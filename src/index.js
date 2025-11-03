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

    this.gameCanvas.width = 800;
    this.gameCanvas.height = 600;
    this.editorCanvas.width = 800;
    this.editorCanvas.height = 600;

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
}

// Start the app
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
