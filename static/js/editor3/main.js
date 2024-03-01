// main.js
// エントリーポイント

import { World } from "ecsy";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
    Scene, Camera, Renderer,
    Mesh, Group,
    Position, Rotation, Scale, // Transform
    UIControllable, Visualizer
} from "./components/index.js";
import {
    RenderingSystem,
    TransformSystem,
    EntityManagementSystem,
    VisualizerSystem
} from "./systems/index.js";
import MusicManager from "./musicManager.js";
import {
    createCube, createSphere, createCone,
    createCylinder, createDodecahedron, createCapsule,
    createTours
} from "./generateObject.js";


// Worldオブジェクトの作成
const world = new World();

// コンポーネントの登録
world
    .registerComponent(Scene)
    .registerComponent(Camera)
    .registerComponent(Renderer)

    .registerComponent(Mesh)
    .registerComponent(Group)

    .registerComponent(Position)
    .registerComponent(Rotation)
    .registerComponent(Scale)

    .registerComponent(UIControllable)
    .registerComponent(Visualizer);

// システムの登録
// 登録の順番で実行される
world
    .registerSystem(RenderingSystem)
    .registerSystem(TransformSystem)
    .registerSystem(EntityManagementSystem)
    .registerSystem(VisualizerSystem);

// Sceneオブジェクトの作成
const scene = new THREE.Scene();

// Cameraオブジェクトの作成
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 5;

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

// 光源を作成
const light = new THREE.DirectionalLight(0xFFFFFF);
scene.add(light);

const helper = new THREE.DirectionalLightHelper(light, 5);
scene.add(helper);

// エンティティを作成し、Scene、Camera、Rendererコンポーネントを追加
const sceneEntity = world.createEntity()
    .addComponent(Scene, { scene: scene, fog: new THREE.Fog(0x000000, 50, 2000) })
    .addComponent(Camera, { camera: camera })
    .addComponent(Renderer, {
        renderer: renderer,
        clearColor: "#111111",
        pixelRatio: window.devicePixelRatio,
        size: { width: window.innerWidth, height: window.innerHeight }
    })
    .addComponent(UIControllable);

// 利用可能なオブジェクトのリスト
// MeshとGroupで処理を分けるためにtypeキーを作成した方が良いかもしれない
// type: "mesh" type: group:みたいな感じ
const availableObjects = [
    { name: "Cube", createFunction: createCube },
    { name: "Sphere", createFunction: createSphere },
    { name: "Cone", createFunction: createCone },
    { name: "Cylinder", createFunction: createCylinder },
    { name: "Dodecahedron", createFunction: createDodecahedron },
    { name: "Capsule", createFunction: createCapsule },
    { name: "Tours", createFunction: createTours },
]

// UIを追加
const selectorContainer = document.querySelector("#objectSelector");
availableObjects.forEach(object => {
    const option = document.createElement("option");
    option.text = object.name;
    option.value = object.name;
    selectorContainer.appendChild(option);
});

const addObjectButton = document.querySelector("#addObjectButton");
addObjectButton.addEventListener("click", () => {
    const selectedObjectName = selectorContainer.value;

    // 選択された要素のエンティティを生成する
    availableObjects.forEach(object => {
        if (object.name === selectedObjectName) {
            const entity = world.createEntity()
                .addComponent(Mesh, { value: object.createFunction() })
                .addComponent(Position, { x: (Math.random() * 10) - 5, y: Math.random() * 5, z: (Math.random() * 10) - 5 })
                .addComponent(Rotation, { x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2 })
                .addComponent(Scale, { x: 1, y: 1, z: 1 })
                .addComponent(UIControllable)
                .addComponent(Visualizer);
            console.log(sceneEntity.getComponent(Scene).scene);
            sceneEntity.getComponent(Scene).scene.add(entity.getComponent(Mesh).value);
        }
    })
})

// 利用可能なオブジェクトのリスト
const newAvaiableObjects = [
    { name: "Mesh", type: "Mesh", createFunction: createCube },
    { name: "Floor", type: "Floor", createFunction: null },
    { name: "Group", type: "Group", createFunction: null },
    { name: "Path", type: "Path", createFunction: null },
    { name: "Light", type: "Light", createFunction: null },
]

// 利用可能なオブジェクトを選択可能にする
const newSelectorContainer = document.querySelector("#newObjectSelector");
newAvaiableObjects.forEach(object => {
    const option = document.createElement("option");
    option.text = object.name;
    option.value = object.name;
    newSelectorContainer.appendChild(option);
})

// ボタン押下時にエンティティをワールドに追加する
const newAddObjectButton = document.querySelector("#newAddObjectButton");
newAddObjectButton.addEventListener("click", () => {
    console.log("click");
    // 選択しているオブジェクトを取得
    const selectedObjectName = newSelectorContainer.value;

    newAvaiableObjects.forEach(object => {
        if (object.name === selectedObjectName) {
            switch (object.type) {
                case "Mesh": addMeshEntity(object.createFunction); break;
                case "Group": addGroupEntity(object.createFunction); break;
                case "Floor": addFloorEntity(object.createFunction); break;
                case "Path": addPathEntity(object.createFunction); break;
                case "Light": addLightEntity(object.createFunction); break;
            }
        }
    })
})

const addMeshEntity = (func) => {
    const entity = world.createEntity()
        .addComponent(Mesh, { value: func() })
        .addComponent(Position, { x: (Math.random() * 10) - 5, y: Math.random() * 5, z: (Math.random() * 10) - 5 })
        .addComponent(Rotation, { x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2 })
        .addComponent(Scale, { x: 1, y: 1, z: 1 })
        .addComponent(UIControllable)
        .addComponent(Visualizer)
    sceneEntity.getComponent(Scene).scene.add(entity.getComponent(Mesh).value);
}

const addGroupEntity = (func) => {
    const entity = world.createEntity()
        .addComponent(Group, { value: new THREE.Group() })
        .addComponent(Position, { x: (Math.random() * 10) - 5, y: Math.random() * 5, z: (Math.random() * 10) - 5 })
        .addComponent(Rotation, { x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2 })
        .addComponent(Scale, { x: 1, y: 1, z: 1 })
        .addComponent(UIControllable)
    sceneEntity.getComponent(Scene).scene.add(entity.getComponent(Group).value);
}

const addFloorEntity = (func) => {

}

const addPathEntity = (func) => {

}

const addLightEntity = (func) => {

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
