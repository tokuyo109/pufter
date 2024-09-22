import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { System } from 'ecsy';
import {
    Scene,
    Renderer,
    Camera,
    Group,
    Mesh,
    Object3D,
    Position,
    Rotation,
    Scale,
    UI,
    Export
} from '../components/components.js';

/*
主に描画を担当するシステム
- エンティティが作成されたときの描画処理
- 画面幅に応じたレスポンシブ対応
- JSON_PATHが用意されなかった場合の初期化処理
を行う
*/
export class RenderingSystem extends System {
    setupScene() {
        const sceneEntity = this.world.createEntity("Scene");
        const scene = new THREE.Scene();
        this.scene = scene;
        sceneEntity
            .addComponent(Object3D, { object3D: scene, parent: null })
            .addComponent(Scene)
            .addComponent(UI)
            .addComponent(Export);
    }

    setupRenderer() {
        const rendererEntity = this.world.createEntity("Renderer");
        rendererEntity
            .addComponent(Renderer, {
                renderer: null,
                clearColor: 0xffffff,
                antialias: true
            })
            .addComponent(UI)
            .addComponent(Export);
    }

    setupCamera() {
        const cameraEntity = this.world.createEntity("Camera");
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        cameraEntity
            .addComponent(Object3D, { object3D: camera, parent: null })
            .addComponent(Position, { x: 0, y: 10, z: 5 })
            .addComponent(Rotation, { x: 0, y: 0, z: 0 })
            .addComponent(Scale, { x: 1, y: 1, z: 1 })
            .addComponent(UI)
            .addComponent(Camera)
            .addComponent(Export);
    }

    init() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this._setAddEventListeners();
    }

    _setAddEventListeners() {
        // 画面幅の変更に応じてサイズやアスペクト比を調整する
        window.addEventListener("resize", () => {
            if (this.renderer && this.camera) {
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
            }
        });
    }

    execute(delta, time) {
        // シーン初期化処理
        this.queries.scenes.added.forEach((entity) => {
            this.scene = entity.getComponent(Object3D).object3D;
        });

        // レンダラ初期化処理
        this.queries.renderers.added.forEach((entity) => {
            const rendererComponent = entity.getMutableComponent(Renderer);
            const antialias = rendererComponent.antialias;
            const clearColor = rendererComponent.clearColor;

            const canvas = document.querySelector("#c");
            this.renderer = new THREE.WebGLRenderer({ antialias: antialias, canvas: canvas });
            this.renderer.setClearColor(clearColor);
            this.renderer.setSize(window.innerWidth, window.innerHeight);

            rendererComponent.renderer = this.renderer;
        });

        // カメラ初期化処理
        this.queries.cameras.added.forEach((entity) => {
            this.camera = entity.getComponent(Object3D).object3D;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.camera.lookAt(0, 0, 0);
            if (this.renderer) {
                const controls = new OrbitControls(this.camera, this.renderer.domElement);
            }
        });

        // オブジェクトの追加処理
        this.queries.objects.added.forEach(entity => {
            const object3DComponent = entity.getComponent(Object3D);
            if (object3DComponent.parent) {
                object3DComponent.parent.add(object3DComponent.object3D);
            } else {
                if (!object3DComponent.object3D.isScene) {
                    this.scene.add(object3DComponent.object3D);
                }
            }
        });

        // オブジェクトの変更処理
        this.queries.objects.changed.forEach((entity) => {
            const object3DComponent = entity.getComponent(Object3D);
            if (object3DComponent.parent) {
                object3DComponent.parent.add(object3DComponent.object3D);
            } else {
                if (!object3DComponent.object3D.isScene) {
                    this.scene.add(object3DComponent.object3D);
                }
            }
        });

        // オブジェクトの削除処理
        this.queries.objects.removed.forEach(entity => {
            const { object3D, parent } = entity.getRemovedComponent(Object3D); 
            if ( object3D && parent ) {
                parent.remove(object3D);
            }
        });

        // 毎フレーム描画
        this.queries.renderers.results.forEach(entity => {
            if (this.scene && this.renderer && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        });
    }
}

RenderingSystem.queries = {
    scenes: {
        components: [Scene, Object3D],
        listen: {
            added: true
        }
    },
    renderers: {
        components: [Renderer],
        listen: {
            added: true
        }
    },
    cameras: {
        components: [Camera, Object3D],
        listen: {
            added: true
        }
    },
    objects: {
        components: [Object3D],
        listen: {
            added: true,
            changed: true,
            removed: true
        }
    }
};
