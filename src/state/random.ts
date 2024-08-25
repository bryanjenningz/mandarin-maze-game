import { BLOCK_SIZE } from "./constants";
import type { Monster, MonsterMove, Target } from "./types";

const RANDOM_TARGET_TILE_RANGE = 5;

/** Generates an integer between low and high inclusive, so generateInt(2, 5) can be 2, 3, 4, or 5 */
const generateInt = (low: number, high: number): number => {
  return Math.floor(Math.random() * (high - low + 1)) + low;
};

const generateTarget = ({ x, y }: Monster): Target | null => {
  if (Math.random() < 0.98) return null;
  return {
    x: generateInt(
      x - RANDOM_TARGET_TILE_RANGE * BLOCK_SIZE,
      x + RANDOM_TARGET_TILE_RANGE * BLOCK_SIZE
    ),
    y: generateInt(
      y - RANDOM_TARGET_TILE_RANGE * BLOCK_SIZE,
      y + RANDOM_TARGET_TILE_RANGE * BLOCK_SIZE
    ),
  };
};

const generateMonsterMove = (monster: Monster): MonsterMove => {
  return {
    shoot: Math.random() < 0.02,
    target: generateTarget(monster),
  };
};

export const generateMonsterMoves = (monsters: Monster[]): MonsterMove[] => {
  return monsters.map(generateMonsterMove);
};
