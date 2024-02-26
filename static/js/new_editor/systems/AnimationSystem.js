export default class AnimationSystem {
  constructor(entities) {
    this.entities = entities; // システムが処理するエンティティのリスト
  }

  update(deltaTime) {
    this.entities.forEach(entity => {
      if (entity.components.positionAnimation) {
        this.applyPositionAnimation(entity, deltaTime);
      }

      if (entity.components.rotationAnimation) {
        this.applyRotationAnimation(entity, deltaTime);
      }
      // if (entity.components.glitchAnimation) {
      //   this.applyGlitchAnimation(entity, deltaTime);
      // }

      if (entity.components.circleAnimation) {
        // console.log("true");
        this.applyCircleAnimation(entity, deltaTime);
      }
    });
  }

  // 位置アニメーションを適用する
  applyPositionAnimation(entity, deltaTime) {
    const { xSpeed, ySpeed, zSpeed } = entity.components.positionAnimation;

    if (!(isNaN(deltaTime))) {
      entity.components.transform.position.x += xSpeed * deltaTime;
      entity.components.transform.position.y += ySpeed * deltaTime;
      entity.components.transform.position.z += zSpeed * deltaTime;
    }
  }

  // 回転アニメーションを適用する
  applyRotationAnimation(entity, deltaTime) {
    const { xSpeed, ySpeed, zSpeed } = entity.components.rotationAnimation;

    // deltaTimeの取得値がNaNの時があり、エラーハンドリングする必要がある。
    if (!(isNaN(deltaTime))) {
      entity.components.transform.rotation.x += xSpeed * deltaTime;
      entity.components.transform.rotation.y += ySpeed * deltaTime;
      entity.components.transform.rotation.z += zSpeed * deltaTime;
    }
  }

  // 円運動アニメーションを適用する
  applyCircleAnimation(entity, deltaTime) {
    // circleAnimationコンポーネントからパラメータを取得
    const { centerX, centerY, centerZ, radius, speed } = entity.components.circleAnimation;

    if (!(isNaN(deltaTime))) {
      // 時間経過に基づいて角度を更新（speedは角速度）
      entity.components.circleAnimation.angle += speed * deltaTime;

      // 角度が2πを超えたらリセット
      if (entity.components.circleAnimation.angle > Math.PI * 2) {
        entity.components.circleAnimation.angle -= Math.PI * 2;
      }

      // 新しい位置を計算
      const angle = entity.components.circleAnimation.angle;
      entity.components.transform.position.x = centerX + Math.cos(angle) * radius;
      entity.components.transform.position.y = centerY; // Y軸は変化させない（平面円運動の場合）
      entity.components.transform.position.z = centerZ + Math.sin(angle) * radius;
    }
  }

  // サイズアニメーションを適用する
  applyScaleAnimation(entity, deltaTime) {

  }

  // applyGlitchAnimation(entity, deltaTime) {
  //   if (Math.random() < entity.glitchAnimation.frequency * deltaTime) {
  //     // RenderSystemで更新されている場合適用がリセットされる問題がある。
  //     // console.log(entity.material.material.color);
  //     if (entity.material && entity.material.material.color) {
  //       // 元の色を保存しておく
  //       if (!entity.originalColor) {
  //         entity.originalColor = entity.material.material.color.clone();
  //       }
  //       // グリッチの強度に基づいてランダムな色を適用
  //       entity.material.material.color.setRGB(Math.random() * entity.glitchAnimation.intensity, Math.random() * entity.glitchAnimation.intensity, Math.random() * entity.glitchAnimation.intensity);

  //       // 一定時間後に元の色に戻す
  //       setTimeout(() => {
  //         if (entity.originalColor) {
  //           entity.material.material.color.copy(entity.originalColor);
  //         }
  //       }, entity.glitchAnimation.duration * 1000); // durationは秒単位なので、ミリ秒に変換
  //     }
  //   }
  // }
}
