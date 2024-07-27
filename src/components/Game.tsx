import { useEffect, useReducer } from "react";
import { range } from "../utils/range";

type GameMap = string[][];

type XY = { x: number; y: number };

type Box = XY & { size: number };

type Player = XY;

type Monster = XY & { target: XY | null; health: number };

type MonsterRandomness = { dx: number; dy: number; targetOverride: boolean };

type Bullet = { x: number; y: number; dx: number; dy: number };

type State = {
  keysDown: Set<string>;
  player: Player;
  monsters: Monster[];
  lastBulletShotTime: number;
  bullets: Bullet[];
};

const boxSize = 20;

const bulletSize = boxSize / 5;

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

const gameMapToWalls = (gameMap: GameMap): Box[] => {
  return gameMapBoxLocations(gameMap, "#").map(({ x, y }) => {
    return { x, y, size: boxSize };
  });
};

const gameMapToMonsters = (gameMap: GameMap): Monster[] => {
  return gameMapBoxLocations(gameMap, "X").map((monster) => {
    return { ...monster, target: null, health: 100 };
  });
};

const walls: Box[] = gameMapToWalls(gameMap);
const initPlayer: Player = gameMapToPlayer(gameMap);
const initMonsters: Monster[] = gameMapToMonsters(gameMap);
const initState: State = {
  keysDown: new Set(),
  player: initPlayer,
  monsters: initMonsters,
  lastBulletShotTime: 0,
  bullets: [],
};

type Action =
  | { type: "TICK"; time: number; monsterRandomness: MonsterRandomness[] }
  | { type: "KEY_DOWN"; key: string }
  | { type: "KEY_UP"; key: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TICK": {
      const player = updatePlayer(state.keysDown, state.player);
      const monsters = updateMonsters(
        state.monsters,
        action.monsterRandomness,
        state.bullets
      );
      const { lastBulletShotTime, bullets } = updateBullets(
        state.keysDown,
        state.player,
        action.time,
        state.lastBulletShotTime,
        state.bullets,
        state.monsters
      );
      return { ...state, player, monsters, bullets, lastBulletShotTime };
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

  if (!walls.some((wall) => isOverlapping({ x, y, size: boxSize }, wall))) {
    return { x, y };
  }
  if (
    !walls.some((wall) =>
      isOverlapping({ x, y: player.y, size: boxSize }, wall)
    )
  ) {
    return { x, y: player.y };
  }
  if (
    !walls.some((wall) =>
      isOverlapping({ x: player.x, y, size: boxSize }, wall)
    )
  ) {
    return { x: player.x, y };
  }
  return player;
};

const generateMonsterTargets = (monsterCount: number): MonsterRandomness[] => {
  return range(0, monsterCount).map((): MonsterRandomness => {
    const randomValue = Math.floor(Math.random() * 25);
    const randomDeltaX = (randomValue % 5) - 2;
    const randomDeltaY = Math.floor(randomValue / 5) - 2;
    return {
      dx: randomDeltaX * boxSize,
      dy: randomDeltaY * boxSize,
      targetOverride: Math.random() < 0.05,
    };
  });
};

const updateMonsters = (
  monsters: Monster[],
  monsterRandomness: MonsterRandomness[],
  bullets: Bullet[]
): Monster[] => {
  return monsters.map((monster, i): Monster => {
    const { dx, dy, targetOverride } = monsterRandomness[i] ?? {
      dx: 0,
      dy: 0,
      targetOverride: false,
    };
    const bulletDamage = 10;
    const health =
      monster.health -
      bullets.filter((bullet) => {
        return isOverlapping(
          { x: monster.x, y: monster.y, size: boxSize },
          { x: bullet.x, y: bullet.y, size: bulletSize }
        );
      }).length *
        bulletDamage;
    if (dx === 0 && dy === 0) return { ...monster, target: null, health };
    const target = (() => {
      const newTarget = { x: monster.x + dx, y: monster.y + dy };
      if (targetOverride) return newTarget;
      return monster.target ?? newTarget;
    })();
    const x = clamp(-1, target.x - monster.x, 1) + monster.x;
    const y = clamp(-1, target.y - monster.y, 1) + monster.y;
    if (
      !walls.some((wall) => isOverlapping({ x, y, size: boxSize }, wall)) &&
      isInBounds({ x, y, size: boxSize })
    ) {
      return { x, y, target, health };
    }
    if (
      !walls.some((wall) =>
        isOverlapping({ x, y: monster.y, size: boxSize }, wall)
      ) &&
      isInBounds({ x, y: monster.y, size: boxSize })
    ) {
      return { x, y: monster.y, target, health };
    }
    if (
      !walls.some((wall) =>
        isOverlapping({ x: monster.x, y, size: boxSize }, wall)
      ) &&
      isInBounds({ x: monster.x, y, size: boxSize })
    ) {
      return { x: monster.x, y, target, health };
    }
    return { ...monster, target: null, health };
  });
};

const updateBullets = (
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

const isInBounds = ({ x, y, size }: Box): boolean => {
  return (
    x >= 0 &&
    x <= boxSize * boxSize - size &&
    y >= 0 &&
    y <= boxSize * boxSize - size
  );
};

const clamp = (lower: number, value: number, upper: number): number => {
  return Math.max(lower, Math.min(upper, value));
};

const isOverlapping = (a: Box, b: Box): boolean => {
  return (
    a.x + a.size > b.x &&
    a.x < b.x + b.size &&
    a.y + a.size > b.y &&
    a.y < b.y + b.size
  );
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
