import { SCREEN_SIZE, BULLET_SIZE } from "../state/constants";
import type { Bullet } from "../state/types";

type BulletProps = {
  bullet: Bullet;
};

export const BulletBlock = ({ bullet }: BulletProps) => {
  return (
    <div
      className="absolute bg-cyan-400"
      style={{
        left: `${(bullet.x / SCREEN_SIZE) * 100}%`,
        top: `${(bullet.y / SCREEN_SIZE) * 100}%`,
        width: `${(BULLET_SIZE / SCREEN_SIZE) * 100}%`,
        height: `${(BULLET_SIZE / SCREEN_SIZE) * 100}%`,
      }}
    ></div>
  );
};
