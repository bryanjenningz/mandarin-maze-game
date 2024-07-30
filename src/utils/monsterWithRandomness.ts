import type { Monster, MonsterRandomness } from "../components/Game";

export const monsterWithRandomness = ({
  monster,
  monsterRandomness,
}: {
  monster: Monster;
  monsterRandomness: MonsterRandomness;
}): Monster => {
  return {
    ...monster,
    target: {
      x: monster.x + monsterRandomness.dx,
      y: monster.y + monsterRandomness.dy,
    },
  };
};
