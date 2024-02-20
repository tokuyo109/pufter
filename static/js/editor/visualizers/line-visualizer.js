// 線型のオーディオビジュアライザーオブジェクト
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
        // for (let i = 0; i < data.length; i++) {
        //     const x = (Math.cos(i) * 2) + (i / data.length) + this.param.x;
        //     const y = (Math.sin(i) * 2) + ((data[i] / 255) * 2 - 1) + this.param.y;
        //     const z = this.param.z;
        //     this.positions[i * 3] = x;
        //     this.positions[i * 3 + 1] = y;
        //     this.positions[i * 3 + 2] = z;
        // }

        this.line.geometry.attributes.position.needsUpdate = true;
        this.line.geometry.computeBoundingSphere();
    }

    setUI() {
        const controller = document.getElementById("controller");
        controller.innerHTML = `
            <form id="positionForm">
                X: <input type="number" id="inputX" step="0.1" value="${this.param.x}">
                Y: <input type="number" id="inputY" step="0.1" value="${this.param.y}">
                Z: <input type="number" id="inputZ" step="0.1" value="${this.param.z}">
            </form>
        `;

        ['inputX', 'inputY', 'inputZ'].forEach(id => {
            document.getElementById(id).addEventListener("change", () => {
                // X, Y, Zの値を取得
                const x = parseFloat(document.getElementById('inputX').value) * -1;
                const y = parseFloat(document.getElementById('inputY').value);
                const z = parseFloat(document.getElementById('inputZ').value) * -1;

                // 選択されたビジュアライザーを取得
                const selectedId = document.getElementById('allVisualierSelector').value;
                const selectedVisualizer = this.stage.visualizers[selectedId];

                // 選択されたビジュアライザーの位置を更新
                if (selectedVisualizer) {
                    this.param.x = x;
                    this.param.y = y;
                    this.param.z = z;
                    // selectedVisualizer.mesh.position.set(x, y, z);
                }
            });
        });
    }

}
