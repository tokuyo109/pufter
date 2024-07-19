import * as THREE from "three";
import { System } from "ecsy";
import { Object3D, Mesh, Position, Rotation, Scale, Typing } from "../components/components.js";

export class TypingSystem extends System {
    init({ playerManager }) {
        this.playerManager = playerManager;
    }

    execute(delta, time) {
        this.queries.Typing.added.forEach(entity => {
            const mesh = entity.getComponent(Object3D).object3D;
            mesh.material.transparent = true;

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            entity.getMutableComponent(Typing).canvas = canvas;
            entity.getMutableComponent(Typing).context = context;
            entity.getMutableComponent(Typing).displayedChars = [];
            entity.getMutableComponent(Typing).currentPhrase = "";
            entity.getMutableComponent(Typing).scaleFactor = 4;

            canvas.width = 4096;
            canvas.height = 2048;
            context.scale(entity.getMutableComponent(Typing).scaleFactor, entity.getMutableComponent(Typing).scaleFactor);

            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            mesh.material.map = texture;
            mesh.material.needsUpdate = true;
        });

        this.queries.Typing.results.forEach(entity => {
            const mesh = entity.getComponent(Object3D).object3D;
            const lyricDataP = this.playerManager.getCurrentPhrase();
            const lyricDataC = this.playerManager.getCurrentChar();
            const position = this.playerManager.getCurrentPosition();

            const font = entity.getComponent(Typing).font || 'Arial';
            const color = entity.getComponent(Typing).color || 'black';
            const context = entity.getComponent(Typing).context;
            const displayedChars = entity.getMutableComponent(Typing).displayedChars;
            const currentPhrase = entity.getMutableComponent(Typing).currentPhrase;

            if (currentPhrase !== lyricDataP.text) {
                displayedChars.length = 0;
                entity.getMutableComponent(Typing).currentPhrase = lyricDataP.text;

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
                    displayedChars.push({ text: lyricDataC.text, startTime: lyricDataC.startTime, x: x });
                }
            }

            context.clearRect(0, 0, context.canvas.width / 4, context.canvas.height / 4);
            displayedChars.forEach(char => {
                typingAnimation(context, char, time, font, color);
            });

            drawCursor(context, displayedChars, time);

            mesh.material.map.needsUpdate = true;
        });
    }
}

/**
 * 文字が段階的に表示されるタイピングアニメーションを実装する関数。
 *
 * @param {CanvasRenderingContext2D} context - キャンバスの描画コンテキスト。
 * @param {Object} char - 描画する文字オブジェクト。
 * @param {Number} time - 経過時間の合計。
 * @param {String} font - フォントの種類。
 * @param {String} color - フォントの色。
 */
function typingAnimation(context, char, time, font, color) {
    const fontSize = 64;
    context.font = `Bold ${fontSize}px ${font}`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const x = char.x;
    const y = 128;
    const typingDuration = 200; // 文字が表示されるのにかかる時間（ミリ秒）
    const elapsedTime = time - char.startTime;

    if (elapsedTime < typingDuration) {
        const opacity = elapsedTime / typingDuration;
        context.globalAlpha = opacity;
        context.fillText(char.text, x, y);
        context.globalAlpha = 1; // 元の不透明度に戻す
    } else {
        context.fillText(char.text, x, y);
    }
}

/**
 * カーソルを描画する関数。
 *
 * @param {CanvasRenderingContext2D} context - キャンバスの描画コンテキスト。
 * @param {Array} displayedChars - 表示された文字のリスト。
 * @param {Number} time - 経過時間の合計。
 */
function drawCursor(context, displayedChars, time) {
    const cursorHeight = 100;
    const cursorWidth = 5;
    const cursorX = displayedChars.length > 0 ? displayedChars[displayedChars.length - 1].x + 40 : 50;
    const cursorY = 128 - cursorHeight / 2;

    const blinkInterval = 500; // カーソルの点滅間隔（ミリ秒）
    const isVisible = Math.floor(time / blinkInterval) % 2 === 0;

    if (isVisible) {
        context.fillStyle = 'black';
        context.fillRect(cursorX, cursorY, cursorWidth, cursorHeight);
    }
}

TypingSystem.queries = {
    Typing: {
        components: [Typing, Object3D],
        listen: {
            added: true,
        }
    }
};
