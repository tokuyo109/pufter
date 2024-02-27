import * as THREE from "three";

// 立方体を生成する関数
export const createCube = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true, wireframe: true, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// 球体を生成する関数
export const createSphere = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true, wireframe: true, wireframe: true, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// コーン型を生成する関数
export const createCone = () => {
    const geometry = new THREE.ConeGeometry(0.5, 1.5, 32);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true, wireframe: true, wireframe: true, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// 筒型を生成する関数
export const createCylinder = () => {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true, wireframe: true, wireframe: true, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// 十二面体を生成する関数
export const createDodecahedron = () => {
    const geometry = new THREE.DodecahedronGeometry(0.5, 0);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true, wireframe: true, wireframe: true, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// カプセル型を生成する関数
export const createCapsule = () => {
    const geometry = new THREE.CapsuleGeometry(0.5, 1, 64, 64);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true, wireframe: true, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// ドーナツ型を生成する関数
export const createTours = () => {
    const geometry = new THREE.TorusGeometry(0.5, 0.2, 64, 64, 6.3);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true, wireframe: true, wireframe: true });
    return new THREE.Mesh(geometry, material);
}
