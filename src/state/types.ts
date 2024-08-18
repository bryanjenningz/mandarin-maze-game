import { BLOCK_SIZE, BULLET_SIZE, LANGUAGES } from "./constants";

export type State = {
  mandarinText: string;
  mandarinWords: MandarinWord[];
  status: Status;
  gameMapLevel: number;
  gameMaps: GameMap[];
  keysDown: Set<string>;
  player: Player;
  itemCount: number;
  monsters: Monster[];
  bullets: Bullet[];
  lastBulletFiredAt: number;
  monsterBullets: Bullet[];
  walls: Wall[];
  exits: Exit[];
};

export type MandarinWord = {
  word: string;
  pronunciation: string;
  meaning: string;
  context: string;
};

export type Status = "ACTIVE" | "PAUSED";

export type Language = (typeof LANGUAGES)[number];

export type GameMap = string[][];

export type Player = {
  x: number;
  y: number;
  size: typeof BLOCK_SIZE;
  health: number;
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

export type Exit = {
  x: number;
  y: number;
  size: typeof BLOCK_SIZE;
};

export type Action =
  | { type: "KEY_DOWN"; key: string }
  | { type: "KEY_UP"; key: string }
  | { type: "TICK"; time: number; monsterMoves: MonsterMove[] };

export type MonsterMove = {
  shoot: boolean;
  target: Target | null;
};
