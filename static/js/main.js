import * as THREE from "three";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Stage {
    constructor() {
        this.visualizers = [];
        this.renderParam = {
            clearColor: 0xeeeeee,
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.cameraParam = {
            fov: 45,
            near: 0.1,
            far: 100,
            lookAt: new THREE.Vector3(0, 0, 0),
            x: 0,
            y: 2,
            z: 4
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.isInitialized = false;
        this.orbitcontrols = null;
    }

    init() {
        this._setScene();
        this._setRender();
        this._setCamera();
        this.isInitialized = true;
    }

    _setScene() {
        this.scene = new THREE.Scene();
        // this.scene.add(new THREE.GridHelper(1000, 100));
        // this.scene.add(new THREE.AxesHelper(100));
    }

    _setRender() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(this.renderParam.clearColor));
        this.renderer.setSize(this.renderParam.width, this.renderParam.height);
        const wrapper = document.querySelector("#webgl");
        wrapper.appendChild(this.renderer.domElement);
    }

    _setCamera() {
        const aspectRatio = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(
            this.cameraParam.fov, // 視野角
            aspectRatio,          // アスペクト比
            this.cameraParam.near, // 近くのクリッピング平面
            this.cameraParam.far   // 遠くのクリッピング平面
        );

        this.camera.position.set(
            this.cameraParam.x,
            this.cameraParam.y,
            this.cameraParam.z
        );
        this.camera.lookAt(this.cameraParam.lookAt);

        // if (!this.orbitcontrols) {
        //   this.orbitcontrols = new OrbitControls(
        //     this.camera,
        //     this.renderer.domElement
        //   );
        // }

        // this.orbitcontrols.enableDamping = true;

        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth - 30, window.innerHeight);
    }

    _render() {
        this.renderer.render(this.scene, this.camera);
        // this.orbitcontrols.update();
    }

    onRaf() {
        this._render();
    }

    addVisualizer(visualizer) {
        this.visualizers.push(visualizer);
        visualizer.init();
    }

    update() {
        this.visualizers.forEach(visualizer => visualizer.update());
    }

    onResize() {
        this._setCamera();
    }
}

class Mesh {
    constructor(stage, analyser) {
        this.stage = stage;
        this.mesh = null;
        this.analyser = analyser;
        this.scaleBase = 0.5; // スケールの基準値
    }

    init() {
        this._setMesh();
    }

    _setMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true });
        this.mesh = new THREE.Mesh(geometry, material);
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

    onResize() {
        //
    }
}

class Waveform {
    constructor(stage, analyser, position = new THREE.Vector3()) {
        this.stage = stage;
        this.analyser = analyser;
        this.line = null;
        this.positions = new Float32Array(analyser.frequencyBinCount * 3);
        this.position = position;
    }

    init() {
        this._setMesh();
    }

    _setMesh() {
        const geometry = new THREE.BufferGeometry();
        // const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, opacity: 0.1 });
        const material = new THREE.LineBasicMaterial({
            color: 0x8ffcdd,
            linewidth: 2, // 多くの環境では1以外は無視される可能性がある
            opacity: 1,
            transparent: true, // 不透明度を有効にするために必要
        });
        this.line = new THREE.Line(geometry, material);
        this.line.position.copy(this.position);
        this.stage.scene.add(this.line);
        geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    }

    update() {
        const data = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(data);

        for (let i = 0; i < data.length; i++) {
            const x = (i / data.length) * 2 - 1;
            const y = ((data[i] / 255) * 2 - 1) * -1;
            // console.log(y);
            // const y = (data[i] / 255) * 2 - 1;
            this.positions[i * 3] = x;
            this.positions[i * 3 + 1] = y;
            this.positions[i * 3 + 2] = 0;
        }

        this.line.geometry.attributes.position.needsUpdate = true;
        this.line.geometry.computeBoundingSphere();
    }

    onResize() {
        //
    }
}

function randomWaveforms(stage, analyser, count) {
    // const waveforms = [];

    for (let i = 0; i < count; i++) {
        const position = new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            0
            // (Math.random() - 0.5) * 20
        );

        // console.log(position);

        const waveform = new Waveform(stage, analyser, position);
        waveform.init();

        stage.addVisualizer(waveform);

        // waveform.push(waveform);
    }

    // return randomWaveforms;
}

// waveformの改良版
class Waveform2 {
    constructor(stage, analyser, position = new THREE.Vector3()) {
        this.stage = stage;
        this.analyser = analyser;
        this.line = null;
        this.positions = null;
        this.position = position;
    }

    init() {
        this._setMesh();
    }

    _setMesh() {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        this.line = new THREE.Line(geometry, material);
        this.line.position.copy(this.position);
        this.stage.scene.add(this.line);
    }

    update() {
        const data = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(data);

        // positions配列の初期化または再利用
        if (!this.positions || this.positions.length !== data.length * 3) {
            this.positions = new Float32Array(data.length * 3);
        }

        for (let i = 0; i < data.length; i++) {
            const x = (i / data.length) * 2 - 1;
            const y = Math.abs((data[i] / 255) * 2 - 1);
            // const y = (data[i] / 255) * 2 - 1;
            // const y = ((data[i] / 255) * 2 - 1) * -1;
            this.positions[i * 3] = x;
            this.positions[i * 3 + 1] = y;
            this.positions[i * 3 + 2] = 0;
        }

        this.line.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.line.geometry.computeBoundingSphere();
    }

}

class BarWaveform {
    constructor(stage, analyser, position = new THREE.Vector3(), radius = 5) {
        this.stage = stage;
        this.analyser = analyser;
        this.bars = [];
        this.numberOfBars = 128; // 表示する棒の数
        this.position = position;
        this.group = new THREE.Group(); // グループを追加
        this.data = new Uint8Array(this.analyser.frequencyBinCount);
        this.radius = radius; // 円の半径
        this.baseColor = new THREE.Color(0x155EE9); // 青系統おしゃれ
    }

    init() {
        const angleStep = Math.PI * 2 / this.numberOfBars; // 角度
        // 基準色#FF4180の色相(Hue)を計算します。Three.jsでは色相は0から1の間で表されます。
        // const baseColor = new THREE.Color(0xFF4180); // アセロラ系
        // const baseColor = new THREE.Color(0x155EE9); // 青系統おしゃれ
        // const baseColor = new THREE.Color(0x155EE9);
        const baseHSL = { h: 0, s: 0, l: 0 };
        this.baseColor.getHSL(baseHSL);
        const baseHue = baseHSL.h;

        for (let i = 0; i < this.numberOfBars; i++) {
            const angle = angleStep * i;
            const x = this.radius * Math.cos(angle) / 2.5;
            const y = this.radius * Math.sin(angle) / 2.5;

            // 色相を徐々に変化させますが、最終的に基準色に戻るように設定
            const hue = (baseHue + (i / (this.numberOfBars - 1)) * (1 - baseHue)) % 1.0;
            // console.log(hue);
            const color = new THREE.Color().setHSL(hue, baseHSL.s, baseHSL.l);
            // const color = new THREE.Color("hsl(0, 100%, 50%)");

            const bar = this._createBar(color);
            bar.position.set(x, 0, y);

            this.group.add(bar);
            this.bars.push(bar);
        }
        this.stage.scene.add(this.group);
    }

    _createBar(color) {
        const geometry = new THREE.BoxGeometry(0.1, 1, 0.1);
        const material = new THREE.MeshBasicMaterial({ color: color, wireframe: true });
        return new THREE.Mesh(geometry, material);
    }

    update() {
        this.analyser.getByteFrequencyData(this.data);

        // 棒の数だけループして、それぞれの高さを更新
        for (let i = 0; i < this.bars.length; i++) {
            const value = this.data[i] / 255.0;
            const height = value;
            this.bars[i].scale.y = height;
            this.bars[i].position.y = height / 2;
        }
    }

    updateBaseColor(newColor) {
        // baseColorを更新
        this.baseColor = new THREE.Color(newColor);

        // 色相(Hue)、彩度(Saturation)、輝度(Lightness)を取得
        const baseHSL = { h: 0, s: 0, l: 0 };
        this.baseColor.getHSL(baseHSL);
        const baseHue = baseHSL.h;

        // 全ての棒グラフの色を更新
        for (let i = 0; i < this.numberOfBars; i++) {
            const hue = (baseHue + (i / (this.numberOfBars - 1)) * (1 - baseHue)) % 1.0;
            const color = new THREE.Color().setHSL(hue, baseHSL.s, baseHSL.l);

            // 既存の棒グラフのmaterialの色を更新
            this.bars[i].material.color = color;
            this.bars[i].material.needsUpdate = true; // Three.jsにmaterialの更新を通知
        }
    }
}

function randomBarWaveforms(stage, analyser, count) {
    for (let i = 0; i < count; i++) {
        const position = new THREE.Vector3(
            (Math.random() - 0.5) * 2, // x
            (Math.random() - 0.5) * 2, // y
            0 // z
        );

        const varwaveform = new BarWaveform(stage, analyser, position);
        varwaveform.init();

        stage.addVisualizer(varwaveform);
    }
}

class AudioVisualizer {
    constructor(fileInput, mesh) {
        this.fileInput = fileInput;
        this.mesh = mesh;
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this._setupEventListeners();
    }

    // ファイルの変更検知
    _setupEventListeners() {
        this.fileInput.addEventListener("change", (e) => this._onFileChange(e));
    }

    // ファイルが変更されたとき
    _onFileChange(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            this.audioContext.decodeAudioData(e.target.result).then(buffer => {
                const source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
                source.start(0);
            }).catch(error => {
                console.error('ファイルの読み込みに失敗しました', error);
                alert('ファイルの読み込みに失敗しました');
            });
        };

        reader.readAsArrayBuffer(file)
    }
}

(() => {

    const stage = new Stage();
    stage.init();

    const fileInput = document.getElementById("fileInput");
    const audioVisualizer = new AudioVisualizer(fileInput, null);

    const mesh = new Mesh(stage, audioVisualizer.analyser);
    stage.addVisualizer(mesh);

    // const waveform = new Waveform(stage, audioVisualizer.analyser);
    // stage.addVisualizer(waveform);

    const barwaveform = new BarWaveform(stage, audioVisualizer.analyser);
    stage.addVisualizer(barwaveform);

    // randomBarWaveforms(stage, audioVisualizer.analyser, 3)
    randomWaveforms(stage, audioVisualizer.analyser, 50);

    window.addEventListener("resize", () => {
        stage.onResize();
    })

    // meshサイズ変更
    const box_size = document.getElementById("box_size");
    box_size.addEventListener("change", function (e) {
        mesh.scaleBase = e.target.value / 100;
    })

    // waveforms色変更
    const barwaveform_color = document.getElementById("color_picker");
    barwaveform_color.addEventListener("change", function (e) {
        barwaveform.updateBaseColor(e.target.value);
    })

    const _raf = () => {
        window.requestAnimationFrame(() => {
            stage.onRaf();
            stage.update();
            _raf();
        });
    };

    _raf();
})();
