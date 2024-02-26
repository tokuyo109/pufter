import { System } from "ecsy";

import { Mesh, Position, UIControllable } from "../components/index.js";

export default class EntityManagementSystem extends System {
    init() {
        // コンポーネントごとのUIメタデータ
        this.UIMetadata = {
            Position: {
                label: "Position",
                fields: [
                    { key: "positionX", type: "number", step: "0.1" },
                    { key: "positionY", type: "number", step: "0.1" },
                    { key: "positionZ", type: "number", step: "0.1" }
                ]
            }
        }


        this.select = document.querySelector("#entitySelector");
        this.output = document.querySelector("#UIOutoput");

        this.select.addEventListener("change", (event) => {
            this.output.innerHTML = "";
            this.queries.entities.results.forEach(entity => {
                const selectedID = parseInt(event.target.value);
                if (entity.id === selectedID) {
                    if (entity.hasComponent(Position)) {
                        this.setPositionUI(entity);
                    }
                }
            })
        });
    };
    execute(delta, time) {
        // エンティティのリストを更新する
        this.updateEntityList();
    }

    updateEntityList() {
        this.queries.entities.added.forEach(entity => {
            const option = document.createElement("option");
            option.value = entity.id;
            option.text = `Entity ${entity.id}`;
            this.select.appendChild(option);
        });
    }

    // エンティティがPositionコンポーネントを持つ場合
    setPositionUI(entity) {
        const { x, y, z } = entity.getComponent(Position);
        const label = this.UIMetadata.Position.label;

        this.output.innerHTML += `<label for=${label}>${label}</label>`;

        this.UIMetadata.Position.fields.forEach(field => {
            let value;
            switch (field.key) {
                case "positionX":
                    value = x;
                    break;
                case "positionY":
                    value = y;
                    break;
                case "positionZ":
                    value = z;
                    break;
                default:
                    value = ""; // 予期せぬkeyがあった場合は空の値を設定
            }

            this.output.innerHTML += `
                <input name="${label}" key="${field.key}" type="${field.type}" step="${field.step}" value="${value}"></input>
            `
        })
    }

    MeshUISet(entity) {
        const mesh = entity.getComponent(Mesh).value;
        const geometry = mesh.geometry;
        const material = mesh.material;
        this.output.innerHTML = `
            geometry: ${geometry}
            material: ${material}
        `;
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
