// main.js
// エントリーポイント

import { World } from "ecsy";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
    Scene, Camera, Renderer,
    Light,
    Object3D,
    Mesh, Group,
    Position, Rotation, Scale, // Transform
    UIControllable,
    Visualizer, RotationAnimation, CircleSpectrum, LineSpectrum
} from "./components/components.js";
import {
    RenderingSystem,
    TransformSystem,
    UISystem,
    AnimationSystem,
    LineSpectrumSystem
} from "./systems/index.js";
import {
    createCube,
    createFloor,
    createGroup,
    createCircleSpectrum,
    createLight,
    createLineSpectrum
} from "./generateObject.js";
import MusicManager from "./musicManager.js";

// MusicManagerオブジェクトの作成
const musicManager = new MusicManager();

// Worldオブジェクトの作成
const world = new World();

// コンポーネントの登録
world
    .registerComponent(Scene)
    .registerComponent(Camera)
    .registerComponent(Renderer)

    .registerComponent(Light)

    .registerComponent(Object3D)
    .registerComponent(Mesh)
    .registerComponent(Group)

    .registerComponent(Position)
    .registerComponent(Rotation)
    .registerComponent(Scale)

    .registerComponent(UIControllable)
    .registerComponent(Visualizer)
    .registerComponent(RotationAnimation)
    .registerComponent(CircleSpectrum)
    .registerComponent(LineSpectrum)
    ;


// システムの登録
// 登録の順番で実行される
world
    .registerSystem(RenderingSystem)
    .registerSystem(TransformSystem)
    .registerSystem(UISystem)
    .registerSystem(AnimationSystem, musicManager)
    .registerSystem(LineSpectrumSystem, musicManager)
    ;
// Sceneオブジェクトの作成
const scene = new THREE.Scene();

// Cameraオブジェクトの作成
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0, 3, 5);
camera.lookAt(0, 0, 0);

// Rendererオブジェクトの作成
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#webGL").appendChild(renderer.domElement);

// デバック用
// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// GridHelperの設定
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

// // 光源を作成
// const light = new THREE.DirectionalLight(0xFFFFFF);
// scene.add(light);

// const helper = new THREE.DirectionalLightHelper(light, 5);
// scene.add(helper);

// エンティティを作成し、Scene、Camera、Rendererコンポーネントを追加
const sceneEntity = world.createEntity()
    .addComponent(Scene, { scene: scene, fog: new THREE.Fog(0x000000, 0, 100) })
    .addComponent(Camera, { camera: camera })
    .addComponent(Renderer, {
        renderer: renderer,
        clearColor: "#000000",
        pixelRatio: window.devicePixelRatio,
        size: { width: window.innerWidth, height: window.innerHeight }
    })
    .addComponent(UIControllable);

// 床
const floorMesh = createFloor();
floorMesh.material.color = new THREE.Color(0x111111);
// floorMesh.material.color = 0x111111;
const floorEntity = world.createEntity()
    .addComponent(Object3D, { value: floorMesh })
    .addComponent(Mesh)
    .addComponent(Position, { x: 0, y: 0.1, z: 0 })
    .addComponent(Rotation, { x: Math.PI / 2 * -1, y: 0, z: 0 })
    .addComponent(Scale, { x: 1000, y: 100, z: 1 })
    .addComponent(UIControllable)
    ;
sceneEntity.getComponent(Scene).scene.add(floorEntity.getComponent(Object3D).value);

// アンビエントライト
const ambientLightEntity = world.createEntity()
    .addComponent(Object3D, { value: new THREE.AmbientLight(0x404040) })
    .addComponent(Light)
    .addComponent(UIControllable)
sceneEntity.getComponent(Scene).scene.add(ambientLightEntity.getComponent(Object3D).value);

// スポットライト
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.target.position.set(0, 0, 0);
const spotLightEntity = world.createEntity()
    .addComponent(Object3D, { value: spotLight })
    .addComponent(Light)
    .addComponent(Position, { x: 0, y: 10, z: 0 })
    .addComponent(Rotation, { x: Math.PI / 2 * -1, y: 0, z: 0 })
    .addComponent(Scale, { x: 100, y: 100, z: 1 })
    .addComponent(UIControllable)
    ;
sceneEntity.getComponent(Scene).scene.add(spotLightEntity.getComponent(Object3D).value);

// 旧バージョン
// 利用可能なオブジェクトのリスト
// const availableObjects = [
//     { name: "Cube", createFunction: createCube },
//     { name: "Sphere", createFunction: createSphere },
//     { name: "Cone", createFunction: createCone },
//     { name: "Cylinder", createFunction: createCylinder },
//     { name: "Dodecahedron", createFunction: createDodecahedron },
//     { name: "Capsule", createFunction: createCapsule },
//     { name: "Tours", createFunction: createTours },
// ]

// // UIを追加
// const selectorContainer = document.querySelector("#objectSelector");
// availableObjects.forEach(object => {
//     const option = document.createElement("option");
//     option.text = object.name;
//     option.value = object.name;
//     selectorContainer.appendChild(option);
// });

// const addObjectButton = document.querySelector("#addObjectButton");
// addObjectButton.addEventListener("click", () => {
//     const selectedObjectName = selectorContainer.value;

//     // 選択された要素のエンティティを生成する
//     availableObjects.forEach(object => {
//         if (object.name === selectedObjectName) {
//             const entity = world.createEntity()
//                 .addComponent(Mesh, { value: object.createFunction() })
//                 .addComponent(Position, { x: (Math.random() * 10) - 5, y: Math.random() * 5, z: (Math.random() * 10) - 5 })
//                 .addComponent(Rotation, { x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2 })
//                 .addComponent(Scale, { x: 1, y: 1, z: 1 })
//                 .addComponent(UIControllable)
//                 .addComponent(Visualizer);
//             console.log(sceneEntity.getComponent(Scene).scene);
//             sceneEntity.getComponent(Scene).scene.add(entity.getComponent(Mesh).value);
//         }
//     })
// })

// 利用可能なオブジェクトのリスト
// createFunctionにはgenerateObject.jsからエクスポートした関数を設定する
const newAvaiableObjects = [
    // ビジュアライザーについてはLineSpectrumを参考にするといいです。
    // CircleSpectrumはあまり出来が良くないので。
    { name: "Mesh", type: "Mesh", createFunction: createCube },
    { name: "Floor", type: "Floor", createFunction: createFloor },
    { name: "Group", type: "Group", createFunction: createGroup },
    { name: "CircleSpectrum", type: "Group", createFunction: createCircleSpectrum },
    { name: "LineSpectrum", type: "LineSpectrum", createFunction: createLineSpectrum },
    { name: "Path", type: "Path", createFunction: null },
    { name: "Light", type: "Light", createFunction: createLight },


]

// 利用可能なオブジェクトを選択可能にする
const newSelectorContainer = document.querySelector("#newObjectSelector");
newAvaiableObjects.forEach(object => {
    const option = document.createElement("option");
    option.id = object.name;
    option.text = object.name;
    option.value = object.name;
    newSelectorContainer.appendChild(option);
})

// ボタン押下時にエンティティをワールドに追加する
const newAddObjectButton = document.querySelector("#newAddObjectButton");
newAddObjectButton.addEventListener("click", () => {
    // 選択しているオブジェクトを取得
    const selectedObjectName = newSelectorContainer.value;

    newAvaiableObjects.forEach(object => {
        if (object.name === selectedObjectName) {
            switch (object.type) {
                case "Mesh": addMeshEntity(object); break;
                case "Group": addGroupEntity(object); break;
                case "Floor": addFloorEntity(object); break;
                case "Path": addPathEntity(object); break;
                case "Light": addLightEntity(object); break;
                case "LineSpectrum": addLineSpectrumEntity(object); break;
                // case "Visualizer": addVisualizerEntity(object); break;
            }
        }
    })
})

// メッシュをワールドに追加する
const addMeshEntity = (object) => {
    const entity = world.createEntity()
        .addComponent(Object3D, { value: object.createFunction() })
        .addComponent(Mesh)
        .addComponent(Position, { x: (Math.random() * 10) - 5, y: Math.random() * 3 + 1, z: (Math.random() * 10) - 5 })
        .addComponent(Rotation, { x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2 })
        .addComponent(Scale, { x: 1, y: 1, z: 1 })
        .addComponent(UIControllable)
    sceneEntity.getComponent(Scene).scene.add(entity.getComponent(Object3D).value);
}

// グループをワールドに追加する
const addGroupEntity = (object) => {
    const entity = world.createEntity()
        .addComponent(Object3D, { value: object.createFunction() })
        .addComponent(Group)
        .addComponent(Position, { x: (Math.random() * 10) - 5, y: Math.random() * 5, z: (Math.random() * 10) - 5 })
        .addComponent(Rotation, { x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2 })
        .addComponent(Scale, { x: 1, y: 1, z: 1 })
        .addComponent(UIControllable)

    // 円状スペクトラムの場合
    if (object.name === "CircleSpectrum") {
        entity
            .addComponent(CircleSpectrum)
            .removeComponent(Position)
            .removeComponent(Scale)
            .addComponent(Position, { x: 0, y: 2, z: 0 })
            .addComponent(Scale, { x: 1, y: 1, z: 1 })
            .addComponent(RotationAnimation, { speedX: 0.001, speedY: 0.001, speedZ: 0.001 });
    }
    sceneEntity.getComponent(Scene).scene.add(entity.getComponent(Object3D).value);
}

// 床をワールドに追加する
const addFloorEntity = (object) => {
    const entity = world.createEntity()
        .addComponent(Object3D, { value: object.createFunction() })
        .addComponent(Mesh)
        .addComponent(Position, { x: 0, y: 0.1, z: 0 })
        .addComponent(Rotation, { x: Math.PI / 2 * -1, y: 0, z: 0 })
        .addComponent(Scale, { x: 100, y: 100, z: 1 })
        .addComponent(UIControllable)
    sceneEntity.getComponent(Scene).scene.add(entity.getComponent(Object3D).value);
}

// パスをワールドに追加する
const addPathEntity = (object) => {

}

// ライトをワールドに追加する
const addLightEntity = (object) => {
    // Component関連のメソッド : https://ecsyjs.github.io/ecsy/docs/#/manual/Architecture?id=components
    // newAvaiableObjectsのcreateFunctionにライトを生成する関数を設定する必要がある
    const entity = world.createEntity()
        .addComponent(Object3D, { value: object.createFunction() })
        .addComponent(Light)
        .addComponent(Position, { x: 0, y: 5, z: 0 })
        .addComponent(Rotation, { x: Math.PI / 2, y: 0, z: 0 })
        .addComponent(Scale, { x: 1, y: 1, z: 1 })
        .addComponent(UIControllable)
    sceneEntity.getComponent(Scene).scene.add(entity.getComponent(Object3D).value);
}

// 線状のスペクトラムをワールドに追加する
const addLineSpectrumEntity = (object) => {
    const entity = world.createEntity()
        .addComponent(Object3D, { value: object.createFunction() })
        .addComponent(LineSpectrum)
        .addComponent(Position, { x: 0, y: 1, z: 0 })
        .addComponent(Rotation, { x: 0, y: 0, z: 0 })
        .addComponent(Scale, { x: 1, y: 1, z: 1 })
        .addComponent(UIControllable)
    sceneEntity.getComponent(Scene).scene.add(entity.getComponent(Object3D).value);
}


let lastTime = performance.now();
const run = () => {
    // 1フレームの経過時間を計算する
    const time = performance.now();
    const delta = time - lastTime;

    // 全てのシステムを実行する
    world.execute(delta, time);
    lastTime = time;

    // シーンをレンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(run);
}
run();
