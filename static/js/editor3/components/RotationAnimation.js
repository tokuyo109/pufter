// 回転アニメーションを管理する
import { Component, Types } from 'ecsy';

export default class RotationAnimation extends Component { };
RotationAnimation.schema = {
    speedX: { type: Types.Number, default: 0.0001 },
    speedY: { type: Types.Number, default: 0.0001 },
    speedZ: { type: Types.Number, default: 0.0001 }
}
