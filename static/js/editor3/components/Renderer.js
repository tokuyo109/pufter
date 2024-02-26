import { Component, Types } from 'ecsy';

export default class Renderer extends Component { }
Renderer.schema = {
    renderer: { type: Types.Ref }, // THREE.WebGLRendererへの参照
    clearColor: { type: Types.String, default: '#000000' }, // クリアカラー（黒をデフォルトとする）
    pixelRatio: { type: Types.Number, default: window.devicePixelRatio }, // ピクセル比
    size: { type: Types.JSON, default: { width: window.innerWidth, height: window.innerHeight } } // レンダラのサイズ
};
