// 線型のオーディオビジュアライザーオブジェクト
// ビジュアライザー制作の参考に
import * as THREE from "three";

export default class LineVisualizer {
    constructor(stage, musicManager) {
        this.id = null;
        this.name = "LineVisualizer";
        this.stage = stage;
        this.musicManager = musicManager;
        this.line = null;
        this.position = new THREE.Vector3();
        this.positions = new Float32Array(musicManager.analyserNode.frequencyBinCount * 3);
        this.param = {
            x: 0,
            y: 0,
            z: 0
        };
    }

    init() {
        this._setLine();
    }

    _setLine() {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
        this.line = new THREE.Line(geometry, material);
        this.line.position.copy(this.position);
        this.stage.scene.add(this.line);
        geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    }

    update() {
        const data = this.musicManager.getAnalyzedData();
        // position[x: i * 3, y: i * 3 + 1, z: i * 3 + 2]
        for (let i = 0; i < data.length; i++) {
            const x = (i / data.length) * 2 - 1 + this.param.x;
            const y = ((data[i] / 255) * 2 - 1) * - 1 + this.param.y;
            const z = this.param.z;
            this.positions[i * 3] = x;
            this.positions[i * 3 + 1] = y;
            this.positions[i * 3 + 2] = z;
        }

        this.line.geometry.attributes.position.needsUpdate = true;
        this.line.geometry.computeBoundingSphere();
    }
}