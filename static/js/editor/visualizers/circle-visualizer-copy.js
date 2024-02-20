import * as THREE from "three";

export default class CircleVisualizer {
    constructor(stage, analyser) {
        this.id = null;
        this.name = "CircleVisualizer";
        this.stage = stage;
        this.analyser = analyser;
        this.number = 64;
        this.bars = [];
    }

    init() {
        this._setMesh();
    }

    _setMesh() {
        // オブジェクトを一つにまとめる
        const group = new THREE.Group();
        // const axis = new THREE.Vector3(1, 1, 0).normalize();
        // numberの数だけバーを円周上に作成する
        for(let i = 0; i < this.number; i++) {
            // バーの角度
            const angle = i / (2 * Math.PI);

            // バーの座標
            const x = Math.cos(angle) * 5;
            const y = Math.sin(angle) * 5;
            const z = 0;

            // Meshを作成
            const geometry = new THREE.BoxGeometry(
                1, // width
                1, // height
                1 // depth
            )
            const material = new THREE.MeshBasicMaterial(
                {
                    color: 0xffffff,
                    wireframe: true
                }
            )
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                x,
                y,
                z
            )

            // バーの向きを設定
            // mesh.quaternion.setFromAxisAngle(axis, angle);

            this.bars.push(mesh);
            group.add(mesh);
            this.stage.scene.add(group);
        }
    }

    update() {
        const data = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(data);
        
        for(let i = 0; i < this.bars.length; i++) {
            const scaleY = ((data[i] / 255) * 2 - 1) * - 1;
            this.bars[i].scale.y = scaleY;
        }
    }

    setUI() {

    }
}