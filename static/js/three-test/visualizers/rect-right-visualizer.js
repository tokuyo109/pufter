// 背景に長方形の光源オブジェクトを生成する
import * as THREE from "three";

class RectRightVisualizer {
    constructor(stage, analyser) {
        this.stage = stage;
        this.analyser = analyser;
        this.mesh = null;
        this.scaleBase = 0.5; // スケールの基準値
    }

    init() {
        this._setMesh();
    }

    _setMesh() {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(2, 0, -5); // 位置を設定する
        this.stage.scene.add(this.mesh);
    }

    update() {
        if (this.mesh) {
            const data = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(data);
            const scale = (data[0] / 128.0) + this.scaleBase;
            this.mesh.scale.set(scale, scale, scale);
        }
    }
}

export default RectRightVisualizer;
