import * as THREE from "three";
import { World } from "ecsy";
import * as Components from "./components/components.js";
import * as Systems from "./systems/index.js";
import { PlayerManager } from "./controller/PlayerManager.js";

// playerManagerを初期化する
const playerManager = new PlayerManager();
playerManager.init();

// 曲変更用
document.addEventListener('DOMContentLoaded', () => {
    // 曲を変更するためのイベントリスナー
    const changeSongButton = document.querySelector('#changeSong');
    changeSongButton.addEventListener('click', () => {
        const songUrlInput = document.querySelector('#songUrl');
        const songUrl = songUrlInput.value;
        if (songUrl) {
            playerManager.onVideoReady(playerManager.player.createFromSongUrl(songUrl));
        }
    });
});

// ワールドを初期化する
const world = new World();

// コンポーネントを登録する
const registerComponents = (world) => {
    Object.values(Components).forEach(component => world.registerComponent(component));
}

// システムを登録する
const registerSystems = (world) => {
    const options = {};
    options['playerManager'] = playerManager;
    world.registerSystem(Systems.EditorSystem, options);
    world.registerSystem(Systems.TransformSystem, options);
    world.registerSystem(Systems.RandomWalkSystem, options);
    world.registerSystem(Systems.LyricDisplayCubeSystem, options);
    world.registerSystem(Systems.EaseOutBackSystem, options);
    world.registerSystem(Systems.TypingSystem, options);
    world.registerSystem(Systems.RotationCharSystem, options);
    world.registerSystem(Systems.WaveSystem, options);
    world.registerSystem(Systems.SlideSystem, options);
    world.registerSystem(Systems.AnimationSystem, options);
    world.registerSystem(Systems.RenderingSystem, options);
    world.registerSystem(Systems.BeatColorChangeSystem, options);
    world.registerSystem(Systems.BeatScaleSizeSystem, options);
}

// シーンを作成する(新規プロジェクトの場合)
const createSceneEntity = () => {
    const sceneEntity = world.createEntity("Scene");
    const scene = new THREE.Scene();
    sceneEntity
        .addComponent(Components.Object3D, { object3D: scene, parent: null })
        .addComponent(Components.Scene)
        .addComponent(Components.UI)
        .addComponent(Components.Export)
        ;
    return scene;
}

// レンダラーを作成する(新規プロジェクトの場合)
const createRendererEntity = () => {
    const rendererEntity = world.createEntity("Renderer");
    rendererEntity
        .addComponent(Components.Renderer, {
            renderer: null,
            clearColor: 0xffffff,
            antialias: true
        })
        .addComponent(Components.UI)
        .addComponent(Components.Export)
        ;
}

// カメラを作成する(新規プロジェクトの場合)
const createCameraEntity = () => {
    const cameraEntity = world.createEntity("Camera");
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    cameraEntity
        .addComponent(Components.Object3D, { object3D: camera, parent: null })
        .addComponent(Components.Position, { x: 0, y: 10, z: 5 })
        .addComponent(Components.Rotation, { x: 0, y: 0, z: 0 })
        .addComponent(Components.Scale, { x: 1, y: 1, z: 1 })
        .addComponent(Components.UI)
        .addComponent(Components.Camera)
        .addComponent(Components.Export)
        ;
}

// メッシュを作成する(新規プロジェクトの場合)
const createMeshEntity = (scene) => {
    const meshEntity = world.createEntity("Mesh1");
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )
    meshEntity
        .addComponent(Components.Object3D, { object3D: mesh, parent: scene })
        .addComponent(Components.Position, { x: 0, y: 0, z: 0 })
        .addComponent(Components.Rotation, { x: 0, y: 0, z: 0 })
        .addComponent(Components.Scale, { x: 1, y: 1, z: 1 })
        .addComponent(Components.UI)
        .addComponent(Components.Export)
        ;
}

// 新規プロジェクトの場合、初期化を行う
const initializeNewProject = () => {
    const scene = createSceneEntity();
    createRendererEntity();
    createCameraEntity();
    createMeshEntity(scene);
}

// オブジェクトを検索する
const findObject3D = (rootObject, object) => {
    if (object.isCamera) return object;
    if (rootObject.uuid === object.uuid) {
        return rootObject;
    }
    for (let child of rootObject.children) {
        let found = findObject3D(child, object);
        if (found) return found;
    }
    return null;
};

// プロジェクトデータを初期化する
const initializeProject = (data) => {
    const loader = new THREE.ObjectLoader();
    let scene = null;

    // 新規プロジェクトの場合、初期化を行う
    if (!data.entities) {
        initializeNewProject();
        return;
    }

    // JSONデータを読み込み、エンティティを作成する
    data.entities.forEach(entity => {
        const newEntity = world.createEntity(entity.name);
        Object.entries(entity.components).forEach(([key, value]) => { // key: Component, value: Component.schema
            const component = Components[key]; // Component
            const props = {}; // Componentのプロパティ
            switch (key) {
                case "Renderer":
                    props.renderer = null;
                    props.clearColor = value.clearColor;
                    props.antialias = value.antialias;
                    break;

                case "Object3D":
                    const object = loader.parse(value.object3D);
                    if (object.isScene) {
                        scene = object;
                    }
                    props.object3D = findObject3D(scene, object);

                    const hasParent = value.parent ? true : false;
                    if (hasParent) {
                        const parent = loader.parse(value.parent);
                        props.parent = findObject3D(scene, parent);
                    } else {
                        props.parent = null;
                    }
                    break;
                case "Position":
                case "Rotation":
                case "Scale":
                    props.x = value.x;
                    props.y = value.y;
                    props.z = value.z
                    break;
            }
            newEntity.addComponent(component, props);
        })
    })
}

// JSONを読み込む
const importJSON = async () => {
    try {
        const response = await fetch(`/api/serve_json/${project_data["json_path"]}`);
        const data = await response.json();
        initializeProject(data);
    } catch (error) {
        console.error("プロジェクトの読み込みに失敗しました", error);
    };
}

// コンポーネント、システムを登録する
registerComponents(world);
registerSystems(world);

// JSONを読み込む
importJSON();

let lastTime = performance.now();
// 毎フレーム実行
const animate = () => {
    const time = performance.now();
    const delta = time - lastTime;

    world.execute(delta, time); // 一フレーム当たりの時間、累計時間

    lastTime = time;
    requestAnimationFrame(animate);
}

animate();
