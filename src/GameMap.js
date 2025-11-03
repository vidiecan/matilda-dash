export class GameMap {
  constructor(width, height, blockSize = 32) {
    this.width = width;
    this.height = height;
    this.blockSize = blockSize;
    this.cols = Math.floor(width / blockSize);
    this.rows = Math.floor(height / blockSize);
    this.tiles = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(0));
    this.startPos = { x: 2, y: 10 };
    this.endPos = { x: this.cols - 3, y: 10 };
  }

  isSolid(col, row) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
      return true;
    }
    return this.tiles[row][col] > 0;
  }

  getTile(col, row) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
      return 0;
    }
    return this.tiles[row][col];
  }

  setTile(col, row, value) {
    if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
      this.tiles[row][col] = value;
    }
  }

  getTileType(value) {
    switch (value) {
      case 1:
        return 'grass';
      case 2:
        return 'dirt';
      case 3:
        return 'stone';
      default:
        return null;
    }
  }

  render(ctx, assets, cameraX = 0, cameraY = 0) {
    // Render background
    if (assets.images.background) {
      ctx.drawImage(assets.images.background, 0, 0, ctx.canvas.width, ctx.canvas.height);
    } else {
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Render tiles
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const tile = this.tiles[row][col];
        if (tile > 0) {
          const x = col * this.blockSize - cameraX;
          const y = row * this.blockSize - cameraY;

          const tileType = this.getTileType(tile);
          const img = assets.images[`block_${tileType}`];

          if (img) {
            ctx.drawImage(img, Math.round(x), Math.round(y), this.blockSize, this.blockSize);
          } else {
            ctx.fillStyle = tile === 1 ? '#7CFC00' : tile === 2 ? '#8B4513' : '#808080';
            ctx.fillRect(Math.round(x), Math.round(y), this.blockSize, this.blockSize);
          }
        }
      }
    }

    // Render start marker
    const startX = this.startPos.x * this.blockSize - cameraX;
    const startY = this.startPos.y * this.blockSize - cameraY - this.blockSize;
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(startX, startY, this.blockSize, 8);
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText('START', startX + 2, startY + 6);

    // Render end marker
    const endX = this.endPos.x * this.blockSize - cameraX;
    const endY = this.endPos.y * this.blockSize - cameraY - this.blockSize;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(endX, endY, this.blockSize, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('END', endX + 6, endY + 6);
  }

  loadDefaultMap() {
    // Ground
    for (let col = 0; col < this.cols; col++) {
      this.tiles[this.rows - 1][col] = 1; // Grass
      this.tiles[this.rows - 2][col] = 2; // Dirt
    }

    // Platforms
    for (let col = 5; col < 10; col++) {
      this.tiles[12][col] = 1;
    }

    for (let col = 12; col < 18; col++) {
      this.tiles[10][col] = 1;
    }

    for (let col = 20; col < 25; col++) {
      this.tiles[8][col] = 1;
    }

    // Obstacles
    for (let row = 11; row < 15; row++) {
      this.tiles[row][15] = 3; // Wall
    }

    // Final platform
    for (let col = this.cols - 6; col < this.cols - 1; col++) {
      this.tiles[11][col] = 1;
    }
  }

  toJSON() {
    return {
      width: this.width,
      height: this.height,
      blockSize: this.blockSize,
      tiles: this.tiles,
      startPos: this.startPos,
      endPos: this.endPos,
    };
  }

  fromJSON(data) {
    this.width = data.width;
    this.height = data.height;
    this.blockSize = data.blockSize;
    this.tiles = data.tiles;
    this.startPos = data.startPos;
    this.endPos = data.endPos;
    this.cols = Math.floor(this.width / this.blockSize);
    this.rows = Math.floor(this.height / this.blockSize);
  }

  clear() {
    this.tiles = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(0));
  }
}
