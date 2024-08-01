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

type Player = {
  x: number;
  y: number;
  size: typeof BLOCK_SIZE;
};

type Monster = {
  x: number;
  y: number;
  size: typeof BLOCK_SIZE;
  target: Target | null;
};

type Target = {
  x: number;
  y: number;
};

export type Action = { type: "KEY_DOWN"; key: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "KEY_DOWN": {
      const keysDown = new Set([...state.keysDown, action.key.toLowerCase()]);
      return { ...state, keysDown };
    }
  }
};
