export default class ParentComponent {
    constructor() {
        this.children = []; // 子エンティティのIDを格納する配列
    }

    addChild(entityId) {
        this.children.push(entityId);
    }

    removeChild(entityId) {
        const index = this.children.indexOf(entityId);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    getChildren() {
        return this.children;
    }
}
