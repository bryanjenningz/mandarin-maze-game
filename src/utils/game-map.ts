import { type Monster, type Player } from "../components/game";
import { type XY, type Box, boxSize } from "./box";

type GameMap = string[][];

export const gameMap: GameMap = [
  "#EEEE###############",
  "#    #             #",
  "#    #       X     #",
  "#    #             #",
  "#    #    ####     #",
  "#  X            X  #",
  "#                  #",
  "######         #   #",
  "#              #   #",
  "#  X    ####       #",
  "#                  #",
  "#                  #",
  "#            #     #",
  "######       #  X  #",
  "#  P #       #     #",
  "#    #       #     #",
  "#    #             #",
  "#                  #",
  "#                  #",
  "####################",
].map((row) => row.split(""));

const gameMapBoxLocations = (gameMap: GameMap, targetBox: string): XY[] => {
  return gameMap
    .flatMap((row, y) => {
      return row.flatMap((box, x) => {
        return box === targetBox ? { x: x * boxSize, y: y * boxSize } : null;
      });
    })
    .filter(Boolean);
};

export const gameMapToPlayer = (gameMap: GameMap): Player => {
  return gameMapBoxLocations(gameMap, "P")[0] ?? { x: 0, y: 0 };
};

export const gameMapToWalls = (gameMap: GameMap): Box[] => {
  return gameMapBoxLocations(gameMap, "#").map(({ x, y }) => {
    return { x, y, size: boxSize };
  });
};

export const gameMapToMonsters = (gameMap: GameMap): Monster[] => {
  return gameMapBoxLocations(gameMap, "X").map((monster) => {
    return { ...monster, target: null, health: 100 };
  });
};
