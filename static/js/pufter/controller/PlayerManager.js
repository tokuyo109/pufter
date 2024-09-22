import { Player } from "textalive-app-api";

// 互換性を保つために、いくつかの古いコードを残しています。
export class PlayerManager {
    constructor() {
        this.player = null;

        this.lyrics = [];
        this.lyricsC = []; // 歌詞情報（文字）
        this.lyricsW = []; // 歌詞情報（単語）
        this.lyricsP = []; // 歌詞情報（フレーズ）
        this.beats = [];
        this.segments = [];
        this.isSeeking = false;

        this.canvas = document.querySelector("#c");
        this.seekBar = document.querySelector("#seekBar");
        // this.currentPosition = document.querySelector("#currentPosition");
        // this.currentBeat = document.querySelector("#currentBeat");

        this.currentChar = "";
        this.currentWord = "";
        this.currentPhrase = "";
        this.previousPhrase = "";
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

    findCurrentChar() {
        if (this.player && this.player.video) {
            return this.player.video.findChar(this.player.mediaPosition);
        }
        return null;
    }

    findCurrentWord() {
        if (this.player && this.player.video) {
            return this.player.video.findWord(this.player.mediaPosition);
        }
        return null;
    }

    findCurrentPhrase() {
        if (this.player && this.player.video) {
            return this.player.video.findPhrase(this.player.mediaPosition);
        }
        return null;
    }

    // 歌詞情報の取得（文字）
    getCurrentChar() {
        const currentTime = this.player.timer.position;
        for (let lyric of this.lyricsC) {
            if (currentTime >= lyric.startTime && currentTime <= lyric.endTime) {
                return { text: lyric.text, startTime: lyric.startTime, endTime: lyric.endTime };
            }
        }
        return { text: "", startTime: null, endTime: null };
    }

    // 歌詞情報の取得（単語）
    getCurrentWord() {
        const currentTime = this.player.timer.position;
        for (let lyric of this.lyricsW) {
            if (currentTime >= lyric.startTime && currentTime <= lyric.endTime) {
                return { text: lyric.text, startTime: lyric.startTime, endTime: lyric.endTime };
            }
        }
        return { text: "", startTime: null, endTime: null };
    }

    // 歌詞情報の取得（フレーズ）
    getCurrentPhrase() {
        const currentTime = this.player.timer.position;
        for (let lyric of this.lyricsP) {
            if (currentTime >= lyric.startTime && currentTime <= lyric.endTime) {
                return { text: lyric.text, startTime: lyric.startTime, endTime: lyric.endTime };
            }
        }
        return { text: "", startTime: null, endTime: null };
    }

    // 現在の再生位置を取得するメソッド
    getCurrentPosition() {
        if (this.player && this.player.timer) {
            return this.player.timer.position; // 現在の再生位置をミリ秒で返す
        }
        return 0;
    }

    init() {
        this.player = new Player({
            app: {
                token: ""
            },
            mediaElement: document.querySelector("#media")
        })
        this.player.addListener({
            onAppReady: (app) => this._onAppReady(app),
            onVideoReady: (v) => this.onVideoReady(v),
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

        // // 再生位置表示
        // this.currentPosition.addEventListener("click", () => {
        //     console.log(this.player.data.songMap.segments);
        //     this.player.data.songMap.segments.forEach((segment) => {
        //         if (this.player.timer.position <= segment.duration) {
        //             console.log(segment);
        //         }
        //     })
        // })

        // this.currentBeat.addEventListener("click", () => {
        //     console.log(this.getCurrentBeat());
        // })
    }

    onVideoReady(v) {
        this.lyricsC = [];
        this.lyricsW = [];
        this.lyricsP = [];

        // 歌詞が存在するかどうか
        if (v.firstChar) {
            // 歌詞付き楽曲
            console.log("歌詞付き楽曲");

            // 文字単位
            let c = v.firstChar;
            while (c) {
                this.lyricsC.push(new Lyric(c))
                c = c.next;
            }

            // 単語単位
            let w = v.firstWord;
            while (w) {
                this.lyricsW.push(new Lyric(w))
                w = w.next;
            }

            // フレーズ単位
            let p = v.firstPhrase;
            while (p) {
                this.lyricsP.push(new Lyric(p))
                p = p.next;
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

    updateLyrics() {
        const currentChar = this.findCurrentChar();
        const currentWord = this.findCurrentWord();
        const currentPhrase = this.findCurrentPhrase();

        let updated = false;
        if (currentChar && currentChar.text !== this.currentChar) {
            this.currentChar = currentChar.text;
            updated = true;
        }
        if (currentWord && currentWord.text !== this.currentWord) {
            this.currentWord = currentWord.text;
            updated = true;
        }
        if (currentPhrase && currentPhrase.text !== this.currentPhrase) {
            this.currentPhrase = currentPhrase.text;
            updated = true;
        }

        if (updated) {
            return {
                char: this.currentChar,
                word: this.currentWord,
                phrase: this.currentPhrase
            };
        }
        return null;
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
