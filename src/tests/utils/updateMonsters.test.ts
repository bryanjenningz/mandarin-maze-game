import { describe, expect, test } from "vitest";
import { updateMonsters } from "../../utils/updateMonsters";
import type { Bullet, Monster, MonsterRandomness } from "../../components/Game";

describe("updateMonsters", () => {
  test("lowers monster health if bullets overlap", () => {
    const monsters: Monster[] = [];
    const monsterRandomness: MonsterRandomness[] = [];
    const bullets: Bullet[] = [];
    const newMonsters = updateMonsters(monsters, monsterRandomness, bullets);
    expect(newMonsters).toEqual([]);
  });
});
