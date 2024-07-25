import { useEffect, useReducer } from "react";

type GameMap = string[][];

type XY = { x: number; y: number };

type Player = XY;

type Monster = XY & { target: XY | null };

type MonsterTarget = { dx: number; dy: number; override: boolean };

type State = { keysDown: Set<string>; player: Player; monsters: Monster[] };

const boxSize = 20;

const gameMap: GameMap = [
  "#EEEE###############",
  "#    #             #",
  "#    #       X     #",
  "#    #             #",
  "#    #    ####     #",
  "#  X            X  #",
  "#                  #",
  "######         #   #",
  "#              #   #",
  "#  X    ####       #",
  "#                  #",
  "#                  #",
  "#            #     #",
  "######       #  X  #",
  "#  P #       #     #",
  "#    #       #     #",
  "#    #             #",
  "#                  #",
  "#                  #",
  "####################",
].map((row) => row.split(""));

const gameMapBoxLocations = (gameMap: GameMap, targetBox: string): XY[] => {
  return gameMap
    .flatMap((row, y) => {
      return row.flatMap((box, x) => {
        return box === targetBox ? { x: x * boxSize, y: y * boxSize } : null;
      });
    })
    .filter(Boolean);
};

const gameMapToPlayer = (gameMap: GameMap): Player => {
  return gameMapBoxLocations(gameMap, "P")[0] ?? { x: 0, y: 0 };
};

const gameMapToWalls = (gameMap: GameMap): XY[] => {
  return gameMapBoxLocations(gameMap, "#");
};

const gameMapToMonsters = (gameMap: GameMap): Monster[] => {
  return gameMapBoxLocations(gameMap, "X").map((monster) => {
    return { ...monster, target: null };
  });
};

const walls: XY[] = gameMapToWalls(gameMap);
const initPlayer: Player = gameMapToPlayer(gameMap);
const initMonsters: Monster[] = gameMapToMonsters(gameMap);
const initState: State = {
  keysDown: new Set(),
  player: initPlayer,
  monsters: initMonsters,
};

type Action =
  | { type: "TICK"; monsterTargets: MonsterTarget[] }
  | { type: "KEY_DOWN"; key: string }
  | { type: "KEY_UP"; key: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TICK": {
      const player = updatePlayer(state.keysDown, state.player);
      const monsters = updateMonsters(state.monsters, action.monsterTargets);
      return { ...state, player, monsters };
    }
    case "KEY_DOWN": {
      const keysDown = new Set([...state.keysDown, action.key]);
      return { ...state, keysDown };
    }
    case "KEY_UP": {
      const keysDown = new Set(
        [...state.keysDown].filter((key) => key !== action.key)
      );
      return { ...state, keysDown };
    }
  }
};

const updatePlayer = (keysDown: Set<string>, player: Player): Player => {
  const x = ((): number => {
    if (keysDown.has("ArrowLeft")) {
      return Math.max(0, player.x - 1);
    }
    if (keysDown.has("ArrowRight")) {
      return Math.min(boxSize * (boxSize - 1), player.x + 1);
    }
    return player.x;
  })();

  const y = ((): number => {
    if (keysDown.has("ArrowUp")) {
      return Math.max(0, player.y - 1);
    }
    if (keysDown.has("ArrowDown")) {
      return Math.min(boxSize * (boxSize - 1), player.y + 1);
    }
    return player.y;
  })();

  if (!walls.some((wall) => isOverlapping({ x, y }, wall))) {
    return { x, y };
  }
  if (!walls.some((wall) => isOverlapping({ x, y: player.y }, wall))) {
    return { x, y: player.y };
  }
  if (!walls.some((wall) => isOverlapping({ x: player.x, y }, wall))) {
    return { x: player.x, y };
  }
  return player;
};

const range = (lower: number, upper: number): number[] => {
  const result: number[] = [];
  for (let i = lower; i < upper; i += 1) result.push(i);
  return result;
};

const generateMonsterTargets = (monsterCount: number): MonsterTarget[] => {
  return range(0, monsterCount).map(() => {
    const randomValue = Math.floor(Math.random() * 25);
    const randomDeltaX = (randomValue % 5) - 2;
    const randomDeltaY = Math.floor(randomValue / 5);
    return {
      dx: randomDeltaX * boxSize,
      dy: randomDeltaY * boxSize,
      override: Math.random() < 0.1,
    };
  });
};

const updateMonsters = (
  monsters: Monster[],
  monsterTargets: MonsterTarget[]
): Monster[] => {
  return monsters.map((monster, i) => {
    const { dx, dy, override } = monsterTargets[i] ?? {
      dx: 0,
      dy: 0,
      override: false,
    };
    if (dx === 0 && dy === 0) return { ...monster, target: null };
    const target = (() => {
      const newTarget = { x: monster.x + dx, y: monster.y + dy };
      if (override) return newTarget;
      return monster.target ?? newTarget;
    })();
    const x = clamp(-1, target.x - monster.x, 1) + monster.x;
    const y = clamp(-1, target.y - monster.y, 1) + monster.y;
    if (!walls.some((wall) => isOverlapping({ x, y }, wall))) {
      return { x, y, target };
    }
    if (!walls.some((wall) => isOverlapping({ x, y: monster.y }, wall))) {
      return { x, y: monster.y, target };
    }
    if (!walls.some((wall) => isOverlapping({ x: monster.x, y }, wall))) {
      return { x: monster.x, y, target };
    }
    return { ...monster, target: null };
  });
};

const clamp = (lower: number, value: number, upper: number): number => {
  return Math.max(lower, Math.min(upper, value));
};

const isOverlapping = (a: XY, b: XY): boolean => {
  return (
    a.x + boxSize > b.x &&
    a.x < b.x + boxSize &&
    a.y + boxSize > b.y &&
    a.y < b.y + boxSize
  );
};

export const Game = () => {
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
        monsterTargets: generateMonsterTargets(initMonsters.length),
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

        <div
          className="absolute bg-blue-400 w-[5%] h-[5%]"
          style={{
            left: (state.player.x / (boxSize * boxSize)) * 100 + "%",
            top: (state.player.y / (boxSize * boxSize)) * 100 + "%",
          }}
        ></div>

        {state.monsters.map((monster, i) => {
          return (
            <div
              key={i}
              className="absolute bg-red-700 w-[5%] h-[5%]"
              style={{
                left: (monster.x / (boxSize * boxSize)) * 100 + "%",
                top: (monster.y / (boxSize * boxSize)) * 100 + "%",
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};
