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
