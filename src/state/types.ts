import { BLOCK_SIZE, BULLET_SIZE } from "./constants";

export type State = {
  status: Status;
  language: Language;
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

export type Status = "START" | "ACTIVE" | "PAUSED";

export const languages = ["MANDARIN", "JAPANESE", "SPANISH"] as const;

export type Language = (typeof languages)[number];

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
  | { type: "SET_LANGUAGE"; language: Language }
  | { type: "KEY_DOWN"; key: string }
  | { type: "KEY_UP"; key: string }
  | { type: "TICK"; time: number; monsterMoves: MonsterMove[] };

export type MonsterMove = {
  shoot: boolean;
  target: Target | null;
};
