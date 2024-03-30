// 歌詞を1文字ずつ表示する箱のアニメーションシステム
import * as THREE from "three";

import { System } from "ecsy";

import { Object3D, Mesh, Position, Rotation, Scale, UIControllable, LyricDisplayCube } from "../components/components.js";

export default class LyricDisplayCubeSystem extends System {
    init(playerManager) {
        this.playerManager = playerManager;
    }

    execute(delta, time) {
        // オブジェクトの初期化処理
        this.queries.lyricDisplayCube.added.forEach(entity => {
            const mesh = entity.getComponent(Object3D).value;
            mesh.material.transparent = true;
        });

        // 歌詞のアニメーション処理
        this.queries.lyricDisplayCube.results.forEach(entity => {
            const mesh = entity.getComponent(Object3D).value;
            const size = 256;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext("2d");

            const currentLyric = this.playerManager.getCurrentLyric();

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.font = 'Bold 128px Arial';
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(currentLyric, canvas.width / 2, canvas.height / 2);

            const newTexture = new THREE.Texture(canvas);
            newTexture.needsUpdate = true;

            // テクスチャをMeshのMaterialに設定
            mesh.material.map = newTexture;
            mesh.material.needsUpdate = true;
        });
    }
}

LyricDisplayCubeSystem.queries = {
    lyricDisplayCube: {
        components: [LyricDisplayCube, Object3D],
        listen: {
            added: true,
        }
    }
};

