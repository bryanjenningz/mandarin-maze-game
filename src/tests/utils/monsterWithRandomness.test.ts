import { describe, expect, test } from "vitest";
import type { Monster, MonsterRandomness } from "../../components/Game";
import { monsterWithRandomness } from "../../utils/monsterWithRandomness";

describe("monsterWithRandomness", () => {
  describe("monsterRandomness with false targetOverride", () => {
    const monsterRandomness: MonsterRandomness = {
      dx: 1,
      dy: -2,
      targetOverride: false,
    };

    test("puts randomness into monster with null target", () => {
      const monster: Monster = { x: 10, y: 10, health: 100, target: null };
      const newMonster: Monster = monsterWithRandomness({
        monster,
        monsterRandomness,
      });
      const expectedNewMonster: Monster = {
        ...monster,
        target: { x: 11, y: 8 },
      };
      expect(newMonster).toEqual(expectedNewMonster);
    });

    test("does nothing to monster that already has a target", () => {
      const monster: Monster = {
        x: 10,
        y: 10,
        health: 100,
        target: { x: 8, y: 12 },
      };
      const newMonster: Monster = monsterWithRandomness({
        monster,
        monsterRandomness,
      });
      const expectedNewMonster: Monster = monster;
      expect(newMonster).toEqual(expectedNewMonster);
    });
  });

  describe("monsterRandomness with true targetOverride", () => {
    const monsterRandomness: MonsterRandomness = {
      dx: 1,
      dy: -2,
      targetOverride: true,
    };

    test("puts randomness into monster with null target", () => {
      const monster: Monster = { x: 10, y: 10, health: 100, target: null };
      const newMonster: Monster = monsterWithRandomness({
        monster,
        monsterRandomness,
      });
      const expectedNewMonster: Monster = {
        ...monster,
        target: { x: 11, y: 8 },
      };
      expect(newMonster).toEqual(expectedNewMonster);
    });

    test("puts randomness into monster that already has a target", () => {
      const monster: Monster = {
        x: 10,
        y: 10,
        health: 100,
        target: { x: 8, y: 12 },
      };
      const newMonster: Monster = monsterWithRandomness({
        monster,
        monsterRandomness,
      });
      const expectedNewMonster: Monster = {
        ...monster,
        target: { x: 11, y: 8 },
      };
      expect(newMonster).toEqual(expectedNewMonster);
    });
  });
});
