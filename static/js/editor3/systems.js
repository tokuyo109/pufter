// systems.js
import { System } from "ecsy";
import { Position, Rotation, Mesh, Group } from "./components.js";

// システムの定義
export class MovableSystem extends System {
    init() { }
    execute(delta, now) {
        this.queries.moving.results.forEach(entity => {
            const position = entity.getMutableComponent(Position);
            position.x += delta * 0.0001;
            position.y += delta * 0.0001;
            position.z += delta * 0.0001;

            const mesh = entity.getMutableComponent(Mesh).value;
            mesh.position.set(position.x, position.y, position.z);
        })
    }
}
MovableSystem.queries = {
    moving: {
        components: [Position, Mesh]
    }
}

// 回転を行うシステム
export class RotationSystem extends System {
    init() { }
    execute(delta, now) {
        this.queries.moving.results.forEach(entity => {
            const rotation = entity.getMutableComponent(Rotation);
            rotation.x += delta * 0.001;
            rotation.y += delta * 0.001;
            rotation.z += delta * 0.001;

            const mesh = entity.getMutableComponent(Mesh).value;
            mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        })
    }
}
RotationSystem.queries = {
    moving: {
        components: [Rotation, Mesh]
    }
}

// グループに対して回転を行うシステム
export class GroupRotationSystem extends System {
    init() { }
    execute(delta, now) {
        this.queries.groups.results.forEach(entity => {
            // console.log("group");
            const rotation = entity.getMutableComponent(Rotation);
            rotation.x += delta * 0.001;
            rotation.y += delta * 0.001;
            rotation.z += delta * 0.001;

            const group = entity.getMutableComponent(Group).value;
            group.rotation.set(rotation.x, rotation.y, rotation.z);
        })
    }
}

GroupRotationSystem.queries = {
    groups: {
        components: [Group]
    }
}