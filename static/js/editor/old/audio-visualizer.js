// 音楽ファイルを管理するクラス
// music-managerに以降
export default class AudioVisualizer {
    constructor(input_element) {
        this.audioContext = new AudioContext();
        // analyser.frequencyBinCountに波形情報が格納されている
        // ビジュアライザーを作りたいときは以下を利用する
        this.analyser = this.audioContext.createAnalyser();

        this.source = null;

        // 曲の再生時間
        this.playTime = null;

        input_element.addEventListener("change", (event) => {
            this._loadAndPlay(event);
        })

        document.getElementById("playbackBar").addEventListener("change", (event) => {
            const value = event.target.value;
            this._changePosition(value);
        });
    }

    _loadAndPlay(event) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = (event) => {
            this.audioContext.decodeAudioData(event.target.result).then(buffer => {
                // 曲の再生時間
                this.playTime = buffer.duration;
                // console.log("曲の再生時間:", duration);

                this.source = this.audioContext.createBufferSource();

                this.source.buffer = buffer;
                this.source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);

                // start(when, offset, duration)
                this.source.start(0);
            }).catch(error => {
                console.error("ファイルの読み込みに失敗しました", error);
                alert("ファイルの読み込みに失敗しました");
            });
        };
        reader.readAsArrayBuffer(file)
    }

    // 再生位置を変更するメソッド
    _changePosition(value) {
        const currentTime = this.playTime * value / 100; // 再生位置を計算
        this.source.stop(); // 現在の再生を停止

        // 新しく再生を開始するには毎回sourceを作り替えないといけないらしい
        const source = this.audioContext.createBufferSource();
        // 曲は同じなので使いまわす
        source.buffer = this.source.buffer

        // 更新 & 再生
        this.source = source;
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.source.start(0, currentTime); // 新しい再生位置から再生を開始
    }
}
