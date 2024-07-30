import type { Monster, MonsterRandomness } from "../components/Game";

export const monsterWithRandomness = ({
  monster,
  monsterRandomness,
}: {
  monster: Monster;
  monsterRandomness: MonsterRandomness;
}): Monster => {
  if (monster.target) return monster;
  return {
    ...monster,
    target: {
      x: monster.x + monsterRandomness.dx,
      y: monster.y + monsterRandomness.dy,
    },
  };
};
