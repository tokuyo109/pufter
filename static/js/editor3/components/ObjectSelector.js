export default class ObjectSelectorComponent extends Component { }
ObjectSelectorComponent.schema = {
    objects: { type: Types.Array }, // 利用可能なオブジェクトのリスト
    selectedObject: { type: Types.Ref, default: null } // 選択されたオブジェクト
};
