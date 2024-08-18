import { useEffect, useReducer } from "react";
import { initState, reducer } from "../state/reducer";
import { BLOCK_SIZE } from "../state/constants";
import type { Monster, MonsterMove, Target } from "../state/types";
import { closestMonster } from "../state/utils";
import { PlayerBlock } from "./PlayerBlock";
import { BulletBlock } from "./BulletBlock";
import { MonsterBlock } from "./MonsterBlock";
import { WallBlock } from "./WallBlock";

const generateTarget = ({ x, y }: Monster): Target | null => {
  if (Math.random() < 0.98) return null;
  return {
    x: x + (Math.floor(Math.random() * 11) - 3) * BLOCK_SIZE,
    y: y + (Math.floor(Math.random() * 11) - 3) * BLOCK_SIZE,
  };
};

const generateMonsterMove = (monster: Monster): MonsterMove => {
  return {
    shoot: Math.random() < 0.02,
    target: generateTarget(monster),
  };
};

const generateMonsterMoves = (monsters: Monster[]): MonsterMove[] => {
  return monsters.map(generateMonsterMove);
};

export const Game = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      dispatch({ type: "KEY_DOWN", key: e.key });
    };
    const onKeyUp = (e: KeyboardEvent) => {
      dispatch({ type: "KEY_UP", key: e.key });
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    let unmounted = false;
    const update = () => {
      if (unmounted) return;
      dispatch({
        type: "TICK",
        time: Date.now(),
        monsterMoves: generateMonsterMoves(state.monsters),
      });
      requestAnimationFrame(update);
    };
    update();
    return () => {
      unmounted = true;
    };
  }, []);

  const closest = closestMonster(state.player, state.monsters);

  return (
    <div className="text-white bg-black w-full h-[100svh] flex justify-center items-center">
      <div className="relative aspect-square w-full max-w-2xl bg-gray-800">
        {state.walls.map((wall, i) => {
          return <WallBlock key={i} wall={wall} />;
        })}

        {state.monsters.length > 0 &&
          state.exits.map((exit, i) => {
            return <WallBlock key={i} wall={exit} />;
          })}

        {state.monsters.map((monster, i) => {
          return <MonsterBlock key={i} monster={monster} closest={closest} />;
        })}

        {state.monsterBullets.map((bullet, i) => {
          return <BulletBlock key={i} bullet={bullet} />;
        })}

        {state.bullets.map((bullet, i) => {
          return <BulletBlock key={i} bullet={bullet} />;
        })}

        <PlayerBlock player={state.player} />
      </div>
    </div>
  );
};
