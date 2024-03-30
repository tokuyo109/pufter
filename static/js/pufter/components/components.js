import { Component, TagComponent, Types } from "ecsy";

// THREE.Object3D
export class Object3D extends Component { };
Object3D.schema = {
    value: { type: Types.Ref }
}

// THREE.Mesh
export class Mesh extends TagComponent { };

// THREE.Group
export class Group extends Component { };
Group.schema = {
    count: { type: Types.Number, default: 0 }
}

// THREE.Object3D.position
export class Position extends Component { };
Position.schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 }
}

// THREE.Object3D.rotation
export class Rotation extends Component { };
Rotation.schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 }
}

// THREE.Object3D.scale
export class Scale extends Component { };
Scale.schema = {
    x: { type: Types.Number, default: 1 },
    y: { type: Types.Number, default: 1 },
    z: { type: Types.Number, default: 1 }
}

// THREE.Scene
export class Scene extends Component { }
Scene.schema = {
    scene: { type: Types.Ref }, // THREE.Scene
    background: { type: Types.Ref, default: null }, // THREE.Color
    fog: { type: Types.Ref, default: null } // THREE.Fog
}

// THREE.WebGLRenderer
export class Renderer extends Component { }
Renderer.schema = {
    renderer: { type: Types.Ref }, // THREE.WebGLRenderer
    clearColor: { type: Types.Number, default: 0x000000 },
    pixelRatio: { type: Types.Number, default: window.devicePixelRatio },
    size: { type: Types.JSON, default: { width: window.innerWidth, height: window.innerHeight } }
}

// THREE.PerspectiveCamera
export class Camera extends Component { }
Camera.schema = {
    fov: { type: Types.Number, default: 75 },
    aspect: { type: Types.Number, default: window.innerWidth / window.innerHeight },
    near: { type: Types.Number, default: 0.1 },
    far: { type: Types.Number, default: 1000 },
    lookAt: { type: Types.Ref, default: { x: 0, y: 0, z: 0 } }
}

// カメラが有効かどうか
export class CameraActive extends TagComponent { }

// UIから操作可能なエンティティかどうか
export class UIControllable extends TagComponent { }

// 歌詞を一文字ずつ表示する箱
export class LyricDisplayCube extends TagComponent { }

// ランダムに移動するエンティティ
export class RandomWalk extends TagComponent { }
