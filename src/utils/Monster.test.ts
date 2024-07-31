import { describe, test, expect } from "vitest";
import type { MonsterRandomTarget, Monster, Bullet } from "../components/Game";
import { addMonsterTarget, updateMonsters } from "./Monster";
import type { Box } from "./box";

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

describe("updateMonsters", () => {
  test("lowers monster health if bullets overlap", () => {
    const walls: Box[] = [];
    const monster: Monster = { x: 10, y: 10, target: null, health: 100 };
    const monsters: Monster[] = [monster];
    const monsterRandomness: MonsterRandomTarget[] = [];
    const bullets: Bullet[] = [{ x: 10, y: 10, dx: 2, dy: 0 }];
    const newMonsters = updateMonsters({
      walls,
      monsters,
      monsterRandomness,
      bullets,
    });
    const expectedNewMonsters: Monster[] = [{ ...monster, health: 90 }];
    expect(newMonsters).toEqual(expectedNewMonsters);
  });

  test("lowers monster health if bullets will overlap but don't currently overlap", () => {
    const walls: Box[] = [];
    const monster: Monster = { x: 10, y: 10, target: null, health: 100 };
    const monsters: Monster[] = [monster];
    const monsterRandomness: MonsterRandomTarget[] = [];
    const bullets: Bullet[] = [{ x: 0, y: 0, dx: 10, dy: 10 }];
    const newMonsters = updateMonsters({
      walls,
      monsters,
      monsterRandomness,
      bullets,
    });
    const expectedNewMonsters: Monster[] = [{ ...monster, health: 90 }];
    expect(newMonsters).toEqual(expectedNewMonsters);
  });

  test("no change in monster health if a bullet doesn't ever overlap", () => {
    const walls: Box[] = [];
    const monsters: Monster[] = [{ x: 10, y: 10, target: null, health: 100 }];
    const monsterRandomness: MonsterRandomTarget[] = [];
    const bullets: Bullet[] = [{ x: 0, y: 0, dx: 10, dy: 0 }];
    const newMonsters = updateMonsters({
      walls,
      monsters,
      monsterRandomness,
      bullets,
    });
    expect(newMonsters).toEqual(monsters);
  });
});
