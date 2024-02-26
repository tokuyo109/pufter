export default class PositionAnimationComponent {
    constructor(xSpeed = 0, ySpeed = 0, zSpeed = 0) {
        this.xSpeed = xSpeed; // x軸周りの移動速度
        this.ySpeed = ySpeed; // y軸周りの移動速度
        this.zSpeed = zSpeed; // z軸周りの移動速度
    }
}
