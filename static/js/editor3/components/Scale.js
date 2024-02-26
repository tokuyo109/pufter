// Scale(大きさ)コンポーネント
import { Component, Types } from 'ecsy';

export default class Scale extends Component { };
Scale.schema = {
    x: { type: Types.Number, default: 1 },
    y: { type: Types.Number, default: 1 },
    z: { type: Types.Number, default: 1 }
}
