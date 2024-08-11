import {
  BLOCK_SIZE,
  BULLET_DAMAGE,
  BULLET_FIRE_DELAY,
  BULLET_SIZE,
  BULLET_SPEED,
  SCREEN_SIZE,
} from "./constants";
import type {
  State,
  Action,
  Monster,
  Bullet,
  Player,
  Wall,
  MonsterMove,
} from "./types";

// #region Game map

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
  monsterBullets: [],
  walls: wallsFromGameMap(gameMap),
};

// #region Reducer

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
      const player = updatePlayer(state);
      const monsters = updateMonsters(state, action.monsterMoves);
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
      const monsterBullets: Bullet[] = state.monsterBullets
        .filter((bullet) => {
          return (
            !state.walls.some((wall) => overlaps(bullet, wall)) &&
            !overlaps(bullet, state.player)
          );
        })
        .map((bullet) => {
          const x = bullet.x + bullet.dx;
          const y = bullet.y + bullet.dy;
          return { ...bullet, x, y };
        });
      for (const [i, monster] of state.monsters.entries()) {
        const move = action.monsterMoves[i];
        if (!move?.shoot || monster.health <= 0) continue;
        const angle = Math.abs(
          Math.atan((state.player.y - monster.y) / (state.player.x - monster.x))
        );
        const dxSign = state.player.x - monster.x < 0 ? -1 : 1;
        const dySign = state.player.y - monster.y < 0 ? -1 : 1;
        monsterBullets.push({
          x: monster.x,
          y: monster.y,
          dx: dxSign * Number((BULLET_SPEED * Math.cos(angle)).toFixed(1)),
          dy: dySign * Number((BULLET_SPEED * Math.sin(angle)).toFixed(1)),
          size: BULLET_SIZE,
        });
      }
      let dx = 0;
      let dy = 0;
      if (state.keysDown.has("w")) dy -= BULLET_SPEED;
      if (state.keysDown.has("s")) dy += BULLET_SPEED;
      if (state.keysDown.has("a")) dx -= BULLET_SPEED;
      if (state.keysDown.has("d")) dx += BULLET_SPEED;
      let lastBulletFiredAt = state.lastBulletFiredAt;
      if (
        action.time - state.lastBulletFiredAt >= BULLET_FIRE_DELAY &&
        (dx !== 0 || dy !== 0)
      ) {
        bullets.push({ x: player.x, y: player.y, dx, dy, size: BULLET_SIZE });
        lastBulletFiredAt = action.time;
      }
      return {
        ...state,
        player,
        itemCount,
        monsters,
        bullets,
        lastBulletFiredAt,
        monsterBullets,
      };
    }
  }
};

// #region Util functions

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

// #region Update functions

const updatePlayer = (state: State): Player => {
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
  return player;
};

const updateMonsters = (
  state: State,
  monsterMoves: MonsterMove[]
): Monster[] => {
  return state.monsters
    .filter((monster) => {
      return !(monster.health <= 0 && overlaps(monster, state.player));
    })
    .map((monster, i) => {
      const target = monsterMoves[i]?.target ?? monster.target;
      const health = Math.max(
        0,
        monster.health -
          state.bullets.filter((bullet) => overlaps(monster, bullet)).length *
            BULLET_DAMAGE
      );
      if (health === 0) return { ...monster, health, target: null };
      if (!target) return { ...monster, health };
      const x = clamp(monster.x - 1, target.x, monster.x + 1);
      const y = clamp(monster.y - 1, target.y, monster.y + 1);
      const { x: newX, y: newY } = [
        { x, y },
        { x: monster.x, y },
        { x, y: monster.y },
      ]
        .map(({ x, y }) => {
          if (
            x >= 0 &&
            y >= 0 &&
            x <= SCREEN_SIZE - BLOCK_SIZE &&
            y <= SCREEN_SIZE - BLOCK_SIZE &&
            !state.walls.some((wall) =>
              overlaps(wall, { x, y, size: BLOCK_SIZE })
            )
          )
            return { x, y };
          return null;
        })
        .find(Boolean) ?? { x: monster.x, y: monster.y };
      const newTarget = newX === target.x && newY === target.y ? null : target;
      return { ...monster, x: newX, y: newY, target: newTarget, health };
    });
};
