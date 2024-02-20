import * as THREE from "three";

export default class CircleVisualizer {
    constructor(stage, analyser) {
        this.id = null;
        this.name = "CircleVisualizer";
        this.stage = stage;
        this.analyser = analyser;
        this.number = 64; // 円周上に配置するバーの数
        this.bars = []; // バーのMeshを格納する配列
    }

    init() {
        this._setMesh();
    }

    _setMesh() {
        const group = new THREE.Group(); // バーをまとめるグループ
        for(let i = 0; i < this.number; i++) {
            const angle = (i / this.number) * Math.PI * 2; // バーの角度

            // バーの座標
            const x = Math.cos(angle) * 5;
            const y = Math.sin(angle) * 5;
            const z = 0;

            // Meshを作成
            const geometry = new THREE.BoxGeometry(0.2, 3, 0); // バーのサイズ
            const material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.lookAt(new THREE.Vector3(0, 0, 0)); // バーを中心に向ける

            this.bars.push(mesh);
            group.add(mesh);
        }
        this.stage.scene.add(group); // グループをシーンに追加
    }

    update() {
        const data = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(data);
        
        for(let i = 0; i < this.bars.length; i++) {
            const scaleY = (data[i] / 255) * 5 + 0.1;
            this.bars[i].scale.y = scaleY;
        }
    }

    setUI() {
    }
}
