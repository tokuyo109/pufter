// 今は使用していない
// ./system/UISystem.js
import * as THREE from "three";

import { System } from 'ecsy';
import { Object3D, Mesh, Position, Rotation, Scale, UIControllable, LyricDisplayCube, RandomWalk } from '../components/components.js';

import GUI from "lil-gui";

// 追加することができるエンティティのリスト
const avaiableEntities = [
    { name: "LyricDisplayCube" },
];

// UIを管理するシステム
export default class UISystem extends System {
    init(world) {
        this.world = world;
        this.gui = new GUI({
            injectStyles: true,
            container: document.querySelector("#entityParameters")
        });
        this.selector = document.querySelector("#entitySelector");
        this.avaiableEntitiesSelector = document.querySelector("#avaiableEntitySelector");

        // 選択することができるエンティティをセレクタに追加する
        avaiableEntities.forEach((entity) => {
            const divElement = document.createElement("div");
            divElement.textContent = entity.name;
            divElement.value = entity.name;
            this.avaiableEntitiesSelector.appendChild(divElement);
            divElement.addEventListener("click", (event) => {
                this.addEntity(event.target.value);
            });
        });
    }

    // 毎フレーム実行する
    execute(delta, time) {
        // 追加されたエンティティをセレクタに追加する
        this.queries.uiControllable.added.forEach(entity => {
            const optionElement = document.createElement("option");
            optionElement.value = entity.id;
            optionElement.textContent = entity.name;
            this.selector.appendChild(optionElement);
            optionElement.addEventListener("click", (event) => {
                const currentEntity = this.queries.uiControllable.results.find(entity => entity.id == event.target.value);
                this.setParamUI(currentEntity);
            });
        });
    }

    // エンティティを追加する
    addEntity(entityName) {
        switch (entityName) {
            case "LyricDisplayCube":
                const LyricDisplayCubeEntity = this.world.createEntity();
                LyricDisplayCubeEntity
                    .addComponent(Object3D, { value: new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial()) })
                    .addComponent(Mesh)
                    .addComponent(Position, { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5, z: Math.random() * 3 - 1.5 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 2, y: 2, z: 2 })
                    .addComponent(LyricDisplayCube)
                    .addComponent(UIControllable)
                    .addComponent(RandomWalk); // 仮でRandomWalkを追加しています
                LyricDisplayCubeEntity.name = `LyricDisplayCube${LyricDisplayCubeEntity.id}`;
                break;
        }
    }

    // パラメータ調整UIを作成する
    setParamUI(entity) {
        // GUIをリセット
        if (this.gui) {
            this.gui.destroy();
            this.gui = null;
        }
        this.gui = new GUI({
            injectStyles: true,
            container: document.querySelector("#entityParameters")
        });
        if (entity.hasComponent(Position)) {
            this.setPositionUI(entity);
        }

        if (entity.hasComponent(Rotation)) {
            this.setRotationUI(entity);
        }

        if (entity.hasComponent(Scale)) {
            this.setScaleUI(entity);
        }
        if (entity.hasComponent(LyricDisplayCube)) {
            this.setFontUI(entity); // Lyric～コンポーネントを持つならフォント選択UIを追加
        }
    }

    setPositionUI(entity) {
        const { x, y, z } = entity.getComponent(Position);
        const positionFolder = this.gui.addFolder("position");
        positionFolder
            .add({ X: x }, "X", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Position).x = newValue)
            .listen();
        positionFolder
            .add({ Y: y }, "Y", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Position).y = newValue)
            .listen();
        positionFolder
            .add({ Z: z }, "Z", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Position).z = newValue)
            .listen();
    }

    setRotationUI(entity) {
        const { x, y, z } = entity.getComponent(Rotation);
        const rotationFolder = this.gui.addFolder("rotation");
        rotationFolder
            .add({ X: x }, "X", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Rotation).x = newValue);
        rotationFolder
            .add({ Y: y }, "Y", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Rotation).y = newValue);
        rotationFolder
            .add({ Z: z }, "Z", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Rotation).z = newValue);
    }

}

UISystem.queries = {
    uiControllable: {
        components: [UIControllable],
        listen: {
            added: true
        }
    }
};

