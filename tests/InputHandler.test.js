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
});
