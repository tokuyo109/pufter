/*
MusicManagerクラスはWeb Audio APIを使用して
音楽ファイルの読み込み、再生、停止、再生位置変更などの音楽プレイヤーの
基本機能を提供します。

また、getAnalyzedData()メソッドで音源の解析データを提供します。
解析されたデータは音源を可視化する際に必要になります。
*/

export default class MusicManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.gainNode = this.audioContext.createGain();

        this.source = null; // 音源データの再生用
        this.audioBuffer = null; // デコードされた音源を保持する
        this.startTime = 0; // 再生開始時間
        this.currentPosition = 0; // 現在の再生位置
        this.intervalID = null;
        this.isDragging = false; // 再生バーが操作されているか否か
        this.initialized = false;

        this.fileElement = document.querySelector("#musicFile");
        this.volumeElement = document.querySelector("#volumeBar")
        this.playButtonElement = document.querySelector("#playButton");
        this.stopButtonElement = document.querySelector("#stopButton");
        this.positionElement = document.querySelector("#positionBar");

        this._init();
    }

    // 周波数領域のデータをバイト配列で返す
    getFrequencyData() {
        const data = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(data);
        return data;
    }

    // 時間領域のデータをバイト配列で返す
    getTimeDomainData() {
        const data = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(data);
        return data;
    }

    // 初期化処理
    _init() {
        if (!this.initialized) {
            // ファイルが変更されたとき読み込む
            this.fileElement.addEventListener("change", (event) => {
                const file = event.target.files[0];
                this._load(file);
            })

            // 再生ボタンがクリックされたとき再生する
            this.playButtonElement.addEventListener("click", () => {
                this._play();
            })

            // 停止ボタンがクリックされたとき停止する
            this.stopButtonElement.addEventListener("click", () => {
                this._stop();
            })

            // 再生位置が変更されたとき音楽の再生位置を変更する
            this.positionElement.addEventListener("change", () => {
                this._changePosition();
            })

            // マウスダウン時再生バー更新処理を無効にする
            this.positionElement.addEventListener("mousedown", () => {
                this.isDragging = true;
            })

            // マウスアップ時再生バー更新処理を有効にする
            this.positionElement.addEventListener("mouseup", () => {
                this.isDragging = false;
            })

            // 音量バーの位置が変更されたとき音量を変更する
            this.volumeElement.addEventListener("change", () => {
                this._changeVolume();
            })
        }

        this.initialized = true;
    }

    // 音源を読み込む
    _load(file) {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        // readAsArrayBufferが完了したときに実行
        fileReader.onload = (event) => {
            // 既に読み込まれているファイルが存在すれば削除する
            if (this.source) {
                this.source.stop();
                this.source.disconnect();
            }

            // 音量を設定
            const volumeSize = this.volumeElement.value / 100;
            this.gainNode.gain.value = volumeSize;

            // 読み込まれたAudioBuffer
            const arrayBuffer = event.target.result;

            // 非同期でデコードし、sourceにデータを格納する
            this.audioContext.decodeAudioData(arrayBuffer).then(decodeData => {
                // 再生位置変更などで再利用する
                this.audioBuffer = decodeData;

                // デコードされた音源をBaseAudioContextに接続し、再生可能状態にする
                this.source = this.audioContext.createBufferSource();
                this.source.buffer = this.audioBuffer;
                this.source.connect(this.gainNode);
                this.gainNode.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
                this.source.start(0);
                this.audioContext.suspend();
            })
        }
    }

    // 音源を再生する
    _play() {
        if (this.audioContext.state === "suspended") {
            this.audioContext.resume().then(() => {
                console.log("再生");
                this.startTime = this.audioContext.currentTime - this.currentPosition;
                this.intervalID = setInterval(() => this._updateBar(), 1000);
            })
        }
    }

    // 音源を停止する
    _stop() {
        if (this.audioContext.state === "running") {
            this.audioContext.suspend().then(() => {
                console.log("停止");

                //再生バーの更新を停止する
                if (this.intervalID) clearInterval(this.intervalID);
            })
        }
    }

    // 音源の再生位置を変更する
    _changePosition() {
        // 音源が存在しないとき早期リターン
        if (!this.audioBuffer) return;

        // 再生位置を算出
        const newPosition = this.positionElement.value;
        this.currentPosition = this.audioBuffer.duration * (newPosition / 100);

        // 再生初期化処理
        if (this.source) this.source.stop();
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.source.start(0, this.currentPosition);

        // 再生開始位置を計算
        if (this.audioContext.state === "running") {
            this.startTime = this.audioContext.currentTime - this.currentPosition;
        }
    }

    // 再生バーを更新する
    _updateBar() {
        // 音源が存在しない or 音声バーが操作されているとき早期リターン
        if (!this.audioBuffer || this.isDragging) return;

        // 再生位置を計算し更新
        const elapsedTime = this.audioContext.currentTime - this.startTime;
        this.currentPosition = elapsedTime;
        const newPosition = (elapsedTime / this.audioBuffer.duration) * 100;
        this.positionElement.value = newPosition;
    }

    // 音源の音量を調整する
    _changeVolume() {
        // 音源が存在しないとき早期リターン
        if (!this.audioBuffer) return;

        // 音量を設定
        const volumeSize = this.volumeElement.value / 100;
        this.gainNode.gain.value = volumeSize;

        // 再生初期化処理
        if (this.source) this.source.stop();
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.source.start(0, this.currentPosition);

        // 再生開始位置を計算
        if (this.audioContext.state === "running") {
            this.startTime = this.audioContext.currentTime - this.currentPosition;
        }
    }
}
