// Light( color : Integer, intensity : Float )

// Light(THREE.Light)コンポーネント
import { Component, Types } from 'ecsy';

export default class Light extends Component { }
Light.schema = {
    value: { type: Types.Ref },
}
