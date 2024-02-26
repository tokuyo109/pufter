// コンポーネントを監視し、更新するシステム

import * as THREE from 'three';

export default class RenderingSystem {
    constructor(scene) {
        this.scene = scene;
    }

    update(entities) {
        entities.forEach(entity => {
            // Meshの作成処理
            if (entity.hasComponent("geometry") && entity.hasComponent("material") && !entity.hasComponent("mesh")) {
                // Meshの作成
                entity.addComponent("mesh", new THREE.Mesh(
                    entity.getComponent("geometry").geometry,
                    entity.getComponent("material").material
                ));

                // 親エンティティが存在する場合
                if (entity.hasComponent("parentReference")) {
                    const parentEntity = entities.find(
                        e => e.id === entity.getComponent("parentReference").parentReference
                    );
                    parentEntity.getComponent("group").group.add(entity.getComponent("mesh"));
                } else {
                    this.scene.add(entity.getComponent("mesh"));
                }
            }
            // groupをsceneに追加する
            if (entity.hasComponent("group")) {
                this.scene.add(entity.getComponent("group").group);
            }

            // Transformの更新
            if (entity.hasComponent("mesh") && entity.hasComponent("transform")) {
                const { position, rotation, scale } = entity.getComponent("transform");
                const mesh = entity.getComponent("mesh");

                mesh.position.set(position.x, position.y, position.z);
                mesh.rotation.set(rotation.x, rotation.y, rotation.z);
                mesh.scale.set(scale.x, scale.y, scale.z);
            }
            // グループが存在するとき
            if (entity.hasComponent("group") && entity.hasComponent("transform")) {
                const { position, rotation, scale } = entity.getComponent("transform");
                const group = entity.getComponent("group").group;

                group.position.set(position.x, position.y, position.z);
                group.rotation.set(rotation.x, rotation.y, rotation.z);
                group.scale.set(scale.x, scale.y, scale.z);
            }
        })
    }

    // update(entities) {
    //     entities.forEach(entity => {
    //         // Meshの作成と条件に応じた処理
    //         if (entity.components.geometry && entity.components.material && !entity.components.mesh) {
    //             // Meshの作成
    //             entity.components.mesh = new THREE.Mesh(entity.components.geometry.geometry, entity.components.material.material);

    //             // 親がなければシーンに直接追加、あれば親のgroupに追加
    //             if (entity.components.parent) {
    //                 // 親エンティティを見つける
    //                 const parentEntity = entities.find(e => e.id === entity.components.parent);
    //                 if (parentEntity && !parentEntity.components.group) {
    //                     // 親エンティティにGroupがなければ作成してシーンに追加
    //                     parentEntity.components.group = new THREE.Group();
    //                     this.scene.add(parentEntity.components.group);
    //                 }
    //                 // 親のGroupにMeshを追加
    //                 if (parentEntity.components.group) {
    //                     parentEntity.components.group.add(entity.components.mesh);
    //                 }
    //             } else {
    //                 // 親がいない場合はシーンにMeshを直接追加
    //                 this.scene.add(entity.components.mesh);
    //             }
    //         }

    //         // Transformの更新
    //         if (entity.components.mesh && entity.components.transform) {
    //             const { position, rotation, scale } = entity.components.transform;
    //             // Positionの更新
    //             entity.components.mesh.position.set(position.x, position.y, position.z);
    //             // Rotationの更新
    //             entity.components.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    //             // Scaleの更新
    //             entity.components.mesh.scale.set(scale.x, scale.y, scale.z);
    //         }

    //         // GroupのTransformを更新
    //         if (entity.components.group && entity.components.transform) {
    //             const { position, rotation, scale } = entity.components.transform;
    //             // Positionの更新
    //             entity.components.group.position.set(position.x, position.y, position.z);
    //             // Rotationの更新
    //             entity.components.group.rotation.set(rotation.x, rotation.y, rotation.z);
    //             // Scaleの更新
    //             entity.components.group.scale.set(scale.x, scale.y, scale.z);
    //         }
    //     });
    // }

    // update(entities) {
    //     entities.forEach(entity => {
    //         if (
    //             entity.components.geometry &&
    //             entity.components.material &&
    //             !entity.components.mesh
    //         ) {
    //             // meshの作成と追加
    //             entity.components.mesh = new THREE.Mesh(entity.components.geometry.geometry, entity.components.material.material);
    //             this.scene.add(entity.components.mesh);
    //         }

    //         if (
    //             entity.components.mesh &&
    //             entity.components.transform
    //         ) {
    //             // position(位置)の更新
    //             entity.components.mesh.position.copy(entity.components.transform.position);

    //             // rotation(回転)の更新
    //             entity.components.mesh.rotation.set(
    //                 entity.components.transform.rotation.x,
    //                 entity.components.transform.rotation.y,
    //                 entity.components.transform.rotation.z
    //             );

    //             // scale(大きさ)の更新
    //             entity.components.mesh.scale.copy(entity.components.transform.scale);
    //         }

    //         // ParentComponentがある場合、子エンティティを処理
    //         if (entity.components.parent) {
    //             console.log(entity);
    //             if (!entity.components.group) {
    //                 entity.components.group = new THREE.Group(); // Groupコンポーネントがなければ作成
    //                 this.scene.add(entity.components.group); // シーンにGroupを追加
    //             }

    //             entity.components.parent.children.forEach(childId => {
    //                 const childEntity = entities.find(e => e.id === childId);
    //                 if (childEntity && childEntity.components.mesh) {
    //                     entity.components.group.add(childEntity.components.mesh); // Groupに子Meshを追加
    //                 }
    //             });

    //             if (entity.components.transform && entity.components.group) {
    //                 // position(位置)の更新
    //                 entity.components.group.position.copy(entity.components.transform.position);

    //                 // rotation(回転)の更新
    //                 entity.components.group.rotation.set(
    //                     entity.components.transform.rotation.x,
    //                     entity.components.transform.rotation.y,
    //                     entity.components.transform.rotation.z
    //                 );

    //                 // scale(大きさ)の更新
    //                 entity.components.group.scale.copy(entity.components.transform.scale);
    //             }
    //         }
    //     });
    // }
}
