import { useEffect, useReducer } from "react";

type GameMap = string[][];

type XY = { x: number; y: number };

type Player = XY;

type State = { keysDown: Set<string>; player: Player };

const boxSize = 20;

const gameMap: GameMap = [
  "#EEEE###############",
  "#    #             #",
  "#    #             #",
  "#    #             #",
  "#    #    ####     #",
  "#                  #",
  "#             #    #",
  "######        #    #",
  "#                  #",
  "#       ####       #",
  "#                  #",
  "#                  #",
  "#            #     #",
  "######       #     #",
  "#  P #       #     #",
  "#    #       #     #",
  "#    #             #",
  "#                  #",
  "#                  #",
  "####################",
].map((row) => row.split(""));

const gameMapToPlayer = (gameMap: GameMap): Player => {
  return (
    gameMap
      .flatMap((row, y) => {
        return row.flatMap((box, x) => {
          return box === "P" ? { x: x * boxSize, y: y * boxSize } : undefined;
        });
      })
      .filter(Boolean)[0] ?? { x: 0, y: 0 }
  );
};

const gameMapToWalls = (gameMap: GameMap): XY[] => {
  return gameMap
    .flatMap((row, y) => {
      return row.flatMap((box, x) => {
        return box === "#" ? { x: x * boxSize, y: y * boxSize } : undefined;
      });
    })
    .filter(Boolean);
};

const walls: XY[] = gameMapToWalls(gameMap);

const initPlayer: Player = gameMapToPlayer(gameMap);

const initState: State = { keysDown: new Set(), player: initPlayer };

type Action =
  | { type: "TICK" }
  | { type: "KEY_DOWN"; key: string }
  | { type: "KEY_UP"; key: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TICK": {
      const player = updatePlayer(state.keysDown, state.player);
      if (player === state.player) return state;
      return { ...state, player };
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

  if (x === player.x && y === player.y) {
    return player;
  }
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
      dispatch({ type: "TICK" });
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
      </div>
    </div>
  );
};
