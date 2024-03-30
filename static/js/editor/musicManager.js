// 音楽プレイヤーと波形情報を提供するクラス
export default class MusicManager {
    constructor() {
        // Web Audio API系のインスタンス群
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.gain = this.audioContext.createGain();

        this._initElements();
        this._addEventListeners();
    }

    _initElements() {
        this.audioBuffer = null;
        this.source = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.intervalID = null;

        this.fileElement = document.getElementById("musicFile");
        this.togglePlayButtonElement = document.getElementById("togglePlayButton");
        this.currentTimeElement = document.getElementById("time-current");
        this.durationTimeElement = document.getElementById("time-duration");
        this.volumeBarElement = document.getElementById("volumeBar");
        this.positionBarElement = document.getElementById("positionBar");
    }

    _addEventListeners() {
        this.fileElement.addEventListener("change", event => this._load(event.target.files[0]));
        this.togglePlayButtonElement.addEventListener("click", () => this.isPlaying ? this._pause() : this._play());
        this.positionBarElement.addEventListener("change", () => this.audioBuffer && this._changePosition());
        this.volumeBarElement.addEventListener("change", () => this._changeVolume());
    }

    // 周波数領域のデータをバイト配列で取得する
    getFrequencyData() {
        const data = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(data);
        return data;
    }

    // 時間領域のデータをバイト配列で取得する
    getTimeDomainData() {
        const data = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(data);
        return data;
    }

    // 音源の再生位置や音量などの設定をおなう
    _setup(startTime = 0) {
        if (this.source) {
            this.source.stop();
            this.source.disconnect();
        }

        // 音源を作成し、ノードに接続する
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.gain);
        this.gain.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        // 音量を設定
        this.gain.gain.value = this.volumeBarElement.value / 100;

        // 指定された位置から音源の再生を開始
        this.source.start(0, startTime);

        // 再生位置を更新
        this.currentTime = startTime;
    }

    // 音源変更時処理
    _load(file) {
        // 再生前状態に初期化
        if (this.source) {
            if (this.intervalID) {
                clearInterval(this.intervalID);
                this.intervalID = null;
            }
            this.currentTime = 0;
            this.positionBarElement.value = 0;
            this.togglePlayButtonElement.innerText = "再生";
            this.togglePlayButtonElement.style.backgroundColor = "#f0f0f0";
        }

        // 音源を読み込み再生可能状態に
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.addEventListener("loadend", async (event) => {
            const arrayBuffer = event.currentTarget.result;
            const decodeData = await this.audioContext.decodeAudioData(arrayBuffer)
            this.audioBuffer = decodeData;
            this._setup();
            this.audioContext.suspend();

            // UIの初期化
            this.currentTimeElement.innerHTML = "0:00";
            const playTime = this.audioBuffer.duration;
            this.durationTimeElement.innerHTML = this._convertTime(playTime);
            this.togglePlayButtonElement.style.backgroundColor = "#ff5555";
        })
    }

    // 音源の再生
    _play() {
        if (this.audioContext.state === "suspended") {
            this.audioContext.resume().then(() => {
                console.log("再生");
                this.intervalID = setInterval(() => this._countUp(), 1000);
            })
        }
        this.isPlaying = true;
        this.togglePlayButtonElement.innerText = "停止";
    }

    // 音源の停止
    _pause() {
        if (this.audioContext.state === "running") {
            this.audioContext.suspend().then(() => {
                console.log("停止");
                if (this.intervalID) clearInterval(this.intervalID);
            })
        }
        this.isPlaying = false;
        this.togglePlayButtonElement.innerText = "再生";
    }

    // 音源の再生位置を変更
    _changePosition() {
        const startTime = this.audioBuffer.duration * this.positionBarElement.value / 100;
        this._setup(startTime);
    }

    // 音源の音量を変更
    _changeVolume() {
        this._setup(this.currentTime);
    }

    // 再生バーを更新する
    _countUp() {
        const endTime = this.audioBuffer.duration;

        if (this.currentTime < endTime) {
            this.currentTime++;
        }

        const ratio = this.currentTime / endTime; // 再生位置の割合
        this.positionBarElement.value = 100 * ratio; // 割合を%に変換
        this.currentTimeElement.innerText = this._convertTime(this.currentTime);
    }

    // 再生時間を表示用に変換して返す
    _convertTime(value) {
        const minutes = Math.trunc(value / 60);
        const seconds = `${Math.trunc(value % 60)}`.padStart(2, "0");
        return `${minutes}:${seconds}`;
    }
}
