// シーン、カメラ、レンダラーを描画、更新するシステム
import { System } from "ecsy";

import { Scene, Camera, Renderer } from "../components/components.js";

export default class RenderingSystem extends System {
    // システムの初期化
    init() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        // レスポンシブ処理
        window.addEventListener("resize", this.onWindowResize.bind(this), false);
    }

    // 画面幅が変更されたときに実行
    onWindowResize() {
        this.queries.scenes.results.forEach(entity => {
            const cameraComponent = entity.getMutableComponent(Camera);
            const rendererComponent = entity.getMutableComponent(Renderer);

            // コンポーネントの値を更新する
            if (cameraComponent && rendererComponent) {
                cameraComponent.aspect = window.innerWidth / window.innerHeight;

                rendererComponent.size = {
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            }
        })
    }

    // システムの実行
    execute(delta, now) {
        // 初期化処理
        this.queries.scenes.added.forEach(entity => {
            this.render(entity);
        })

        // 変更時更新処理
        this.queries.scenes.changed.forEach(entity => {
            this.render(entity);
        })
    }

    render(entity) {
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
