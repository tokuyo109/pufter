// generateObjects.js
// オブジェクトを生成する関数群
import * as THREE from "three";

// メッシュ
// 立方体を生成する関数
export const createCube = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// 球体を生成する関数
export const createSphere = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// コーン型を生成する関数
export const createCone = () => {
    const geometry = new THREE.ConeGeometry(0.5, 1.5, 32);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// 筒型を生成する関数
export const createCylinder = () => {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// 十二面体を生成する関数
export const createDodecahedron = () => {
    const geometry = new THREE.DodecahedronGeometry(0.5, 0);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// カプセル型を生成する関数
export const createCapsule = () => {
    const geometry = new THREE.CapsuleGeometry(0.5, 1, 64, 64);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// ドーナツ型を生成する関数
export const createTours = () => {
    const geometry = new THREE.TorusGeometry(0.5, 0.2, 64, 64, 6.3);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// 床を生成する関数
export const createFloor = () => {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x808080, wireframe: false });
    return new THREE.Mesh(geometry, material)
}

// グループ
// 空のグループを生成する関数
export const createGroup = () => {
    return new THREE.Group();
}

// 円のスペクトラムを表示する
export const createCircleSpectrum = () => {
    const group = new THREE.Group();
    group.position.y = 0;
    group.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    const count = 100;

    for (let i = 0; i < count; i++) {

        if (i % 2) {
            const angle = i / count * Math.PI * 2;
            const radius = 1;
            const colors = [];
            const color1 = new THREE.Color(0x7777ff);
            const color2 = new THREE.Color(0x8888ff);

            const geometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
            geometry.translate(0, -0.25, 0);

            for (let i = 0; i < geometry.attributes.position.count; i++) {
                colors.push(...(i % 2 === 0) ? [color1.r, color1.g, color1.b] : [color2.r, color2.g, color2.b])
            }

            geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

            const material = new THREE.MeshBasicMaterial({ vertexColors: true, wireframe: true });
            const mesh = new THREE.Mesh(geometry, material);


            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            mesh.position.set(x, y, z);

            mesh.rotation.z = angle + Math.PI / 2;

            group.add(mesh);
        }
    }

    return group;
}

// 線のスペクトラムを表示する
export const createLineSpectrum = () => {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const line = new THREE.Line(geometry, material);

    return line;
}

// ライト
// THREE.Lightを返す関数
export const createLight = () => {
    const lightGroup = new THREE.Group();
    const light = new THREE.AmbientLight(0x404040); // soft white light
    lightGroup.add(light);
    return lightGroup;
    // return light;
}
