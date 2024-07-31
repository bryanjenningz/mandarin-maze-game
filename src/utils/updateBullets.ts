import {
  type Player,
  type Bullet,
  type Monster,
  bulletSize,
  walls,
  boxSize,
} from "../components/Game";
import { isOverlapping } from "./isOverlapping";
import { isInBounds } from "./Box";

export const updateBullets = (
  keysDown: Set<string>,
  player: Player,
  time: number,
  lastBulletShotTime: number,
  bullets: Bullet[],
  monsters: Monster[]
): { lastBulletShotTime: number; bullets: Bullet[] } => {
  const newBullets = bullets
    .map((bullet) => {
      return { ...bullet, x: bullet.x + bullet.dx, y: bullet.y + bullet.dy };
    })
    .filter(
      (bullet) =>
        isInBounds({ x: bullet.x, y: bullet.y, size: bulletSize }) &&
        !walls.some((wall) =>
          isOverlapping({ x: bullet.x, y: bullet.y, size: bulletSize }, wall)
        ) &&
        !monsters.some((monster) =>
          isOverlapping(
            { x: bullet.x, y: bullet.y, size: bulletSize },
            { x: monster.x, y: monster.y, size: boxSize }
          )
        )
    );
  let dx = 0;
  let dy = 0;
  const bulletSpeed = 2;
  if (keysDown.has("w")) dy -= bulletSpeed;
  if (keysDown.has("s")) dy += bulletSpeed;
  if (keysDown.has("a")) dx -= bulletSpeed;
  if (keysDown.has("d")) dx += bulletSpeed;
  if (dx === 0 && dy === 0) return { lastBulletShotTime, bullets: newBullets };
  const bulletDelay = 100;
  if (time - lastBulletShotTime <= bulletDelay)
    return { lastBulletShotTime, bullets: newBullets };
  return {
    lastBulletShotTime: time,
    bullets: [...newBullets, { x: player.x, y: player.y, dx, dy }],
  };
};
