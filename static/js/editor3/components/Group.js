// Group(THREE.Group)コンポーネント
import { Component, Types } from 'ecsy';

export default class Group extends Component { }
Group.schema = {
    value: { type: Types.Ref }
}
