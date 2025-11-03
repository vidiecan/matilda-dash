import { GameMap } from '../src/GameMap.js';

describe('GameMap', () => {
  let map;

  beforeEach(() => {
    map = new GameMap(800, 600, 32);
  });

  test('map should have correct dimensions', () => {
    expect(map.width).toBe(800);
    expect(map.height).toBe(600);
    expect(map.blockSize).toBe(32);
    expect(map.cols).toBe(25);
    expect(map.rows).toBe(18);
  });

  test('map should initialize with empty tiles', () => {
    expect(map.tiles.length).toBe(18);
    expect(map.tiles[0].length).toBe(25);
    expect(map.getTile(0, 0)).toBe(0);
  });

  test('should set and get tiles correctly', () => {
    map.setTile(5, 5, 1);
    expect(map.getTile(5, 5)).toBe(1);

    map.setTile(5, 5, 2);
    expect(map.getTile(5, 5)).toBe(2);
  });

  test('should identify solid tiles', () => {
    expect(map.isSolid(0, 0)).toBe(false);

    map.setTile(0, 0, 1);
    expect(map.isSolid(0, 0)).toBe(true);
  });

  test('should treat out-of-bounds as solid', () => {
    expect(map.isSolid(-1, 0)).toBe(true);
    expect(map.isSolid(0, -1)).toBe(true);
    expect(map.isSolid(100, 0)).toBe(true);
    expect(map.isSolid(0, 100)).toBe(true);
  });

  test('should get correct tile types', () => {
    expect(map.getTileType(1)).toBe('grass');
    expect(map.getTileType(2)).toBe('dirt');
    expect(map.getTileType(3)).toBe('stone');
    expect(map.getTileType(0)).toBe(null);
  });

  test('should load default map', () => {
    map.loadDefaultMap();

    // Check ground is created
    expect(map.getTile(0, map.rows - 1)).toBe(1);
    expect(map.getTile(10, map.rows - 1)).toBe(1);
    expect(map.getTile(0, map.rows - 2)).toBe(2);
  });

  test('should serialize and deserialize', () => {
    map.setTile(5, 5, 1);
    map.setTile(10, 10, 2);

    const json = map.toJSON();
    expect(json.width).toBe(800);
    expect(json.tiles[5][5]).toBe(1);

    const newMap = new GameMap(800, 600, 32);
    newMap.fromJSON(json);

    expect(newMap.getTile(5, 5)).toBe(1);
    expect(newMap.getTile(10, 10)).toBe(2);
  });

  test('should clear map', () => {
    map.setTile(5, 5, 1);
    map.setTile(10, 10, 2);

    map.clear();

    expect(map.getTile(5, 5)).toBe(0);
    expect(map.getTile(10, 10)).toBe(0);
  });

  test('should have start and end positions', () => {
    expect(map.startPos).toBeDefined();
    expect(map.endPos).toBeDefined();
    expect(map.startPos.x).toBeGreaterThanOrEqual(0);
    expect(map.endPos.x).toBeGreaterThanOrEqual(0);
  });
});
