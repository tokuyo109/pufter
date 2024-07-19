/*

エクスポートの際にJSONを複雑にしないためにType.Refでの定義はTHREE.Object3Dのみに留める。(toJSONメソッドを持つため)
他のオブジェクトはType.Number、Type.Boolean、Type.String、Type.JSON、Type.Arrayで定義する。

*/

// ecsy
import { Component, TagComponent, Types } from "ecsy";

// toJSONを持たないため、少し特別な実装を行う
export class Renderer extends Component { };
Renderer.schema = {
    renderer: { type: Types.Ref },
    clearColor: { type: Types.Number },
    antialias: { type: Types.Boolean }
}

// 基本はObject3D + Mesh or Groupの組み合わせでエンティティを構築する
// わざわざ分けているのはPositionなどのプロパティを一律に処理するため
// THREE.Object3D
export class Object3D extends Component { }
Object3D.schema = {
    object3D: { type: Types.Ref }, // THREE.Object3D
    parent: { type: Types.Ref, default: null } // THREE.Scene or THREE.Group
}
// それぞれのタイプに応じた処理を行うために定義する
// THREE.Scene
export class Scene extends TagComponent { };
// THREE.PersPectiveCamera
export class Camera extends TagComponent { }
// THREE.Mesh
export class Mesh extends TagComponent { }
// THREE.Group
export class Group extends TagComponent { }

// 位置
export class Position extends Component { }
Position.schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 }
}

// 回転
export class Rotation extends Component { }
Rotation.schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 }
}

// サイズ
export class Scale extends Component { }
Scale.schema = {
    x: { type: Types.Number, default: 1 },
    y: { type: Types.Number, default: 1 },
    z: { type: Types.Number, default: 1 }
}

export class UI extends TagComponent { }

export class Export extends TagComponent { }

// 歌詞を表示するために使用するコンテナ
// 歌詞アニメーションコンポーネントと併用する
// 過去作品との互換性を保つため使用しない
export class Lyric extends Component { }
Lyric.schema = {
    canvas: { type: Types.Ref, default: null },
    context: { type: Types.Ref, default: null },
    texture: { type: Types.Ref, default: null },
    font: { type: Types.String, default: "Arial" },
    color: { type: Types.String, default: "#000000" }
}

// 歌詞を一文字ずつ表示する箱
export class LyricDisplayCube extends TagComponent { }
LyricDisplayCube.schema = {
    canvas: { type: Types.Ref, default: null},
    context: { type: Types.Ref, default: null},
    texture: { type: Types.Ref, default: null },
    font: { type: Types.String, default: "Arial"},
    color: { type: Types.String, default: "#000000"}
}

// 表示時、文字サイズを弾むように変化させる歌詞アニメーション
export class EaseOutBack extends Component { }
EaseOutBack.schema = {
    canvas: { type: Types.Ref, default: null },
    context: { type: Types.Ref, default: null },
    texture: { type: Types.Ref, default: null },
    font: { type: Types.String, default: "Arial" },
    color: { type: Types.String, default: "#000000" }
}

// タイピング風の歌詞アニメーション
export class Typing extends TagComponent { }

// 波打つ歌詞アニメーション
export class Wave extends TagComponent { }

// 文字を一回転させる歌詞アニメーション
export class RotationChar extends TagComponent { }

// フレーズをスライドさせる歌詞アニメーション
export class Slide extends TagComponent { }

// ランダムに移動するエンティティ
export class RandomWalk extends TagComponent { }

// らせん状に移動する歌詞アニメーション
export class Spiral extends TagComponent { }

// 法線ベクトルに沿って放射するビートアニメーション
export class Radiate extends Component { }
Radiate.schema = {
    count: { type: Types.Number, default: 5 },
    children: { type: Types.Array, default: [] }
}

// ランダムで色が変わる
export class BeatColorChange extends TagComponent { }

// ビートが実行された時に大きくなる
export class BeatScaleSize extends TagComponent { }