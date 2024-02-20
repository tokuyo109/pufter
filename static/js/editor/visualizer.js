import * as THREE from "three";
import BoxVisualizer from "./visualizers/box-visualizer.js";
import LineVisualizer from "./visualizers/line-visualizer.js";
import CircleVisualizer from "./visualizers/circle-visualizer.js";

export default class Visualizer {
    constructor(stage, musicManager) {
        this.stage = stage;
        this.musicManager = musicManager;
    }

    setTemplate(templateName) {
        switch (templateName) {
            case "box-visualizer":
                setBoxVisualizer(this.stage, this.musicManager);
                break;
            case "line-visualizer":
                setLineVisualizer(this.stage, this.musicManager);
                break;
            case "circle-visualizer":
                setCircleVisualizer(this.stage, this.musicManager);

        }
    }
}

const setBoxVisualizer = (stage, musicManager) => {
    console.log("setBoxVisualizer execute.");
    stage.addVisualizer(new BoxVisualizer(stage, musicManager));
}

const setLineVisualizer = (stage, musicManager) => {
    console.log("setLineVisualizer execute.");
    stage.addVisualizer(new LineVisualizer(stage, musicManager));
}

const setCircleVisualizer = (stage, musicManager) => {
    console.log("setCircleVisualizer execute.");
    stage.addVisualizer(new CircleVisualizer(stage, musicManager));
}
// ...setVisualizerメソッド
