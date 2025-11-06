import { AssetLoader } from './AssetLoader.js';
import { Game } from './Game.js';
import { MapEditor } from './MapEditor.js';
import { AudioManager } from './AudioManager.js';

class App {
  constructor() {
    this.assets = null;
    this.game = null;
    this.editor = null;
    this.audio = new AudioManager();
    this.currentScreen = 'menu';
    this.init();
  }

  async init() {
    // Show loading
    console.log('Loading assets...');

    this.assets = new AssetLoader();
    await this.assets.loadAll();

    console.log('Assets loaded!');

    // Setup canvases
    this.gameCanvas = document.getElementById('game-canvas');
    this.editorCanvas = document.getElementById('editor-canvas');

    // Adjust canvas size for mobile
    this.updateCanvasSize();
    window.addEventListener('resize', () => this.updateCanvasSize());

    // Create game and editor instances
    this.game = new Game(this.gameCanvas, this.assets);
    this.editor = new MapEditor(this.editorCanvas, this.assets);

    this.setupUI();
    this.showScreen('menu');
  }

  setupUI() {
    // Menu buttons
    document.getElementById('btn-play').addEventListener('click', () => {
      this.showScreen('game');
      this.game.start();
    });

    document.getElementById('btn-editor').addEventListener('click', () => {
      this.showScreen('editor');
      this.startEditorLoop();
    });

    // Game buttons
    document.getElementById('btn-menu').addEventListener('click', () => {
      this.game.stop();
      this.showScreen('menu');
    });

    // Setup touch controls for the game
    const leftBtn = document.getElementById('btn-left');
    const rightBtn = document.getElementById('btn-right');
    const jumpBtn = document.getElementById('btn-jump');
    this.game.input.setupTouchControls(leftBtn, rightBtn, jumpBtn);

    // Editor buttons
    document.getElementById('block-type').addEventListener('change', (e) => {
      this.editor.setBlockType(e.target.value);
    });

    document.getElementById('btn-save-map').addEventListener('click', () => {
      this.editor.saveMap();
      alert('Map saved!');
    });

    document.getElementById('btn-load-map').addEventListener('click', () => {
      if (this.editor.loadMap()) {
        alert('Map loaded!');
      } else {
        alert('No saved map found!');
      }
    });

    document.getElementById('btn-clear-map').addEventListener('click', () => {
      if (confirm('Clear entire map?')) {
        this.editor.clearMap();
      }
    });

    document.getElementById('btn-test-map').addEventListener('click', () => {
      const mapData = this.editor.getMap().toJSON();
      this.game.loadCustomMap(mapData);
      this.showScreen('game');
      this.game.start();
    });

    document.getElementById('btn-editor-menu').addEventListener('click', () => {
      this.stopEditorLoop();
      this.showScreen('menu');
    });

    // Audio controls
    document.getElementById('btn-music-toggle').addEventListener('click', () => {
      const enabled = this.audio.toggleMusic();
      document.getElementById('btn-music-toggle').textContent = enabled ? '🔊' : '🔇';
    });

    document.getElementById('music-select').addEventListener('change', (e) => {
      this.audio.playMusic(e.target.value);
    });
  }

  showScreen(screen) {
    document.querySelectorAll('.screen').forEach((s) => {
      s.classList.remove('active');
    });

    if (screen === 'menu') {
      document.getElementById('menu').classList.add('active');
    } else if (screen === 'game') {
      document.getElementById('game').classList.add('active');
    } else if (screen === 'editor') {
      document.getElementById('editor').classList.add('active');
    }

    this.currentScreen = screen;
  }

  startEditorLoop() {
    const loop = () => {
      if (this.currentScreen === 'editor') {
        this.editor.render();
        requestAnimationFrame(loop);
      }
    };
    loop();
  }

  stopEditorLoop() {
    // Loop will stop naturally when screen changes
  }

  updateCanvasSize() {
    const isMobile = window.innerWidth < 700;
    
    if (isMobile) {
      // Mobile: use available space
      const width = Math.min(window.innerWidth - 20, 600);
      // Reserve space for HUD (60px) and touch controls (100px) = 160px total
      const availableHeight = window.innerHeight - 160;
      const height = Math.min(availableHeight, 600);
      
      this.gameCanvas.width = width;
      this.gameCanvas.height = height;
      this.editorCanvas.width = width;
      this.editorCanvas.height = height;
      
      // Show touch controls
      document.getElementById('touch-controls').style.display = 'flex';
    } else {
      // Desktop: full size
      this.gameCanvas.width = 800;
      this.gameCanvas.height = 600;
      this.editorCanvas.width = 800;
      this.editorCanvas.height = 600;
      
      // Hide touch controls on desktop unless it's a touch device
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      document.getElementById('touch-controls').style.display = isTouchDevice ? 'flex' : 'none';
    }
    
    // Update game map if it exists
    if (this.game && this.game.map) {
      this.game.canvas = this.gameCanvas;
      this.game.ctx = this.gameCanvas.getContext('2d');
    }
  }
}

// Start the app
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
