// 編集ページ全体の管理ファイル
import Stage from "./stage.js";
import AudioVisualizer from "./audio-visualizer.js";
import Background from "./background.js";
import Visualizer from "./visualizer.js";

// 背景を変更する
const changeBackground = (stage, selectedTemplate) => {
    const background = new Background(stage.scene);
    background.setTemplate(selectedTemplate);
}

// ビジュアライザーを追加する
const addVisualizer = (stage, audioVisualizer) => {
    const selectedTemplate = document.getElementById("visualizerSelector").value;
    const visualizer = new Visualizer(stage, audioVisualizer.analyser);
    visualizer.setTemplate(selectedTemplate);
}

// ビジュアライザーを選択する
const choiceVisualizer = (stage, selectedId) => {
    const selectedVisualizer = stage.visualizers[selectedId];
    selectedVisualizer.setUI();
}

// イベントリスナーを設定する
const setUpEventListeners = (stage, audioVisualizer) => {
    document.getElementById("backgroundSelector").addEventListener("change", (event) => {
        changeBackground(stage, event.target.value);
    })

    document.getElementById("addVisualizer").addEventListener("click", () => {
        addVisualizer(stage, audioVisualizer);
    })

    document.getElementById("allVisualierSelector").addEventListener("change", (event) => {
        choiceVisualizer(stage, event.target.value);
    })
}

(() => {
    const stage = new Stage();
    stage.init();

    const audioVisualizer = new AudioVisualizer(document.getElementById("input_music"));

    setUpEventListeners(stage, audioVisualizer);

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
