import * as THREE from "three";

export default class Background {
    constructor(scene) {
        this.scene = scene;
    }

    setTemplate(templateName) {
        switch (templateName) {
            case "template1":
                setBlackTemplate(this.scene);
                break;
            case "template2":
                setWhiteTemplate(this.scene);
                break;
            case "template3":
                setGrayTemplate(this.scene);
                break;
        }
    }
}

// 背景が黒
const setBlackTemplate = (scene) => {
    scene.background = new THREE.Color(0x222222);
}

// 背景が白
const setWhiteTemplate = (scene) => {
    scene.background = new THREE.Color(0xeeeeee);
}

// 背景が白
const setGrayTemplate = (scene) => {
    scene.background = new THREE.Color(0x888888);
}
