import { Player } from './Player.js';
import { GameMap } from './GameMap.js';
import { InputHandler } from './InputHandler.js';

export class Game {
  constructor(canvas, assets) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.assets = assets;
    this.input = new InputHandler();
    this.map = new GameMap(800, 600, 32);
    this.map.loadDefaultMap();
    this.player = new Player(
      this.map.startPos.x * this.map.blockSize,
      this.map.startPos.y * this.map.blockSize - 32
    );
    this.running = false;
    this.animationId = null;
    this.won = false;
  }

  start() {
    this.running = true;
    this.won = false;
    this.player.reset(
      this.map.startPos.x * this.map.blockSize,
      this.map.startPos.y * this.map.blockSize - 32
    );
    this.gameLoop();
  }

  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  gameLoop() {
    if (!this.running) return;

    this.update();
    this.render();

    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    if (this.won) return;

    this.player.update(this.input, this.map);

    // Check win condition
    const playerCenterX = this.player.x + this.player.width / 2;
    const playerCenterY = this.player.y + this.player.height / 2;
    const endX = this.map.endPos.x * this.map.blockSize;
    const endY = this.map.endPos.y * this.map.blockSize;

    if (
      playerCenterX > endX &&
      playerCenterX < endX + this.map.blockSize &&
      playerCenterY > endY - this.map.blockSize &&
      playerCenterY < endY
    ) {
      this.won = true;
    }

    // Check fall off map
    if (this.player.y > this.canvas.height) {
      this.player.reset(
        this.map.startPos.x * this.map.blockSize,
        this.map.startPos.y * this.map.blockSize - 32
      );
    }
  }

  render() {
    // Simple camera following player
    const cameraX = Math.max(
      0,
      Math.min(
        this.player.x - this.canvas.width / 2 + this.player.width / 2,
        this.map.width - this.canvas.width
      )
    );

    this.map.render(this.ctx, this.assets, cameraX, 0);

    // Render player with camera offset
    this.ctx.save();
    this.ctx.translate(-cameraX, 0);
    this.player.render(this.ctx, this.assets);
    this.ctx.restore();

    // Win message
    if (this.won) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#FFD700';
      this.ctx.font = 'bold 48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('YOU WIN!', this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.font = '24px Arial';
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillText(
        'Press Menu to continue',
        this.canvas.width / 2,
        this.canvas.height / 2 + 50
      );
    }
  }

  loadCustomMap(mapData) {
    this.map.fromJSON(mapData);
    this.player.reset(
      this.map.startPos.x * this.map.blockSize,
      this.map.startPos.y * this.map.blockSize - 32
    );
  }
}
