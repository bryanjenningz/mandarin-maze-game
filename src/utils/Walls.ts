import type { Box } from "./Box";
import * as GameMap from "./GameMap";

export const init: Box[] = GameMap.toWalls(GameMap.init);
