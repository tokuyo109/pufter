import { Player } from "textalive-app-api";

export class PlayerManager {
    constructor() {
        this.player = null; // APIのエントリーポイント
        this.lyrics = []; // 歌詞情報
        this.beats = []; // ビート情報
        this.segments = []; // セグメント情報
        this.isSeeking = false; // シークバーを操作しているか

        this.canvas = document.querySelector("#WebGL");
        this.seekBar = document.querySelector("#seekBar");
        this.currentPosition = document.querySelector("#currentPosition");
        this.currentBeat = document.querySelector("#currentBeat");
    }

    getCurrentLyric() {
        const currentTime = this.player.timer.position;
        for (let lyric of this.lyrics) {
            if (currentTime >= lyric.startTime && currentTime <= lyric.endTime) {
                return lyric.text;
            }
        }
        return "";
    }

    getCurrentBeat() {
        const currentTime = this.player.timer.position;
        for (let beat of this.beats) {
            if (currentTime >= beat.startTime && currentTime <= beat.endTime) {
                return beat;
            }
        }
        return null;
    }

    init() {
        this.player = new Player({
            app: {
                token: "3Iq9elt9xbFuRrND"
            },
            mediaElement: document.querySelector("#media")
        })
        this.player.addListener({
            onAppReady: (app) => this._onAppReady(app),
            onVideoReady: (v) => this._onVideoReady(v),
            onPlay: () => this._onPlay(),
            onPause: () => this._onPause(),
            onStop: () => this._onStop(),
            onMediaSeek: (pos) => this._onMediaSeek(pos),
            onTimeUpdate: (pos) => this._onTimeUpdate(pos),
            onThrottledTimeUpdate: (pos) => this._onThrottledTimeUpdate(pos),
            onAppParameterUpdate: (name, value) => this._onAppParameterUpdate(name, value),
            onAppMediaChange: (url) => this._onAppMediaChange(url),
        });
    }

    _onAppReady(app) {
        if (!app.songUrl) {
            this.player.createFromSongUrl("https://www.youtube.com/watch?v=jMKPYg0uhCI");
        }

        // シーク操作
        this.seekBar.addEventListener("mousedown", () => {
            this.isSeeking = true;
        })

        this.seekBar.addEventListener("mouseup", (event) => {
            this.isSeeking = false;
            const value = event.target.value;
            const duration = this.player.video.duration;
            this.player.requestMediaSeek(duration * (value / 100));
        })

        this.seekBar.addEventListener("mouseleave", () => {
            if (this.isSeeking) {
                this.isSeeking = false;
            }
        })

        // 再生位置表示
        this.currentPosition.addEventListener("click", () => {
            console.log(this.player.data.songMap.segments);
            this.player.data.songMap.segments.forEach((segment) => {
                if (this.player.timer.position <= segment.duration) {
                    console.log(segment);
                }
            })
        })

        this.currentBeat.addEventListener("click", () => {
            console.log(this.getCurrentBeat());
        })
    }

    _onVideoReady(v) {
        if (v.firstChar) {
            // 歌詞付き楽曲
            console.log("歌詞付き楽曲");
            let c = v.firstChar;
            while (c) {
                this.lyrics.push(new Lyric(c))
                c = c.next;
            }

        } else {
            // 歌詞のない楽曲
            console.log("歌詞のない楽曲");
        }
        this.beats = this.player.data.songMap.beats;
        this.segments = this.player.data.songMap.segments;
    }

    _onPlay() {
    }

    _onPause() {

    }

    _onStop() {

    }

    _onMediaSeek(pos) {

    }

    // 歌詞が発生したときに呼び出される
    _onTimeUpdate(pos) {
        if (!this.player.video || this.isSeeking) return;
        // シークバーを更新する
        const duration = this.player.video.duration;
        this.seekBar.value = (pos / duration) * 100;
    }

    _onThrottledTimeUpdate(pos) {

    }

    _onAppParameterUpdate(name, value) {

    }

    _onAppMediaChange(url) {
        console.log("新しい再生楽曲が指定されました:", mediaUrl);
    }
}

class Lyric {
    constructor(data) {
        this.text = data.text;      // 歌詞文字
        this.startTime = data.startTime; // 開始タイム [ms]
        this.endTime = data.endTime;   // 終了タイム [ms]
        this.duration = data.duration;  // 開始から終了迄の時間 [ms]

        if (data.next && data.next.startTime - this.endTime < 500) this.endTime = data.next.startTime;
        else this.endTime += 500;
    }
}
