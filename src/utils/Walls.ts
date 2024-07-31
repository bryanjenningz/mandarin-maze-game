import type { Box } from "./Box";
import * as GameMap from "./GameMap";

export const walls: Box[] = GameMap.toWalls(GameMap.init);
