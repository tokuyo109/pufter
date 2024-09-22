import * as THREE from "three";
import { System } from "ecsy";
import { Object3D, Mesh, Position, Rotation, Scale, EaseOutBack } from "../components/components.js";
import { easeOutBack } from "../utils/easing.js";

export class EaseOutBackSystem extends System {
    init({ playerManager }) {
        this.playerManager = playerManager;
    }

    execute(delta, time) {
        this.queries.EaseOutBack.added.forEach(entity => {
            const mesh = entity.getComponent(Object3D).object3D;
            mesh.material.transparent = true;

            // canvasとcontextを初期化
            const easeOutBackComponent = entity.getMutableComponent(EaseOutBack);
            easeOutBackComponent.canvas = document.createElement("canvas");
            easeOutBackComponent.canvas.width = 256;
            easeOutBackComponent.canvas.height = 256;
            easeOutBackComponent.context = easeOutBackComponent.canvas.getContext("2d");

            // 参照先のcanvasが変更された際にテクスチャを更新する
            const texture = new THREE.Texture(easeOutBackComponent.canvas);
            texture.needsUpdate = true;

            mesh.material.map = texture;
            mesh.material.needsUpdate = true;
            easeOutBackComponent.texture = texture;
        })

        this.queries.EaseOutBack.results.forEach(entity => {
            // 歌詞と再生位置
            const lyricData = this.playerManager.getCurrentChar();
            const position = this.playerManager.getCurrentPosition();

            
            const progress = easeOutBack(Math.min((position - lyricData.startTime) / Math.min(lyricData.endTime - lyricData.startTime, 200), 1));
            if (lyricData.startTime <= position && position < lyricData.endTime) {
                // 描画スタイル
                const {canvas, context, texture, font, color} = entity.getComponent(EaseOutBack);
                this._drawLyric(context, lyricData.text, canvas.width / 2, canvas.height / 2, font, progress, color);

                texture.needsUpdate = true;
            }
        });
    }

    _drawLyric(context, lyric, x, y, font, progress, color) {
        const fontSize = 128 * progress;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.font = `Bold ${fontSize}px ${font}`;
        context.fillStyle = color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(lyric, x, y);
    }
}

EaseOutBackSystem.queries = {
    EaseOutBack: {
        components: [EaseOutBack, Object3D],
        listen: {
            added: true,
        }
    }
};
