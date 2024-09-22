import { System } from 'ecsy';

import { Object3D, Mesh, Position, Rotation, Scale, RandomWalk } from '../components/components.js';

// ビートに合わせてランダムウォークを行うシステム
export class RandomWalkSystem extends System {
    init({playerManager}) {
        this.playerManager = playerManager;
        this.prevBeat = null;
    }

    // 毎フレーム実行する
    execute(delta, time) {
        const currentBeat = this.playerManager.getCurrentBeat();
        // if (currentBeat != this.prevBeat) console.log("beat");
        this.queries.entities.results.forEach(entity => currentBeat != this.prevBeat ? this.randomSetPosition(entity) : null);
        this.prevBeat = currentBeat;
    }

    randomSetPosition(entity) {
        const positionComponent = entity.getMutableComponent(Position);
        positionComponent.x = Math.random() * 10 - 5;
        positionComponent.y = Math.random() * 10 - 5;
        positionComponent.z = Math.random() * 10 - 5;

    }
}

RandomWalkSystem.queries = {
    entities: { components: [RandomWalk, Object3D, Position] }
};