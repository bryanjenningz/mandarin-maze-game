import { useEffect, useReducer } from "react";
import { range } from "../utils/range";
import { reducer } from "../utils/State";
import {
  gameMap,
  gameMapToMonsters,
  gameMapToPlayer,
  gameMapToWalls,
} from "../utils/GameMap";
import type { Box, XY } from "../utils/Box";

export type Player = XY;

export type Monster = XY & { target: XY | null; health: number };

export type MonsterRandomTarget = {
  dx: number;
  dy: number;
  override: boolean;
};

export type Bullet = { x: number; y: number; dx: number; dy: number };

export type State = {
  keysDown: Set<string>;
  player: Player;
  monsters: Monster[];
  lastBulletShotTime: number;
  bullets: Bullet[];
};

export const boxSize = 20;

export const bulletSize = boxSize / 5;

export const walls: Box[] = gameMapToWalls(gameMap);
const initPlayer: Player = gameMapToPlayer(gameMap);
const initMonsters: Monster[] = gameMapToMonsters(gameMap);
const initState: State = {
  keysDown: new Set(),
  player: initPlayer,
  monsters: initMonsters,
  lastBulletShotTime: 0,
  bullets: [],
};

export type Action =
  | { type: "TICK"; time: number; monsterRandomness: MonsterRandomTarget[] }
  | { type: "KEY_DOWN"; key: string }
  | { type: "KEY_UP"; key: string };

const generateMonsterTargets = (
  monsterCount: number
): MonsterRandomTarget[] => {
  return range(0, monsterCount).map((): MonsterRandomTarget => {
    const randomValue = Math.floor(Math.random() * 25);
    const randomDeltaX = (randomValue % 5) - 2;
    const randomDeltaY = Math.floor(randomValue / 5) - 2;
    return {
      dx: randomDeltaX * boxSize,
      dy: randomDeltaY * boxSize,
      override: Math.random() < 0.05,
    };
  });
};

export const Game = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) =>
      dispatch({ type: "KEY_DOWN", key: e.key });
    const handleKeyUp = (e: KeyboardEvent) =>
      dispatch({ type: "KEY_UP", key: e.key });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let stop = false;
    const tick = () => {
      if (stop) return;
      dispatch({
        type: "TICK",
        time: Date.now(),
        monsterRandomness: generateMonsterTargets(initMonsters.length),
      });
      requestAnimationFrame(tick);
    };
    tick();
    return () => {
      stop = true;
    };
  }, []);

  return (
    <div className="h-[100svh] flex flex-col justify-center items-center">
      <div className="relative aspect-square bg-slate-800 w-full max-w-2xl flex flex-col">
        {gameMap.map((row, y) => {
          return (
            <div key={y} className="flex h-[5%]">
              {row.map((box, x) => {
                return (
                  <div
                    key={x}
                    className={
                      "w-full " +
                      ((): string => {
                        switch (box) {
                          case "#":
                            return "bg-blue-800";
                          case " ":
                          case "E":
                          case "P":
                          case "X":
                            return "bg-black";
                          default:
                            return "";
                        }
                      })()
                    }
                  ></div>
                );
              })}
            </div>
          );
        })}

        {state.monsters.map((monster, i) => {
          return (
            <div
              key={i}
              className="absolute bg-red-700 w-[5%] h-[5%]"
              style={{
                left: (monster.x / (boxSize * boxSize)) * 100 + "%",
                top: (monster.y / (boxSize * boxSize)) * 100 + "%",
              }}
            >
              {monster.health < 100 && (
                <div className="absolute -top-5 h-1/4 w-full bg-red-700">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-green-500"
                    style={{ width: monster.health + "%" }}
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
              className="absolute bg-cyan-600 w-[1%] h-[1%]"
              style={{
                left: (bullet.x / (boxSize * boxSize)) * 100 + "%",
                top: (bullet.y / (boxSize * boxSize)) * 100 + "%",
              }}
            ></div>
          );
        })}

        <div
          className="absolute bg-blue-400 w-[5%] h-[5%]"
          style={{
            left: (state.player.x / (boxSize * boxSize)) * 100 + "%",
            top: (state.player.y / (boxSize * boxSize)) * 100 + "%",
          }}
        ></div>
      </div>
    </div>
  );
};
