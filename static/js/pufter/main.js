// THREE.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

// TextAliveApp
import { PlayerManager } from "./controller/PlayerManager.js";

// ecsy
import { World } from "ecsy";
import {
    Scene,
    Renderer,
    Camera,
    Object3D,
    Mesh,
    Position,
    Rotation,
    Scale,
    CameraActive,
    UIControllable,
    LyricDisplayCube,
    RandomWalk
} from "./components/components.js";
import {
    RenderingSystem,
    UISystem,
    LyricDisplayCubeSystem,
    TransformSystem,
    RandomWalkSystem
} from "./systems/index.js";

const playerManager = new PlayerManager();
playerManager.init();

const world = new World();
world
    // コンポーネント
    .registerComponent(Scene)
    .registerComponent(Renderer)
    .registerComponent(Camera)
    .registerComponent(Object3D)
    .registerComponent(Mesh)
    .registerComponent(Position)
    .registerComponent(Rotation)
    .registerComponent(Scale)
    .registerComponent(CameraActive)
    .registerComponent(UIControllable)
    .registerComponent(LyricDisplayCube)
    .registerComponent(RandomWalk)
    // システム
    .registerSystem(UISystem, world)
    .registerSystem(RenderingSystem, world)
    .registerSystem(LyricDisplayCubeSystem, playerManager)
    .registerSystem(TransformSystem)
    .registerSystem(RandomWalkSystem, playerManager);
;

// (() => {
//     for (let i = 0; i < 5; i++) {
//         const meshEntity = world.createEntity();
//         meshEntity
//             .addComponent(Object3D, {
//                 value: new THREE.Mesh(
//                     new THREE.BoxGeometry(1, 1, 1),
//                     new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random() })
//                 )
//             })
//             .addComponent(Position, { x: Math.random() * 5 - 2.5, y: 0, z: Math.random() * 5 - 2.5 })
//             .addComponent(Rotation, { x: 0, y: 0, z: 0 })
//             .addComponent(Scale, { x: 1, y: 1, z: 1 })
//             .addComponent(UIControllable)
//             .addComponent(RandomWalk)
//             ;
//         meshEntity.name = `Mesh${meshEntity.id}`;
//     }
// })();

let lastTime = performance.now();
const run = () => {
    // 1フレームの経過時間を計算する
    const time = performance.now();
    const delta = time - lastTime;

    // 全てのシステムを実行する
    world.execute(delta, time);
    lastTime = time;

    requestAnimationFrame(run);
}
run();
