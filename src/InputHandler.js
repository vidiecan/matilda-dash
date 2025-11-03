export class InputHandler {
  constructor() {
    this.keys = {};
    this.touchActive = {
      left: false,
      right: false,
      jump: false,
    };
    this.setupListeners();
  }

  setupListeners() {
    // Keyboard listeners
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

  setupTouchControls(leftBtn, rightBtn, jumpBtn) {
    if (!leftBtn || !rightBtn || !jumpBtn) return;

    // Left button
    leftBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.touchActive.left = true;
    });
    leftBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.touchActive.left = false;
    });
    leftBtn.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      this.touchActive.left = false;
    });

    // Right button
    rightBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.touchActive.right = true;
    });
    rightBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.touchActive.right = false;
    });
    rightBtn.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      this.touchActive.right = false;
    });

    // Jump button
    jumpBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.touchActive.jump = true;
    });
    jumpBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.touchActive.jump = false;
    });
    jumpBtn.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      this.touchActive.jump = false;
    });
  }

  isPressed(key) {
    return this.keys[key] || false;
  }

  isLeft() {
    return this.isPressed('a') || this.isPressed('ArrowLeft') || this.touchActive.left;
  }

  isRight() {
    return this.isPressed('d') || this.isPressed('ArrowRight') || this.touchActive.right;
  }

  isJump() {
    return (
      this.isPressed(' ') ||
      this.isPressed('Space') ||
      this.isPressed('w') ||
      this.isPressed('ArrowUp') ||
      this.touchActive.jump
    );
  }

  reset() {
    this.keys = {};
    this.touchActive = {
      left: false,
      right: false,
      jump: false,
    };
  }
}
