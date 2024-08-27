import { useEffect } from "react";
import { generateMonsterMoves } from "../state/random";
import type { Action, Monster } from "../state/types";

export const useTick = (
  monsters: Monster[],
  dispatch: React.Dispatch<Action>
): void => {
  useEffect(() => {
    let unmounted = false;
    const update = () => {
      if (unmounted) return;
      dispatch({
        type: "TICK",
        time: Date.now(),
        monsterMoves: generateMonsterMoves(monsters),
      });
      requestAnimationFrame(update);
    };
    update();
    return () => {
      unmounted = true;
    };
  }, []);
};
