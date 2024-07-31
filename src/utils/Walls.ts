import type { Box } from "./box";
import * as GameMap from "./GameMap";

export const init: Box[] = GameMap.toWalls(GameMap.init);
