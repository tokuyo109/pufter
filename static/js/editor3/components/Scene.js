import { Component, Types } from 'ecsy';

export default class Scene extends Component { }
Scene.schema = {
    scene: { type: Types.Ref }, // THREE.Sceneへの参照
    background: { type: Types.Ref, default: null }, // 色、テクスチャ、またはキューブテクスチャ
    fog: { type: Types.Ref, default: null } // THREE.Fogへの参照
};
