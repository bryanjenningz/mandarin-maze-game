import { describe, expect, test } from "vitest";
import type { Monster, MonsterRandomTarget } from "../../components/Game";
import { addMonsterTarget } from "../../utils/addMonsterTarget";

describe("addMonsterTarget", () => {
  describe("randomTarget with false override", () => {
    const randomTarget: MonsterRandomTarget = {
      dx: 1,
      dy: -2,
      override: false,
    };

    test("puts randomness into monster with null target", () => {
      const monster: Monster = { x: 10, y: 10, health: 100, target: null };
      const newMonster: Monster = addMonsterTarget({ monster, randomTarget });
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
      const newMonster: Monster = addMonsterTarget({ monster, randomTarget });
      const expectedNewMonster: Monster = monster;
      expect(newMonster).toEqual(expectedNewMonster);
    });
  });

  describe("randomTarget with true override", () => {
    const randomTarget: MonsterRandomTarget = {
      dx: 1,
      dy: -2,
      override: true,
    };

    test("puts randomness into monster with null target", () => {
      const monster: Monster = { x: 10, y: 10, health: 100, target: null };
      const newMonster: Monster = addMonsterTarget({ monster, randomTarget });
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
      const newMonster: Monster = addMonsterTarget({ monster, randomTarget });
      const expectedNewMonster: Monster = {
        ...monster,
        target: { x: 11, y: 8 },
      };
      expect(newMonster).toEqual(expectedNewMonster);
    });
  });
});
