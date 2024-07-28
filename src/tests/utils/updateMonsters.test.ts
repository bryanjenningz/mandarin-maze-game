import { describe, expect, test } from "vitest";
import { updateMonsters } from "../../utils/updateMonsters";
import type { Bullet, Monster, MonsterRandomness } from "../../components/Game";

describe("updateMonsters", () => {
  test("lowers monster health if bullets overlap", () => {
    const monsters: Monster[] = [{ x: 10, y: 10, target: null, health: 100 }];
    const monsterRandomness: MonsterRandomness[] = [];
    const bullets: Bullet[] = [{ x: 10, y: 10, dx: 2, dy: 0 }];
    const newMonsters = updateMonsters(monsters, monsterRandomness, bullets);
    const expectedNewMonsters: Monster[] = [
      { x: 10, y: 10, target: null, health: 90 },
    ];
    expect(newMonsters).toEqual(expectedNewMonsters);
  });
});
