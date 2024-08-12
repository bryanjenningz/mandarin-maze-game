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
  "#EEE################",
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

const exitsFromGameMap = (gameMap: string[][]): Wall[] => {
  return tilesFromGameMap(gameMap, "E");
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
  exits: exitsFromGameMap(gameMap),
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
      const { bullets, lastBulletFiredAt } = updateBullets(state, action.time);
      const monsterBullets = updateMonsterBullets(state, action.monsterMoves);
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

const updatePlayer = ({
  keysDown,
  player,
  monsters,
  walls,
  exits,
}: State): Player => {
  const x = ((): number => {
    if (keysDown.has("arrowleft")) return player.x - 1;
    if (keysDown.has("arrowright")) return player.x + 1;
    return player.x;
  })();
  const y = ((): number => {
    if (keysDown.has("arrowup")) return player.y - 1;
    if (keysDown.has("arrowdown")) return player.y + 1;
    return player.y;
  })();
  const newPlayer: Player =
    [
      { ...player, x, y },
      { ...player, x },
      { ...player, y },
    ].find(
      (newPlayer) =>
        inBounds(newPlayer) &&
        !walls.some((wall) => overlaps(newPlayer, wall)) &&
        (monsters.length === 0 ||
          !exits.some((exit) => overlaps(newPlayer, exit)))
    ) ?? player;
  return newPlayer;
};

const updateMonsters = (
  { player, monsters, bullets, walls, exits }: State,
  monsterMoves: MonsterMove[]
): Monster[] => {
  return monsters
    .filter((monster) => {
      return !(monster.health <= 0 && overlaps(monster, player));
    })
    .map((monster, i) => {
      const target = monsterMoves[i]?.target ?? monster.target;
      const health = Math.max(
        0,
        monster.health -
          bullets.filter((bullet) => overlaps(monster, bullet)).length *
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
            !walls.some((wall) => overlaps(wall, { x, y, size: BLOCK_SIZE })) &&
            !exits.some((exit) => overlaps(exit, { x, y, size: BLOCK_SIZE }))
          )
            return { x, y };
          return null;
        })
        .find(Boolean) ?? { x: monster.x, y: monster.y };
      const newTarget = newX === target.x && newY === target.y ? null : target;
      return { ...monster, x: newX, y: newY, target: newTarget, health };
    });
};

const updateBullets = (
  { keysDown, player, monsters, bullets, lastBulletFiredAt, walls }: State,
  time: number
): { bullets: Bullet[]; lastBulletFiredAt: number } => {
  const updatedBullets = bullets
    .filter((bullet) => {
      return (
        !walls.some((wall) => overlaps(bullet, wall)) &&
        !monsters.some(
          (monster) => overlaps(bullet, monster) && monster.health > 0
        )
      );
    })
    .map((bullet) => {
      const x = bullet.x + bullet.dx;
      const y = bullet.y + bullet.dy;
      return { ...bullet, x, y };
    });

  const newBullet = ((): Bullet | undefined => {
    const dx =
      (keysDown.has("a") ? -BULLET_SPEED : 0) +
      (keysDown.has("d") ? BULLET_SPEED : 0);
    const dy =
      (keysDown.has("w") ? -BULLET_SPEED : 0) +
      (keysDown.has("s") ? BULLET_SPEED : 0);
    if (
      time - lastBulletFiredAt >= BULLET_FIRE_DELAY &&
      (dx !== 0 || dy !== 0)
    ) {
      const { x, y } = player;
      return { x, y, dx, dy, size: BULLET_SIZE };
    }
    return undefined;
  })();

  if (newBullet) {
    return {
      bullets: [...updatedBullets, newBullet],
      lastBulletFiredAt: time,
    };
  }

  return { bullets: updatedBullets, lastBulletFiredAt };
};

const updateMonsterBullets = (
  { player, monsters, monsterBullets, walls }: State,
  monsterMoves: MonsterMove[]
): Bullet[] => {
  const updatedMonsterBullets = monsterBullets
    .filter((bullet) => {
      return (
        !walls.some((wall) => overlaps(bullet, wall)) &&
        !overlaps(bullet, player)
      );
    })
    .map((bullet) => {
      const x = bullet.x + bullet.dx;
      const y = bullet.y + bullet.dy;
      return { ...bullet, x, y };
    });

  const newMonsterBullets = monsters
    .filter((monster, i) => {
      const move = monsterMoves[i];
      return monster && monster.health > 0 && move?.shoot;
    })
    .map((monster): Bullet => {
      const riseOverRun = (player.y - monster.y) / (player.x - monster.x);
      const angle = Math.abs(Math.atan(riseOverRun));
      const dxSign = player.x - monster.x < 0 ? -1 : 1;
      const dySign = player.y - monster.y < 0 ? -1 : 1;
      const dx = dxSign * Number((BULLET_SPEED * Math.cos(angle)).toFixed(1));
      const dy = dySign * Number((BULLET_SPEED * Math.sin(angle)).toFixed(1));
      return { x: monster.x, y: monster.y, dx, dy, size: BULLET_SIZE };
    });

  return [...updatedMonsterBullets, ...newMonsterBullets];
};
