import { System } from 'ecsy';
import { Object3D, Position, BeatColorChange } from '../components/components.js';

export class BeatColorChangeSystem extends System {
    init(attributes) {
        this.playerManager = attributes.playerManager;
        this.prevBeat = null;
    }

    execute(delta, time) {
        // エンティティが存在しない場合早期リターン
        if (!this.queries.entities.results) return;
        const currentBeat = this.playerManager.getCurrentBeat();
        if (currentBeat != this.prevBeat) {
            this.queries.entities.results.forEach(entity => {
                this.beatColorChange(entity);
            });
            this.prevBeat = currentBeat;
        }
    }

    beatColorChange(entity) {
        const object3DComponent = entity.getComponent(Object3D);
        if (object3DComponent) {
            const color = Math.random() * 0xffffff;
            object3DComponent.object3D.traverse(child => {
                if (child.isMesh) {
                    child.material.color.setHex(color);
                }
            });
        }
    }
}

BeatColorChangeSystem.queries = {
    entities: {
        components: [BeatColorChange, Object3D, Position]
    }
};
