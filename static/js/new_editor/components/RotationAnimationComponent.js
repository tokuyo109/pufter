export default class RotationAnimationComponent {
    constructor(xSpeed = 0, ySpeed = 0, zSpeed = 0) {
        this.xSpeed = xSpeed; // x軸周りの回転速度
        this.ySpeed = ySpeed; // y軸周りの回転速度
        this.zSpeed = zSpeed; // z軸周りの回転速度
    }
}
