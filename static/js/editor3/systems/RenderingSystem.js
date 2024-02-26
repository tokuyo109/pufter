// 描画処理を行う。シーン、カメラ、レンダラーの設定
import { System } from "ecsy";

import Scene from "./../components/Scene.js"
import Camera from "./../components/Camera.js"
import Renderer from "./../components/Renderer.js"

export default class RenderingSystem extends System {
    // システムの初期化
    init() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    // システムの実行
    execute(delta, now) {
        this.queries.scenes.results.forEach(entity => {
            const sceneComponent = entity.getComponent(Scene);
            const cameraComponent = entity.getComponent(Camera);
            const rendererComponent = entity.getComponent(Renderer);

            // Scene、Camera、Rendererの初期化または更新
            if (!this.scene) this.scene = sceneComponent.scene;
            if (!this.camera) this.camera = cameraComponent.camera;
            if (!this.renderer) this.renderer = rendererComponent.renderer;

            // Rendererの設定更新
            this.renderer.setClearColor(rendererComponent.clearColor);
            this.renderer.setPixelRatio(rendererComponent.pixelRatio);
            this.renderer.setSize(rendererComponent.size.width, rendererComponent.size.height);

            // Sceneの背景と霧の設定更新
            if (sceneComponent.background) this.scene.background = sceneComponent.background;
            if (sceneComponent.fog) this.scene.fog = sceneComponent.fog;

            // Cameraの設定更新
            this.camera.aspect = cameraComponent.aspect;
            this.camera.fov = cameraComponent.fov;
            this.camera.near = cameraComponent.near;
            this.camera.far = cameraComponent.far;
            this.camera.updateProjectionMatrix();

            // レンダリングの実行
            if (this.scene && this.camera && this.renderer) {
                this.renderer.render(this.scene, this.camera);
            }
        })
    }
}

// エンティティの追加とコンポーネントの変化を検知
RenderingSystem.queries = {
    scenes: {
        components: [Scene, Camera, Renderer],
        listen: {
            added: true,
            changed: [Scene, Camera, Renderer]
        }
    }
}
