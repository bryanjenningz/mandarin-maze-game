import { describe, expect, it } from "vitest";
import {
  exitsFromGameMap,
  monstersFromGameMap,
  playerFromGameMap,
  wallsFromGameMap,
} from "./gameMap";
import type { Exit, GameMap, Monster, Player, Wall } from "./types";

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
    it("returns null if there are no players in the game map", () => {
      const gameMap: GameMap = [
        "    ",
        "M M ",
        "    ",
        " MM ",
        "    ",
        "    ",
      ].map((x) => x.split(""));
      const player: Player | null = playerFromGameMap(gameMap);
      const expected = null;
      expect(player).toEqual(expected);
    });

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

  describe("wallsFromGameMap", () => {
    it("returns walls in the game map", () => {
      const gameMap: GameMap = [
        "### ",
        "# M ",
        "    ",
        " MM ",
        "    ",
        "    ",
      ].map((x) => x.split(""));
      const walls: Wall[] = wallsFromGameMap(gameMap);
      const expected = [
        { size: 20, x: 0, y: 0 },
        { size: 20, x: 20, y: 0 },
        { size: 20, x: 40, y: 0 },
        { size: 20, x: 0, y: 20 },
      ];
      expect(walls).toEqual(expected);
    });
  });

  describe("exitsFromGameMap", () => {
    it("returns exits in the game map", () => {
      const gameMap: GameMap = [
        "### ",
        "# M ",
        "E   ",
        "EMM ",
        "    ",
        "    ",
      ].map((x) => x.split(""));
      const exits: Exit[] = exitsFromGameMap(gameMap);
      const expected = [
        { size: 20, x: 0, y: 40 },
        { size: 20, x: 0, y: 60 },
      ];
      expect(exits).toEqual(expected);
    });
  });
});
