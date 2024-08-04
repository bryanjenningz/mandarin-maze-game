const BLOCK_SIZE = 20;

export type State = {
  keysDown: Set<string>;
  player: Player;
  monsters: Monster[];
};

export const initState: State = {
  keysDown: new Set(),
  player: { x: 20, y: 20, size: 20 },
  monsters: [{ x: 40, y: 40, size: 20, target: null }],
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
};

export type Target = {
  x: number;
  y: number;
};

export type Action =
  | { type: "KEY_DOWN"; key: string }
  | { type: "KEY_UP"; key: string }
  | { type: "TICK" };

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
      const player: Player = { ...state.player, x, y };
      const monsters: Monster[] = state.monsters.map((monster) => {
        if (!monster.target) return monster;
        if (monster.x === monster.target.x && monster.y === monster.target.y) {
          return { ...monster, target: null };
        }
        return {
          ...monster,
          x: clamp(monster.x - 1, monster.target.x, monster.x + 1),
          y: clamp(monster.y - 1, monster.target.y, monster.y + 1),
        };
      });
      return { ...state, player, monsters };
    }
  }
};

const clamp = (low: number, x: number, high: number): number => {
  return Math.min(high, Math.max(low, x));
};
