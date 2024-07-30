import { describe, expect, test } from "vitest";
import type { Monster, MonsterRandomness } from "../../components/Game";
import { monsterWithRandomness } from "../../utils/monsterWithRandomness";

describe("monsterWithRandomness", () => {
  test("puts randomness into monster with null target", () => {
    const monster: Monster = { x: 10, y: 10, health: 100, target: null };
    const monsterRandomness: MonsterRandomness = {
      dx: 1,
      dy: -2,
      targetOverride: false,
    };
    const newMonster: Monster = monsterWithRandomness({
      monster,
      monsterRandomness,
    });
    const expectedNewMonster: Monster = { ...monster, target: { x: 11, y: 8 } };
    expect(newMonster).toEqual(expectedNewMonster);
  });
});
