// 編集ページ全体の管理ファイル
import Stage from "./stage.js";
import MusicManager from "./music-manager.js";
import Background from "./background.js";
import Visualizer from "./visualizer.js";

// 背景を変更する
const changeBackground = (stage, selectedTemplate) => {
    const background = new Background(stage.scene);
    background.setTemplate(selectedTemplate);
}

// ビジュアライザーを追加する
const addVisualizer = (stage, musicManager) => {
    const selectedTemplate = document.getElementById("visualizerSelector").value;
    const visualizer = new Visualizer(stage, musicManager);
    visualizer.setTemplate(selectedTemplate);
}

// ビジュアライザーを選択する
const choiceVisualizer = (stage, selectedId) => {
    const selectedVisualizer = stage.visualizers[selectedId];
    selectedVisualizer.setUI();
}

// イベントリスナーを設定する
const setUpEventListeners = (stage, musicManager) => {
    document.getElementById("backgroundSelector").addEventListener("change", (event) => {
        changeBackground(stage, event.target.value);
    })

    document.getElementById("addVisualizer").addEventListener("click", () => {
        addVisualizer(stage, musicManager);
    })

    document.getElementById("allVisualierSelector").addEventListener("change", (event) => {
        choiceVisualizer(stage, event.target.value);
    })
}

(() => {
    const stage = new Stage();
    stage.init();
    const musicManager = new MusicManager();

    setUpEventListeners(stage, musicManager);

    // アニメーションループを開始する
    const _raf = () => {
        window.requestAnimationFrame(() => {
            stage.onRaf();// マイフレームレンダリング
            stage.updateVisualizers();// 全てのビジュアライザーの更新
            _raf();
        });
    };

    _raf();
})();
