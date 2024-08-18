import { BLOCK_SIZE } from "./constants";
import type { Wall, Exit, Monster, Player, GameMap } from "./types";

const gameMap1 = [
  "#EEE################",
  "#   #              #",
  "#   #          M   #",
  "# M #              #",
  "#   #    #####     #",
  "#                  #",
  "#     M            #",
  "#              M   #",
  "#####              #",
  "#                  #",
  "#                  #",
  "#   #              #",
  "#   #    #####     #",
  "#                  #",
  "#                  #",
  "#####         #    #",
  "#   #   #     #  M #",
  "# P     #          #",
  "#       #          #",
  "####################",
].map((line) => line.split(""));

const gameMap2 = [
  "####################",
  "#                  E",
  "#   M              E",
  "#                  E",
  "#       ############",
  "#                  #",
  "#            M     #",
  "#    ##########    #",
  "#                  #",
  "#                  #",
  "#   M              #",
  "#                  #",
  "#      ####  ##    #",
  "#                  #",
  "#              #   #",
  "#  ###        #    #",
  "#       #    #   M #",
  "# M     #    #     #",
  "#       # P  #     #",
  "####################",
].map((line) => line.split(""));

export const gameMaps: [GameMap, ...GameMap[]] = [gameMap1, gameMap2];

type Tile = { x: number; y: number; size: typeof BLOCK_SIZE };

const tilesFromGameMap = (gameMap: string[][], targetTile: string): Tile[] => {
  return gameMap.flatMap((row, y) => {
    return row
      .map((tile, x): Tile | null => {
        if (tile === targetTile) {
          return { x: x * BLOCK_SIZE, y: y * BLOCK_SIZE, size: BLOCK_SIZE };
        }
        return null;
      })
      .filter(Boolean);
  });
};

export const wallsFromGameMap = (gameMap: string[][]): Wall[] => {
  return tilesFromGameMap(gameMap, "#");
};

export const exitsFromGameMap = (gameMap: string[][]): Exit[] => {
  return tilesFromGameMap(gameMap, "E");
};

export const monstersFromGameMap = (gameMap: string[][]): Monster[] => {
  return tilesFromGameMap(gameMap, "M").map((tile): Monster => {
    return {
      x: tile.x,
      y: tile.y,
      size: tile.size,
      health: 100,
      target: null,
    };
  });
};

export const playerFromGameMap = (gameMap: string[][]): Player | null => {
  const tile = tilesFromGameMap(gameMap, "P")[0];
  if (!tile) return null;
  return { ...tile, health: 100 };
};
