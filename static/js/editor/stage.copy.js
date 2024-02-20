/*
HTML Canvasを用いて3Dビジュアライゼーションを管理するクラスです
3Dシーンのレンダリング、カメラの設定、ビジュアライザーの管理を行う
*/

import * as THREE from "three";
import randomString from "./utils/random-string.js";

class StageCoopy {
    constructor() {
        // Visualizerインスタンスを格納
        this.visualizers = [];

        this.renderParam = {
            clearColor: 0x222222,
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.cameraParam = {
            fov: 45,
            near: 1,
            far: 1000,
            lookAt: new THREE.Vector3(0, 0, 0),
            x: 0,
            y: 5,
            z: -15
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.isInitialized = false;
    }

    init() {
        // レンダリングの一連の流れを実行する
        this._setScene();
        this._setRender();
        this._setCamera();
        this.isInitialized = true;

        // 変更を検知するメソッド群
        this._onResize();
    }

    _setScene() {
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.GridHelper(10, 10)); // 平面グリッド表示
        this.scene.add(new THREE.AxesHelper(180)); // x, y, z軸表示
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
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // 画面を更新する
    _render() {
        this.renderer.render(this.scene, this.camera);
    }
    // requestAnimationFrame内に記述し、マイフレームレンダリングするための関数を呼び出す
    onRaf() {
        this._render();
    }

    // Stageにビジュアライザーを追加する
    addVisualizer(visualizer) {
        // stageに描画
        visualizer.init();

        // 配列に保存
        const id = randomString();
        visualizer.id = id;
        this.visualizers[id] = visualizer;

        // 追加されたビジュアライザーを基にUIを更新する
        this.updateVisualizersList();
    }

    // Sceneに描画されている全てのビジュアライザーを更新する
    updateVisualizers() {
        // オブジェクトを一度、値のみの配列にしてから更新処理する
        Object.values(this.visualizers).forEach(visualizer => { visualizer.update() });
    }

    // Sceneに追加されているビジュアライザーのリスト表示
    updateVisualizersList() {
        const allVisualierSelector = document.getElementById("allVisualierSelector");
        allVisualierSelector.innerHTML = '<option value="">Select a Visualizer...</option>'; // リストをリセット

        for (const id in this.visualizers) {
            const option = document.createElement("option");
            option.value = id;
            option.textContent = `Visualizer ${id}`;
            allVisualierSelector.appendChild(option);
        }
    }

    // 画面幅が変更されたときにカメラを中心に据える
    _onResize() {
        window.addEventListener("resize", () => {
            this._setCamera();
        })
    }
}
