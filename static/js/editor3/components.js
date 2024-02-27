// 現在は使用していない
// components.js
import { Component, Types } from "ecsy";

// Group(THREE.Group)コンポーネント
export class Group extends Component { };
Group.schema = {
    value: { type: Types.Ref }
}

// Position(位置)コンポーネント
export class Position extends Component { };
Position.schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 }
}

// Rotation(向き)コンポーネント
export class Rotation extends Component { };
Rotation.schema = {
    x: { type: Types.Number },
    y: { type: Types.Number },
    z: { type: Types.Number }
}

// Scale(大きさ)コンポーネント
export class Scale extends Component { };
Scale.schema = {
    x: { type: Types.Number },
    y: { type: Types.Number },
    z: { type: Types.Number }
}

// Velocity(速度)コンポーネント

// Acceleration(加速度)コンポーネント

// Mesh(THREE.Mesh)コンポーネント
export class Mesh extends Component { }
Mesh.schema = {
    value: { type: Types.Ref }
}

// Lightコンポーネント
