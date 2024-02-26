/*
HTML Canvasを用いて3Dビジュアライゼーションを管理するクラスです
3Dシーンのレンダリング、カメラの設定、ビジュアライザーの管理を行う
*/

import * as THREE from "three";
import SceneManager from "./scene-manager.js";
import randomString from "./utils/random-string.js";

class StageCopy {
    constructor() {
        this.sceneManager = SceneManager;
        this.dynamicObjects = {}; // ビジュアライザーなど
        this.staticObjects = {}; // ライトなど
        this.recentlyObjects = {}; // 最近使用したオブジェクト

        this.selectedID = null; // 選択されているオブジェクトを一意に特定する

        _setEventListener();
    }

    _setEventListener() {

    }

    // 動的なオブジェクトを格納する
    addDynamicObjects() {

    }

    // 静的なオブジェクトを格納する
    addStaticObjects() {

    }

    // 最近使用したオブジェクトを格納する(10個まで)
    addRecentlyObjects() {

    }

    // 動的なオブジェクトを更新する
    updateDynamicObjects() {

    }

    // // Stageにビジュアライザーを追加する
    // addVisualizer(visualizer) {
    //     // stageに描画
    //     visualizer.init();

    //     // 配列に保存
    //     const id = randomString();
    //     visualizer.id = id;
    //     this.visualizers[id] = visualizer;

    //     // 追加されたビジュアライザーを基にUIを更新する
    //     this.updateVisualizersList();
    // }

    // Sceneに描画されている全てのビジュアライザーを更新する
    // updateVisualizers() {
    //     // オブジェクトを一度、値のみの配列にしてから更新処理する
    //     Object.values(this.visualizers).forEach(visualizer => { visualizer.update() });
    // }

    // // Sceneに追加されているビジュアライザーのリスト表示
    // updateVisualizersList() {
    //     const allVisualierSelector = document.getElementById("allVisualierSelector");
    //     allVisualierSelector.innerHTML = '<option value="">Select a Visualizer...</option>'; // リストをリセット

    //     for (const id in this.visualizers) {
    //         const option = document.createElement("option");
    //         option.value = id;
    //         option.textContent = `Visualizer ${id}`;
    //         allVisualierSelector.appendChild(option);
    //     }
    // }
}
