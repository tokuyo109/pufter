import * as THREE from "three";
import { System } from "ecsy";
import { Object3D, Mesh, Position, Rotation, Scale, Slide, Lyric } from "../components/components.js";
import { easeOutQuad } from "../utils/easing.js";

export class SlideSystem extends System {
    init({ playerManager }) {
        this.playerManager = playerManager;
    }

    execute(delta, time) {
        this.queries.Slide.added.forEach(entity => {
            const mesh = entity.getComponent(Object3D).object3D;
            mesh.material.transparent = true;

            // canvasとtextureを初期化
            const lyricComponent = entity.getMutableComponent(Lyric);
            lyricComponent.canvas = document.createElement("canvas");
            lyricComponent.context = lyricComponent.canvas.getContext("2d");
            lyricComponent.canvas.width = 2048;
            lyricComponent.canvas.height = 1024;
            lyricComponent.texture = new THREE.Texture(lyricComponent.canvas);

            // 参照先のcanvasが変更された際にテクスチャを更新する
            const texture = new THREE.Texture(lyricComponent.canvas);
            texture.needsUpdate = true;

            mesh.material.map = texture;
            mesh.material.needsUpdate = true;
            lyricComponent.texture = texture;
        })

        this.queries.Slide.results.forEach(entity => {
            const lyricDataP = this.playerManager.getCurrentPhrase();
            const position = this.playerManager.getCurrentPosition();

            const progress = easeOutQuad(Math.min((position - lyricDataP.startTime) / (lyricDataP.endTime - lyricDataP.startTime), 1));
            if (lyricDataP.startTime <= position && position < lyricDataP.endTime) {
                const { canvas, context, texture, font, color } = entity.getComponent(Lyric);
                this._slideAnimation(context, lyricDataP.text, canvas.width, canvas.height / 2, font, progress, color);

                texture.needsUpdate = true;
            }
        });
    }

    _slideAnimation(context, lyric, canvasWidth, y, font, progress, color) {
        const fontSize = 128;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.font = `Bold ${fontSize}px ${font}`;
        context.fillStyle = color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        const x = -canvasWidth * (1 - progress) + canvasWidth / 2;
        context.fillText(lyric, x, y);
    }
}

SlideSystem.queries = {
    Slide: {
        components: [Slide, Lyric, Object3D],
        listen: {
            added: true,
        }
    }
};
