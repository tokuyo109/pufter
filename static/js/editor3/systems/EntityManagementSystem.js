// ecsyのSystemをインポートする
import { System } from "ecsy";

// ecsyのComponentをインポートする
import {
    Scene, Renderer,
    Mesh,
    Position, Rotation, Scale,
    UIControllable
} from "../components/index.js";

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
            Position: {
                label: "Position",
                fields: [
                    { key: "positionX", type: "number", step: "0.1" },
                    { key: "positionY", type: "number", step: "0.1" },
                    { key: "positionZ", type: "number", step: "0.1" }
                ]
            },
            Rotation: {
                label: "Rotation",
                fields: [
                    { key: "rotationX", type: "number", step: "0.1" },
                    { key: "rotationY", type: "number", step: "0.1" },
                    { key: "rotationZ", type: "number", step: "0.1" }
                ]
            },
            Scale: {
                label: "Scale",
                fields: [
                    { key: "scaleX", type: "number", step: "0.1" },
                    { key: "scaleY", type: "number", step: "0.1" },
                    { key: "scaleZ", type: "number", step: "0.1" }
                ]
            },
            Visualizer: {
                label: "Visualizer",
                fields: [

                ]
            }
        }

        this.select = document.querySelector("#entitySelector");
        this.output = document.querySelector("#UIOutoput");

        // セレクトが変更されたときにUIを更新する
        this.select.addEventListener("change", (event) => {
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

        const label = this.UIMetadata.Renderer.label;
        const labelElement = document.createElement("label");
        labelElement.setAttribute("for", "color-picker");
        // labelElement.setAttribute("for", label);
        labelElement.textContent = label;

    }

    // ポジションを編集するUIを生成する
    setPositionUI(entity) {
        const { x, y, z } = entity.getComponent(Position);

        const label = this.UIMetadata.Position.label;
        const labelElement = document.createElement("label");
        labelElement.setAttribute("for", label);
        labelElement.textContent = label;

        this.output.appendChild(labelElement);

        this.UIMetadata.Position.fields.forEach(field => {
            let value;
            switch (field.key) {
                case "positionX": value = x; break;
                case "positionY": value = y; break;
                case "positionZ": value = z; break;
            }

            const input = document.createElement("input");
            input.setAttribute("name", label);
            input.setAttribute("id", field.key);
            input.setAttribute("type", field.type);
            input.setAttribute("step", field.step);
            input.value = value;

            // イベントリスナーをここで追加
            input.addEventListener("change", (event) => {
                const newValue = parseFloat(event.target.value);
                switch (event.target.id) {
                    case "positionX": this.updatePositionX(entity, newValue); break;
                    case "positionY": this.updatePositionY(entity, newValue); break;
                    case "positionZ": this.updatePositionZ(entity, newValue); break;
                }
            });

            this.output.appendChild(input);
        });
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

        const label = this.UIMetadata.Rotation.label;
        const labelElement = document.createElement("label");
        labelElement.setAttribute("for", label);
        labelElement.textContent = label;

        this.output.appendChild(labelElement);

        this.UIMetadata.Rotation.fields.forEach(field => {
            let value;
            switch (field.key) {
                case "rotationX": value = x; break;
                case "rotationY": value = y; break;
                case "rotationZ": value = z; break;
            }

            const input = document.createElement("input");
            input.setAttribute("name", label);
            input.setAttribute("id", field.key);
            input.setAttribute("type", field.type);
            input.setAttribute("step", field.step);
            input.value = value;

            // イベントリスナーをここで追加
            input.addEventListener("change", (event) => {
                const newValue = parseFloat(event.target.value);
                switch (event.target.id) {
                    case "rotationX": this.updateRotationX(entity, newValue); break;
                    case "rotationY": this.updateRotationY(entity, newValue); break;
                    case "rotationZ": this.updateRotationZ(entity, newValue); break;
                }
            });

            this.output.appendChild(input);
        });
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

        const label = this.UIMetadata.Scale.label;
        const labelElement = document.createElement("label");
        labelElement.setAttribute("for", label);
        labelElement.textContent = label;

        this.output.appendChild(labelElement);

        this.UIMetadata.Scale.fields.forEach(field => {
            let value;
            switch (field.key) {
                case "scaleX": value = x; break;
                case "scaleY": value = y; break;
                case "scaleZ": value = z; break;
            }

            const input = document.createElement("input");
            input.setAttribute("name", label);
            input.setAttribute("id", field.key);
            input.setAttribute("type", field.type);
            input.setAttribute("step", field.step);
            input.value = value;

            // イベントリスナーをここで追加
            input.addEventListener("change", (event) => {
                const newValue = parseFloat(event.target.value);
                switch (event.target.id) {
                    case "scaleX": this.updateScaleX(entity, newValue); break;
                    case "scaleY": this.updateScaleY(entity, newValue); break;
                    case "scaleZ": this.updateScaleZ(entity, newValue); break;
                }
            });

            this.output.appendChild(input);
        });
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
