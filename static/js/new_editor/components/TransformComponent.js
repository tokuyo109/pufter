import { Vector3 } from 'three';

export default class TransformComponent {
  constructor(position = new Vector3(), rotation = new Vector3(), scale = new Vector3(1, 1, 1)) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
}
