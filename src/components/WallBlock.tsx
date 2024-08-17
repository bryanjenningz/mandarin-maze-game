import { SCREEN_SIZE, BLOCK_SIZE } from "../state/constants";
import type { Wall } from "../state/types";

type WallProps = {
  wall: Wall;
};

export const WallBlock = ({ wall }: WallProps) => {
  return (
    <div
      className="absolute bg-blue-700"
      style={{
        left: `${(wall.x / SCREEN_SIZE) * 100}%`,
        top: `${(wall.y / SCREEN_SIZE) * 100}%`,
        width: `${(BLOCK_SIZE / SCREEN_SIZE) * 100}%`,
        height: `${(BLOCK_SIZE / SCREEN_SIZE) * 100}%`,
      }}
    ></div>
  );
};
