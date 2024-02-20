import * as THREE from "three";

export default class CircleVisualizer {
    constructor(stage, musicManager) {
        this.id = null;
        this.name = "CircleVisualizer";
        this.stage = stage;
        this.musicManager = musicManager;
        this.number = 64; // 円周上に配置するバーの数
        this.bars = []; // バーのMeshを格納する配列
    }

    init() {
        this._setMesh();
    }

    _setMesh() {
        const group = new THREE.Group();
        for (let i = 0; i < this.number; i++) {
            // 0から1までの範囲で値を求め、0~360度の範囲にマッピングする
            const angle = (i / this.number) * Math.PI * 2; // バーの角度

            // バーの座標
            const x = Math.cos(angle) * 5;
            const y = Math.sin(angle) * 5;
            const z = 0;

            // Meshを作成
            const geometry = new THREE.BoxGeometry(0.2, 3, 0); // バーのサイズ
            geometry.translate(0, 1.5, 0);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            // mesh.lookAt(new THREE.Vector3(0, 0, 0)); // バーを中心に向ける

            mesh.rotation.z = angle + Math.PI / 2;

            this.bars.push(mesh);
            group.add(mesh);
        }
        this.stage.scene.add(group); // グループをシーンに追加
    }

    update() {
        // 現在の再生位置の波形情報を取得
        const data = this.musicManager.getAnalyzedData();

        // バーのサイズを更新する
        for (let i = 0; i < this.bars.length; i++) {
            // const index = Math.floor((i / this.bars.length) * data.length);
            const index = Math.min(Math.floor((i / this.bars.length) * data.length), data.length - 1);
            const scaleY = data[index] / 255 + 0.1;
            this.bars[i].scale.y = scaleY;
        }
    }

    setUI() {
    }
}
