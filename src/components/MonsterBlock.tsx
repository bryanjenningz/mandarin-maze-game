import { SCREEN_SIZE, BLOCK_SIZE } from "../state/constants";
import type { Monster } from "../state/types";
import { classNames } from "./utils";

type MonsterProps = {
  monster: Monster;
  closest: Monster | null;
};

export const MonsterBlock = ({ monster, closest }: MonsterProps) => {
  return (
    <div
      className={classNames(
        "absolute",
        monster.health > 0
          ? closest === monster
            ? "bg-blue-900"
            : "bg-red-700"
          : "bg-black"
      )}
      style={{
        left: `${(monster.x / SCREEN_SIZE) * 100}%`,
        top: `${(monster.y / SCREEN_SIZE) * 100}%`,
        width: `${(BLOCK_SIZE / SCREEN_SIZE) * 100}%`,
        height: `${(BLOCK_SIZE / SCREEN_SIZE) * 100}%`,
      }}
    >
      {monster.health > 0 && (
        <div className="absolute -top-4 left-0 right-0 h-2 bg-red-700">
          <div
            className="absolute top-0 left-0 bottom-0 bg-green-500"
            style={{ width: `${monster.health}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};
