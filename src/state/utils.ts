import { SCREEN_SIZE } from "./constants";
import type { Player, Monster } from "./types";

type Point = { x: number; y: number };

const distance = (a: Point, b: Point): number => {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
};

export const closestMonster = (
  player: Player,
  monsters: Monster[]
): Monster | null => {
  let shortestDistance = Infinity;
  let shortestDistanceMonster: Monster | null = null;
  for (const monster of monsters) {
    if (monster.health <= 0) continue;
    const monsterDistance = distance(player, monster);
    if (monsterDistance < shortestDistance) {
      shortestDistance = monsterDistance;
      shortestDistanceMonster = monster;
    }
  }
  return shortestDistanceMonster;
};

export const clamp = (low: number, x: number, high: number): number => {
  return Math.min(high, Math.max(low, x));
};

export type Box = { x: number; y: number; size: number };

export const overlaps = (a: Box, b: Box): boolean => {
  return (
    a.x + a.size > b.x &&
    a.x < b.x + b.size &&
    a.y + a.size > b.y &&
    a.y < b.y + b.size
  );
};

export const inBounds = ({ x, y, size }: Box): boolean => {
  return x >= 0 && x + size <= SCREEN_SIZE && y >= 0 && y + size <= SCREEN_SIZE;
};

export const range = (low: number, high: number): number[] => {
  const result: number[] = [];
  for (let i = low; i < high; i += 1) {
    result.push(i);
  }
  return result;
};
