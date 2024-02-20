/*
HTML Canvasを用いて3Dビジュアライゼーションを管理するクラスです。
3Dシーンのレンダリング、カメラの設定を行います。
*/
import * as THREE from "three";

export default class SceneManager {
    constructor() {
        // 描画プロパティ
        this.renderParam = {
            clearColor: 0x000000,
            width: window.innerWidth,
            height: window.innerHeight
        };

        // カメラプロパティ
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

        _init();
    }

    _init() {
        this._setScene();
        this._setRenderer();
        this._setCamera();
        this.isInitialized = true;
    }

    // シーンの描画
    _setScene() {
        this.scene = new THREE.Scene();
    }

    // レンダラーの描画
    _setRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(this.renderParam.clearColor));
        this.renderer.setSize(this.renderParam.width, this.renderParam.height);
        const wrapper = document.querySelector("#webgl");
        wrapper.appendChild(this.renderer.domElement);
    }

    // カメラの描画
    _setCamera() {
        // アスペクト比を計算
        const aspectRatio = window.innerWidth / window.innerHeight;
        // カメラの設定
        this.camera = new THREE.PerspectiveCamera(
            this.cameraParam.fov,  // 視野角
            aspectRatio,           // アスペクト比
            this.cameraParam.near, // 近くのクリッピング平面
            this.cameraParam.far   // 遠くのクリッピング平面
        );
        // カメラ座標の設定
        this.camera.position.set(
            this.cameraParam.x,
            this.cameraParam.y,
            this.cameraParam.z
        );
        // カメラ向きの設定
        this.camera.lookAt(this.cameraParam.lookAt);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _render() {
        this.renderer.render(this.scene, this.camera);
    }

    // レスポンシブ処理
    _onResize() {
        window.addEventListener("resize", () => {
            this._setCamera();
        })
    }

    // シーン調整用プロパティ(背景色やカメラの角度など)
    setUI() {

    }
}
