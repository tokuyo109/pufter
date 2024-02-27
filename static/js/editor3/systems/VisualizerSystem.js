// ビジュアライズアニメーションを管理する
// 欠陥あり
import { System } from "ecsy";
import { Mesh, Position, Rotation, Scale, Visualizer } from "../components/index.js";
import MusicManager from "../musicManager.js";

export default class VisualizerSystem extends System {
    init() {
        this.musicManager = new MusicManager();
    }

    execute(delta, time) {
        // const frequencyData = this.musicManager.getFrequencyData();
        // this.queries.entities.results.forEach(entity => {
        //     const scale = entity.getMutableComponent(Scale);

        //     // 音楽データに応じたビジュアライズのロジック
        //     // 例: 周波数データの平均値を計算して、それに基づいてスケールを変更
        //     const averageFrequency = frequencyData.reduce((sum, val) => sum + val, 0) / frequencyData.length;
        //     const scaleValue = 1 + averageFrequency / 128; // 128は適当な正規化のための値

        //     // スケールを更新
        //     scale.x = scaleValue + scale.x;
        //     scale.y = scaleValue + scale.y;
        //     scale.z = scaleValue + scale.z;
        // });
    }
}

VisualizerSystem.queries = {
    entities: {
        components: [Mesh, Position, Rotation, Scale, Visualizer],
    }
}