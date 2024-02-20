/*
オブジェクトの追加
*/

export default class ObjectManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.dynamicObjects = {};
        this.staticObjects = {};
        this.recentlyObject = {};
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
}
