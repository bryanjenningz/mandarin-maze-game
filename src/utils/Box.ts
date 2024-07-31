export type XY = { x: number; y: number };

export type Box = XY & { size: number };

export const boxSize = 20;

export const isInBounds = ({ x, y, size }: Box): boolean => {
  return (
    x >= 0 &&
    x <= boxSize * boxSize - size &&
    y >= 0 &&
    y <= boxSize * boxSize - size
  );
};

export const isOverlapping = (a: Box, b: Box): boolean => {
  return (
    a.x + a.size > b.x &&
    a.x < b.x + b.size &&
    a.y + a.size > b.y &&
    a.y < b.y + b.size
  );
};
