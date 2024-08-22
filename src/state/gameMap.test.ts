import { describe, expect, it } from "vitest";
import { monstersFromGameMap, playerFromGameMap } from "./gameMap";
import type { GameMap, Monster, Player } from "./types";

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

  describe("playerFromGameMap", () => {
    it("returns player in the game map", () => {
      const gameMap: GameMap = [
        "   P",
        "M M ",
        "    ",
        " MM ",
        "    ",
        "    ",
      ].map((x) => x.split(""));
      const player: Player | null = playerFromGameMap(gameMap);
      const expected: Player = { x: 60, y: 0, size: 20, health: 100 };
      expect(player).toEqual(expected);
    });
  });
});
