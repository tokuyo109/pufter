import { Component, Types } from "ecsy";

export default class Camera extends Component { };
Camera.schema = {
    camera: { type: Types.Ref }, // THREE.Cameraへの参照
    fov: { type: Types.Number, default: 45 }, // 視野角
    aspect: { type: Types.Number, default: window.innerWidth / window.innerHeight }, // アスペクト比
    near: { type: Types.Number, default: 1 }, // 近クリップ
    far: { type: Types.Number, default: 1000 } // 遠クリップ
}
