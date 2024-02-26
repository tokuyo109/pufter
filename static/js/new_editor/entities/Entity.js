import { v4 as uuid4 } from 'uuid';

export default class Entity {
    constructor(components = {}) {
        this.id = uuid4(); // エンティティを一意に識別する番号
        this.components = components; // エンティティが持つコンポーネント
    }

    // コンポーネントを追加するメソッド
    addComponent(componentType, component) {
        this.components[componentType] = component;
    }

    // コンポーネントを取得するメソッド
    getComponent(componentType) {
        return this.components[componentType];
    }

    // コンポーネントの存在を確認するメソッド
    hasComponent(componentType) {
        return this.components.hasOwnProperty(componentType);
    }
}