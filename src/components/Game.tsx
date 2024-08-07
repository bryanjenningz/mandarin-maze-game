import { useEffect, useReducer } from "react";
import { BLOCK_SIZE, initState, reducer, SCREEN_SIZE } from "../state/reducer";

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
