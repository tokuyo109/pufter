// 箱型のオーディオビジュアライザーオブジェクト
import * as THREE from "three";

export default class BoxVisualizer {
    constructor(stage, musicManager) {
        this.id = null;
        this.name = "BoxVisualizer";
        this.stage = stage;
        this.musicManager = musicManager;
        this.mesh = null;
        this.param = {
            width: 1,
            height: 1,
            depth: 1,
            color: 0xffff00,
            wireframe: true,
            scaleBase: 0.5,
            x: 0,
            y: 2,
            z: 0
        };
    }

    init() {
        this._setMesh();
    }

    _setMesh() {
        const geometry = new THREE.BoxGeometry(
            this.param.width,
            this.param.height,
            this.param.depth
        );
        const material = new THREE.MeshBasicMaterial(
            { color: this.param.color, wireframe: this.param.wireframe }
        );
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.param.x, this.param.y, this.param.z);
        this.stage.scene.add(this.mesh);
    }

    update() {
        if (this.mesh) {
            const data = this.musicManager.getAnalyzedData();
            const scale = (data[0] / 128.0) + this.param.scaleBase;
            this.mesh.scale.set(scale, scale, scale);
        }
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
                    selectedVisualizer.mesh.position.set(x, y, z);
                }
            });
        });
    }

    // // 状態をJSONとして出力するメソッド
    // exportState() {
    //     return (
    //         {
    //             name: this.name,
    //             param: this.param
    //         }
    //     );
    // }

    // // JSONから復元するメソッド
    // importState(state) {

    // }
}
