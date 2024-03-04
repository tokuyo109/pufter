// Threeモジュールをインポートする
import * as THREE from "three";

// ecsyのSystemをインポートする
import { System } from "ecsy";

// ecsyのComponentをインポートする
import {
    Scene, Camera, Renderer,
    Light,
    Mesh, Group,
    Position, Rotation, Scale,
    UIControllable, Visualizer, CircleSpectrum,
    RotationAnimation
} from "../components/index.js";

// lil-guiをインポートする
import GUI from "lil-gui";

export default class EntityManagementSystem extends System {
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
                    // if (entity.hasComponent(Scene)) {
                    //     this.setSceneUI(entity);
                    // }

                    // エンティティがCameraコンポーネントを持つか
                    if (entity.hasComponent(Camera)) {
                        this.setCameraUI(entity);
                    }

                    // エンティティがRendererコンポーネントを持つか
                    if (entity.hasComponent(Renderer)) {
                        this.setRendererUI(entity);
                    }

                    // エンティティがLightコンポーネントを持つか


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
        } else {
            option.text = `updateEntityList()に定義されていないEntity ${entity.id}`
        }
        option.value = entity.id;
        this.select.appendChild(option);
    }

    // シーンを編集するUIを生成する
    setSceneUI(entity) {
        // ここに処理を記述する
    }

    // カメラを編集するUIを生成する
    setCameraUI(entity) {
        const cameraComponent = entity.getComponent(Camera);
        const camera = cameraComponent.camera;
        const { fov, near, far } = camera;

        // カメラフォルダの作成
        const cameraFolder = this.gui.addFolder("camera");
        const obj = { fov: fov, near: near, far: far }

        cameraFolder.add(obj, "fov", 1, 100, 5) //min max step
            .onChange(newValue => entity.getMutableComponent(Camera).fov = newValue)
        cameraFolder.add(obj, "near", 1, 10, 1) //min max step
            .onChange(newValue => entity.getMutableComponent(Camera).near = newValue)
        cameraFolder.add(obj, "far", 1000, 2000, 100)// min max step
            .onChange(newValue => entity.getMutableComponent(Camera).far = newValue)
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

    // メッシュを編集するUIを生成する
    setMeshUI(entity) {
        const meshComponent = entity.getComponent(Mesh).value;

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
            entity.getMutableComponent(Mesh).value.geometry = func();
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
            const meshComponent = entity.getComponent(Mesh).value;
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
            .add({ wireframe: entity.getComponent(Mesh).value.material.wireframe }, "wireframe")
            .onChange((value) => {
                entity.getComponent(Mesh).value.material.wireframe = value;
            });

        // 色変更UIの表示
        const [r, g, b] = meshComponent.material.color;
        const colorObj = {
            color: { r: r, g: g, b: b }
        }
        meshFolder.addColor(colorObj, "color").onChange((value) => {
            const { r, g, b } = value;
            entity.getComponent(Mesh).value.material.color.set(new THREE.Color(r, g, b));
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
        entity.getComponent(Group).value.add(mesh);
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

}

// UIControllableが付与されているエンティティのみ処理する
EntityManagementSystem.queries = {
    entities: {
        components: [UIControllable],
        listen: {
            added: true
        }
    }
};
