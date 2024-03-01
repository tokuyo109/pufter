// Threeモジュールをインポートする
import * as THREE from "three";

// ecsyのSystemをインポートする
import { System } from "ecsy";

// ecsyのComponentをインポートする
import {
    Scene, Camera, Renderer,
    Mesh, Group,
    Position, Rotation, Scale,
    UIControllable, Visualizer
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
            // lil-gui処理
            if (this.gui) {
                this.gui.destroy();
                this.gui = null;
            }
            this.gui = new GUI();
            this.queries.entities.results.forEach(entity => {
                // 選択されているエンティティのID
                const selectedID = parseInt(event.target.value);
                if (entity.id === selectedID) {

                    // エンティティが持つコンポーネントごとに処理を分岐させる
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
        // カメラのパラメータを設定するために取得
        // カメラのパラメータはeditor3/components/Camera.jsで確認できます。

        const cameraComponent = entity.getComponent(Camera);
        const camera = cameraComponent.camera
        const { fov, near, far } = camera

        console.log(cameraComponent);
        // console.log(camera);

        // 以下にカメラのUIを生成するプログラムを記述してください。
        // 実装はlil-guiを使用してください。
        // 視野角、近クリップ、遠クリップの調整ができるUIを目指してください。
        // 値の変更(onChange)があった時に、コンポーネントの値を変更する
        // 値を変更するとRenderingSystem.js(70行目あたり)がCameraの設定を反映します。       

        // カメラフォルダの作成
        const cameraFolder = this.gui.addFolder('camera');
        const obj = { fov: fov, near: near, far: far }

        cameraFolder.add(obj, 'fov', 1, 100, 5) //min max step
            .onChange(newValue => entity.getMutableComponent(Camera).fov = newValue)
        cameraFolder.add(obj, 'near', 1, 10, 1) //min max step
            .onChange(newValue => entity.getMutableComponent(Camera).near = newValue)
        cameraFolder.add(obj, 'far', 1000, 2000, 100)// min max step
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
        const materialColor = meshComponent.material.color
        console.log(meshComponent.material.color)

        // フォルダ作成
        const meshFolder = this.gui.addFolder("mesh");

        // ジオメトリ変更UIの表示
        const geometryObj = {
            cube: () => new THREE.BoxGeometry(1, 1, 1),
            sphere: () => new THREE.SphereGeometry(0.5, 32, 32)
        }

        meshFolder.add(geometryObj, "mesh", geometryObj).onChange((func) => {
            this.updateGeometry(entity, func);
        })

        // マテリアル変更UIの表示
        const materialObj = {
            Standard: () => new THREE.MeshStandardMaterial(),
            Basic: () => new THREE.MeshBasicMaterial()
        }

        meshFolder.add(materialObj, "Material", materialObj).onChange((func) => {
            const meshComponent = entity.getComponent(Mesh).value;
            // 色を保持しておく
            const materialColor = meshComponent.material.color;

            const newMaterial = func();
            // 色が初期値に戻る
            meshComponent.material = newMaterial;

            // 色を復元する
            meshComponent.material.color = materialColor;
        })

        // 色変更UIの表示
        const color = meshComponent.material.color;
        const [r, g, b] = color;
        const colorObj = {
            color: { r: r, g: g, b: b }
        }

        meshFolder.addColor(colorObj, "color").onChange((value) => {
            this.updateMeshColor(entity, value)
        });
    }

    // ジオメトリを更新する
    updateGeometry(entity, func) {
        entity.getMutableComponent(Mesh).value.geometry = func();
        // console.log(entity.getMutableComponent(Mesh).value.geometry);
    }

    // 色を更新する
    updateMeshColor(entity, value) {
        const { r, g, b } = value;
        entity.getMutableComponent(Mesh).value.material.color.set(new THREE.Color(r, g, b));
    }

    // // マテリアルを更新する
    // updateMaterial(entity, func) {
    //     const newMaterial = func();
    //     entity.getMutableComponent(Mesh).value.material = newMaterial;
    // }


    // グループを編集するUIを生成する
    setGroupUI(entity) {
        const groupFolder = this.gui.addFolder("group");
        groupFolder.add({ addMesh: () => this.addGroupInMesh(entity) }, "addMesh")
    }

    addGroupInMesh(entity) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 10 - 5;
        mesh.position.y = Math.random() * 10 - 5;
        mesh.position.z = Math.random() * 10 - 5;
        mesh.rotation.x = Math.random() * 2;
        mesh.rotation.y = Math.random() * 2;
        mesh.rotation.z = Math.random() * 2;
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
