// ./systems/RenderingSystem.js
// シーン、レンダラー、カメラの初期化。
// オブジェクトの追加、削除、カメラの切り替え。
// シーンのレンダリングを行うシステム。
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { System } from "ecsy";
import {
    Scene,
    Renderer,
    Camera,
    Object3D,
    Position,
    Rotation,
    Scale,
    CameraActive,
    UIControllable
} from "../components/components.js";

export default class RenderingSystem extends System {
    init(world) {
        // 初期化処理
        this.sceneEntity = null;
        this.rendererEntity = null;
        this.cameraEntity = null;
        this.composer = null;
        this.renderPass = null;

        // シーン、レンダラー、カメラのエンティティを作成
        this.sceneEntity = world.createEntity()
            .addComponent(Scene, { scene: new THREE.Scene(), fog: new THREE.Fog(0x000000, 1, 100) })
            .addComponent(UIControllable);
        this.sceneEntity.name = `Scene${this.sceneEntity.id}`;

        this.rendererEntity = world.createEntity()
            .addComponent(Renderer, { renderer: new THREE.WebGLRenderer(), clearColor: 0xffffff, pixelRatio: window.devicePixelRatio, size: { width: window.innerWidth, height: window.innerHeight } })
            .addComponent(UIControllable);
        this.rendererEntity.name = `Renderer${this.rendererEntity.id}`;

        this.cameraEntity = world.createEntity()
            .addComponent(Camera, { fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 100, lookAt: { x: 0, y: 0, z: 0 } })
            .addComponent(Object3D, { value: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) })
            .addComponent(Position, { x: 1, y: 2, z: 3 })
            .addComponent(Rotation, { x: 0, y: 0, z: 0 })
            .addComponent(Scale, { x: 1, y: 1, z: 1 })
            .addComponent(CameraActive)
            .addComponent(UIControllable);
        this.cameraEntity.name = `Camera${this.cameraEntity.id}`;

        // レスポンシブ処理
        window.addEventListener("resize", () => {
            this.rendererEntity.getComponent(Renderer).renderer.setSize(window.innerWidth, window.innerHeight);
            this.cameraEntity.getComponent(Object3D).value.aspect = window.innerWidth / window.innerHeight;
            this.cameraEntity.getComponent(Object3D).value.updateProjectionMatrix();
        })
    }

    execute(delta, time) {
        // シーン初期化処理
        this.queries.scene.added.forEach((entity) => {
            const sceneComponent = entity.getComponent(Scene);
            const scene = sceneComponent.scene;
            scene.background = sceneComponent.background;
            scene.fog = sceneComponent.fog;
        });

        // カメラ初期化処理
        this.queries.camera.added.forEach((entity) => {
            const cameraComponent = entity.getComponent(Camera);
            const camera = entity.getComponent(Object3D).value;
            const { x: posX, y: posY, z: posZ } = entity.getComponent(Position);
            camera.position.set(posX, posY, posZ);
            camera.fov = cameraComponent.fov;
            camera.aspect = cameraComponent.aspect;
            camera.near = cameraComponent.near;
            camera.far = cameraComponent.far;
            camera.lookAt(cameraComponent.lookAt.x, cameraComponent.lookAt.y, cameraComponent.lookAt.z);

            // const cameraButton = document.createElement("button");
            // cameraButton.innerText = "Camera";
            // document.body.appendChild(cameraButton);
            // cameraButton.addEventListener("click", (event) => {
            //     this.queries.camera.results.forEach((oldEntity) => {
            //         oldEntity.removeComponent(CameraActive);
            //     });
            //     entity.addComponent(CameraActive);
            // });
        });

        // レンダラー初期化処理
        this.queries.renderer.added.forEach((entity) => {
            const rendererComponent = entity.getComponent(Renderer);
            const renderer = rendererComponent.renderer;
            const WebGLElement = document.querySelector("#WebGL");
            renderer.setSize(rendererComponent.size.width, rendererComponent.size.height);
            renderer.setPixelRatio(rendererComponent.pixelRatio);
            renderer.setClearColor(rendererComponent.clearColor);
            if (WebGLElement) {
                WebGLElement.appendChild(renderer.domElement);
            } else {
                document.body.appendChild(renderer.domElement);
            }

            // カメラコントロール
            const controls = new OrbitControls(this.cameraEntity.getComponent(Object3D).value, renderer.domElement);

            // ポストエフェクト処理
            this.composer = new EffectComposer(renderer);
            this.renderPass = new RenderPass(this.sceneEntity.getComponent(Scene).scene, this.cameraEntity.getComponent(Object3D).value);
            this.composer.addPass(this.renderPass);
            // this.composer.addPass(new GlitchPass());
        });

        // カメラ変更検知処理
        this.queries.cameraActive.added.forEach((entity) => {
            this.cameraEntity = entity;
            const camera = entity.getComponent(Object3D).value;
            const { x: posX, y: posY, z: posZ } = entity.getComponent(Position);
            camera.position.set(posX, posY, posZ);
            const { x: lookX, y: lookY, z: lookZ } = entity.getComponent(Camera).lookAt;
            camera.lookAt(lookX, lookY, lookZ);

            // ポストエフェクト処理
            this.renderPass.camera = camera;
        });

        // オブジェクト追加処理
        this.queries.object3D.added.forEach((entity) => {
            const object3D = entity.getComponent(Object3D).value;
            this.sceneEntity.getComponent(Scene).scene.add(object3D);
        });

        // オブジェクト削除処理
        this.queries.object3D.removed.forEach((entity) => {
            const object3D = entity.getComponent(Object3D).value;
            this.sceneEntity.getComponent(Scene).scene.remove(object3D);
        });

        // レンダリング処理
        if (this.sceneEntity && this.rendererEntity && this.cameraEntity) {
            const scene = this.sceneEntity.getComponent(Scene).scene;
            const renderer = this.rendererEntity.getComponent(Renderer).renderer;
            const camera = this.cameraEntity.getComponent(Object3D).value;
            // renderer.render(scene, camera);
            this.composer.render();
        }
    }
}

RenderingSystem.queries = {
    scene: {
        components: [Scene],
        listen: {
            added: true
        }
    },
    renderer: {
        components: [Renderer],
        listen: {
            added: true
        }
    },
    camera: {
        components: [Camera],
        listen: {
            added: true
        }
    },
    cameraActive: {
        components: [CameraActive],
        listen: {
            added: true
        }
    },
    object3D: {
        components: [Object3D],
        listen: {
            added: true,
            removed: true
        }
    }
}
