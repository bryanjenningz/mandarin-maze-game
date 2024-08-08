import {
  BLOCK_SIZE,
  BULLET_DAMAGE,
  BULLET_SIZE,
  SCREEN_SIZE,
} from "./constants";
import type { State, Action, Monster, Bullet, Player, Wall } from "./types";

const gameMap = [
  "####################",
  "#   #              #",
  "#   #          M   #",
  "# M #              #",
  "#   #    #####     #",
  "#                  #",
  "#     M            #",
  "#              M   #",
  "#####              #",
  "#                  #",
  "#                  #",
  "#   #              #",
  "#   #    #####     #",
  "#                  #",
  "#                  #",
  "#####         #    #",
  "#   #   #     #  M #",
  "# P     #          #",
  "#       #          #",
  "####################",
].map((line) => line.split(""));

type Tile = { x: number; y: number; size: typeof BLOCK_SIZE };

const tilesFromGameMap = (gameMap: string[][], targetTile: string): Tile[] => {
  return gameMap.flatMap((row, y) => {
    return row
      .map((tile, x): Tile | null => {
        if (tile === targetTile) {
          return { x: x * BLOCK_SIZE, y: y * BLOCK_SIZE, size: BLOCK_SIZE };
        }
        return null;
      })
      .filter(Boolean);
  });
};

const wallsFromGameMap = (gameMap: string[][]): Wall[] => {
  return tilesFromGameMap(gameMap, "#");
};

const monstersFromGameMap = (gameMap: string[][]): Monster[] => {
  return tilesFromGameMap(gameMap, "M").map((tile): Monster => {
    return {
      x: tile.x,
      y: tile.y,
      size: tile.size,
      health: 100,
      target: null,
    };
  });
};

const playerFromGameMap = (gameMap: string[][]): Player | null => {
  return tilesFromGameMap(gameMap, "P")[0] ?? null;
};

export const initState: State = {
  keysDown: new Set(),
  player: playerFromGameMap(gameMap) ?? { x: 20, y: 20, size: 20 },
  itemCount: 0,
  monsters: monstersFromGameMap(gameMap),
  bullets: [],
  lastBulletFiredAt: 0,
  walls: wallsFromGameMap(gameMap),
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "KEY_DOWN": {
      const keysDown = new Set([...state.keysDown, action.key.toLowerCase()]);
      return { ...state, keysDown };
    }
    case "KEY_UP": {
      const keysDown = new Set(
        [...state.keysDown].filter((key) => key !== action.key.toLowerCase())
      );
      return { ...state, keysDown };
    }
    case "TICK": {
      const x = ((): number => {
        if (state.keysDown.has("arrowleft")) return state.player.x - 1;
        if (state.keysDown.has("arrowright")) return state.player.x + 1;
        return state.player.x;
      })();
      const y = ((): number => {
        if (state.keysDown.has("arrowup")) return state.player.y - 1;
        if (state.keysDown.has("arrowdown")) return state.player.y + 1;
        return state.player.y;
      })();
      const player: Player =
        [
          { ...state.player, x, y },
          { ...state.player, x },
          { ...state.player, y },
        ].find(
          (newPlayer) =>
            inBounds(newPlayer) &&
            !state.walls.some((wall) => overlaps(newPlayer, wall))
        ) ?? state.player;
      const monsters: Monster[] = state.monsters
        .filter((monster) => {
          return !(monster.health <= 0 && overlaps(monster, player));
        })
        .map((monster, i) => {
          const target = action.targets[i] ?? monster.target;
          const health = Math.max(
            0,
            monster.health -
              state.bullets.filter((bullet) => overlaps(monster, bullet))
                .length *
                BULLET_DAMAGE
          );
          if (health === 0) return { ...monster, health, target: null };
          if (!target) return { ...monster, health };
          const x = clamp(monster.x - 1, target.x, monster.x + 1);
          const y = clamp(monster.y - 1, target.y, monster.y + 1);
          const newTarget = x === target.x && y === target.y ? null : target;
          return { ...monster, x, y, target: newTarget, health };
        });
      const itemCount =
        state.itemCount + (state.monsters.length - monsters.length);
      const bullets: Bullet[] = state.bullets
        .filter((bullet) => {
          return (
            !state.walls.some((wall) => overlaps(bullet, wall)) &&
            !state.monsters.some(
              (monster) => overlaps(bullet, monster) && monster.health > 0
            )
          );
        })
        .map((bullet) => {
          const x = bullet.x + bullet.dx;
          const y = bullet.y + bullet.dy;
          return { ...bullet, x, y };
        });
      let dx = 0;
      let dy = 0;
      if (state.keysDown.has("w")) dy -= 1;
      if (state.keysDown.has("s")) dy += 1;
      if (state.keysDown.has("a")) dx -= 1;
      if (state.keysDown.has("d")) dx += 1;
      if (dx !== 0 || dy !== 0) {
        bullets.push({ x, y, dx, dy, size: BULLET_SIZE });
      }
      return { ...state, player, itemCount, monsters, bullets };
    }
  }
};

const clamp = (low: number, x: number, high: number): number => {
  return Math.min(high, Math.max(low, x));
};

type Box = { x: number; y: number; size: number };

const overlaps = (a: Box, b: Box): boolean => {
  return (
    a.x + a.size > b.x &&
    a.x < b.x + b.size &&
    a.y + a.size > b.y &&
    a.y < b.y + b.size
  );
};

const inBounds = ({ x, y, size }: Box): boolean => {
  return x >= 0 && x + size <= SCREEN_SIZE && y >= 0 && y + size <= SCREEN_SIZE;
};
