// Position、Rotation、Scaleの更新を行う
import * as THREE from "three";
import { System } from "ecsy";

import {
    Mesh,
    Position, Rotation, Scale
} from "../components/index.js";

export default class TransformSystem extends System {
    // システムの初期化
    init() {
    }

    // システムの実行
    execute(delta, now) {
        // Meshを持つエンティティが追加されたとき
        this.queries.mesh.added.forEach(entity => {
            const mesh = entity.getComponent(Mesh).value;

            if (entity.hasComponent(Position)) {
                this._setPositionMesh(entity, mesh);
            }
            if (entity.hasComponent(Rotation)) {
                this._setRotationMesh(entity, mesh);
            }
            if (entity.hasComponent(Scale)) {
                this._setScaleMesh(entity, mesh);
            }
        })

        // Meshを持つエンティティが更新されたとき
    }

    // MeshにPositionをセットする
    _setPositionMesh(entity, mesh) {
        const { x, y, z } = entity.getComponent(Position);
        mesh.position.x = x;
        mesh.position.y = y;
        mesh.position.z = z;
    }

    // MeshにRotationをセットする
    _setRotationMesh(entity, mesh) {
        const { x, y, z } = entity.getComponent(Rotation);
        mesh.rotation.x = x;
        mesh.rotation.y = y;
        mesh.rotation.z = z;
    }

    // MeshにScaleをセットする
    _setScaleMesh(entity, mesh) {
        const { x, y, z } = entity.getComponent(Scale);
        mesh.scale.x = x;
        mesh.scale.y = y;
        mesh.scale.z = z;
    }

    // GroupにPositionをセットする
    _setPositionGroup(entity, group) {

    }

    // GroupにRotationをセットする
    _setRotationGroup(entity, group) {

    }

    // GroupにRotationをセットする
    _setScaleGroup(entity, group) {

    }
}

// エンティティの追加とコンポーネントの変化を検知
TransformSystem.queries = {
    mesh: {
        components: [Mesh, Position, Rotation, Scale],
        listen: {
            added: true,
            changed: [Position, Rotation, Scale]
        }
    },
    // group: {
    //     components: [Group, Position, Rotation, Scale],
    //     listen: {
    //         added: true,
    //         changed: [Position, Rotation, Scale]
    //     }
    // }
}
