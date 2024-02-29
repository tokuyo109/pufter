import * as THREE from "three";

// ecsyのSystemをインポートする
import { System } from "ecsy";

// ecsyのComponentをインポートする
import {
    Scene, Renderer,
    Mesh,
    Position, Rotation, Scale,
    UIControllable, Visualizer
} from "../components/index.js";

// lil-guiをインポートする
import GUI from "lil-gui";

/*
this.output.innerHTMLで直接再代入しないでください。
DOMが再描画され、EventListenerが初期化されます。
*/

export default class EntityManagementSystem extends System {
    init() {
        // コンポーネントごとにUIメタデータを用意する
        // HTMLを生成する際に使用する
        // fieldsにはHTML Elementに付与するプロパティの情報を記述する
        this.UIMetadata = {
            Mesh: {
                label: "Mesh",
                fields: [
                    { key: "color", type: "color" }
                ]
            },
            Renderer: {
                label: "Renderer",
                fields: [
                    { key: "color", type: "color" }
                ]
            },
            Visualizer: {
                label: "Visualizer",
                fields: [

                ]
            }
        }

        // lil-guiインスタンスが格納される
        this.gui = null;
        // エンティティのリスト
        this.select = document.querySelector("#entitySelector");
        // GUIの出力先
        this.output = document.querySelector("#UIOutoput");

        // セレクトが変更されたときにUIを更新する
        this.select.addEventListener("change", (event) => {
            // lil-gui処理
            if (this.gui) {
                this.gui.destroy();
                this.gui = null;
            }
            this.gui = new GUI();

            // 過去のUIを空にする
            this.output.innerHTML = "";
            this.queries.entities.results.forEach(entity => {
                // 選択されているエンティティのID
                const selectedID = parseInt(event.target.value);
                if (entity.id === selectedID) {

                    // エンティティがRendererコンポーネントを持つか
                    if (entity.hasComponent(Renderer)) {
                        this.setRendererUI(entity);
                    }

                    // エンティティがMeshコンポーネントを持つか
                    if (entity.hasComponent(Mesh)) {
                        this.setMeshUI(entity);
                    }

                    // // エンティティがSceneコンポーネントを持つか
                    // if (entity.hasComponent(Scene)) {
                    //     this.setSceneUI(entity);
                    // }

                    // エンティティがPositionコンポーネントを持つか
                    if (entity.hasComponent(Position)) {
                        this.setPositionUI(entity);
                    }

                    // エンティティがRotationコンポーネントを持つか
                    if (entity.hasComponent(Rotation)) {
                        this.setRotationUI(entity);
                    }

                    // エンティティがScaleコンポーネントを持つか
                    if (entity.hasComponent(Scale)) {
                        this.setScaleUI(entity);
                    }

                    // エンティティがVisualizerコンポーネントを持つか
                    if (entity.hasComponent(Visualizer)) {
                        // ここに処理を記述
                    }
                }
            })
        });
    };

    execute(delta, time) {
        // エンティティのリストを更新する
        this.updateEntityList();
    }

    // エンティティのリストを更新する
    // optionを追加し、エンティティを選択できるようにする
    updateEntityList() {
        this.queries.entities.added.forEach(entity => {
            const option = document.createElement("option");
            if (entity.hasComponent(Scene)) {
                option.text = `Scene ${entity.id}`;
            } else if (entity.hasComponent(Mesh)) {
                option.text = `Mesh ${entity.id}`;
            } else {
                option.text = `updateEntityList()に定義されていないEntity ${entity.id}`
            }
            option.value = entity.id;
            this.select.appendChild(option);
        });
    }

    // シーンを編集するUIを生成する
    setSceneUI(entity) {
        // ここに処理を記述する
    }

    // レンダラーを編集するUIを生成する
    // 背景色を変更するUIの生成プログラムはここで記述する
    setRendererUI(entity) {
        const rendererComponent = entity.getMutableComponent(Renderer);
        console.log(rendererComponent);
        const field = this.UIMetadata.Renderer.fields;
        const label = this.UIMetadata.Renderer.label;
        const labelElement = document.createElement("label");

        console.log(label);

        labelElement.setAttribute("for", label);
        labelElement.textContent = label;

        this.output.appendChild(labelElement);


        const input = document.createElement("input");
        input.setAttribute("name", label)
        input.setAttribute("id", field.key)
        input.setAttribute("type", field.type)
        input.value = rendererComponent.clearColor

        //イベントリスナー
        input.addEventListener("change", (event) => {
            const newValue = event.target.value;
            this.updateclearColor(entity, newValue, rendererComponent);
        });
        this.output.appendChild(input)

    }
    updateclearColor(entity, newValue, rendererComponent) {
        rendererComponent.clearColor = newValue
    };

    // メッシュを編集するUIを生成する
    setMeshUI(entity) {
        const meshComponent = entity.getComponent(Mesh).value;

        // フォルダ作成
        const meshFolder = this.gui.addFolder("mesh");


        // ジオメトリ変更UIの表示
        const geometryObj = {
            cube: () => new THREE.BoxGeometry(1, 1, 1),
            sphere: () => new THREE.SphereGeometry(0.5, 32, 32)
        }

        meshFolder.add(geometryObj, "cube", geometryObj).onChange((func) => {
            this.updateGeometry(entity, func);
        })

        // 色変更UIの表示
        const color = meshComponent.material.color;
        const [r, g, b] = color;
        const colorObj = {
            color: { r: r, g: g, b: b }
        }

        meshFolder.addColor(colorObj, "color").onChange((value) => {
            this.updateMeshColor(entity, value)
        });
    }

    // ジオメトリを更新する
    updateGeometry(entity, func) {
        entity.getMutableComponent(Mesh).value.geometry = func();
        // console.log(entity.getMutableComponent(Mesh).value.geometry);
    }

    // 色を更新する
    updateMeshColor(entity, value) {
        const { r, g, b } = value;
        entity.getMutableComponent(Mesh).value.material.color.set(new THREE.Color(r, g, b));
    }

    // ポジションを編集するUIを生成する
    setPositionUI(entity) {
        const { x, y, z } = entity.getComponent(Position);

        const positionFolder = this.gui.addFolder("position");
        const positionObj = {
            X: x,
            Y: y,
            Z: z
        }

        positionFolder.add(positionObj, "X", -5, 5).onChange((value) => {
            this.updatePositionX(entity, value);
        });
        positionFolder.add(positionObj, "Y", -5, 5).onChange((value) => {
            this.updatePositionY(entity, value);
        });
        positionFolder.add(positionObj, "Z", -5, 5).onChange((value) => {
            this.updatePositionZ(entity, value);
        })
    }

    updatePositionX(entity, newValue) {
        entity.getMutableComponent(Position).x = newValue;
    }
    updatePositionY(entity, newValue) {
        entity.getMutableComponent(Position).y = newValue;
    }
    updatePositionZ(entity, newValue) {
        entity.getMutableComponent(Position).z = newValue;
    }

    // ロテーションを編集するUIを生成する
    setRotationUI(entity) {
        const { x, y, z } = entity.getComponent(Rotation);

        const rotationFolder = this.gui.addFolder("rotation");
        const rotationObj = {
            X: x,
            Y: y,
            Z: z
        }

        rotationFolder.add(rotationObj, "X", -5, 5).onChange((value) => {
            this.updateRotationX(entity, value);
        });
        rotationFolder.add(rotationObj, "Y", -5, 5).onChange((value) => {
            this.updateRotationY(entity, value);
        });
        rotationFolder.add(rotationObj, "Z", -5, 5).onChange((value) => {
            this.updateRotationZ(entity, value);
        })
    }

    // Rotationの変更を反映させる
    updateRotationX(entity, newValue) {
        entity.getMutableComponent(Rotation).x = newValue;
    }
    updateRotationY(entity, newValue) {
        entity.getMutableComponent(Rotation).y = newValue;
    }
    updateRotationZ(entity, newValue) {
        entity.getMutableComponent(Rotation).z = newValue;
    }

    // スケールを編集するUIを生成する
    setScaleUI(entity) {
        const { x, y, z } = entity.getComponent(Scale);

        const scaleFolder = this.gui.addFolder("scale");
        const scaleObj = {
            X: x,
            Y: y,
            Z: z
        }

        scaleFolder.add(scaleObj, "X", -5, 5).onChange((value) => {
            this.updateScaleX(entity, value);
        });
        scaleFolder.add(scaleObj, "Y", -5, 5).onChange((value) => {
            this.updateScaleY(entity, value);
        });
        scaleFolder.add(scaleObj, "Z", -5, 5).onChange((value) => {
            this.updateScaleZ(entity, value);
        })
    }

    // Scaleの変更を反映させる
    updateScaleX(entity, newValue) {
        entity.getMutableComponent(Scale).x = newValue;
    }
    updateScaleY(entity, newValue) {
        entity.getMutableComponent(Scale).y = newValue;
    }
    updateScaleZ(entity, newValue) {
        entity.getMutableComponent(Scale).z = newValue;
    }
}

EntityManagementSystem.queries = {
    entities: {
        components: [UIControllable],
        listen: {
            added: true
        }
    }
};
