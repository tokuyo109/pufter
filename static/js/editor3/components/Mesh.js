// Mesh(THREE.Mesh)コンポーネント
import { Component, Types } from 'ecsy';

export default class Mesh extends Component { }
Mesh.schema = {
    value: { type: Types.Ref }
}
