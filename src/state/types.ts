import type { Dictionary } from "../dictionary/types";
import { BLOCK_SIZE, BULLET_SIZE, LANGUAGES } from "./constants";

export type State = {
  mandarinDictionary: Dictionary;
  mandarinText: string;
  mandarinWords: MandarinWord[];
  unknownWords: string[];
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

export type Status =
  | { type: "START" }
  | { type: "ACTIVE" }
  | { type: "PAUSED" }
  | { type: "SHOWING_NEW_WORD"; word: MandarinWord }
  | { type: "SHOWING_LEVEL_REVIEW"; words: MandarinWord[] };

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
  | { type: "SET_MANDARIN_DICTIONARY"; mandarinDictionary: Dictionary }
  | { type: "SET_MANDARIN_TEXT"; mandarinText: string }
  | { type: "TOGGLE_MANDARIN_WORD_KNOWN"; word: string }
  | { type: "START_GAME" }
  | { type: "KEY_DOWN"; key: string }
  | { type: "KEY_UP"; key: string }
  | { type: "PASS_REVIEW" }
  | { type: "FAIL_REVIEW" }
  | { type: "TICK"; time: number; monsterMoves: MonsterMove[] };

export type MonsterMove = {
  shoot: boolean;
  target: Target | null;
};
