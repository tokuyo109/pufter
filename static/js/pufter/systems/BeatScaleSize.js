import { System } from 'ecsy';

import { Object3D, Mesh, Position, Rotation, Scale, BeatScaleSize } from '../components/components.js';


export class BeatScaleSizeSystem extends System {
    init(attributes) {
        this.playerManager = attributes.playerManager;
        this.prevBeat = null;
        this.frameCount = 0;
    }
    // 毎フレーム実行する
    execute(delta, time) {
        const currentBeat = this.playerManager.getCurrentBeat();
        this.frameCount++;

        // 5フレーム実行される
        if (this.frameCount >= 4) {
            const isBeatChanged = currentBeat != this.prevBeat;

            this.queries.entities.results.forEach(entity => {
                const scaleSize = entity.getMutableComponent(Scale);

                if (isBeatChanged) {
                    this.beatScaleSize(scaleSize);
                } else {
                    this.setDefaultScale(scaleSize);
                }
            });

            this.frameCount = 0;
            this.prevBeat = currentBeat;
        }
    }

    setDefaultScale(scaleSize) {
        if (scaleSize.x !== 1 || scaleSize.y !== 1 || scaleSize.z !== 1) {
            scaleSize.x = 1;
            scaleSize.y = 1;
            scaleSize.z = 1;
        }
    }

    beatScaleSize(scaleSize) {
        if (scaleSize.x !== 1.15 || scaleSize.y !== 1.15 || scaleSize.z !== 1.15) {
            scaleSize.x = 1.15;
            scaleSize.y = 1.15;
            scaleSize.z = 1.15;
        }
    }
};

BeatScaleSizeSystem.queries = {
    entities: { components: [BeatScaleSize, Object3D, Position] }
};

