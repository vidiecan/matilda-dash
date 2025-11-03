import { InputHandler } from '../src/InputHandler.js';

describe('InputHandler', () => {
  let input;

  beforeEach(() => {
    input = new InputHandler();
  });

  afterEach(() => {
    input.reset();
  });

  test('should detect left movement', () => {
    // Simulate 'a' key press
    const event = new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' });
    window.dispatchEvent(event);

    expect(input.isLeft()).toBe(true);
  });

  test('should detect right movement', () => {
    const event = new KeyboardEvent('keydown', { key: 'd', code: 'KeyD' });
    window.dispatchEvent(event);

    expect(input.isRight()).toBe(true);
  });

  test('should detect jump', () => {
    const event = new KeyboardEvent('keydown', { key: ' ', code: 'Space' });
    window.dispatchEvent(event);

    expect(input.isJump()).toBe(true);
  });

  test('should detect arrow keys', () => {
    let event = new KeyboardEvent('keydown', { key: 'ArrowLeft', code: 'ArrowLeft' });
    window.dispatchEvent(event);
    expect(input.isLeft()).toBe(true);

    input.reset();

    event = new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight' });
    window.dispatchEvent(event);
    expect(input.isRight()).toBe(true);
  });

  test('should reset keys', () => {
    const event = new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' });
    window.dispatchEvent(event);

    expect(input.isLeft()).toBe(true);

    input.reset();

    expect(input.isLeft()).toBe(false);
  });

  test('should detect key release', () => {
    let event = new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' });
    window.dispatchEvent(event);
    expect(input.isLeft()).toBe(true);

    event = new KeyboardEvent('keyup', { key: 'a', code: 'KeyA' });
    window.dispatchEvent(event);
    expect(input.isLeft()).toBe(false);
  });

  describe('Touch Controls', () => {
    let leftBtn, rightBtn, jumpBtn;

    beforeEach(() => {
      // Create mock buttons
      leftBtn = document.createElement('button');
      rightBtn = document.createElement('button');
      jumpBtn = document.createElement('button');

      input.setupTouchControls(leftBtn, rightBtn, jumpBtn);
    });

    test('should detect left touch', () => {
      const touchStart = new Event('touchstart');
      leftBtn.dispatchEvent(touchStart);

      expect(input.isLeft()).toBe(true);

      const touchEnd = new Event('touchend');
      leftBtn.dispatchEvent(touchEnd);

      expect(input.isLeft()).toBe(false);
    });

    test('should detect right touch', () => {
      const touchStart = new Event('touchstart');
      rightBtn.dispatchEvent(touchStart);

      expect(input.isRight()).toBe(true);

      const touchEnd = new Event('touchend');
      rightBtn.dispatchEvent(touchEnd);

      expect(input.isRight()).toBe(false);
    });

    test('should detect jump touch', () => {
      const touchStart = new Event('touchstart');
      jumpBtn.dispatchEvent(touchStart);

      expect(input.isJump()).toBe(true);

      const touchEnd = new Event('touchend');
      jumpBtn.dispatchEvent(touchEnd);

      expect(input.isJump()).toBe(false);
    });

    test('should reset touch state', () => {
      const touchStart = new Event('touchstart');
      leftBtn.dispatchEvent(touchStart);

      expect(input.isLeft()).toBe(true);

      input.reset();

      expect(input.isLeft()).toBe(false);
    });
  });
});
