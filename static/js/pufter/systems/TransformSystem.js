import { System } from 'ecsy';

import { Object3D, Position, Rotation, Scale } from '../components/components.js';

export default class TransformSystem extends System {
    execute(delta, time) {
        // 初期化処理
        this.setTransform(this.queries.position.added, Position);
        this.setTransform(this.queries.rotation.added, Rotation);
        this.setTransform(this.queries.scale.added, Scale);

        // 変更処理
        this.setTransform(this.queries.position.changed, Position);
        this.setTransform(this.queries.rotation.changed, Rotation);
        this.setTransform(this.queries.scale.changed, Scale);
    }

    setTransform(entities, componentType) {
        entities.forEach(entity => {
            const object3D = entity.getComponent(Object3D).value;
            const component = entity.getComponent(componentType);
            if (componentType === Position) {
                object3D.position.set(component.x, component.y, component.z);
            } else if (componentType === Rotation) {
                object3D.rotation.set(component.x, component.y, component.z);
            } else if (componentType === Scale) {
                object3D.scale.set(component.x, component.y, component.z);
            }
        });
    }
}

TransformSystem.queries = {
    position: {
        components: [Object3D, Position],
        listen: {
            added: true,
            changed: true
        }
    },
    rotation: {
        components: [Object3D, Rotation],
        listen: {
            added: true,
            changed: true
        }
    },
    scale: {
        components: [Object3D, Scale],
        listen: {
            added: true,
            changed: true
        }
    }
};

