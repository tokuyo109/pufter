// アニメーションを管理する
import { System } from "ecsy";
import {
    Object3D,
    Mesh,
    Group,
    Position,
    Rotation,
    Scale,
    Visualizer,
    RotationAnimation,
    CircleSpectrum,
} from "../components/components.js";
// import MusicManager from "../musicManager.js";

export default class AnimationSystem extends System {
    init(musicManager) {
        this.musicManager = musicManager;
    }

    execute(delta, time) {
        const frequencyData = this.musicManager.getFrequencyData();
        this.queries.entities.results.forEach(entity => {
            // コンポーネントの取得
            const scaleComponent = entity.getMutableComponent(Scale);

            // オブジェクトの取得
            // let object = null;
            // if (entity.hasComponent(Mesh)) {
            //     object = entity.getComponent(Mesh).value;
            // } else if (entity.hasComponent(Group)) {
            //     object = entity.getComponent(Group).value;
            // }
            let object = null;
            if (entity.hasComponent(Object3D)) {
                object = entity.getComponent(Object3D).value;
            }

            // 周波数の平均データを計算
            const averageFrequency = frequencyData.reduce((sum, val) => sum + val, 0) / frequencyData.length;
            const value = 1 + averageFrequency / 64;

            // スケールに反映
            const scaleX = scaleComponent.x + value;
            const scaleY = scaleComponent.y + value;
            const scaleZ = scaleComponent.z + value;
            object.scale.set(scaleX, scaleY, scaleZ);
        });

        // CircleSpectrumコンポーネントを持つエンティティ
        this.queries.circleSpectrum.results.forEach(entity => {
            const groupComponent = entity.getComponent(Object3D);
            groupComponent.value.children.forEach((mesh, i) => {
                const index = Math.floor((i / groupComponent.value.children.length) * frequencyData.length);
                const scaleY = (frequencyData[index] / 2048) * 20 + 0.1;
                mesh.scale.y = scaleY;
            })
        })

        // RotationAnimationコンポーネントを持つエンティティ
        this.queries.rotationAnimation.results.forEach(entity => {
            // コンポーネントの取得
            const rotationComponent = entity.getMutableComponent(Rotation);
            const { speedX, speedY, speedZ } = entity.getComponent(RotationAnimation);

            // // オブジェクトの取得
            // let object = null;
            // if (entity.hasComponent(Mesh)) {
            //     object = entity.getComponent(Mesh).value;
            // } else if (entity.hasComponent(Group)) {
            //     object = entity.getComponent(Group).value;
            // }
            let object = null;
            if (entity.hasComponent(Object3D)) {
                object = entity.getComponent(Object3D).value;
            }

            // ロテーションに反映
            // console.log(speedX);
            // console.log(speedY);
            // console.log(speedZ);
            rotationComponent.x += speedX * delta;
            rotationComponent.y += speedY * delta;
            rotationComponent.z += speedZ * delta;
        })
    }
}

AnimationSystem.queries = {
    entities: {
        components: [Mesh, Position, Rotation, Scale, Visualizer],
    },
    rotationAnimation: {
        components: [RotationAnimation, Rotation],
    },
    circleSpectrum: {
        components: [CircleSpectrum],
    },
}