import * as THREE from "three";
import { System } from "ecsy";
import { Object3D, RotationChar } from "../components/components.js";

export class RotationCharSystem extends System {
    init({ playerManager }) {
        this.playerManager = playerManager;
    }

    execute(delta, time) {
        this.queries.RotationChar.added.forEach(entity => {
            const mesh = entity.getComponent(Object3D).object3D;
            mesh.material.transparent = true;

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            entity.getMutableComponent(RotationChar).canvas = canvas;
            entity.getMutableComponent(RotationChar).context = context;
            entity.getMutableComponent(RotationChar).displayedChars = [];
            entity.getMutableComponent(RotationChar).currentPhrase = "";
            entity.getMutableComponent(RotationChar).scaleFactor = 4;

            canvas.width = 4096;
            canvas.height = 2048;
            context.scale(entity.getMutableComponent(RotationChar).scaleFactor, entity.getMutableComponent(RotationChar).scaleFactor);

            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            mesh.material.map = texture;
            mesh.material.needsUpdate = true;
        });

        this.queries.RotationChar.results.forEach(entity => {
            const mesh = entity.getComponent(Object3D).object3D;
            const lyricDataP = this.playerManager.getCurrentPhrase();
            const lyricDataC = this.playerManager.getCurrentChar();
            const position = this.playerManager.getCurrentPosition();

            const rotationCharComponent = entity.getMutableComponent(RotationChar);
            const { font = 'Arial', color = 'black', context, displayedChars, currentPhrase } = rotationCharComponent;

            if (currentPhrase !== lyricDataP.text) {
                displayedChars.length = 0;
                rotationCharComponent.currentPhrase = lyricDataP.text;

                const charCount = lyricDataP.text.length;
                const fontSize = 64;
                const spacing = Math.min((512 - 100) / (charCount - 1), 50);
                const canvasWidth = Math.max(512, charCount * (fontSize + spacing));
                const canvasHeight = 256;

                context.clearRect(0, 0, canvasWidth, canvasHeight);
            }

            if (lyricDataC.startTime <= position && position < lyricDataC.endTime) {
                if (!displayedChars.some(char => char.text === lyricDataC.text && char.startTime === lyricDataC.startTime)) {
                    const x = 50 + displayedChars.length * (64 + 10);
                    displayedChars.push({ text: lyricDataC.text, startTime: lyricDataC.startTime, x: x, rotationStartTime: time });
                }
            }

            const scaleFactor = rotationCharComponent.scaleFactor;
            const scaledWidth = context.canvas.width / scaleFactor;
            const scaledHeight = context.canvas.height / scaleFactor;
            context.clearRect(0, 0, scaledWidth, scaledHeight);
            
            displayedChars.forEach(char => {
                rotationAnimation(context, char, time, font, color);
            });

            mesh.material.map.needsUpdate = true;
        });
    }
}

/**
 * 文字を一回転させるアニメーション関数
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Object} char
 * @param {Number} time
 * @param {String} font
 * @param {String} color
 */
function rotationAnimation(context, char, time, font, color) {
    const fontSize = 64;
    context.font = `Bold ${fontSize}px ${font}`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const x = char.x;
    const y = 128;
    const rotationDuration = 2 * Math.PI;
    const elapsedTime = time - char.rotationStartTime;

    let rotation = 0;
    if (elapsedTime < 1000) {
        rotation = (elapsedTime / 1000) * rotationDuration;
    }

    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.fillText(char.text, 0, 0);
    context.restore();
}

RotationCharSystem.queries = {
    RotationChar: {
        components: [RotationChar, Object3D],
        listen: {
            added: true,
        }
    }
};
