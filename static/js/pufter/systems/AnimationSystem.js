import * as THREE from "three";
import { System } from "ecsy";
import { Object3D, Mesh, Group, Position, Rotation, Scale, Spiral, Radiate } from "../components/components.js";
import { easeInOutCubic, easeInOutQuad } from "../utils/easing.js";

export class AnimationSystem extends System {
    init({ playerManager }) {
        this.playerManager = playerManager;
        this.randomNormal = this.getRandomNormal(); // ランダムな法線を取得するメソッド

        this.prevBeat = null;
    }

    execute(delta, time) {
        const currentBeat = this.playerManager.getCurrentBeat();

        this.queries.spiral.results.forEach(entity => {
            this.spiral(entity, delta, time);
        })

        this.queries.radiate.results.forEach(entity => {
            this.radiate(entity, delta, time, currentBeat);
        })

        this.prevBeat = currentBeat;
    }

    spiral(entity, delta, time) {
        const group = entity.getComponent(Object3D).object3D;
        const maxSize = 100;
        const lyric = this.playerManager.updateLyrics();
        if (lyric && lyric.char) {
            const sprite = new THREE.Sprite(
                new THREE.SpriteMaterial({
                    map: this.createTextTexture(lyric.char, '100px sans-serif'),
                    transparent: true
                })
            )
            group.add(sprite);
        };

        if (group.children.length > maxSize) {
            group.remove(group.children[0]);
        }

        group.children.forEach((lyric, index) => {
            const angle = (time / 1000) + index * 2;
            lyric.position.x = Math.sin(angle) * 2;
            lyric.position.y += (delta / 1000) * 0.5;
            lyric.position.z = Math.cos(angle) * 2;
            lyric.material.opacity = Math.max(1 - (lyric.position.y / 10), 0);
        })
    }

    createTextTexture(text, font) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 512;
        canvas.height = 512;

        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = font;
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        return texture;
    }

    radiate(entity, delta, time, currentBeat) {
        const radiate = entity.getComponent(Radiate);
        const children = radiate.children;
        const count = radiate.count;
        const group = entity.getComponent(Object3D).object3D;

        if (currentBeat != this.prevBeat) {
            for (let i = 0; i < count; i++) this.createRadiateObject(group, time, children);
        }

        children.forEach((obj, index) => {
            const { object, startTime, duration, startPosition, endPosition } = obj;
            const progress = (time / 1000 - startTime) / duration;

            if (progress < 1) {
                object.position.lerpVectors(startPosition, endPosition, easeInOutQuad(progress));
            } else {
                group.remove(object);
                children.splice(index, 1);
            }
        })
    }

    getRandomNormal() {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const normals = geometry.attributes.normal.array;
        const normalsCount = normals.length / 3;

        return () => {
            const randomIDX = Math.trunc(Math.random() * normalsCount);
            return new THREE.Vector3(
                normals[randomIDX * 3],
                normals[randomIDX * 3 + 1],
                normals[randomIDX * 3 + 2]
            );
        }
    }

    createRadiateObject(group, time, children) {
        const normal = this.randomNormal();
        const colors = [0xffb3ba, 0xffdfba, 0xffffba, 0xbaffc9, 0xbae1ff];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: randomColor });
        const object = new THREE.Mesh(geometry, material);
        object.rotation.set(Math.random(), Math.random(), Math.random());

        const startTime = time / 1000;
        const duration = 0.7;

        children.push({
            object,
            startTime,
            duration,
            startPosition: normal.clone().multiplyScalar(3),
            endPosition: normal.clone().multiplyScalar(7)
        });

        group.add(object);
    }
}

AnimationSystem.queries = {
    spiral: {
        components: [Object3D, Group, Spiral],
    },

    radiate: {
        components: [Object3D, Group, Radiate],
    }
}
