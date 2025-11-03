import { Player } from '../src/Player.js';
import { GameMap } from '../src/GameMap.js';

class MockInput {
  constructor() {
    this.left = false;
    this.right = false;
    this.jump = false;
  }

  isLeft() {
    return this.left;
  }

  isRight() {
    return this.right;
  }

  isJump() {
    return this.jump;
  }
}

describe('Player', () => {
  let player;
  let map;
  let input;

  beforeEach(() => {
    player = new Player(100, 100);
    map = new GameMap(800, 600, 32);
    input = new MockInput();

    // Create a simple floor
    for (let col = 0; col < map.cols; col++) {
      map.setTile(col, map.rows - 1, 1);
    }
  });

  test('player should have initial position', () => {
    expect(player.x).toBe(100);
    expect(player.y).toBe(100);
  });

  test('player should move right when right input is pressed', () => {
    const initialX = player.x;
    input.right = true;
    player.update(input, map);
    expect(player.x).toBeGreaterThan(initialX);
    expect(player.direction).toBe('right');
  });

  test('player should move left when left input is pressed', () => {
    const initialX = player.x;
    input.left = true;
    player.update(input, map);
    expect(player.x).toBeLessThan(initialX);
    expect(player.direction).toBe('left');
  });

  test('player should fall with gravity', () => {
    player.y = 100;
    player.onGround = false;
    const initialY = player.y;
    player.update(input, map);
    expect(player.y).toBeGreaterThan(initialY);
  });

  test('player should not move through solid blocks horizontally', () => {
    player.x = 32;
    player.y = map.rows * 32 - 64;
    map.setTile(2, map.rows - 2, 1); // Block to the right

    input.right = true;
    for (let i = 0; i < 20; i++) {
      player.update(input, map);
    }

    expect(player.x).toBeLessThan(64); // Should be stopped by block
  });

  test('player should reset to given position', () => {
    player.x = 200;
    player.y = 300;
    player.velocityX = 5;
    player.velocityY = -10;

    player.reset(50, 50);

    expect(player.x).toBe(50);
    expect(player.y).toBe(50);
    expect(player.velocityX).toBe(0);
    expect(player.velocityY).toBe(0);
  });

  test('player should have correct dimensions', () => {
    expect(player.width).toBe(32);
    expect(player.height).toBe(32);
  });
});
