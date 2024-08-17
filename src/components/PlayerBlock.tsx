import { BLOCK_SIZE, SCREEN_SIZE } from "../state/constants";
import type { Player } from "../state/types";
import { classNames } from "./utils";

type PlayerProps = {
  player: Player;
};

export const PlayerBlock = ({ player }: PlayerProps) => {
  return (
    <div
      className={classNames(
        "absolute",
        player.health > 0 ? "bg-cyan-700" : "bg-black"
      )}
      style={{
        left: `${(player.x / SCREEN_SIZE) * 100}%`,
        top: `${(player.y / SCREEN_SIZE) * 100}%`,
        width: `${(BLOCK_SIZE / SCREEN_SIZE) * 100}%`,
        height: `${(BLOCK_SIZE / SCREEN_SIZE) * 100}%`,
      }}
    >
      <div className="absolute -top-4 left-0 right-0 h-2 bg-red-700">
        <div
          className="absolute top-0 left-0 bottom-0 bg-green-500"
          style={{ width: `${Math.max(0, player.health)}%` }}
        ></div>
      </div>
    </div>
  );
};
