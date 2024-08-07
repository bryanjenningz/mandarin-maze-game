import { BLOCK_SIZE, BULLET_SIZE } from "./constants";

export type State = {
  keysDown: Set<string>;
  player: Player;
  itemCount: number;
  monsters: Monster[];
  bullets: Bullet[];
  walls: Wall[];
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
