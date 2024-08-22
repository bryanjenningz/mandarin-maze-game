import { describe, expect, it } from "vitest";
import { monstersFromGameMap } from "./gameMap";
import type { GameMap, Monster } from "./types";

describe("gameMap", () => {
  describe("monstersFromGameMap", () => {
    it("returns monsters in the game map", () => {
      const gameMap: GameMap = [
        "    ",
        "M M ",
        "    ",
        " MM ",
        "    ",
        "    ",
      ].map((x) => x.split(""));
      const monsters: Monster[] = monstersFromGameMap(gameMap);
      const expected: Monster[] = [
        { health: 100, size: 20, target: null, x: 0, y: 20 },
        { health: 100, size: 20, target: null, x: 40, y: 20 },
        { health: 100, size: 20, target: null, x: 20, y: 60 },
        { health: 100, size: 20, target: null, x: 40, y: 60 },
      ];
      expect(monsters).toEqual(expected);
    });
  });
});
