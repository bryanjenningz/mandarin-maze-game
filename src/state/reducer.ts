import { BULLET_DAMAGE, BULLET_SIZE, SCREEN_SIZE } from "./constants";
import type { State, Action, Monster, Bullet, Player } from "./types";

export const initState: State = {
  keysDown: new Set(),
  player: { x: 20, y: 20, size: 20 },
  itemCount: 0,
  monsters: [{ x: 40, y: 40, size: 20, target: null, health: 100 }],
  bullets: [],
  walls: [],
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
  return x >= 0 && x + size <= SCREEN_SIZE && y >= 0 && y <= SCREEN_SIZE;
};
