import {
  boxSize,
  bulletSize,
  type Bullet,
  type Monster,
  type MonsterRandomTarget,
} from "../components/Game";
import { type Box, isInBounds, isOverlapping } from "./Box";
import { clamp } from "./utilities";

export const addMonsterTarget = ({
  monster,
  randomTarget,
}: {
  monster: Monster;
  randomTarget: MonsterRandomTarget;
}): Monster => {
  if (!monster.target || randomTarget.override) {
    return {
      ...monster,
      target: {
        x: monster.x + randomTarget.dx,
        y: monster.y + randomTarget.dy,
      },
    };
  }
  return monster;
};

export const updateMonsters = ({
  walls,
  monsters,
  monsterRandomness,
  bullets,
}: {
  walls: Box[];
  monsters: Monster[];
  monsterRandomness: MonsterRandomTarget[];
  bullets: Bullet[];
}): Monster[] => {
  return monsters.map((monster, i): Monster => {
    const {
      dx,
      dy,
      override: targetOverride,
    } = monsterRandomness[i] ?? {
      dx: 0,
      dy: 0,
      override: false,
    };
    const bulletDamage = 10;
    const health =
      monster.health -
      bullets
        .map((bullet) => {
          return {
            ...bullet,
            x: bullet.x + bullet.dx,
            y: bullet.y + bullet.dy,
          };
        })
        .filter((bullet) => {
          return isOverlapping(
            { x: monster.x, y: monster.y, size: boxSize },
            { x: bullet.x, y: bullet.y, size: bulletSize }
          );
        }).length *
        bulletDamage;
    if (dx === 0 && dy === 0) return { ...monster, target: null, health };
    const target = (() => {
      const newTarget = { x: monster.x + dx, y: monster.y + dy };
      if (targetOverride) return newTarget;
      return monster.target ?? newTarget;
    })();
    const x = clamp(-1, target.x - monster.x, 1) + monster.x;
    const y = clamp(-1, target.y - monster.y, 1) + monster.y;
    if (
      !walls.some((wall) => isOverlapping({ x, y, size: boxSize }, wall)) &&
      isInBounds({ x, y, size: boxSize })
    ) {
      return { x, y, target, health };
    }
    if (
      !walls.some((wall) =>
        isOverlapping({ x, y: monster.y, size: boxSize }, wall)
      ) &&
      isInBounds({ x, y: monster.y, size: boxSize })
    ) {
      return { x, y: monster.y, target, health };
    }
    if (
      !walls.some((wall) =>
        isOverlapping({ x: monster.x, y, size: boxSize }, wall)
      ) &&
      isInBounds({ x: monster.x, y, size: boxSize })
    ) {
      return { x: monster.x, y, target, health };
    }
    return { ...monster, target: null, health };
  });
};
