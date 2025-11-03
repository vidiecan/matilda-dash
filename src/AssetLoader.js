export class AssetLoader {
  constructor() {
    this.images = {};
    this.sounds = {};
    this.loaded = 0;
    this.total = 0;
  }

  loadImage(name, path) {
    this.total++;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.images[name] = img;
        this.loaded++;
        resolve(img);
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${path}`);
        this.loaded++;
        resolve(null);
      };
      img.src = path;
    });
  }

  loadSound(name, path) {
    this.total++;
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.sounds[name] = audio;
        this.loaded++;
        resolve(audio);
      };
      audio.onerror = () => {
        console.warn(`Failed to load sound: ${path}`);
        this.loaded++;
        resolve(null);
      };
      audio.src = path;
    });
  }

  async loadAll() {
    const promises = [
      this.loadImage('matilda_right', 'assets/images/matilda_right.png'),
      this.loadImage('matilda_left', 'assets/images/matilda_left.png'),
      this.loadImage('matilda_idle', 'assets/images/matilda_idle.png'),
      this.loadImage('matilda_jump', 'assets/images/matilda_jump.png'),
      this.loadImage('block_grass', 'assets/images/block_grass.png'),
      this.loadImage('block_dirt', 'assets/images/block_dirt.png'),
      this.loadImage('block_stone', 'assets/images/block_stone.png'),
      this.loadImage('background', 'assets/backgrounds/sky.png'),
    ];

    await Promise.all(promises);
    return this;
  }

  getProgress() {
    return this.total > 0 ? this.loaded / this.total : 1;
  }
}
