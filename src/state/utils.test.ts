import { describe, expect, it } from "vitest";
import { clamp, closestMonster, overlaps, type Box } from "./utils";
import type { Monster, Player } from "./types";

describe("closestMonster", () => {
  it("returns the null if there are no monsters", () => {
    const player: Player = { x: 0, y: 0, size: 20, health: 100 };
    const monsters: Monster[] = [];
    const closest = closestMonster(player, monsters);
    const expected = null;
    expect(closest).toEqual(expected);
  });

  it("returns the null if there are no living monsters", () => {
    const player: Player = { x: 0, y: 0, size: 20, health: 100 };
    const monsters: Monster[] = [
      { x: 0, y: 0, size: 20, health: 0, target: null },
    ];
    const closest = closestMonster(player, monsters);
    const expected = null;
    expect(closest).toEqual(expected);
  });

  it("finds the closest living monster", () => {
    const player: Player = { x: 0, y: 0, size: 20, health: 100 };
    const monsters: Monster[] = [
      { x: 0, y: 0, size: 20, health: 0, target: null },
      { x: 100, y: 0, size: 20, health: 10, target: null },
    ];
    const closest = closestMonster(player, monsters);
    const expected = monsters[1];
    expect(closest).toEqual(expected);
  });

  it("finds the closest monster", () => {
    const player: Player = { x: 0, y: 0, size: 20, health: 100 };
    const monsters: Monster[] = [
      { x: 0, y: 0, size: 20, health: 10, target: null },
      { x: 100, y: 0, size: 20, health: 10, target: null },
    ];
    const closest = closestMonster(player, monsters);
    const expected = monsters[0];
    expect(closest).toEqual(expected);
  });
});

describe("clamp", () => {
  const testCases: [low: number, x: number, high: number, expected: number][] =
    [
      [1, 3, 2, 2],
      [1, 2, 3, 2],
      [1, 0, 3, 1],
      [1, 1, 3, 1],
      [1, 4, 3, 3],
    ];
  it.each(testCases)("clamp(%i, %i, %i) -> %i", (low, x, high, expected) => {
    expect(clamp(low, x, high)).toEqual(expected);
  });
});

describe("overlaps", () => {
  const testCases: [Box, Box, boolean][] = [
    [{ x: 0, y: 0, size: 20 }, { x: 0, y: 0, size: 20 }, true],
    [{ x: 0, y: 0, size: 20 }, { x: 20, y: 0, size: 20 }, false],
    [{ x: 0, y: 0, size: 20 }, { x: 0, y: 20, size: 20 }, false],
    [{ x: 0, y: 0, size: 20 }, { x: 0, y: 19, size: 20 }, true],
    [{ x: 0, y: 0, size: 20 }, { x: 19, y: 19, size: 20 }, true],
    [{ x: 0, y: 0, size: 20 }, { x: 20, y: 19, size: 20 }, false],
    [{ x: 0, y: 0, size: 20 }, { x: 19, y: 19, size: 4 }, true],
  ];
  it.each(testCases)("overlaps(%j, %j) -> %s", (first, second, expected) => {
    expect(overlaps(first, second)).toEqual(expected);
  });
});
