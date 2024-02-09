import * as THREE from "three";
import BoxVisualizer from "./visualizers/box-visualizer.js";

export default class Visualizer {
    constructor(stage, analyser) {
        this.stage = stage;
        this.analyser = analyser;
    }

    setTemplate(templateName) {
        switch (templateName) {
            case "box-visualizer":
                setBoxVisualizer(this.stage, this.analyser);
                break;
            case "template2":
                break;
        }
    }
}

const setBoxVisualizer = (stage, analyser) => {
    console.log("setBoxVisualizer execute.");
    stage.addVisualizer(new BoxVisualizer(stage, analyser));
}

// ...setVisualizerメソッド
