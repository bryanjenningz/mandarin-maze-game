import { useEffect, useReducer } from "react";
import { initState, reducer } from "../state/reducer";
import { BLOCK_SIZE, BULLET_SIZE, SCREEN_SIZE } from "../state/constants";

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
      dispatch({ type: "TICK", targets: [] });
      requestAnimationFrame(update);
    };
    update();
    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <div className="text-white bg-black w-full h-[100svh] flex justify-center items-center">
      <div className="relative aspect-square w-full max-w-2xl bg-gray-800">
        {state.walls.map((wall, i) => {
          return (
            <div
              key={i}
              className="absolute bg-blue-700"
              style={{
                left: `${(wall.x / SCREEN_SIZE) * 100}%`,
                top: `${(wall.y / SCREEN_SIZE) * 100}%`,
                width: `${(BLOCK_SIZE / SCREEN_SIZE) * 100}%`,
                height: `${(BLOCK_SIZE / SCREEN_SIZE) * 100}%`,
              }}
            ></div>
          );
        })}

        {state.monsters.map((monster, i) => {
          return (
            <div
              key={i}
              className="absolute bg-red-700"
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
        })}

        {state.bullets.map((bullet, i) => {
          return (
            <div
              key={i}
              className="absolute bg-cyan-400"
              style={{
                left: `${(bullet.x / SCREEN_SIZE) * 100}%`,
                top: `${(bullet.y / SCREEN_SIZE) * 100}%`,
                width: `${(BULLET_SIZE / SCREEN_SIZE) * 100}%`,
                height: `${(BULLET_SIZE / SCREEN_SIZE) * 100}%`,
              }}
            ></div>
          );
        })}

        <div
          className="absolute bg-cyan-700"
          style={{
            left: `${(state.player.x / SCREEN_SIZE) * 100}%`,
            top: `${(state.player.y / SCREEN_SIZE) * 100}%`,
            width: `${(BLOCK_SIZE / SCREEN_SIZE) * 100}%`,
            height: `${(BLOCK_SIZE / SCREEN_SIZE) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};
