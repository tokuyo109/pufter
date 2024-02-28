// ビジュアライズアニメーションを管理する
import { System } from "ecsy";
import { Mesh, Group, Position, Rotation, Scale, Visualizer } from "../components/index.js";
import MusicManager from "../musicManager.js";

export default class VisualizerSystem extends System {
    init() {
        this.musicManager = new MusicManager();
    }

    execute(delta, time) {
        const frequencyData = this.musicManager.getFrequencyData();
        this.queries.entities.results.forEach(entity => {
            // コンポーネントの取得
            const scaleComponent = entity.getMutableComponent(Scale);

            // オブジェクトの取得
            let object = null;
            if (entity.hasComponent(Mesh)) {
                object = entity.getComponent(Mesh).value;
            } else if (entity.hasComponent(Group)) {
                object = entity.getComponent(Group).value;
            }

            // 周波数の平均データを計算
            const averageFrequency = frequencyData.reduce((sum, val) => sum + val, 0) / frequencyData.length;
            const value = 1 + averageFrequency / 128; // 128は適当な正規化のための値

            // スケールに反映
            const scaleX = scaleComponent.x + value;
            const scaleY = scaleComponent.y + value;
            const scaleZ = scaleComponent.z + value;
            object.scale.set(scaleX, scaleY, scaleZ);
        });
    }
}

VisualizerSystem.queries = {
    entities: {
        components: [Mesh, Position, Rotation, Scale, Visualizer],
    }
}