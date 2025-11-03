export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 4;
    this.jumpPower = 12;
    this.gravity = 0.5;
    this.onGround = false;
    this.direction = 'right';
    this.state = 'idle';
    this.animationFrame = 0;
    this.animationTimer = 0;
    this.animationSpeed = 8;
  }

  update(input, map) {
    // Horizontal movement
    this.velocityX = 0;
    if (input.isLeft()) {
      this.velocityX = -this.speed;
      this.direction = 'left';
      this.state = 'walk';
    } else if (input.isRight()) {
      this.velocityX = this.speed;
      this.direction = 'right';
      this.state = 'walk';
    } else {
      this.state = 'idle';
    }

    // Jump
    if (input.isJump() && this.onGround) {
      this.velocityY = -this.jumpPower;
      this.onGround = false;
    }

    // Apply gravity
    this.velocityY += this.gravity;

    // Move horizontally
    this.x += this.velocityX;
    this.checkCollisionX(map);

    // Move vertically
    this.y += this.velocityY;
    this.checkCollisionY(map);

    // Update animation
    if (this.velocityX !== 0 || !this.onGround) {
      this.animationTimer++;
      if (this.animationTimer >= this.animationSpeed) {
        this.animationFrame = (this.animationFrame + 1) % 4;
        this.animationTimer = 0;
      }
    } else {
      this.animationFrame = 0;
    }

    if (!this.onGround) {
      this.state = 'jump';
    }
  }

  checkCollisionX(map) {
    const blockSize = map.blockSize;
    const left = Math.floor(this.x / blockSize);
    const right = Math.floor((this.x + this.width - 1) / blockSize);
    const top = Math.floor(this.y / blockSize);
    const bottom = Math.floor((this.y + this.height - 1) / blockSize);

    for (let row = top; row <= bottom; row++) {
      for (let col = left; col <= right; col++) {
        if (map.isSolid(col, row)) {
          if (this.velocityX > 0) {
            this.x = col * blockSize - this.width;
          } else if (this.velocityX < 0) {
            this.x = (col + 1) * blockSize;
          }
          this.velocityX = 0;
        }
      }
    }
  }

  checkCollisionY(map) {
    const blockSize = map.blockSize;
    const left = Math.floor(this.x / blockSize);
    const right = Math.floor((this.x + this.width - 1) / blockSize);
    const top = Math.floor(this.y / blockSize);
    const bottom = Math.floor((this.y + this.height - 1) / blockSize);

    this.onGround = false;

    for (let row = top; row <= bottom; row++) {
      for (let col = left; col <= right; col++) {
        if (map.isSolid(col, row)) {
          if (this.velocityY > 0) {
            this.y = row * blockSize - this.height;
            this.onGround = true;
          } else if (this.velocityY < 0) {
            this.y = (row + 1) * blockSize;
          }
          this.velocityY = 0;
        }
      }
    }
  }

  render(ctx, assets) {
    const spriteKey =
      this.state === 'jump'
        ? 'matilda_jump'
        : this.state === 'idle'
          ? 'matilda_idle'
          : this.direction === 'left'
            ? 'matilda_left'
            : 'matilda_right';

    const sprite = assets.images[spriteKey];
    if (sprite) {
      if ((this.state === 'walk' && spriteKey.includes('_left')) || spriteKey.includes('_right')) {
        const frameWidth = sprite.width / 4;
        ctx.drawImage(
          sprite,
          this.animationFrame * frameWidth,
          0,
          frameWidth,
          sprite.height,
          Math.round(this.x),
          Math.round(this.y),
          this.width,
          this.height
        );
      } else {
        ctx.drawImage(sprite, Math.round(this.x), Math.round(this.y), this.width, this.height);
      }
    } else {
      // Fallback rectangle
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(Math.round(this.x), Math.round(this.y), this.width, this.height);
    }
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.onGround = false;
  }
}
