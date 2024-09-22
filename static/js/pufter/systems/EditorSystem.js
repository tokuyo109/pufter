import * as THREE from "three";
import { System } from "ecsy";
import { RenderingSystem } from "./RenderingSystem.js";
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
    EaseOutBack,
    Typing,
    Slide,
    Lyric,
    Wave,
    RotationChar,
    Spiral,
    Radiate,
    BeatColorChange,
    BeatScaleSize
} from "../components/components.js";
import GUI from "lil-gui";

// 編集ページを管理するシステム
export class EditorSystem extends System {
    init() {
        this.MAX_STACK_SIZE = 20;
        this.undoStack = [];
        this.redoStack = [];
        this.undoButton = null;
        this.redoButton = null;
        this.gui = null;
        this.tree = new Tree("#selector", this);
        this.scene = null;
        this.updatingFlg = false;

        this.initElements();
        this.initAddEvent();
        this.initTabs();

        this.waitForRenderingSystem();
    }

    // 要素の初期化
    initElements() {
        this.titleInput = document.querySelector("#title_input");
        this.avaiable = document.querySelector("#avaiable");
        this.selector = document.querySelector("#selector");
        this.parameter = document.querySelector("#parameter");
        this.contextmenu = document.querySelector("#contextmenu");
    }

    initAddEvent() {
        this.titleInput.addEventListener("blur", (event) => {
            fetch(`/api/${project_data.project_id}/${event.target.value}`, {
                method: 'GET',
            }).catch(error => {
                console.error('Error:', error);
            });
        })
    }

    // タブの初期化
    initTabs() {
        this.addTabEvent();
        this.entityList = [
            { name: "Group", label: "グループ", type: "Object" },
            { name: "Mesh", label: "メッシュ", type: "Object" },
            { name: "AmbientLight", label: "アンビエント", type: "Object" },
            { name: "DirectionalLight", label: "ディレクショナル", type: "Object" },

            { name: "LyricDisplayCube", label: "歌詞表示キューブ", type: "Lyric" },
            { name: "EaseOutBack", label: "表示時文字の大きさが弾むように変わる", type: "Lyric" },
            { name: "Slide", label: "スライド", type: "Lyric" },
            { name: "Typing", label: "タイピング", type: "Lyric" },
            { name: "Wave", label: "波打ち", type: "Lyric" },
            { name: "RotationChar", label: "文字が一回転", type: "Lyric" },
            { name: "Spiral", label: "螺旋", type: "Lyric" },

            { name: "Radiate", label: "放射", type: "Beat" },
            { name: "ColorChange", label: "色がランダムで変わる", type: "Beat" },
            { name: "ScaleChange", label: "ビート時大きくなる", type: "Beat" }
        ];
        this.entityList.forEach(entity => this.createPanelItem(entity));
    }

    //RenderingSystemの初期化を待つ
    waitForRenderingSystem() {
        const checkInterval = setInterval(() => {
            this.renderingSystem = this.world.getSystem(RenderingSystem);
            if (this.renderingSystem) {
                clearInterval(checkInterval);
                console.log("RenderingSystem load");
            } else {
                console.warn("Waiting for RenderingSystem");
            }
        }, 100); // 100ミリ秒ごとにチェック
    }

    // タブパネルにアイテムを追加
    createPanelItem(entity) {
        const panelItem = document.createElement("li");
        panelItem.textContent = entity.label;
        panelItem.setAttribute("data-value", entity.name);
        panelItem.addEventListener("click", event => this.createEntity(event.target.getAttribute("data-value")));
        document.querySelector(`${this.getPanelId(entity.type)} > ul`).appendChild(panelItem);
    }

    // タブパネルのIDを取得
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

    // タブを切り替えられるようにする
    addTabEvent() {
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

    createEntity(entityName) {
        let entity = this.world.createEntity();
        entity.name = `${entityName}${entity.id}`;
        switch (entityName) {
            case "Mesh":
                entity
                    .addComponent(Object3D, { object3D: new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x727272 })), parent: this.scene })
                    .addComponent(Mesh)
                    .addComponent(Position, { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5, z: Math.random() * 3 - 1.5 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 2, y: 2, z: 2 })
                    .addComponent(UI)
                    .addComponent(Export)
                break;
            case "Group":
                entity
                    .addComponent(Object3D, { object3D: new THREE.Group(), parent: this.scene })
                    .addComponent(Group)
                    .addComponent(Position, { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5, z: Math.random() * 3 - 1.5 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 2, y: 2, z: 2 })
                    .addComponent(UI)
                    .addComponent(Export)
                break;
            case "AmbientLight":
                entity
                    .addComponent(Object3D, { object3D: new THREE.AmbientLight(0xffffff), parent: this.scene })
                    .addComponent(UI)
                    .addComponent(Export)
                break;
            case "LyricDisplayCube":
                entity
                    .addComponent(Object3D, { object3D: new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial()), parent: this.scene })
                    .addComponent(Mesh)
                    .addComponent(Position, { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5, z: Math.random() * 3 - 1.5 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 2, y: 2, z: 2 })
                    .addComponent(LyricDisplayCube)
                    .addComponent(Lyric)
                    .addComponent(UI)
                    .addComponent(Export)
                break;
            case "EaseOutBack":
                entity
                    .addComponent(Object3D, { object3D: new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), new THREE.MeshBasicMaterial()), parent: this.scene })
                    .addComponent(Mesh)
                    .addComponent(Position, { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5, z: Math.random() * 3 - 1.5 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 2, y: 2, z: 2 })
                    .addComponent(EaseOutBack)
                    .addComponent(UI)
                    .addComponent(Export)
                    .addComponent(RandomWalk)
                break;
            case "Typing":
                entity
                    .addComponent(Object3D, { object3D: new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), new THREE.MeshBasicMaterial()), parent: this.scene })
                    .addComponent(Mesh)
                    .addComponent(Position, { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5, z: Math.random() * 3 - 1.5 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 2, y: 2, z: 2 })
                    .addComponent(Typing)
                    .addComponent(UI)
                    .addComponent(Export)
                break;
            case "Wave":
                entity
                    .addComponent(Object3D, { object3D: new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), new THREE.MeshBasicMaterial()), parent: this.scene })
                    .addComponent(Mesh)
                    .addComponent(Position, { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5, z: Math.random() * 3 - 1.5 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 2, y: 2, z: 2 })
                    .addComponent(Wave)
                    .addComponent(UI)
                    .addComponent(Export)
                break;
            case "RotationChar":
                entity
                    .addComponent(Object3D, { object3D: new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), new THREE.MeshBasicMaterial()), parent: this.scene })
                    .addComponent(Mesh)
                    .addComponent(Position, { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5, z: Math.random() * 3 - 1.5 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 2, y: 2, z: 2 })
                    .addComponent(RotationChar)
                    .addComponent(UI)
                    .addComponent(Export)
                break;
            case "Slide":
                entity
                    .addComponent(Object3D, { object3D: new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), new THREE.MeshBasicMaterial()), parent: this.scene })
                    .addComponent(Mesh)
                    .addComponent(Position, { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5, z: Math.random() * 3 - 1.5 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 2, y: 2, z: 2 })
                    .addComponent(Slide)
                    .addComponent(Lyric)
                    .addComponent(UI)
                    .addComponent(Export)
                break;
            case "Spiral":
                entity
                    .addComponent(Object3D, { object3D: new THREE.Group(), parent: this.scene })
                    .addComponent(Group)
                    .addComponent(Spiral)
                    .addComponent(Position, { x: 0, y: 0, z: 0 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 1, y: 1, z: 1 })
                    .addComponent(UI)
                    .addComponent(Export)
                break;
            case "Radiate":
                entity
                    .addComponent(Object3D, { object3D: new THREE.Group(), parent: this.scene })
                    .addComponent(Group)
                    .addComponent(Radiate)
                    .addComponent(Position, { x: 0, y: 0, z: 0 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 1, y: 1, z: 1 })
                    .addComponent(UI)
                    .addComponent(Export)
                break;
            case "ColorChange":
                entity
                    .addComponent(Object3D, { object3D: new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ wireframe: true, color: 0x000000 })), parent: this.scene })
                    .addComponent(Position, { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5, z: Math.random() * 3 - 1.5 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 1, y: 1, z: 1 })
                    .addComponent(BeatColorChange)
                    .addComponent(UI)
                    .addComponent(Export);
                break;
            case "ScaleChange":
                entity
                    .addComponent(Object3D, { object3D: new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ wireframe: true, color: 0x0000FF })), parent: this.scene })
                    .addComponent(Position, { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5, z: Math.random() * 3 - 1.5 })
                    .addComponent(Rotation, { x: 0, y: 0, z: 0 })
                    .addComponent(Scale, { x: 1, y: 1, z: 1 })
                    .addComponent(BeatScaleSize)
                    .addComponent(UI)
                    .addComponent(Export);
                break;
        }
    }

    execute(delta, time) {
        // シーンエンティティ追加時、メンバ変数に設定
        this.queries.scene.added.forEach(entity => {
            this.scene = entity.getComponent(Object3D).object3D;
        })

        // UIエンティティ追加時ツリーに追加
        this.queries.ui.added.forEach(entity => {
            const { object3D, parent } = entity.getComponent(Object3D);
            const node = {
                id: object3D.uuid,
                name: entity.name,
                ref: entity,
                hasGroup: entity.hasComponent(Group),
                hasScene: entity.hasComponent(Scene)
            }
            const parentNode = parent ? document.querySelector(`#li-${parent.uuid} > ul`) : null;
            this.tree.add(node, (node.hasScene || parentNode === null) ? this.selector : parentNode);
        });

        // UIエンティティ削除時ツリーから削除
        this.queries.ui.removed.forEach(entity => {
            const object3DComponent = entity.getRemovedComponent(Object3D);
            if (object3DComponent) {
                this.tree.remove(object3DComponent.object3D.uuid);
            }
        });
    }

    viewParametor(entity) {
        this.initParameterGUI();

        if (entity.hasComponent(Position)) this.setPositionUI(entity);
        if (entity.hasComponent(Rotation)) this.setRotationUI(entity);
        if (entity.hasComponent(Scale)) this.setScaleUI(entity);
        if (entity.hasComponent(Scene)) this.setSceneUI(entity);
        if (entity.hasComponent(LyricDisplayCube)) this.setFontUI(entity), this.setColorUI(entity);
        if (entity.hasComponent(EaseOutBack)) this.setFontUI(entity), this.setColorUI(entity);
        if (entity.hasComponent(Typing)) this.setFontUI(entity), this.setColorUI(entity);
        if (entity.hasComponent(RotationChar)) this.setFontUI(entity), this.setColorUI(entity);
        if (entity.hasComponent(Wave)) this.setFontUI(entity), this.setColorUI(entity);
        // if (entity.hasComponent(Lyric)) this.setFontUI(entity), this.setColorUI(entity);
        if (entity.hasComponent(BeatColorChange)) this.setColorChangeUI(entity);
        // if (entity.hasComponent(BeatScaleSize)) this.setColorChangeUI(entity);
        if (entity.hasComponent(BeatScaleSize)) this.setColorUI(entity);
    }

    resetParameterGUI() {
        if (this.gui) {
            this.gui.destroy();
            this.gui = null;
        }
    }

    initParameterGUI() {
        this.resetParameterGUI();

        this.gui = new GUI({ container: document.querySelector("#parameter") });
        this.gui.onFinishChange(() => {
            this.saveJSON();
            this.saveThumb();
        });

        this.undoButton = this.createButton(this.gui, "undo", "fa-rotate-left", () => {
            if (this.undoStack.length) {
                const undoFunc = this.undoStack.pop();
                undoFunc();
            }
        });

        this.redoButton = this.createButton(this.gui, "redo", "fa-rotate-right", () => {
            if (this.redoStack.length) {
                const redoFunc = this.redoStack.pop();
                redoFunc();
            }
        });

        this.updateUndoRedoState();
    }

    createButton(gui, name, iconClass, onClick) {
        const button = gui.add({ [name]: onClick }, name).disable().name("");
        const buttonElement = button.domElement.querySelector("button");
        const iconElement = document.createElement('i');
        iconElement.classList.add('fa-sharp', 'fa-solid', iconClass);
        buttonElement.appendChild(iconElement);
        buttonElement.id = name;
        return button;
    }

    setPositionUI(entity) {
        const { x, y, z } = entity.getComponent(Position);
        const positionFolder = this.gui.addFolder("Position");
        const position = { x, y, z };

        Object.keys(position).forEach(key => {
            const positionController = positionFolder.add(position, key, -100, 100, 0.1)
                .listen()
                .onChange((value) => {
                    if (this.updatingFlg) return;
                    this.updateComponentProperty(entity, Position, key, value, positionController);
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
            const rotationController = rotationFolder.add(rotation, key, -Math.PI, Math.PI, 0.1)
                .listen()
                .onChange((value) => {
                    if (this.updatingFlg) return;
                    this.updateComponentProperty(entity, Rotation, key, value, rotationController);
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
            const scaleController = scaleFolder.add(scale, key, 0.1, 10, 0.1)
                .listen()
                .onChange((value) => {
                    if (this.updatingFlg) return;
                    this.updateComponentProperty(entity, Scale, key, value, scaleController);
                    const component = entity.getMutableComponent(Scale);
                    component[key] = value;
                });
        });
    }

    setSceneUI(entity) {
        const rendererComponent = this.queries.renderer.results[0].getMutableComponent(Renderer);
        const renderer = rendererComponent.renderer;
        const clearColor = rendererComponent.clearColor;

        const colorController = this.gui
            .addColor({ clearColor: clearColor }, "clearColor")
            .onChange((value) => {
                if (this.updatingFlg) return;
                this.updateRendererProperty(rendererComponent, renderer, 'clearColor', value, colorController);
                renderer.setClearColor(value);
            })
    }

    // スケールを編集するUIを生成する
    // setScaleUI(entity) {
    //     const { x, y, z } = entity.getComponent(Scale);
    //     const scaleFolder = this.gui.addFolder("scale");
    //     scaleFolder
    //         .add({ X: x }, "X", -5, 5)
    //         .onChange(newValue => entity.getMutableComponent(Scale).x = newValue);
    //     scaleFolder
    //         .add({ Y: y }, "Y", -5, 5)
    //         .onChange((newValue) => entity.getMutableComponent(Scale).y = newValue);
    //     scaleFolder
    //         .add({ Z: z }, "Z", -5, 5)
    //         .onChange((newValue) => entity.getMutableComponent(Scale).z = newValue);
    // }

    // フォントを編集するUIを生成する
    setFontUI(entity) {
        if (entity.hasComponent(LyricDisplayCube)) {
            const fontOptions = { font: 'Arial' }; // 初期値をArialに設定
            const fontFolder = this.gui.addFolder("Font");
            fontFolder
                .add(fontOptions, 'font', ['Arial', 'Serif'])
                .onChange(newValue => {
                    entity.getMutableComponent(LyricDisplayCube).font = newValue;
                });
            // if (entity.hasComponent(Lyric)) {
            //     const fontOptions = { font: 'Arial' }; // 初期値をArialに設定
            //     const fontFolder = this.gui.addFolder("Font");
            //     fontFolder.add(fontOptions, 'font', ['Arial', 'Serif'])
            //         .onChange(newValue => {
            //             entity.getMutableComponent(Lyric).font = newValue;
            //         });
        } else if (entity.hasComponent(EaseOutBack)) {
            const fontOptions = { font: 'Arial' };
            const fontFolder = this.gui.addFolder("Font");
            fontFolder.add(fontOptions, 'font', ['Arial', 'Serif'])
                .onChange(newValue => {
                    entity.getMutableComponent(EaseOutBack).font = newValue;
                });
        } else if (entity.hasComponent(Typing)) {
            const fontOptions = { font: 'Arial' };
            const fontFolder = this.gui.addFolder("Font");
            fontFolder.add(fontOptions, 'font', ['Arial', 'Serif'])
                .onChange(newValue => {
                    entity.getMutableComponent(Typing).font = newValue;
                });
        } else if (entity.hasComponent(RotationChar)) {
            const fontOptions = { font: 'Arial' };
            const fontFolder = this.gui.addFolder("Font");
            fontFolder.add(fontOptions, 'font', ['Arial', 'Serif'])
                .onChange(newValue => {
                    entity.getMutableComponent(RotationChar).font = newValue;
                });
        } else if (entity.hasComponent(RotationChar)) {
            const fontOptions = { font: 'Arial' };
            const fontFolder = this.gui.addFolder("Font");
            fontFolder.add(fontOptions, 'font', ['Arial', 'Serif'])
                .onChange(newValue => {
                    entity.getMutableComponent(RotationChar).font = newValue;
                });
        } else if (entity.hasComponent(Slide)) {
            const fontOptions = { font: 'Arial' };
            const fontFolder = this.gui.addFolder("Font");
            fontFolder.add(fontOptions, 'font', ['Arial', 'Serif'])
                .onChange(newValue => {
                    entity.getMutableComponent(Slide).font = newValue;
                });
        }
    }

    // 文字色を編集するUIを生成する
    setColorUI(entity) {
        if (entity.hasComponent(LyricDisplayCube)) {
            const colorOptions = { color: entity.getComponent(LyricDisplayCube).color || '#000000' };
            const colorFolder = this.gui.addFolder("color");
            colorFolder.addColor(colorOptions, 'color')
                .onChange(newValue => {
                    entity.getMutableComponent(LyricDisplayCube).color = newValue;
                });
            // if (entity.hasComponent(Lyric)) {
            //     const colorOptions = { color: entity.getComponent(Lyric).color || '#000000' };
            //     const colorFolder = this.gui.addFolder("color");
            //     colorFolder.addColor(colorOptions, 'color')
            //         .onChange(newValue => {
            //             entity.getMutableComponent(Lyric).color = newValue;
            //         });

        } else if (entity.hasComponent(EaseOutBack)) {
            const colorOptions = { color: entity.getComponent(EaseOutBack).color || '#000000' };
            const colorFolder = this.gui.addFolder("color");
            colorFolder.addColor(colorOptions, 'color')
                .onChange(newValue => {
                    entity.getMutableComponent(EaseOutBack).color = newValue;
                });
        } else if (entity.hasComponent(Typing)) {
            const colorOptions = { color: entity.getComponent(Typing).color || '#000000' };
            const colorFolder = this.gui.addFolder("color");
            colorFolder.addColor(colorOptions, 'color')
                .onChange(newValue => {
                    entity.getMutableComponent(Typing).color = newValue;
                });
        } else if (entity.hasComponent(RotationChar)) {
            const colorOptions = { color: entity.getComponent(RotationChar).color || '#000000' };
            const colorFolder = this.gui.addFolder("color");
            colorFolder.addColor(colorOptions, 'color')
                .onChange(newValue => {
                    entity.getMutableComponent(RotationChar).color = newValue;
                });
        } else if (entity.hasComponent(Wave)) {
            const colorOptions = { color: entity.getComponent(Wave).color || '#000000' };
            const colorFolder = this.gui.addFolder("color");
            colorFolder.addColor(colorOptions, 'color')
                .onChange(newValue => {
                    entity.getMutableComponent(Wave).color = newValue;
                });
        } else if (entity.hasComponent(Slide)) {
            const colorOptions = { color: entity.getComponent(Slide).color || '#000000' };
            const colorFolder = this.gui.addFolder("color");
            colorFolder.addColor(colorOptions, 'color')
                .onChange(newValue => {
                    entity.getMutableComponent(Slide).color = newValue;
                });
        };
    }

    //オブジェクトのパラメータ更新　変更を記録
    updateComponentProperty(entity, componentClass, key, newValue, controller) {
        const component = entity.getMutableComponent(componentClass);
        const currentValue = component[key];
        const transform = { [key]: currentValue };

        const redoFunc = () => {
            this.updatingFlg = true;
            const component = entity.getMutableComponent(componentClass);
            component[key] = newValue;
            transform[key] = newValue;
            this.undoStack.push(undoFunc);
            this.updateUndoRedoState();
            if (controller) controller.setValue(newValue);
            this.updatingFlg = false;
        };

        const undoFunc = () => {
            this.updatingFlg = true;
            const component = entity.getMutableComponent(componentClass);
            component[key] = currentValue;
            transform[key] = currentValue;
            this.redoStack.push(redoFunc);
            this.updateUndoRedoState();
            if (controller) controller.setValue(currentValue);
            this.updatingFlg = false;
        };

        this.redoStack = [];
        redoFunc();
    }

    //clearColorの変更
    updateRendererProperty(rendererComponent, renderer, key, newValue, controller) {
        const currentValue = rendererComponent[key];
        const redoFunc = () => {
            this.updatingFlg = true;
            rendererComponent[key] = newValue;
            renderer.setClearColor(newValue);

            this.undoStack.push(undoFunc);
            this.updateUndoRedoState();
            if (controller) controller.setValue(newValue);
            this.updatingFlg = false;

        };

        const undoFunc = () => {
            this.updatingFlg = true;
            rendererComponent[key] = currentValue;
            renderer.setClearColor(currentValue);

            this.redoStack.push(redoFunc);
            this.updateUndoRedoState();
            if (controller) controller.setValue(currentValue);
            this.updatingFlg = false;
        };

        this.redoStack = [];
        redoFunc();
    }

    updateUndoRedoState() {
        if (this.undoStack.length) {
            this.undoButton.enable();
        } else {
            this.undoButton.disable();
        }

        if (this.redoStack.length) {
            this.redoButton.enable();
        } else {
            this.redoButton.disable();
        }
    }

    saveJSON() {
        const exportsData = {
            entities: [],
            file_name: project_data['json_path']
        };

        this.queries.export.results.forEach(entity => {
            const components = entity.getComponentTypes().reduce((acc, componentClass) => {
                const component = entity.getComponent(componentClass);
                acc[componentClass.name] = this.serializeComponent(component, componentClass.schema);
                return acc;
            }, {});

            exportsData.entities.push({ id: entity.id, name: entity.name, components });
        });

        const json = JSON.stringify(exportsData, null, 2);

        fetch('/api/save_json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: json
        }).catch(error => {
            console.error('Error:', error);
            alert('保存中にエラーが発生しました');
        });
    }

    serializeComponent(component, schema) {
        return Object.keys(schema).reduce((acc, key) => {
            switch (key) {
                case "object3D":
                    acc[key] = component.object3D.toJSON();
                    break;
                case "parent":
                    acc[key] = component.parent ? component.parent.toJSON() : null;
                    break;
                /* 
                    Object3D以外のType.Refはnullで初期化
                    オブジェクトをエクスポートすると処理が重くなるため
                */
                case "renderer":
                case "canvas":
                case "context":
                case "texture":
                    acc[key] = null;
                    break;
                default:
                    acc[key] = component[key];
                    break;
            }
            return acc;
        }, {});
    }

    saveThumb() {
        const renderer = this.renderingSystem.renderer;
        const camera = this.renderingSystem.camera;
        const scene = this.renderingSystem.scene;

        const size = new THREE.Vector2();
        renderer.getSize(size);

        renderer.render(scene, camera)

        const canvas = renderer.domElement;
        const thumbURL = canvas.toDataURL('image/png');
        let thumbName = project_data['thumb_path'];

        //projectsのサムネイルが'noImage' の場合　新たにjsonと同じファイル名で画像ファイルを作成
        if (thumbName === 'noImage') {
            const project_path_name = project_data['json_path'].replace(/\.json$/, '')
            thumbName = `${project_data['user_id']}_${project_path_name}.png`
        }

        fetch('/api/save_thumb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: thumbURL,
                thumb_name: thumbName,
                project_id: project_data['project_id']
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log("サーバからの応答:", data);
            })
            .catch(error => {
                console.log('サムネイル保存中にエラーが発生しました');
                console.log("error:", error);
            });
    }

}

EditorSystem.queries = {
    scene: {
        components: [Scene, Object3D],
        listen: { added: true }
    },
    renderer: {
        components: [Renderer]
    },
    ui: {
        components: [UI, Object3D],
        listen: { added: true, removed: true }
    },
    export: {
        components: [Export]
    }
};

class Node {
    constructor(node, parentElement, editorSystem) {
        this.node = node;
        this.parentElement = parentElement;
        this.editorSystem = editorSystem;
        this.children = [];
        this.childContainer = null;
        this.li = this.create();
        this.addEvent(this.li);
    }

    create() {
        const li = document.createElement("li");
        li.textContent = this.node.name;
        li.id = `li-${this.node.id}`;
        li.draggable = true;
        this.parentElement.appendChild(li);

        if (this.node.hasGroup || this.node.hasScene) {
            const ul = document.createElement("ul");
            ul.classList.add("hidden");
            li.appendChild(ul);
            this.childContainer = ul;
        }

        return li;
    }

    addChild(node) {
        const childNode = new Node(node, this.childContainer, this.editorSystem); // 子ノードもeditorSystemを渡す
        this.children.push(childNode);
        return childNode;
    }

    addEvent(li) {
        li.addEventListener("dragstart", event => this.onDragStart(event, li));
        li.addEventListener("dragend", event => this.onDragEnd(event, li));
        li.addEventListener("click", event => this.onClick(event, li));
        const menuIcon = this.createMenuIcon(li);
        menuIcon.addEventListener("click", event => this.onMenu(event, li));

        if (this.childContainer) {
            const toggleIcon = this.createToggleIcon(li);
            toggleIcon.addEventListener('click', event => this.onToggle(event, toggleIcon));

            li.addEventListener("drop", event => this.onDrop(event, this.childContainer));
            li.addEventListener("dragover", event => this.onDragOver(event, li));
            li.addEventListener("dragleave", event => this.onDragLeave(event, li));
        }
    }

    createToggleIcon(li) {
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-caret-right";
        icon.style.cursor = "pointer";
        icon.style.padding = "5px 7px"
        li.prepend(icon);
        return icon;
    }

    createMenuIcon(li) {
        const icon = document.createElement("i")
        icon.style.display = "inline-block";
        icon.className = "fa-solid fa-ellipsis-vertical";
        icon.style.cursor = "pointer";
        icon.style.float = "right";
        icon.style.padding = "5px 10px";
        const hasUl = li.querySelector("ul");
        hasUl ? li.insertBefore(icon, hasUl) : li.appendChild(icon);
        return icon;
    }

    onDragStart(event, li) {
        li.classList.add("dragging");
        event.dataTransfer.setData("text/plain", li.id);
        event.stopPropagation();
    }

    onDragEnd(event, li) {
        li.classList.remove("dragging");
        event.stopPropagation();
    }

    onClick(event, li) {
        event.stopPropagation();
        document.querySelector("#selector").querySelectorAll("li").forEach(li => li.classList.remove("selected"));
        li.classList.add("selected");
        this.editorSystem.viewParametor(this.node.ref);
    }

    onMenu(event, li) {
        // 他のUIが削除されることを防ぐ
        event.stopPropagation();
        event.preventDefault();

        const contextMenu = this.editorSystem.contextmenu;
        contextMenu.classList.remove("display-none");

        contextMenu.style.position = "fixed";
        contextMenu.style.zIndex = "999";

        // 画面の幅と高さを取得
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // メニューの幅と高さを取得
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;

        // デフォルトの位置をメニューの左側に設定
        let left = event.clientX - menuWidth;
        let top = event.clientY;

        // 画面の左端を超えないように調整
        if (left < 0) {
            left = 0;
        }

        // 画面の右端を超えないように調整
        if (left + menuWidth > windowWidth) {
            left = windowWidth - menuWidth;
        }

        // 画面の下端を超えないように調整
        if (top + menuHeight > windowHeight) {
            top = windowHeight - menuHeight;
        }

        // 画面の上端を超えないように調整
        if (top < 0) {
            top = 0;
        }

        // 計算された位置を適用
        contextMenu.style.left = `${left}px`;
        contextMenu.style.top = `${top}px`;

        const deleteButton = document.querySelector("#delete");
        deleteButton.removeEventListener("click", this.deleteNode);
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            this.node.ref.remove();
        });

        this.boundCloseMenu = this.closeMenu.bind(this);
        document.addEventListener("click", this.boundCloseMenu);
    }

    closeMenu(e) {
        if (!this.editorSystem.contextmenu.contains(e.target)) {
            this.editorSystem.contextmenu.classList.add("display-none");
            document.removeEventListener("click", this.boundCloseMenu);
        }
    }

    closeMenu(e) {
        this.editorSystem.contextmenu.classList.add("display-none");
        document.removeEventListener("click", this.boundCloseMenu);

        // if (!this.editorSystem.contextmenu.contains(e.target)) {
        //     this.editorSystem.contextmenu.classList.add("display-none");
        //     document.removeEventListener("click", this.boundCloseMenu);
        // }
    }

    onToggle(event, icon) {
        const isHidden = this.childContainer.classList.toggle("hidden");
        icon.className = isHidden ? "fa-sharp fa-solid fa-caret-right" : "fa-sharp fa-solid fa-caret-down";
        if (isHidden) {
            icon.style.padding = "5px 7px";
        } else {
            icon.style.padding = "5px 8px";
        }
        event.stopPropagation();
    }

    onDrop(event, childContainer) {
        event.preventDefault();
        event.stopPropagation();
        const draggedId = event.dataTransfer.getData("text/plain");
        const draggedElement = document.querySelector(`#${draggedId}`);
        childContainer.appendChild(draggedElement);
        this.li.classList.remove("over");
    }

    onDragOver(event, li) {
        event.preventDefault();
        event.stopPropagation();
        li.classList.add("over");
    }

    onDragLeave(event, li) {
        event.preventDefault();
        li.classList.remove("over");
    }
}

class Tree {
    constructor(selector, editorSystem) {
        this.selector = document.querySelector(selector);
        this.rightSide = document.querySelector(".side:last-child");
        this.editorSystem = editorSystem; // EditorSystemのインスタンスを保持
        this.tree = {};

        this.setEvent();
    }

    add(node, parentElement = this.selector) {
        const newNode = new Node(node, parentElement, this.editorSystem); // Nodeの作成時にeditorSystemを渡す
        this.tree[node.id] = newNode;
        return newNode;
    }

    remove(nodeId) {
        const node = this.tree[nodeId];
        if (node) {
            node.li.remove();
            delete this.tree[nodeId];
        }
    }

    setEvent() {
        // 右サイドバー以外をクリックした際にコントローラーが閉じる処理
        document.addEventListener("click", event => {
            // クリック位置に右サイドバーが含まれていないかチェック
            if (!this.rightSide.contains(event.target)) {
                document.querySelectorAll("#selector li").forEach(li => li.classList.remove("selected"));
                this.editorSystem.resetParameterGUI();
            }
        })
    }
}
