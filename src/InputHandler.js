export class InputHandler {
  constructor() {
    this.keys = {};
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.keys[e.code] = true;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.keys[e.code] = false;
    });
  }

  isPressed(key) {
    return this.keys[key] || false;
  }

  isLeft() {
    return this.isPressed('a') || this.isPressed('ArrowLeft');
  }

  isRight() {
    return this.isPressed('d') || this.isPressed('ArrowRight');
  }

  isJump() {
    return (
      this.isPressed(' ') ||
      this.isPressed('Space') ||
      this.isPressed('w') ||
      this.isPressed('ArrowUp')
    );
  }

  reset() {
    this.keys = {};
  }
}
