// ecsyのSystemをインポートする
import { System } from "ecsy";

// ecsyのComponentをインポートする
import {
    Scene, Renderer,
    Mesh,
    Position, Rotation, Scale,
    UIControllable
} from "../components/index.js";

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
    setRendererUI(entity) {
        const rendererComponent = entity.getMutableComponent(Renderer);
        console.log(rendererComponent);
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
        const mesh = entity.getMutableComponent(Mesh).value;
        const position = entity.getMutableComponent(Position);

        position.x = newValue;
        mesh.position.x = position.x;
    }
    updatePositionY(entity, newValue) {
        const mesh = entity.getMutableComponent(Mesh).value;
        const position = entity.getMutableComponent(Position);

        position.y = newValue;
        mesh.position.y = position.y;
    }
    updatePositionZ(entity, newValue) {
        const mesh = entity.getMutableComponent(Mesh).value;
        const position = entity.getMutableComponent(Position);

        position.z = newValue;
        mesh.position.z = position.z;
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
        const mesh = entity.getMutableComponent(Mesh).value;
        const rotation = entity.getMutableComponent(Rotation);

        rotation.x = newValue;
        mesh.rotation.x = rotation.x;
    }
    updateRotationY(entity, newValue) {
        const mesh = entity.getMutableComponent(Mesh).value;
        const rotation = entity.getMutableComponent(Rotation);

        rotation.y = newValue;
        mesh.rotation.y = rotation.y;
    }
    updateRotationZ(entity, newValue) {
        const mesh = entity.getMutableComponent(Mesh).value;
        const rotation = entity.getMutableComponent(Rotation);

        rotation.z = newValue;
        mesh.rotation.z = rotation.z;
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
    updateScaleX(entity, input) {
        const mesh = entity.getMutableComponent(Mesh).value;
        const scale = entity.getMutableComponent(Scale);

        scale.x = input;
        mesh.scale.x = scale.x;
    }
    updateScaleY(entity, input) {
        const mesh = entity.getMutableComponent(Mesh).value;
        const scale = entity.getMutableComponent(Scale);

        scale.y = input;
        mesh.scale.y = scale.y;
    }
    updateScaleZ(entity, input) {
        const mesh = entity.getMutableComponent(Mesh).value;
        const scale = entity.getMutableComponent(Scale);

        scale.z = input;
        mesh.scale.z = scale.z;
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
