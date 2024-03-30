// Threeモジュールをインポートする
import * as THREE from "three";

// ecsyのSystemをインポートする
import { System } from "ecsy";

// RectAreaLightの視覚化
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

// ecsyのComponentをインポートする
import {
    Scene,
    Camera,
    Renderer,
    Light,
    Object3D,
    Mesh,
    Group,
    Position,
    Rotation,
    Scale,
    UIControllable,
    Visualizer,
    CircleSpectrum,
    LineSpectrum,
    RotationAnimation
} from "../components/components.js";

// lil-guiをインポートする
import GUI from "lil-gui";

export default class UISystem extends System {
    init() {
        // lil-guiインスタンスが格納される
        this.gui = null;
        // エンティティのリスト
        this.select = document.querySelector("#entitySelector");

        // セレクトが変更されたときにUIを更新する
        this.select.addEventListener("change", (event) => {
            // GUIをリセット
            if (this.gui) {
                this.gui.destroy();
                this.gui = null;
            }
            this.gui = new GUI();
            this.queries.entities.results.forEach(entity => {
                // 選択されているエンティティのID
                const selectedID = parseInt(event.target.value);
                // エンティティが持つコンポーネントごとに処理を分岐させる
                if (entity.id === selectedID) {
                    // // エンティティがSceneコンポーネントを持つか
                    if (entity.hasComponent(Scene)) {
                        this.setSceneUI(entity);
                    }

                    // エンティティがCameraコンポーネントを持つか
                    if (entity.hasComponent(Camera)) {
                        this.setCameraUI(entity);
                    }

                    // エンティティがRendererコンポーネントを持つか
                    if (entity.hasComponent(Renderer)) {
                        this.setRendererUI(entity);
                    }

                    // エンティティがLightコンポーネントを持つか
                    if (entity.hasComponent(Light)) {
                        this.setLightUI(entity);
                    }

                    // エンティティがMeshコンポーネントを持つか
                    if (entity.hasComponent(Mesh)) {
                        this.setMeshUI(entity);
                    }

                    // エンティティがGroupコンポーネントを持つか
                    if (entity.hasComponent(Group)) {
                        this.setGroupUI(entity);
                    }

                    // エンティティがPositionコンポーネントを持つか
                    if (entity.hasComponent(Position)) {
                        this.setPositionUI(entity);
                    }

                    // エンティティがRotationコンポーネントを持つか
                    if (entity.hasComponent(Rotation)) {
                        this.setRotationUI(entity);
                    }

                    // エンティティがScaleコンポーネントを持つか
                    if (entity.hasComponent(Scale)) {
                        this.setScaleUI(entity);
                    }

                    // エンティティがVisualizerコンポーネントを持つか
                    if (entity.hasComponent(Visualizer)) {
                        // ここに処理を記述
                    }

                    // エンティティがCircleSpectrumコンポーネントを持つか
                    if (entity.hasComponent(CircleSpectrum)) {
                        //
                    }

                    // エンティティがLineSpectrumコンポーネントを持つか
                    if (entity.hasComponent(LineSpectrum)) {
                        this.setLineSpectrumUI(entity);
                        // console.log(entity.getComponent(Object3D));
                    }
                }
            })
        });
    };

    execute(delta, time) {
        // エンティティのリストを更新する
        this.queries.entities.added.forEach(entity => {
            this.updateEntityList(entity);
        })
    }

    // エンティティのリストを更新する
    // optionを追加し、エンティティを選択できるようにする
    updateEntityList(entity) {
        const option = document.createElement("option");
        if (entity.hasComponent(Scene)) {
            option.text = `Scene ${entity.id}`;
        } else if (entity.hasComponent(Mesh)) {
            option.text = `Mesh ${entity.id}`;
        } else if (entity.hasComponent(Group)) {
            option.text = `Group ${entity.id}`;
        } else if (entity.hasComponent(Light)) {
            option.text = `Light ${entity.id}`;
        } else if (entity.hasComponent(LineSpectrum)) {
            option.text = `LineSpectrum ${entity.id}`;
        } else {
            option.text = `updateEntityList()に定義されていないEntity ${entity.id}`
        }
        option.value = entity.id;
        this.select.appendChild(option);
    }

    // シーンを編集するUIを生成する
    setSceneUI(entity) {
        // ここに処理を記述する
        const sceneComponent = entity.getComponent(Scene);

        const fogColor = sceneComponent.scene.fog.color;
        const fogNear = sceneComponent.scene.fog.near;
        const fogFar = sceneComponent.scene.fog.far;

        this.gui.add({ fogNear: fogNear }, "fogNear").onChange((value) => {
            entity.getMutableComponent(Scene).fog = new THREE.Fog(fogColor, value, fogFar);
        })
        this.gui.add({ fogFar: fogFar }, "fogFar").onChange((value) => {
            entity.getMutableComponent(Scene).fog = new THREE.Fog(fogColor, fogNear, value);
        })
    }

    // カメラを編集するUIを生成する
    setCameraUI(entity) {
        // const cameraComponent = entity.getComponent(Camera);
        // const camera = cameraComponent.camera;
        // const { fov, near, far } = camera;

        // // カメラフォルダの作成
        // const cameraFolder = this.gui.addFolder("camera");
        // const obj = { fov: fov, near: near, far: far }

        // cameraFolder.add(obj, "fov", 1, 100, 5) //min max step
        //     .onChange(newValue => entity.getMutableComponent(Camera).fov = newValue)
        // cameraFolder.add(obj, "near", 1, 10, 1) //min max step
        //     .onChange(newValue => entity.getMutableComponent(Camera).near = newValue)
        // cameraFolder.add(obj, "far", 1000, 2000, 100)// min max step
        //     .onChange(newValue => entity.getMutableComponent(Camera).far = newValue)
    }

    // レンダラーを編集するUIを生成する
    setRendererUI(entity) {
        const rendererComponent = entity.getComponent(Renderer);
        const clearColor = rendererComponent.clearColor;

        // 背景色を調整するUI
        this.gui
            .addColor({ clearColor: clearColor }, "clearColor")
            .onChange(newValue => entity.getMutableComponent(Renderer).clearColor = newValue);
    }

    // ライトを編集するUIを生成する
    setLightUI(entity) {
        const lightGroup = entity.getMutableComponent(Object3D).value;
        const lightFolder = this.gui.addFolder("light");
        let helperFolder = null;
        let currentHelper = null;

        // ライト変更UIの表示
        const lightObj = {
            ambient: () => new THREE.AmbientLight(0x404040),
            directional: () => new THREE.DirectionalLight(0xffffff, 0.5),
            hemisphere: () => new THREE.HemisphereLight(0xffffbb, 0x080820, 1),
            point: () => new THREE.PointLight(0xff0000, 1, 100),
            rect: () => new THREE.RectAreaLight(0xffffff, 1, 10, 10),
            spot: () => new THREE.SpotLight(0xffffff)
        }

        lightFolder.add(lightObj, "ambient", lightObj).name("type").onChange((func) => {
            // 既存のヘルパーを削除
            if (currentHelper) {
                lightGroup.remove(currentHelper);
                currentHelper = null;
            }

            // 既存のヘルパーフォルダを削除
            if (helperFolder) {
                helperFolder.destroy();
                helperFolder = null;
            }

            // ライトの型を変更する
            const newLight = func();
            lightGroup.children[0] = newLight;

            // 型に対応するヘルパーを設定する
            const lightType = newLight.type;
            switch (lightType) {
                case "DirectionalLight":
                    currentHelper = new THREE.DirectionalLightHelper(newLight, 5);
                    break;
                case "HemisphereLight":
                    currentHelper = new THREE.HemisphereLightHelper(newLight, 5);
                    break;
                // 他のヘルパーの追加処理
                case "PointLight":
                    currentHelper = new THREE.PointLightHelper(newLight, 5);
                    break;
                case "RectAreaLight":
                    currentHelper = new RectAreaLightHelper(newLight, 5);
                    break;
                case "SpotLight":
                    currentHelper = new THREE.SpotLightHelper(newLight, 5);
                    break;
            }

            // ヘルパーが存在する場合の処理
            if (currentHelper) {
                lightGroup.add(currentHelper);
                const visible = currentHelper.visible;
                // ヘルパーの表示・非表示を切り替えるUI
                helperFolder = lightFolder.addFolder("helper");
                helperFolder.add({ helper: visible }, "helper").onChange(boolean => {
                    currentHelper.visible = boolean;
                })
            }
        })
    }

    // メッシュを編集するUIを生成する
    setMeshUI(entity) {
        const meshComponent = entity.getComponent(Object3D).value;
        // Sceneに追加することができるか試す
        // const testGeometry = new THREE.BoxGeometry(1, 1, 1);
        // const testMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        // const testMesh = new THREE.Mesh(testGeometry, testMaterial);
        // testMesh.position.set(3, 3, 3);
        // const parentScene = meshComponent.parent;
        // console.log(parentScene);
        // parentScene.add(testMesh);

        // フォルダ作成
        const meshFolder = this.gui.addFolder("mesh");

        // ジオメトリ変更UIの表示
        const geometryObj = {
            cube: () => new THREE.BoxGeometry(1, 1, 1),
            sphere: () => new THREE.SphereGeometry(0.5, 32, 32),
            cone: () => new THREE.ConeGeometry(0.5, 1.5, 32),
            cylinder: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
            dodecahedron: () => new THREE.DodecahedronGeometry(0.5, 0),
            capsule: () => new THREE.CapsuleGeometry(0.5, 1, 64, 64),
            tours: () => new THREE.TorusGeometry(0.5, 0.2, 64, 64, 6.3),
        }
        meshFolder.add(geometryObj, "cube", geometryObj).name("geometry").onChange((func) => {
            entity.getMutableComponent(Object3D).value.geometry = func();
        })

        // マテリアル変更UIの表示
        const materialObj = {
            normal: () => new THREE.MeshNormalMaterial,
            standard: () => new THREE.MeshStandardMaterial(),
            basic: () => new THREE.MeshBasicMaterial(),
            lambert: () => new THREE.MeshLambertMaterial(),
            phong: () => new THREE.MeshPhongMaterial(),
            toon: () => new THREE.MeshToonMaterial()
        }
        meshFolder.add(materialObj, "normal", materialObj).name("material").onChange((func) => {
            const meshComponent = entity.getComponent(Object3D).value;
            const wireframe = meshComponent.material.wireframe;
            const color = meshComponent.material.color;

            // マテリアルのプロパティが初期値に戻る
            const newMaterial = func();
            meshComponent.material = newMaterial;

            // 設定を復元する
            meshComponent.material.color = color;
            meshComponent.material.wireframe = wireframe;
        })

        // ワイヤーフレーム変更UIの表示
        meshFolder
            .add({ wireframe: entity.getComponent(Object3D).value.material.wireframe }, "wireframe")
            .onChange((value) => {
                entity.getComponent(Object3D).value.material.wireframe = value;
            });

        // 色変更UIの表示
        const [r, g, b] = meshComponent.material.color;
        const colorObj = {
            color: { r: r, g: g, b: b }
        }
        meshFolder.addColor(colorObj, "color").onChange((value) => {
            const { r, g, b } = value;
            entity.getComponent(Object3D).value.material.color.set(new THREE.Color(r, g, b));
        });
    }

    // グループを編集するUIを生成する
    setGroupUI(entity) {
        const groupFolder = this.gui.addFolder("group");
        groupFolder.add({ addMesh: () => this.addGroupInMesh(entity) }, "addMesh")
    }

    addGroupInMesh(entity) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        );
        mesh.rotation.set(
            Math.random() * 2,
            Math.random() * 2,
            Math.random() * 2
        )
        entity.getComponent(Object3D).value.add(mesh);
    }

    // ポジションを編集するUIを生成する
    setPositionUI(entity) {
        const { x, y, z } = entity.getComponent(Position);
        const positionFolder = this.gui.addFolder("position");
        positionFolder
            .add({ X: x }, "X", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Position).x = newValue);
        positionFolder
            .add({ Y: y }, "Y", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Position).y = newValue);
        positionFolder
            .add({ Z: z }, "Z", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Position).z = newValue);
    }

    // ロテーションを編集するUIを生成する
    setRotationUI(entity) {
        const { x, y, z } = entity.getComponent(Rotation);

        // ロテーション調整UI
        const rotationFolder = this.gui.addFolder("rotation");
        rotationFolder
            .add({ X: x }, "X", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Rotation).x = newValue);
        rotationFolder
            .add({ Y: y }, "Y", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Rotation).y = newValue);
        rotationFolder
            .add({ Z: z }, "Z", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Rotation).z = newValue);


        let rotationAnimationFolder = null;
        // ロテーションアニメーションUI
        rotationFolder.add({ rotationAnimation: false }, "rotationAnimation").onChange(boolean => {
            if (boolean) {
                entity.addComponent(RotationAnimation);
                const { speedX, speedY, speedZ } = entity.getComponent(RotationAnimation);
                rotationAnimationFolder = rotationFolder.addFolder("rotationAnimation");
                rotationAnimationFolder
                    .add({ speedX: speedX }, "speedX", 0, 0.1, 0.0001)
                    .onChange(newValue => entity.getMutableComponent(RotationAnimation).speedX = newValue);
                rotationAnimationFolder
                    .add({ speedY: speedY }, "speedY", 0, 0.1, 0.0001)
                    .onChange(newValue => entity.getMutableComponent(RotationAnimation).speedY = newValue);
                rotationAnimationFolder
                    .add({ speedZ: speedZ }, "speedZ", 0, 0.1, 0.0001)
                    .onChange(newValue => entity.getMutableComponent(RotationAnimation).speedZ = newValue);
            } else {
                entity.removeComponent(RotationAnimation);
                if (rotationAnimationFolder) {
                    rotationAnimationFolder.destroy();
                }
            }
        })
    }

    // スケールを編集するUIを生成する
    setScaleUI(entity) {
        const { x, y, z } = entity.getComponent(Scale);
        const scaleFolder = this.gui.addFolder("scale");
        scaleFolder
            .add({ X: x }, "X", -5, 5)
            .onChange(newValue => entity.getMutableComponent(Scale).x = newValue);
        scaleFolder
            .add({ Y: y }, "Y", -5, 5)
            .onChange((newValue) => entity.getMutableComponent(Scale).y = newValue);
        scaleFolder
            .add({ Z: z }, "Z", -5, 5)
            .onChange((newValue) => entity.getMutableComponent(Scale).z = newValue);
    }

    // setLineSpectrumUI
    setLineSpectrumUI(entity) {
        const currentColor = entity.getComponent(LineSpectrum).color;
        const [r, g, b] = currentColor;
        const colorObj = {
            color: { r, g, b }
        }
        const lineSpectrumFolder = this.gui.addFolder("LineSpectrum");
        lineSpectrumFolder.addColor(colorObj, "color").onChange((nextColor) => {
            const { r, g, b } = nextColor;
            entity.getMutableComponent(LineSpectrum).color = new THREE.Color(r, g, b);
        })
    }
}

// UIControllableが付与されているエンティティのみ処理する
UISystem.queries = {
    entities: {
        components: [UIControllable],
        listen: {
            added: true
        }
    }
};
