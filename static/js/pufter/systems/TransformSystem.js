import { System } from "ecsy";
import {
    Object3D,
    Position,
    Rotation,
    Scale
} from "../components/components.js";

export class TransformSystem extends System {
    init() {
    }

    execute(delta, time) {
        this.queries.entities.added.forEach((entity) => {
            const object = entity.getComponent(Object3D).object3D;
            const position = entity.getComponent(Position);
            const rotation = entity.getComponent(Rotation);
            const scale = entity.getComponent(Scale);

            object.position.set(position.x, position.y, position.z);
            object.rotation.set(rotation.x, rotation.y, rotation.z);
            object.scale.set(scale.x, scale.y, scale.z);
        });

        this.queries.entities.changed.forEach((entity) => {
            const object = entity.getComponent(Object3D).object3D;
            const position = entity.getComponent(Position);
            const rotation = entity.getComponent(Rotation);
            const scale = entity.getComponent(Scale);

            object.position.set(position.x, position.y, position.z);
            object.rotation.set(rotation.x, rotation.y, rotation.z);
            object.scale.set(scale.x, scale.y, scale.z);
        })
    }
}

TransformSystem.queries = {
    entities: {
        components: [Position, Rotation, Scale, Object3D],
        listen: {
            added: true,
            changed: true,
        }
    }
}