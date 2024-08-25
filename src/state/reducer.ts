import { textToDictionaryEntries } from "../dictionary/textToDictionaryEntries";
import type { Dictionary, DictionaryEntry } from "../dictionary/types";
import {
  BLOCK_SIZE,
  BULLET_DAMAGE,
  BULLET_FIRE_DELAY,
  BULLET_SIZE,
  BULLET_SPEED,
  SCREEN_SIZE,
} from "./constants";
import {
  exitsFromGameMap,
  gameMaps,
  monstersFromGameMap,
  playerFromGameMap,
  wallsFromGameMap,
} from "./gameMap";
import type {
  State,
  Action,
  Monster,
  Bullet,
  Player,
  MonsterMove,
  Status,
  MandarinWord,
} from "./types";
import { clamp, closestMonster, inBounds, overlaps } from "./utils";

const textToMandarinWords = (
  mandarinDictionary: Dictionary,
  mandarinText: string
): MandarinWord[] => {
  return textToDictionaryEntries(mandarinDictionary, mandarinText).map(
    (dictionaryEntry: DictionaryEntry): MandarinWord => {
      return {
        word: dictionaryEntry.traditional,
        pronunciation: dictionaryEntry.pronunciation,
        context: mandarinText,
        meaning: dictionaryEntry.meaning,
      };
    }
  );
};

export const initMandarinText =
  "他們以前連飯都吃不飽，現在生活條件已經改善了很多";

export const initState: State = {
  mandarinDictionary: { traditional: [], simplified: [] },
  mandarinText: initMandarinText,
  mandarinWords: [],
  unknownWords: [],
  status: { type: "START" },
  gameMapLevel: 0,
  gameMaps,
  keysDown: new Set(),
  player: playerFromGameMap(gameMaps[0]) ?? {
    x: 20,
    y: 20,
    size: 20,
    health: 100,
  },
  itemCount: 0,
  monsters: monstersFromGameMap(gameMaps[0]),
  bullets: [],
  lastBulletFiredAt: 0,
  monsterBullets: [],
  walls: wallsFromGameMap(gameMaps[0]),
  exits: exitsFromGameMap(gameMaps[0]),
};

// #region Reducer

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_MANDARIN_DICTIONARY": {
      const { mandarinDictionary } = action;
      const mandarinWords: MandarinWord[] = textToMandarinWords(
        mandarinDictionary,
        state.mandarinText
      );
      return { ...state, mandarinDictionary, mandarinWords };
    }
    case "SET_MANDARIN_TEXT": {
      const { mandarinText } = action;
      const mandarinWords: MandarinWord[] = textToMandarinWords(
        state.mandarinDictionary,
        mandarinText
      );
      const unknownWords: string[] = state.unknownWords.filter(
        (word) =>
          !!mandarinWords.find((mandarinWord) => mandarinWord.word === word)
      );
      return {
        ...state,
        mandarinText,
        mandarinWords,
        unknownWords,
      };
    }
    case "TOGGLE_MANDARIN_WORD_KNOWN": {
      const unknownWords: string[] = (() => {
        const hasWord = state.unknownWords.includes(action.word);
        if (hasWord) {
          return state.unknownWords.filter((word) => word !== action.word);
        }
        return [...state.unknownWords, action.word];
      })();
      return { ...state, unknownWords };
    }
    case "START_GAME": {
      return { ...state, status: { type: "ACTIVE" } };
    }
    case "KEY_DOWN":
      return ((): State => {
        switch (state.status.type) {
          case "START":
          case "SHOWING_NEW_WORD":
          case "SHOWING_LEVEL_REVIEW": {
            return state;
          }
          case "ACTIVE":
          case "PAUSED": {
            const keysDown = new Set([
              ...state.keysDown,
              action.key.toLowerCase(),
            ]);
            const status: Status = (() => {
              if (action.key === "p") {
                if (state.status.type === "ACTIVE") return { type: "PAUSED" };
                return { type: "ACTIVE" };
              }
              return state.status;
            })();
            return { ...state, status, keysDown };
          }
        }
      })();
    case "KEY_UP": {
      const keysDown = new Set(
        [...state.keysDown].filter((key) => key !== action.key.toLowerCase())
      );
      return { ...state, keysDown };
    }
    case "TICK": {
      if (
        state.status.type === "PAUSED" ||
        state.status.type === "SHOWING_NEW_WORD" ||
        state.status.type === "START"
      ) {
        return state;
      }
      if (state.exits.some((exit) => overlaps(state.player, exit))) {
        const gameMapLevel = state.gameMapLevel + 1;
        const gameMap = state.gameMaps[gameMapLevel] ?? gameMaps[0];
        const player: Player = playerFromGameMap(gameMap) ?? {
          x: 20,
          y: 20,
          size: 20,
          health: 100,
        };
        const monsters = monstersFromGameMap(gameMap);
        const walls = wallsFromGameMap(gameMap);
        const exits = exitsFromGameMap(gameMap);
        return { ...state, gameMapLevel, player, monsters, walls, exits };
      }
      const player = updatePlayer(state);
      const monsters = updateMonsters(state, action.monsterMoves);
      const itemCount =
        state.itemCount + (state.monsters.length - monsters.length);
      const status: Status = (() => {
        if (state.unknownWords.length === 0) return state.status;
        if (state.exits.some((exit) => overlaps(player, exit))) {
          const MONSTERS_PER_LEVEL = 5;
          const index =
            (state.gameMapLevel * MONSTERS_PER_LEVEL) %
            state.unknownWords.length;
          return {
            type: "SHOWING_LEVEL_REVIEW",
            words: state.mandarinWords.slice(index, index + MONSTERS_PER_LEVEL),
          };
        }
        if (itemCount === state.itemCount) return state.status;
        const word =
          state.unknownWords[state.itemCount % state.unknownWords.length];
        if (!word) return state.status;
        const mandarinWord = state.mandarinWords.find(
          (mandarinWord) => mandarinWord.word === word
        );
        if (!mandarinWord) return state.status;
        return { type: "SHOWING_NEW_WORD", word: mandarinWord };
      })();
      const { bullets, lastBulletFiredAt } = updateBullets(state, action.time);
      const monsterBullets = updateMonsterBullets(state, action.monsterMoves);
      const keysDown = state.keysDown.has("d")
        ? new Set([...state.keysDown].filter((x) => x !== "d"))
        : state.keysDown;
      return {
        ...state,
        status,
        keysDown,
        player,
        itemCount,
        monsters,
        bullets,
        lastBulletFiredAt,
        monsterBullets,
      };
    }
  }
};

// #region Update functions

const updatePlayer = ({
  keysDown,
  player,
  monsters,
  monsterBullets,
  walls,
  exits,
}: State): Player => {
  const x = ((): number => {
    if (keysDown.has("arrowleft")) return player.x - 1;
    if (keysDown.has("arrowright")) return player.x + 1;
    return player.x;
  })();
  const y = ((): number => {
    if (keysDown.has("arrowup")) return player.y - 1;
    if (keysDown.has("arrowdown")) return player.y + 1;
    return player.y;
  })();
  const newPlayer: Player =
    [
      { ...player, x, y },
      { ...player, x },
      { ...player, y },
    ].find(
      (newPlayer) =>
        inBounds(newPlayer) &&
        !walls.some((wall) => overlaps(newPlayer, wall)) &&
        (monsters.length === 0 ||
          !exits.some((exit) => overlaps(newPlayer, exit)))
    ) ?? player;
  const health =
    player.health -
    monsterBullets.filter((bullet) => overlaps(bullet, player)).length *
      BULLET_DAMAGE;
  return { ...newPlayer, health };
};

const updateMonsters = (
  { player, monsters, bullets, walls, exits }: State,
  monsterMoves: MonsterMove[]
): Monster[] => {
  return monsters
    .filter((monster) => {
      return !(monster.health <= 0 && overlaps(monster, player));
    })
    .map((monster, i) => {
      const target = monsterMoves[i]?.target ?? monster.target;
      const health = Math.max(
        0,
        monster.health -
          bullets.filter((bullet) => overlaps(monster, bullet)).length *
            BULLET_DAMAGE
      );
      if (health === 0) return { ...monster, health, target: null };
      if (!target) return { ...monster, health };
      const x = clamp(monster.x - 1, target.x, monster.x + 1);
      const y = clamp(monster.y - 1, target.y, monster.y + 1);
      const { x: newX, y: newY } = [
        { x, y },
        { x: monster.x, y },
        { x, y: monster.y },
      ]
        .map(({ x, y }) => {
          if (
            x >= 0 &&
            y >= 0 &&
            x <= SCREEN_SIZE - BLOCK_SIZE &&
            y <= SCREEN_SIZE - BLOCK_SIZE &&
            !walls.some((wall) => overlaps(wall, { x, y, size: BLOCK_SIZE })) &&
            !exits.some((exit) => overlaps(exit, { x, y, size: BLOCK_SIZE }))
          )
            return { x, y };
          return null;
        })
        .find(Boolean) ?? { x: monster.x, y: monster.y };
      const newTarget = newX === target.x && newY === target.y ? null : target;
      return { ...monster, x: newX, y: newY, target: newTarget, health };
    });
};

const updateBullets = (
  {
    keysDown,
    player,
    monsters,
    bullets,
    lastBulletFiredAt,
    walls,
    exits,
  }: State,
  time: number
): { bullets: Bullet[]; lastBulletFiredAt: number } => {
  const updatedBullets = bullets
    .filter((bullet) => {
      return (
        !walls.some((wall) => overlaps(bullet, wall)) &&
        !exits.some((exit) => overlaps(bullet, exit)) &&
        !monsters.some(
          (monster) => overlaps(bullet, monster) && monster.health > 0
        )
      );
    })
    .map((bullet) => {
      const x = bullet.x + bullet.dx;
      const y = bullet.y + bullet.dy;
      return { ...bullet, x, y };
    });

  const newBullet = ((): Bullet | null => {
    if (!keysDown.has("w")) return null;

    if (time - lastBulletFiredAt < BULLET_FIRE_DELAY) return null;

    const monsterTarget = closestMonster(player, monsters);

    if (!monsterTarget) return null;

    const diffX = monsterTarget.x - player.x;
    const diffY = monsterTarget.y - player.y;
    const angle = Math.abs(Math.atan(diffY / diffX));
    const xSign = monsterTarget.x > player.x ? 1 : -1;
    const ySign = monsterTarget.y > player.y ? 1 : -1;
    const dx = Number((BULLET_SPEED * Math.cos(angle)).toFixed(1));
    const dy = Number((BULLET_SPEED * Math.sin(angle)).toFixed(1));
    const bullet: Bullet = {
      x: player.x,
      y: player.y,
      dx: dx === 0 ? dx : xSign * dx,
      dy: dy === 0 ? dy : ySign * dy,
      size: BULLET_SIZE,
    };
    return bullet;
  })();

  if (newBullet) {
    return {
      bullets: [...updatedBullets, newBullet],
      lastBulletFiredAt: time,
    };
  }

  return { bullets: updatedBullets, lastBulletFiredAt };
};

const updateMonsterBullets = (
  { player, monsters, monsterBullets, walls, exits }: State,
  monsterMoves: MonsterMove[]
): Bullet[] => {
  const updatedMonsterBullets = monsterBullets
    .filter((bullet) => {
      return (
        !walls.some((wall) => overlaps(bullet, wall)) &&
        !exits.some((exit) => overlaps(bullet, exit)) &&
        !overlaps(bullet, player)
      );
    })
    .map((bullet) => {
      const x = bullet.x + bullet.dx;
      const y = bullet.y + bullet.dy;
      return { ...bullet, x, y };
    });

  const newMonsterBullets = monsters
    .filter((monster, i) => {
      const move = monsterMoves[i];
      return monster && monster.health > 0 && move?.shoot;
    })
    .map((monster): Bullet => {
      const riseOverRun = (player.y - monster.y) / (player.x - monster.x);
      const angle = Math.abs(Math.atan(riseOverRun));
      const dxSign = player.x - monster.x < 0 ? -1 : 1;
      const dySign = player.y - monster.y < 0 ? -1 : 1;
      const dx = dxSign * Number((BULLET_SPEED * Math.cos(angle)).toFixed(1));
      const dy = dySign * Number((BULLET_SPEED * Math.sin(angle)).toFixed(1));
      return { x: monster.x, y: monster.y, dx, dy, size: BULLET_SIZE };
    });

  return [...updatedMonsterBullets, ...newMonsterBullets];
};
