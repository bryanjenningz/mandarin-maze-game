import { type Player, boxSize, walls } from "../components/Game";
import { isOverlapping } from "./Box";

export const updatePlayer = (keysDown: Set<string>, player: Player): Player => {
  const x = ((): number => {
    if (keysDown.has("ArrowLeft")) {
      return Math.max(0, player.x - 1);
    }
    if (keysDown.has("ArrowRight")) {
      return Math.min(boxSize * (boxSize - 1), player.x + 1);
    }
    return player.x;
  })();

  const y = ((): number => {
    if (keysDown.has("ArrowUp")) {
      return Math.max(0, player.y - 1);
    }
    if (keysDown.has("ArrowDown")) {
      return Math.min(boxSize * (boxSize - 1), player.y + 1);
    }
    return player.y;
  })();

  if (!walls.some((wall) => isOverlapping({ x, y, size: boxSize }, wall))) {
    return { x, y };
  }
  if (
    !walls.some((wall) =>
      isOverlapping({ x, y: player.y, size: boxSize }, wall)
    )
  ) {
    return { x, y: player.y };
  }
  if (
    !walls.some((wall) =>
      isOverlapping({ x: player.x, y, size: boxSize }, wall)
    )
  ) {
    return { x: player.x, y };
  }
  return player;
};
