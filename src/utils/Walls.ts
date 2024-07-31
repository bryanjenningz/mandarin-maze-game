import type { Box } from "./box";
import { gameMap, gameMapToWalls } from "./game-map";

export const init: Box[] = gameMapToWalls(gameMap);
