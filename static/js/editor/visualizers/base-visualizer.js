import * as THREE from "three";

export default class BaseVisualizer {
    constructor(stage, analyser) {
        this.id = null;
        this.name = "BaseVisualizer";
        this.stage = stage;
        this.analyser = analyser;
        this.mesh = null;
        this.param = {
            x: 0,
            y: 2,
            z: 0
        };
    }

    init() {
        this._setMesh();
    }

    _setMesh() {

    }

    update() {

    }

    setUI() {

    }
}

class CircleVisualizer extends BaseVisualizer {
    
}