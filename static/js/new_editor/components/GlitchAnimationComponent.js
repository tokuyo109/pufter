export default class GlitchAnimationComponent {
    constructor(frequency = 0.05, duration = 0.1, intensity = 1) {
        this.frequency = frequency; // グリッチが発生する頻度
        this.duration = duration; // グリッチの持続時間
        this.intensity = intensity; // グリッチの強度
    }
}
