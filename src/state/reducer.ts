const BLOCK_SIZE = 20;
const BULLET_SIZE = 4;
const BULLET_DAMAGE = 10;

export type State = {
  keysDown: Set<string>;
  player: Player;
  monsters: Monster[];
  bullets: Bullet[];
  walls: Wall[];
};

export const initState: State = {
  keysDown: new Set(),
  player: { x: 20, y: 20, size: 20 },
  monsters: [{ x: 40, y: 40, size: 20, target: null, health: 100 }],
  bullets: [],
  walls: [],
};

export type Player = {
  x: number;
  y: number;
  size: typeof BLOCK_SIZE;
};

export type Monster = {
  x: number;
  y: number;
  size: typeof BLOCK_SIZE;
  target: Target | null;
  health: number;
};

export type Target = {
  x: number;
  y: number;
};

export type Bullet = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: typeof BULLET_SIZE;
};

export type Wall = {
  x: number;
  y: number;
  size: typeof BLOCK_SIZE;
};

export type Action =
  | { type: "KEY_DOWN"; key: string }
  | { type: "KEY_UP"; key: string }
  | { type: "TICK"; targets: (Target | null)[] };

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
          (newPlayer) => !state.walls.some((wall) => overlaps(newPlayer, wall))
        ) ?? state.player;
      const monsters: Monster[] = state.monsters.map((monster, i) => {
        const target = action.targets[i] ?? monster.target;
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
        const newTarget = x === target.x && y === target.y ? null : target;
        return { ...monster, x, y, target: newTarget, health };
      });
      const bullets: Bullet[] = state.bullets
        .filter((bullet) => {
          return (
            !state.walls.some((wall) => overlaps(bullet, wall)) &&
            !state.monsters.some((monster) => overlaps(bullet, monster))
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
      return { ...state, player, monsters, bullets };
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
