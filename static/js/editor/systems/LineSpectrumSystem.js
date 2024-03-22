import * as THREE from "three";
import { System } from "ecsy";
import {
    Object3D,
    LineSpectrum
} from "../components/components.js";

export default class LineSpectrumSystem extends System {
    init(musicManager) {
        this.musicManager = musicManager;
        this.positions = new Float32Array(this.musicManager.analyser.frequencyBinCount * 3);
    }

    execute(delta, time) {
        // 初期化
        this.queries.lineSpectrum.added.forEach(entity => {
            if (entity.hasComponent(Object3D)) {
                const line = entity.getComponent(Object3D).value;
                line.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
            }
        })

        // 毎フレーム実行
        this.queries.lineSpectrum.results.forEach(entity => {
            const line = entity.getComponent(Object3D).value;
            const data = this.musicManager.getTimeDomainData();
            for (let i = 0; i < data.length; i++) {
                const x = (i / data.length) * 2 - 1;// -1 ~ 1の範囲まで
                const y = ((data[i] / 255) * 2 - 1) * - 1;
                const z = 0;
                this.positions[i * 3] = x;
                this.positions[i * 3 + 1] = y;
                this.positions[i * 3 + 2] = z;
            }

            // positionsに変更があった際にgeometryを更新する
            line.geometry.attributes.position.needsUpdate = true;
            line.geometry.computeBoundingSphere();
        })

        // コンポーネントに変更があった際に実行
        this.queries.lineSpectrum.changed.forEach(entity => {
            const object = entity.getComponent(Object3D).value;
            object.material.color = entity.getComponent(LineSpectrum).color;
        })
    }
}

LineSpectrumSystem.queries = {
    lineSpectrum: {
        components: [LineSpectrum],
        listen: {
            added: true,
            changed: true
        }
    },
}