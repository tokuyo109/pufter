export default class CircleAnimationComponent {
    constructor(centerX = 0, centerY = 0, centerZ = 0, radius = 1, speed = 1) {
        this.centerX = centerX; // 円運動の中心点X座標
        this.centerY = centerY; // 円運動の中心点Y座標
        this.centerZ = centerZ; // 円運動の中心点Z座標
        this.radius = radius;   // 円運動の半径
        this.speed = speed;     // 円運動の速度（角速度）
        this.angle = 0;         // 現在の角度（ラジアン単位）
    }
}
