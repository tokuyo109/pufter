// Object3Dを基底とする一部のオブジェクトの位置、回転、サイズを更新する
// Mesh、Group、Light
import { System } from "ecsy";

import {
    Object3D,
    Mesh, Group, Light,
    Position, Rotation, Scale
} from "../components/components.js";

export default class TransformSystem extends System {
    execute(delta, now) {
        this.queries.mesh.added.forEach(entity => {
            // let componentRef = null;

            // if (entity.hasComponent(Mesh)) {
            //     componentRef = entity.getMutableComponent(Mesh).value;
            // } else if (entity.hasComponent(Group)) {
            //     componentRef = entity.getMutableComponent(Group).value;
            // }
            if (entity.hasComponent(Object3D)) {
                const componentRef = entity.getMutableComponent(Object3D).value;
                this._updateTransform(entity, componentRef);
            }
        });

        this.queries.mesh.changed.forEach(entity => {
            // let componentRef = null;

            // if (entity.hasComponent(Mesh)) {
            //     componentRef = entity.getMutableComponent(Mesh).value;
            // } else if (entity.hasComponent(Group)) {
            //     componentRef = entity.getMutableComponent(Group).value;
            // }

            // this._updateTransform(entity, componentRef);
            if (entity.hasComponent(Object3D)) {
                const componentRef = entity.getMutableComponent(Object3D).value;
                this._updateTransform(entity, componentRef);
            }
        });
    }

    _updateTransform(entity, componentRef) {
        if (componentRef) {
            if (entity.hasComponent(Position)) {
                this._setPositionComponent(entity, componentRef);
            }
            if (entity.hasComponent(Rotation)) {
                this._setRotationComponent(entity, componentRef);
            }
            if (entity.hasComponent(Scale)) {
                this._setScaleComponent(entity, componentRef);
            }
        }
    }

    _setPositionComponent(entity, componentRef) {
        const { x, y, z } = entity.getComponent(Position);
        componentRef.position.set(x, y, z);
    }

    _setRotationComponent(entity, componentRef) {
        const { x, y, z } = entity.getComponent(Rotation);
        componentRef.rotation.set(x, y, z);
    }

    _setScaleComponent(entity, componentRef) {
        const { x, y, z } = entity.getComponent(Scale);
        componentRef.scale.set(x, y, z);
    }
}

TransformSystem.queries = {
    mesh: {
        components: [Position, Rotation, Scale],
        listen: {
            added: true,
            changed: [Position, Rotation, Scale]
        }
    }
}
