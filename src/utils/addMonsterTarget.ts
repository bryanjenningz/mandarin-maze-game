import type { Monster, MonsterRandomTarget } from "../components/Game";

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
