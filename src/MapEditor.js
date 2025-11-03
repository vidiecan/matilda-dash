import { GameMap } from './GameMap.js';

export class MapEditor {
  constructor(canvas, assets) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.assets = assets;
    this.map = new GameMap(800, 600, 32);
    this.selectedBlock = 1; // grass
    this.mouseDown = false;
    this.setupListeners();
  }

  setupListeners() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.mouseDown = true;
      this.handleClick(e);
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.mouseDown) {
        this.handleClick(e);
      }
    });

    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.handleRightClick(e);
    });
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / this.map.blockSize);
    const row = Math.floor(y / this.map.blockSize);

    if (this.selectedBlock === 0) {
      this.map.setTile(col, row, 0);
    } else {
      this.map.setTile(col, row, this.selectedBlock);
    }
  }

  handleRightClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / this.map.blockSize);
    const row = Math.floor(y / this.map.blockSize);

    this.map.setTile(col, row, 0);
  }

  setBlockType(type) {
    switch (type) {
      case 'grass':
        this.selectedBlock = 1;
        break;
      case 'dirt':
        this.selectedBlock = 2;
        break;
      case 'stone':
        this.selectedBlock = 3;
        break;
      case 'erase':
        this.selectedBlock = 0;
        break;
      default:
        this.selectedBlock = 1;
    }
  }

  render() {
    this.map.render(this.ctx, this.assets);

    // Draw grid
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;
    for (let col = 0; col <= this.map.cols; col++) {
      this.ctx.beginPath();
      this.ctx.moveTo(col * this.map.blockSize, 0);
      this.ctx.lineTo(col * this.map.blockSize, this.canvas.height);
      this.ctx.stroke();
    }
    for (let row = 0; row <= this.map.rows; row++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, row * this.map.blockSize);
      this.ctx.lineTo(this.canvas.width, row * this.map.blockSize);
      this.ctx.stroke();
    }
  }

  saveMap() {
    const data = JSON.stringify(this.map.toJSON());
    localStorage.setItem('custom_map', data);
    return data;
  }

  loadMap() {
    const data = localStorage.getItem('custom_map');
    if (data) {
      this.map.fromJSON(JSON.parse(data));
      return true;
    }
    return false;
  }

  clearMap() {
    this.map.clear();
  }

  getMap() {
    return this.map;
  }
}
