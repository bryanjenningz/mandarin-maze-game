import { boxSize } from "../components/Game";
import type { Box } from "./Box";

export const isInBounds = ({ x, y, size }: Box): boolean => {
  return (
    x >= 0 &&
    x <= boxSize * boxSize - size &&
    y >= 0 &&
    y <= boxSize * boxSize - size
  );
};
