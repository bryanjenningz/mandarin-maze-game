import { describe, expect, test } from "vitest";
import { updateMonsters } from "../../utils/updateMonsters";
import type {
  Box,
  Bullet,
  Monster,
  MonsterRandomness,
} from "../../components/Game";

describe("updateMonsters", () => {
  test("lowers monster health if bullets overlap", () => {
    const walls: Box[] = [];
    const monster: Monster = { x: 10, y: 10, target: null, health: 100 };
    const monsters: Monster[] = [monster];
    const monsterRandomness: MonsterRandomness[] = [];
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
    const monsterRandomness: MonsterRandomness[] = [];
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
    const monsterRandomness: MonsterRandomness[] = [];
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
