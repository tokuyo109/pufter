// systems/AudioVisualSystem.js
export default class AudioVisualSystem {
    constructor(musicManager, entities) {
        this.musicManager = musicManager;
        this.entities = entities;
    }

    update(deltaTime) {
        // 周波数データを取得
        const frequencyData = this.musicManager.getFrequencyData();

        // 周波数データの平均値を計算
        const averageFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;

        this.entities.forEach(entity => {
            if (entity.components.transform && entity.components.audioReactiveScale) {
                this.applyAudioReactiveScale(entity, averageFrequency, deltaTime);
            }

            // if (entity.transform && entity.material) {
            //     // Transformの更新（例：スケールを音量に応じて変更）
            //     const scale = Math.max(averageFrequency / 128, 0.5); // 値を適宜調整
            //     entity.transform.scale.set(scale, scale, scale);

            //     // Materialの更新（例：色を音量に応じて変更）
            //     const intensity = averageFrequency / 255;
            //     entity.material.material.color.setHSL(0.5, intensity, 0.5); // 色相、彩度、明度を適宜調整
            //     // entity.material.material.color.opacity = intensity;
            //     // console.log(entity.material);
            // }
        });
    }

    applyAudioReactiveScale(entity, averageFrequency, deltaTime) {
        const scale = Math.max(averageFrequency / 128, 0.5); // 値を適宜調整
        entity.components.transform.scale.set(scale, scale, scale);
    }
}
