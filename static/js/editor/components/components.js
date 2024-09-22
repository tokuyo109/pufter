// components.js
// 振る舞いを行う際に必要となる情報をコンポーネントとして持つ
import * as THREE from "three";
import { Component, Types } from "ecsy";

// Scene(THREE.Scene) コンポーネント
export class Scene extends Component { }
Scene.schema = {
    scene: { type: Types.Ref }, // THREE.Sceneへの参照
    background: { type: Types.Ref, default: null }, // 色、テクスチャ
    fog: { type: Types.Ref, default: null } // THREE.Fogへの参照
};

// Camera(THREE.Camera)コンポーネント
export class Camera extends Component { };
Camera.schema = {
    camera: { type: Types.Ref }, // THREE.Cameraへの参照
    fov: { type: Types.Number, default: 45 }, // 視野角
    aspect: { type: Types.Number, default: window.innerWidth / window.innerHeight }, // アスペクト比
    near: { type: Types.Number, default: 1 }, // 近クリップ
    far: { type: Types.Number, default: 1000 } // 遠クリップ
}

// Renderer(THREE.WebGLRenderer)コンポーネント
export class Renderer extends Component { }
Renderer.schema = {
    renderer: { type: Types.Ref }, // THREE.WebGLRendererへの参照
    clearColor: { type: Types.String, default: '#000000' }, // クリアカラー（黒をデフォルトとする）
    pixelRatio: { type: Types.Number, default: window.devicePixelRatio }, // ピクセル比
    size: { type: Types.JSON, default: { width: window.innerWidth, height: window.innerHeight } } // レンダラーのサイズ
};

// Object3D(THREE.Object3D)コンポーネント
export class Object3D extends Component { };
Object3D.schema = {
    value: { type: Types.Ref }
}

// Mesh(THREE.Mesh)コンポーネント
export class Mesh extends Component { }
// Mesh.schema = {
//     value: { type: Types.Ref }
// }

// Group(THREE.Group)コンポーネント
export class Group extends Component { }
// Group.schema = {
//     value: { type: Types.Ref }
// }

// Light(THREE.Light)コンポーネント
export class Light extends Component { }
// Light.schema = {
//     value: { type: Types.Ref },
// }

// ObjectSelectorComponent 
export class ObjectSelectorComponent extends Component { }
ObjectSelectorComponent.schema = {
    objects: { type: Types.Array }, // 利用可能なオブジェクトのリスト
    selectedObject: { type: Types.Ref, default: null } // 選択されたオブジェクト
};

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
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 }
}

// 回転アニメーションを管理するコンポーネント
export class RotationAnimation extends Component { };
RotationAnimation.schema = {
    speedX: { type: Types.Number, default: 0.0001 },
    speedY: { type: Types.Number, default: 0.0001 },
    speedZ: { type: Types.Number, default: 0.0001 }
}

// Scale(大きさ)コンポーネント
export class Scale extends Component { };
Scale.schema = {
    x: { type: Types.Number, default: 1 },
    y: { type: Types.Number, default: 1 },
    z: { type: Types.Number, default: 1 }
}

// UIから操作可能なエンティティを示すマーカーコンポーネント
export class UIControllable extends Component { }

// Visualizer
export class Visualizer extends Component { }
Visualizer.schema = {
    color: { type: Types.Ref, default: new THREE.Color(0xffffff) },
    count: { type: Types.Number, default: 1 },
}

// 円状のオーディオスペクトラム
export class CircleSpectrum extends Component { }
CircleSpectrum.schema = {
    color: { type: Types.Ref, default: new THREE.Color(0xffffff) },
    count: { type: Types.Number, default: 1 },
}

// 線状のオーディオスペクトラム
export class LineSpectrum extends Component { }
LineSpectrum.schema = {
    color: { type: Types.Ref, default: new THREE.Color(0xffffff) },
    count: { type: Types.Number, default: 1 },
}
