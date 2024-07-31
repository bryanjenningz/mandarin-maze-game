import type { Box } from "./box";
import * as GameMap from "./game-map";

export const init: Box[] = GameMap.toWalls(GameMap.init);
