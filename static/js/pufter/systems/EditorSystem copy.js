import * as THREE from "three";
import { System } from "ecsy";
import {
    Scene,
    Renderer,
    Camera,
    Group,
    Object3D,
    Mesh,
    Position,
    Rotation,
    Scale,
    UI,
    Export,
    RandomWalk,
    LyricDisplayCube,
} from "../components/components.js";
import GUI from "lil-gui";

export class EditorSystem extends System {
    init() {
        this.MAX_STACK_SIZE = 20;
        this.undoStack = [];
        this.redoStack = [];
        this.undoButton = null;
        this.redoButton = null;
        this.gui = null;

        this.initElements();
        this.initTabs();
    }

    initElements() {
        this.avaiable = document.querySelector("#avaiable");
        this.selector = document.querySelector("#selector");
        this.parameter = document.querySelector("#parameter");
        this.contextmenu = document.querySelector("#contextmenu");
    }

    initTabs() {
        this.entityList = [
            { name: "LyricDisplayCube", label: "歌詞表示キューブ", type: "Lyric" }
        ];

        this.entityList.forEach(entity => {
            const listElement = document.createElement("li");
            listElement.textContent = entity.label;
            listElement.setAttribute("data-value", entity.name);
            listElement.addEventListener("click", event => this.addEntity(event.target.getAttribute("data-value")));
            document.querySelector(`${this.getPanelId(entity.type)} > ul`).appendChild(listElement);
        });

        this.setTabEvent();
    }

    getPanelId(entityType) {
        switch (entityType) {
            case "Object":
                return "#panel-1";
            case "Lyric":
                return "#panel-2";
            case "Beat":
                return "#panel-3";
        }
    }

    setTabEvent() {
        const tabs = document.querySelectorAll('#avaiable [role="tab"]');
        const tabPanels = document.querySelectorAll('#avaiable [role="tabpanel"]');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.setAttribute('aria-selected', 'false');
                    t.setAttribute('tabindex', '-1');
                });

                tabPanels.forEach(panel => {
                    panel.classList.add('display-none');
                });

                tab.setAttribute('aria-selected', 'true');
                tab.setAttribute('tabindex', '0');
                const tabPanel = document.getElementById(tab.getAttribute('aria-controls'));
                tabPanel.classList.remove('display-none');
            });
        });
    }

    execute(delta, time) {
        this.queries.ui.added.forEach(entity => {
            // const node = {
            //     id: entity.getComponent(Object3D).object3D.uuid,
            //     name: entity.name,
            //     ref: entity,
            //     hasGroup: entity.hasComponent(Group),
            //     hasScene: entity.hasComponent(Scene)
            // }
            const object3DComponent = entity.getComponent(Object3D);
            const hasScene = entity.hasComponent(Scene);
            const hasGroup = entity.hasComponent(Group);
            const parentNode = object3DComponent.parent
                ? document.querySelector(`#li-${object3DComponent.parent.uuid} > ul`)
                : null;

            this.addTree(
                {
                    id: object3DComponent.object3D.uuid,
                    name: entity.name,
                    ref: entity,
                    hasGroup: hasGroup,
                    hasScene: hasScene                
                },
                (hasScene || parentNode === null)
                    ? this.selector
                    : parentNode
            );
        });
    }

    // 階層構造を表示する
    addTree(node, parentElement) {
        const li = document.createElement("li");
        li.id = `li-${node.id}`;
        li.textContent = node.name;
        li.draggable = true;
        li.addEventListener("dragstart", event => {
            li.classList.add("dragging");
            event.dataTransfer.setData("text/plain", li.id);
            event.stopPropagation();
        })
        li.addEventListener("dragend", event => {
            li.classList.remove("dragging");
            event.stopPropagation();
        })
        li.addEventListener("click", event => {
            event.stopPropagation();
            this.setUI(node.ref);
            this.selector.querySelectorAll("li").forEach(li => {
                li.classList.remove("selected");
            })
            event.target.classList.add("selected");
        })
        parentElement.appendChild(li);
        
        if (!node.hasScene) {
            const icon = document.createElement("i");
            icon.className = "fa-sharp fa-solid fa-trash trash-icon";
            li.appendChild(icon);

            li.addEventListener("contextmenu", event => {
                event.stopPropagation();
                event.preventDefault();
                this.contextmenu.classList.remove("display-none");
                this.contextmenu.style.top = `${event.clientY}px`;
                this.contextmenu.style.left = `${event.clientX}px`;
            })

        }

        if (node.hasGroup || node.hasScene) {
            const icon = document.createElement('i');
            icon.className = "fa-solid fa-caret-right";
            icon.style.cursor = "pointer";
            li.prepend(icon);

            const ul = document.createElement("ul");
            ul.classList = "hidden";
            ul.style.paddingLeft = "20px";

            // トグルが見た目から分かるようにする
            icon.addEventListener('click', event => {
                const bool = ul.classList.toggle('hidden');
                if (bool) {
                    icon.className = "fa-sharp fa-solid fa-caret-right";
                } else {
                    icon.className = "fa-sharp fa-solid fa-caret-down";
                }
                // イベントの伝播を防ぐ
                event.stopPropagation();
            });
            // ドロップされたときの処理
            li.addEventListener("drop", event => {
                event.preventDefault();
                event.stopPropagation();
                const draggedId = event.dataTransfer.getData("text/plain");
                const draggedElement = document.querySelector(`#${draggedId}`);

                // ドラッグ要素がCameraの場合はドロップしない
                ul.appendChild(draggedElement);
                li.classList.remove("over");

                // 親要素のオブジェクトを取得し、parentに設定する
                let objectEntity = null;
                let parentObject = null;
                const object_id = draggedId.slice(3);
                const parent_id = li.id.slice(3);

                this.queries.ui.results.forEach(entity => {
                    if (entity.hasComponent(Object3D)) {
                        const objectComponent = entity.getComponent(Object3D);
                        if (objectComponent.object3D.uuid === parent_id) {
                            parentObject = objectComponent.object3D;
                        } else if (objectComponent.object3D.uuid === object_id) {
                            objectEntity = entity;
                        }
                    }
                })
                if (objectEntity && parentObject) {
                    objectEntity.getMutableComponent(Object3D).parent = parentObject;
                }
            })
            // ドロップ対象に重なっているときの処理
            li.addEventListener("dragover", event => {
                event.preventDefault();
                event.stopPropagation();
                li.classList.add("over");
            })
            // ドロップ処理対象から外れたときの処理
            li.addEventListener("dragleave", event => {
                event.preventDefault();
                li.classList.remove("over");
            })

            li.appendChild(ul);
        }
    }

    addEntity(entityName) {
        switch (entityName) {
            case "LyricDisplayCube":
                const entity = this.world.createEntity()
                    .addComponent(Object3D, { object3D: new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial()), parent: null })
                    .addComponent(Mesh)
                    .addComponent(Position, { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5, z: Math.random() * 3 - 1.5 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 2, y: 2, z: 2 })
                    .addComponent(LyricDisplayCube)
                    .addComponent(UI)
                entity.name = `${entityName}${entity.id}`;
                break;
        }
    }

    removeEntity(entity) {

    }

    setUI(entity) {
        if (this.gui) {
            this.gui.destroy();
            this.gui = null;
        }
        this.gui = new GUI({ container: document.querySelector("#parameter"), title: entity.name });
        this.gui.onFinishChange(event => {
            this.saveJSON();
        })

        this.undoButton = this.gui.add({
            undo: () => {
                if (!this.undoStack.length) return;
                const undoFunc = this.undoStack.pop();
                undoFunc();
            }
        }, "undo").disable().name("");
        const undoButton = this.undoButton.domElement;
        const undoIconElement = document.createElement('i');
        undoIconElement.classList.add('fa-sharp', 'fa-solid', 'fa-rotate-left');
        undoButton.querySelector("button").appendChild(undoIconElement);
        undoButton.id = "undo";

        this.redoButton = this.gui.add({
            redo: () => {
                if (!this.redoStack.length) return;
                const redoFunc = this.redoStack.pop();
                redoFunc();
            }
        }, "redo").disable().name("");
        const redoButton = this.redoButton.domElement;
        const redoIconElement = document.createElement('i');
        redoIconElement.classList.add('fa-sharp', 'fa-solid', 'fa-rotate-right');
        redoButton.querySelector("button").appendChild(redoIconElement);
        redoButton.id = "redo";

        if (entity.hasComponent(Position)) {
            this.setPositionUI(entity);
        }

        if (entity.hasComponent(Rotation)) {
            this.setRotationUI(entity);
        }

        if (entity.hasComponent(Scale)) {
            this.setScaleUI(entity);
        }
    }

    setPositionUI(entity) {
        const { x, y, z } = entity.getComponent(Position);
        const positionFolder = this.gui.addFolder("Position");
        const position = { x, y, z };

        Object.keys(position).forEach(key => {
            positionFolder.add(position, key, -100, 100, 0.1)
                .listen()
                .onChange((value) => {
                    this.updateComponentProperty(entity, Position, key, value, position);
                    const component = entity.getMutableComponent(Position);
                    component[key] = value;
                });
        });
    }

    setRotationUI(entity) {
        const { x, y, z } = entity.getComponent(Rotation);
        const rotationFolder = this.gui.addFolder("Rotation");
        const rotation = { x, y, z };

        Object.keys(rotation).forEach(key => {
            rotationFolder.add(rotation, key, -Math.PI, Math.PI, 0.1)
                .listen()
                .onChange((value) => {
                    this.updateComponentProperty(entity, Rotation, key, value, rotation);
                    const component = entity.getMutableComponent(Rotation);
                    component[key] = value;
                });
        });
    }

    setScaleUI(entity) {
        const { x, y, z } = entity.getComponent(Scale);
        const scaleFolder = this.gui.addFolder("Scale");
        const scale = { x, y, z };
        
        Object.keys(scale).forEach(key => {
            scaleFolder.add(scale, key, 0.1, 10, 0.1)
                .listen()
                .onChange((value) => {
                    this.updateComponentProperty(entity, Scale, key, value, scale);
                    const component = entity.getMutableComponent(Scale);
                    component[key] = value;
                });
        });
    }

    updateUndoRedoState() {
        // スタックのサイズを制限
        this.undoStack.length > this.MAX_STACK_SIZE ? this.undoStack.shift() : null;
        this.redoStack.length > this.MAX_STACK_SIZE ? this.redoStack.shift() : null;

        //console.log("UndoStack :", this.undoStack); // 現在のundoスタック状態
        //console.log("RedoStack :", this.redoStack); // 現在のredoスタック状態

        // 有効 / 無効の切り替え
        this.redoStack.length ? this.redoButton.enable() : this.redoButton.disable();
        this.undoStack.length ? this.undoButton.enable() : this.undoButton.disable();
    }
    updateComponentProperty(entity, component, key, newValue, transform) {
        const componentData = entity.getMutableComponent(component);
        const currentValue = componentData[key];

        const redoFunc = () => {
            const entityComponent = entity.getMutableComponent(component);
            entityComponent[key] = newValue;
            transform[key] = newValue;

            //console.log("redo newvalue", entityComponent[key]);
            this.undoStack.push(undoFunc);
            this.updateUndoRedoState();
        }

        const undoFunc = () => {
            const entityComponent = entity.getMutableComponent(component);
            entityComponent[key] = currentValue;
            transform[key] = currentValue;

            //console.log("undo value", entityComponent[key]);
            this.redoStack.push(redoFunc);
            this.updateUndoRedoState();
        }

        this.redoStack = [];

        //変更を適用
        redoFunc();
    }

    saveJSON() {
        // JSONファイルに出力されるデータ
        const exports_data = {
            entities: [],
            file_name: project_data['json_path']
        }

        // エンティティの数だけ、exports_data.entitiesにデータをプッシュする
        this.queries.export.results.forEach(entity => {
            const components = entity.getComponentTypes().reduce((acc, component_type) => {
                const component = entity.getComponent(component_type);
                const component_data = {};
                for (const key in component_type.schema) {
                    switch (key) {
                        case "object3D":
                            component_data[key] = component.object3D.toJSON();
                            break;
                        case "parent":
                            component.parent
                                ? component_data[key] = component.parent.toJSON()
                                : component_data[key] = null;
                            break;
                        case "renderer":
                            component_data[key] = null;
                            break;
                        default:
                            component_data[key] = component[key];
                    }
                }

                acc[component_type.name] = component_data;
                return acc;
            }, {})

            const entity_data = {
                id: entity.id,
                name: entity.name,
                components: components
            };

            exports_data.entities.push(entity_data);
        })

        const json = JSON.stringify(exports_data, null, 2);

        fetch('/api/save_json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        }).catch(error => {
            console.error('Error:', error);
            alert('保存中にエラーが発生しました');
        });
    }
}

EditorSystem.queries = {
    ui: {
        components: [UI, Object3D],
        listen: {
            added: true,
        }
    },
    export: {
        components: [Export]
    }
}
