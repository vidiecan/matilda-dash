const FRAME_SIZE = 32;
const WALK_CADENCE = 6;
const IDLE_CADENCE = 18;
const ANIM_FRAMES = 4;
const MAX_FALL_SPEED = 14;

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = FRAME_SIZE;
    this.height = FRAME_SIZE;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 3;
    this.jumpPower = 12;
    this.gravity = 0.5;
    this.onGround = false;
    this.direction = 'right';
    this.state = 'idle';
    this.animationFrame = 0;
    this.animationTimer = 0;
  }

  update(input, map) {
    const wantLeft = input.isLeft();
    const wantRight = input.isRight();

    this.velocityX = 0;
    if (wantLeft && !wantRight) {
      this.velocityX = -this.speed;
      this.direction = 'left';
    } else if (wantRight && !wantLeft) {
      this.velocityX = this.speed;
      this.direction = 'right';
    }

    if (input.isJump() && this.onGround) {
      this.velocityY = -this.jumpPower;
      this.onGround = false;
    }

    if (!this.onGround) {
      this.velocityY = Math.min(this.velocityY + this.gravity, MAX_FALL_SPEED);
    }

    this.x += this.velocityX;
    this.checkCollisionX(map);

    this.y += this.velocityY;
    this.checkCollisionY(map);

    if (!this.onGround) {
      this.state = 'jump';
    } else if (this.velocityX !== 0) {
      this.state = 'walk';
    } else {
      this.state = 'idle';
    }

    this.advanceAnimation();
  }

  advanceAnimation() {
    if (this.state === 'jump') {
      this.animationTimer = 0;
      this.animationFrame = 0;
      return;
    }
    const cadence = this.state === 'walk' ? WALK_CADENCE : IDLE_CADENCE;
    this.animationTimer += 1;
    if (this.animationTimer >= cadence) {
      this.animationFrame = (this.animationFrame + 1) % ANIM_FRAMES;
      this.animationTimer = 0;
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
            this.velocityY = 0;
            this.onGround = true;
            return;
          } else if (this.velocityY < 0) {
            this.y = (row + 1) * blockSize;
            this.velocityY = 0;
          }
        }
      }
    }

    // Floor probe: stay grounded when standing on a block edge. Snap to the
    // tile top and clear vertical speed so a sub-pixel penetration the main
    // sweep missed doesn't keep applying stale downward velocity next tick.
    const probeRow = Math.floor((this.y + this.height) / blockSize);
    for (let col = left; col <= right; col++) {
      if (map.isSolid(col, probeRow)) {
        this.y = probeRow * blockSize - this.height;
        if (this.velocityY > 0) this.velocityY = 0;
        this.onGround = true;
        break;
      }
    }
  }

  render(ctx, assets) {
    const spriteKey = this.spriteKeyForState();
    const sprite = assets.images[spriteKey];

    if (!sprite || !sprite.width) {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(Math.round(this.x), Math.round(this.y), this.width, this.height);
      return;
    }

    const frameCount = Math.max(1, Math.round(sprite.width / sprite.height));
    const frameWidth = sprite.width / frameCount;
    const frameIndex = Math.min(this.animationFrame, frameCount - 1);
    const sx = frameIndex * frameWidth;

    let drawW = this.width;
    let drawH = this.height;
    let drawX = Math.round(this.x);
    let drawY = Math.round(this.y);
    let pitch = 0;

    if (this.state === 'jump') {
      // Squash & stretch keyed off vertical speed, capped so it never looks goofy.
      const stretch = Math.min(0.2, Math.abs(this.velocityY) * 0.014);
      drawH = Math.round(this.height * (1 + stretch));
      drawW = Math.round(this.width * (1 - stretch * 0.5));
      drawX = Math.round(this.x + (this.width - drawW) / 2);
      drawY = Math.round(this.y + (this.height - drawH));
    } else if (this.state === 'walk') {
      // Four-phase trot: contact-passing-contact-passing.
      // Body bobs up on the passing phases (legs gathered under) and dips on
      // contact phases (legs splayed). A tiny pitch sells the trotting wobble.
      const phase = this.animationFrame & 3;
      drawY += [0, -3, 0, -3][phase];
      pitch = [0.07, 0, -0.07, 0][phase];
    }

    ctx.save();
    if (this.direction === 'left') {
      ctx.translate(drawX + drawW, drawY);
      ctx.scale(-1, 1);
      if (pitch !== 0) {
        ctx.translate(drawW / 2, drawH);
        ctx.rotate(pitch);
        ctx.translate(-drawW / 2, -drawH);
      }
      ctx.drawImage(sprite, sx, 0, frameWidth, sprite.height, 0, 0, drawW, drawH);
    } else {
      if (pitch !== 0) {
        ctx.translate(drawX + drawW / 2, drawY + drawH);
        ctx.rotate(pitch);
        ctx.translate(-(drawX + drawW / 2), -(drawY + drawH));
      }
      ctx.drawImage(sprite, sx, 0, frameWidth, sprite.height, drawX, drawY, drawW, drawH);
    }
    ctx.restore();
  }

  spriteKeyForState() {
    if (this.state === 'jump') return 'matilda_jump';
    if (this.state === 'idle') return 'matilda_idle';
    return 'matilda_right';
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.onGround = false;
    this.state = 'idle';
    this.animationFrame = 0;
    this.animationTimer = 0;
  }
}
