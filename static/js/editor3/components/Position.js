// Position(位置)コンポーネント
import { Component, Types } from 'ecsy';

export default class Position extends Component { };
Position.schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 }
}
