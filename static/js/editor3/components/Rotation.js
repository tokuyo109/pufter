// Rotation(向き)コンポーネント
import { Component, Types } from 'ecsy';

export default class Rotation extends Component { };
Rotation.schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 }
}
