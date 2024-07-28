import { type Box, boxSize } from "../components/Game";

export const isInBounds = ({ x, y, size }: Box): boolean => {
  return (
    x >= 0 &&
    x <= boxSize * boxSize - size &&
    y >= 0 &&
    y <= boxSize * boxSize - size
  );
};
