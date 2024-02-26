import * as THREE from 'three';
import {
    GeometryComponent,
    MaterialComponent,

    TransformComponent,

    RotationAnimationComponent,
    PositionAnimationComponent,
    // CircleAnimationComponent,

    AudioReactiveScaleComponent,

    ParentComponent,
    ParentReferenceConponent,
    GroupComponent
} from './components/index.js';
import { RenderingSystem, AudioVisualizeSystem, AnimationSystem } from './systems/index.js';
import MusicManager from './core/MusicManager.js';
import Entity from './entities/Entity.js';

// ECSアーキテクチャ: worldの初期化
const entities = [];

// 前回のフレームのタイムスタンプを保持する変数
let lastTime = 0;

// Three.jsの設定
const scene = new THREE.Scene();
// scene.add(new THREE.GridHelper(10, 10)); // 平面グリッド表示
// scene.add(new THREE.AxesHelper(180)); // x, y, z軸表示
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

const torusKnotEntity = new Entity(
    {
        "geometry": new GeometryComponent(new THREE.TorusGeometry()),
        "material": new MaterialComponent(new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })),
        "transform": new TransformComponent(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, 2, 2)
        ),
        // "rotationAnimation": new RotationAnimationComponent(1, 1, 1),
        // "positionAnimation": new PositionAnimationComponent(0.01, 0.01, 0.01),
        // "circleAnimation": new CircleAnimationComponent(0, 0, 0, 1, 1),
        // "audioReactiveScale": new AudioReactiveScaleComponent(new THREE.Vector3(2, 2, 2)),
    }
)

// entities.push(torusKnotEntity);

// const groupEntity = new Entity({
//     "parent": new ParentComponent(),
//     "transform": new TransformComponent(
//         new THREE.Vector3(5, 5, 5),
//         new THREE.Vector3(0, 0, 0),
//         new THREE.Vector3(1, 1, 1)
//     ),
// })

// groupEntity.getComponent("parent").addChild(torusKnotEntity.id);
// entities.push(groupEntity);
// console.log(groupEntity);
// groupEntity.getComponent("parent").getChildren().forEach(children => {
//     const id = children;
//     entities.forEach(entity => {
//         if (entity.id === id) {
//             console.log(entity);
//         }
//     })
// })
// entities.push(groupEntity);

const groupEntity = new Entity({
    "group": new GroupComponent(new THREE.Group()),
    "transform": new TransformComponent(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 1, 1)
    ),
})
entities.push(groupEntity);

const childEntity = new Entity({
    "parentReference": new ParentReferenceConponent(groupEntity.id),
    "geometry": new GeometryComponent(new THREE.TorusGeometry()),
    "material": new MaterialComponent(new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })),
    "transform": new TransformComponent(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 1, 1)
    ),
})
entities.push(childEntity);

const childEntity2 = new Entity({
    "parentReference": new ParentReferenceConponent(groupEntity.id),
    "geometry": new GeometryComponent(new THREE.TorusGeometry()),
    "material": new MaterialComponent(new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })),
    "transform": new TransformComponent(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 1, 1)
    ),
})
entities.push(childEntity2);

// ランダムで百個表示させる関数
const randomMeshEntity = (geometry, count) => {
    const max = 2;
    const min = -2;
    for (let i = 0; i < count; i++) {
        const entity = new Entity(
            {
                "geometry": new GeometryComponent(geometry),
                "material": new MaterialComponent(new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })),
                "transform": new TransformComponent(
                    new THREE.Vector3(
                        Math.random() * (max - min) + min,
                        Math.random() * (max - min) + min,
                        Math.random() * (max - min) + min,
                    ),
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(2, 2, 2)
                ),
                "rotationAnimation": new RotationAnimationComponent(1, 1, 1),
                "positionAnimation": new PositionAnimationComponent(0.01, 0.01, 0.01),
                // "circleAnimation": new CircleAnimationComponent(0, 0, 0, 0.5, 1),
                "audioReactiveScale": new AudioReactiveScaleComponent(new THREE.Vector3(2, 2, 2)),
            }
        )
        entities.push(entity);
    }
}
// randomMeshEntity(new THREE.TorusGeometry(), 100);

// RenderSystemのインスタンス化
const renderingSystem = new RenderingSystem(scene);

// MusicManagerのインスタンス化
const musicManager = new MusicManager();

// AudioVisualizeSystemのインスタンス化
const audioVisualizeSystem = new AudioVisualizeSystem(musicManager, entities);

// AnimationSystemのインスタンス化
const animationSystem = new AnimationSystem(entities);

// アニメーションループ
function animate(time) {
    requestAnimationFrame(animate);

    // 1フレーム時間
    const deltaTime = (time - lastTime) / 1000;

    // RenderSystemの更新
    renderingSystem.update(entities);

    // AudioVisualizeSystemの更新
    // audioVisualizeSystem.update(deltaTime);

    // AnimationSystemの更新
    // animationSystem.update(deltaTime);

    renderer.render(scene, camera);

    lastTime = time;
}

animate();
