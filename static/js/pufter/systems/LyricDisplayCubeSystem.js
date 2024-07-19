import * as THREE from "three";
import { System } from "ecsy";
import { Object3D, Mesh, Position, Rotation, Scale, LyricDisplayCube } from "../components/components.js";
import { easeOutBack } from "../utils/easing.js";

export class LyricDisplayCubeSystem extends System {
    init({ playerManager }) {
        this.playerManager = playerManager;
    }

    execute(delta, time) {
        this.queries.LyricDisplayCube.added.forEach(entity => {
            const mesh = entity.getComponent(Object3D).object3D;
            mesh.material.transparent = true;

            // canvasとcontextを初期化
            const lyricDisplayCubeComponent = entity.getMutableComponent(LyricDisplayCube);
            lyricDisplayCubeComponent.canvas = document.createElement("canvas");
            lyricDisplayCubeComponent.canvas.width = 256;
            lyricDisplayCubeComponent.canvas.height = 256;
            lyricDisplayCubeComponent.context = lyricDisplayCubeComponent.canvas.getContext("2d");

            // 参照先のcanvasが変更された際にテクスチャを更新する
            const texture = new THREE.Texture(lyricDisplayCubeComponent.canvas);
            texture.needsUpdate = true;

            mesh.material.map = texture;
            mesh.material.needsUpdate = true;
            lyricDisplayCubeComponent.texture = texture;
        })

        this.queries.LyricDisplayCube.results.forEach(entity => {
            // 歌詞と再生位置
            const lyricData = this.playerManager.getCurrentChar();
            const position = this.playerManager.getCurrentPosition();

            const progress = easeOutBack(Math.min((position - lyricData.startTime) / Math.min(lyricData.endTime - lyricData.startTime, 200), 1));
            if (lyricData.startTime <= position && position < lyricData.endTime) {
                // 描画スタイル
                const { canvas, context, texture, font, color } = entity.getComponent(LyricDisplayCube);
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

LyricDisplayCubeSystem.queries = {
    LyricDisplayCube: {
        components: [LyricDisplayCube, Object3D],
        listen: {
            added: true,
        }
    }
};
