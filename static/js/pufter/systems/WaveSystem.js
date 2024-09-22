import * as THREE from "three";
import { System } from "ecsy";
import { Object3D, Mesh, Position, Rotation, Scale, Wave } from "../components/components.js";

export class WaveSystem extends System {
    init({ playerManager }) {
        this.playerManager = playerManager;
    }

    execute(delta, time) {
        this.queries.Wave.added.forEach(entity => {
            const mesh = entity.getComponent(Object3D).object3D;
            mesh.material.transparent = true;

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            entity.getMutableComponent(Wave).canvas = canvas;
            entity.getMutableComponent(Wave).context = context;
            entity.getMutableComponent(Wave).displayedChars = [];
            entity.getMutableComponent(Wave).currentPhrase = "";
            entity.getMutableComponent(Wave).scaleFactor = 4;

            canvas.width = 4096;
            canvas.height = 2048;
            context.scale(entity.getMutableComponent(Wave).scaleFactor, entity.getMutableComponent(Wave).scaleFactor);

            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            mesh.material.map = texture;
            mesh.material.needsUpdate = true;
        });

        this.queries.Wave.results.forEach(entity => {
            const mesh = entity.getComponent(Object3D).object3D;
            const lyricDataP = this.playerManager.getCurrentPhrase();
            const lyricDataC = this.playerManager.getCurrentChar();
            const position = this.playerManager.getCurrentPosition();

            const font = entity.getComponent(Wave).font || 'Arial';
            const color = entity.getComponent(Wave).color || 'black';
            const context = entity.getComponent(Wave).context;
            const displayedChars = entity.getMutableComponent(Wave).displayedChars;
            const currentPhrase = entity.getMutableComponent(Wave).currentPhrase;

            if (currentPhrase !== lyricDataP.text) {
                displayedChars.length = 0;
                entity.getMutableComponent(Wave).currentPhrase = lyricDataP.text;

                const charCount = lyricDataP.text.length;
                const fontSize = 64;
                const spacing = Math.min((256 - 100) / (charCount - 1), 50);
                const canvasWidth = Math.max(256, charCount * (fontSize + spacing));
                const canvasHeight = 128;

                context.clearRect(0, 0, canvasWidth, canvasHeight);
            }

            if (lyricDataC.startTime <= position && position < lyricDataC.endTime) {
                if (!displayedChars.some(char => char.text === lyricDataC.text && char.startTime === lyricDataC.startTime)) {
                    const x = 50 + displayedChars.length * (64 + 10);
                    displayedChars.push({ text: lyricDataC.text, startTime: lyricDataC.startTime, x: x });
                }
            }

            context.clearRect(0, 0, context.canvas.width / 4, context.canvas.height / 4);
            displayedChars.forEach(char => {
                waveAnimation(context, char, time, font, color);
            });

            mesh.material.map.needsUpdate = true;
        });
    }
}

function waveAnimation(context, char, time, font, color) {
    const fontSize = 64;
    context.font = `Bold ${fontSize}px ${font}`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const y = 128 + Math.sin(time / 1000 + char.x / 100) * 20; // 縦に揺れるアニメーション
    context.fillText(char.text, char.x, y);
}


WaveSystem.queries = {
    Wave: {
        components: [Wave, Object3D],
        listen: {
            added: true,
        }
    }
};
