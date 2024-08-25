import { describe, expect, it } from "vitest";
import { reducer } from "./reducer";
import type {
  Action,
  Bullet,
  Exit,
  GameMap,
  MandarinWord,
  Monster,
  MonsterMove,
  Player,
  State,
  Status,
  Target,
  Wall,
} from "./types";
import {
  BLOCK_SIZE,
  BULLET_DAMAGE,
  BULLET_SIZE,
  BULLET_SPEED,
  SCREEN_SIZE,
} from "./constants";
import type { Dictionary } from "../dictionary/types";

const defaultState: State = {
  mandarinDictionary: { traditional: [], simplified: [] },
  mandarinText: "",
  mandarinWords: [],
  unknownWords: [],
  status: { type: "ACTIVE" },
  gameMapLevel: 0,
  gameMaps: [],
  keysDown: new Set(),
  player: { x: -20, y: -20, size: 20, health: 100 },
  itemCount: 0,
  monsters: [],
  bullets: [],
  lastBulletFiredAt: 0,
  monsterBullets: [],
  walls: [],
  exits: [],
};

describe("reducer", () => {
  describe("SET_MANDARIN_DICTIONARY", () => {
    it("sets mandarin dictionary and mandarinWords", () => {
      const state: State = {
        ...defaultState,
        mandarinDictionary: { traditional: [], simplified: [] },
        mandarinText: "a",
        mandarinWords: [],
      };
      const mandarinDictionary: Dictionary = {
        traditional: ["a a [a] /a/", "b b [b] /b/"],
        simplified: ["a a [a] /a/", "b b [b] /b/"],
      };
      const action: Action = {
        type: "SET_MANDARIN_DICTIONARY",
        mandarinDictionary,
      };
      const newState: State = reducer(state, action);
      const expected: State = {
        ...state,
        mandarinDictionary,
        mandarinWords: [
          { word: "a", pronunciation: "a", meaning: "a", context: "a" },
        ],
      };
      expect(newState).toEqual(expected);
    });
  });

  describe("SET_MANDARIN_TEXT", () => {
    it("sets mandarin text, sets mandarinWords, clears words in unknownWords that aren't in mandarinWords", () => {
      const mandarinDictionary: Dictionary = {
        traditional: [
          "a a-simplified [a-pinyin] /a-meaning/",
          "c c-simplified [c-pinyin] /c-meaning/",
          "d d-simplified [d-pinyin] /d-meaning/",
        ],
        simplified: [
          "a a-simplified [a-pinyin] /a-meaning/",
          "c c-simplified [c-pinyin] /c-meaning/",
          "d d-simplified [d-pinyin] /d-meaning/",
        ],
      };
      const state: State = {
        ...defaultState,
        mandarinDictionary,
        mandarinText: "acd",
        mandarinWords: [
          {
            word: "a",
            pronunciation: "a-pinyin",
            meaning: "a-meaning",
            context: "acd",
          },
          {
            word: "c",
            pronunciation: "c-pinyin",
            meaning: "c-meaning",
            context: "acd",
          },
          {
            word: "d",
            pronunciation: "d-pinyin",
            meaning: "d-meaning",
            context: "acd",
          },
        ],
        unknownWords: ["c", "d"],
      };
      const action: Action = { type: "SET_MANDARIN_TEXT", mandarinText: "abc" };
      const newState: State = reducer(state, action);
      const expected: State = {
        ...state,
        mandarinText: "abc",
        mandarinWords: [
          {
            word: "a",
            pronunciation: "a-pinyin",
            meaning: "a-meaning",
            context: "abc",
          },
          {
            word: "c",
            pronunciation: "c-pinyin",
            meaning: "c-meaning",
            context: "abc",
          },
        ],
        unknownWords: ["c"],
      };
      expect(newState).toEqual(expected);
    });
  });

  describe("TOGGLE_MANDARIN_WORD_KNOWN", () => {
    it("adds word to known words", () => {
      const state: State = {
        ...defaultState,
        unknownWords: ["a", "b", "c"],
      };
      const action: Action = { type: "TOGGLE_MANDARIN_WORD_KNOWN", word: "d" };
      const newState: State = reducer(state, action);
      const expected: State = {
        ...state,
        unknownWords: ["a", "b", "c", "d"],
      };
      expect(newState).toEqual(expected);
    });

    it("removes word from known words", () => {
      const state: State = {
        ...defaultState,
        unknownWords: ["a", "b", "c"],
      };
      const action: Action = { type: "TOGGLE_MANDARIN_WORD_KNOWN", word: "b" };
      const newState: State = reducer(state, action);
      const expected: State = {
        ...state,
        unknownWords: ["a", "c"],
      };
      expect(newState).toEqual(expected);
    });
  });

  describe("START_GAME", () => {
    it("sets status to ACTIVE", () => {
      const state: State = { ...defaultState, status: { type: "START" } };
      const action: Action = { type: "START_GAME" };
      const newState: State = reducer(state, action);
      const expected: State = { ...state, status: { type: "ACTIVE" } };
      expect(newState).toEqual(expected);
    });
  });

  describe("KEY_DOWN", () => {
    it("adds lowercase 'a' key down to state when you press down 'A'", () => {
      const state: State = defaultState;
      const action: Action = { type: "KEY_DOWN", key: "A" };
      const newState: State = reducer(state, action);
      const expected: State = { ...state, keysDown: new Set(["a"]) };
      expect(newState).toEqual(expected);
    });

    it("adds lowercase 'arrowup' key down to state when you press down 'ArrowUp'", () => {
      const state: State = { ...defaultState, keysDown: new Set(["a"]) };
      const action: Action = { type: "KEY_DOWN", key: "ArrowUp" };
      const newState: State = reducer(state, action);
      const expected: State = { ...state, keysDown: new Set(["a", "arrowup"]) };
      expect(newState).toEqual(expected);
    });

    it("pauses game when 'p' is pressed while active", () => {
      const state: State = { ...defaultState, status: { type: "ACTIVE" } };
      const action: Action = { type: "KEY_DOWN", key: "p" };
      const newState: State = reducer(state, action);
      const expected: State = {
        ...state,
        status: { type: "PAUSED" },
        keysDown: new Set(["p"]),
      };
      expect(newState).toEqual(expected);
    });

    it("does nothing when 'p' is pressed at game start", () => {
      const state: State = { ...defaultState, status: { type: "START" } };
      const action: Action = { type: "KEY_DOWN", key: "p" };
      const newState: State = reducer(state, action);
      const expected: State = state;
      expect(newState).toEqual(expected);
    });

    it("resumes game when 'p' is pressed while paused", () => {
      const state: State = { ...defaultState, status: { type: "PAUSED" } };
      const action: Action = { type: "KEY_DOWN", key: "p" };
      const newState: State = reducer(state, action);
      const expected: State = {
        ...state,
        status: { type: "ACTIVE" },
        keysDown: new Set(["p"]),
      };
      expect(newState).toEqual(expected);
    });
  });

  describe("KEY_UP", () => {
    it("removes lowercase 'a' key down from state when you press up 'A'", () => {
      const state: State = { ...defaultState, keysDown: new Set(["a"]) };
      const action: Action = { type: "KEY_UP", key: "A" };
      const newState: State = reducer(state, action);
      const expected: State = { ...state, keysDown: new Set() };
      expect(newState).toEqual(expected);
    });

    it("removes lowercase 'arrowup' key down to state when you press up 'ArrowUp'", () => {
      const state: State = {
        ...defaultState,
        keysDown: new Set(["a", "arrowup"]),
      };
      const action: Action = { type: "KEY_UP", key: "ArrowUp" };
      const newState: State = reducer(state, action);
      const expected: State = { ...state, keysDown: new Set(["a"]) };
      expect(newState).toEqual(expected);
    });
  });

  describe("PASS_REVIEW", () => {
    const statuses: [Status][] = [
      [{ type: "START" }],
      [{ type: "ACTIVE" }],
      [{ type: "PAUSED" }],
      [
        {
          type: "SHOWING_NEW_WORD",
          word: {
            word: "w-2",
            pronunciation: "p-2",
            meaning: "m-2",
            context: "c-2",
          },
        },
      ],
    ];
    it.each(statuses)(
      "Does nothing if the game status is not SHOWING_LEVEL_REVIEW (%j)",
      (status) => {
        const state: State = { ...defaultState, status };
        const action: Action = { type: "PASS_REVIEW" };
        const newState: State = reducer(state, action);
        const expected: State = state;
        expect(newState).toEqual(expected);
      }
    );
  });

  describe("TICK", () => {
    const tick = (
      {
        time = 0,
        monsterMoves = [],
      }: {
        time?: number;
        monsterMoves?: MonsterMove[];
      } = {
        time: 0,
        monsterMoves: [],
      }
    ): Action => {
      return { type: "TICK", time, monsterMoves };
    };

    describe("status", () => {
      it("doesn't update if game status is START", () => {
        const bullets: Bullet[] = [
          { x: 50, y: 50, dx: 1, dy: 1, size: BULLET_SIZE },
        ];
        const monsterBullets: Bullet[] = bullets;
        const state: State = {
          ...defaultState,
          status: { type: "START" },
          bullets,
          monsterBullets,
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state };
        expect(newState).toEqual(expected);
      });

      it("doesn't update if game status is PAUSED", () => {
        const bullets: Bullet[] = [
          { x: 50, y: 50, dx: 1, dy: 1, size: BULLET_SIZE },
        ];
        const monsterBullets: Bullet[] = bullets;
        const state: State = {
          ...defaultState,
          status: { type: "PAUSED" },
          bullets,
          monsterBullets,
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state };
        expect(newState).toEqual(expected);
      });

      it("doesn't update if status is SHOWING_NEW_WORD", () => {
        const bullets: Bullet[] = [
          { x: 50, y: 50, dx: 1, dy: 1, size: BULLET_SIZE },
        ];
        const monsterBullets: Bullet[] = bullets;
        const state: State = {
          ...defaultState,
          status: {
            type: "SHOWING_NEW_WORD",
            word: { word: "a", pronunciation: "b", meaning: "c", context: "d" },
          },
          bullets,
          monsterBullets,
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state };
        expect(newState).toEqual(expected);
      });

      it("doesn't update if status is SHOWING_LEVEL_REVIEW", () => {
        const bullets: Bullet[] = [
          { x: 50, y: 50, dx: 1, dy: 1, size: BULLET_SIZE },
        ];
        const monsterBullets: Bullet[] = bullets;
        const state: State = {
          ...defaultState,
          status: {
            type: "SHOWING_LEVEL_REVIEW",
            words: [
              { word: "a", pronunciation: "b", meaning: "c", context: "d" },
            ],
          },
          bullets,
          monsterBullets,
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state };
        expect(newState).toEqual(expected);
      });

      it("changes the status to ACTIVE if there are no words left to review and status is SHOWING_LEVEL_REVIEW", () => {
        const state: State = {
          ...defaultState,
          status: {
            type: "SHOWING_LEVEL_REVIEW",
            words: [],
          },
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state, status: { type: "ACTIVE" } };
        expect(newState).toEqual(expected);
      });
    });

    describe("game map level", () => {
      it("increases map level and set the new state when the player is overlapping with an exit and status is ACTIVE", () => {
        const player: Player = { x: 0, y: 19, size: 20, health: 100 };
        const exits: Exit[] = [{ x: 0, y: 0, size: 20 }];
        const gameMap1 = [
          ["#", "#"],
          ["#", "#"],
        ];
        const gameMap2 = [
          ["M", "P"],
          ["#", "E"],
        ];
        const gameMaps: GameMap[] = [gameMap1, gameMap2];
        const state: State = {
          ...defaultState,
          status: { type: "ACTIVE" },
          gameMapLevel: 0,
          gameMaps,
          player,
          exits,
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          gameMapLevel: 1,
          player: { x: BLOCK_SIZE, y: 0, size: BLOCK_SIZE, health: 100 },
          monsters: [
            { x: 0, y: 0, size: BLOCK_SIZE, health: 100, target: null },
          ],
          walls: [{ x: 0, y: BLOCK_SIZE, size: BLOCK_SIZE }],
          exits: [{ x: BLOCK_SIZE, y: BLOCK_SIZE, size: BLOCK_SIZE }],
        };
        expect(newState).toEqual(expected);
      });
    });

    describe("player movement", () => {
      it("moves player left/up when arrowleft/arrowup are down", () => {
        const keysDown = new Set(["arrowleft", "arrowup"]);
        const player: Player = { x: 40, y: 30, size: 20, health: 100 };
        const state: State = { ...defaultState, keysDown, player };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          player: { ...player, x: 39, y: 29 },
        };
        expect(newState).toEqual(expected);
      });

      it("moves player right/down when arrowright/arrowdown are down", () => {
        const keysDown = new Set(["arrowright", "arrowdown"]);
        const player: Player = { x: 40, y: 30, size: 20, health: 100 };
        const state: State = { ...defaultState, keysDown, player };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          player: { ...player, x: player.x + 1, y: player.y + 1 },
        };
        expect(newState).toEqual(expected);
      });

      it("moves player up when arrowleft/arrowup are down and wall to left", () => {
        const keysDown = new Set(["arrowleft", "arrowup"]);
        const player: Player = { x: 40, y: 30, size: 20, health: 100 };
        const walls: Wall[] = [
          { x: player.x - BLOCK_SIZE, y: player.y, size: BLOCK_SIZE },
        ];
        const state: State = { ...defaultState, keysDown, player, walls };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          player: { ...player, y: player.y - 1 },
        };
        expect(newState).toEqual(expected);
      });

      it("moves player right when arrowright/arrowdown are down and wall below", () => {
        const keysDown = new Set(["arrowright", "arrowdown"]);
        const player: Player = { x: 40, y: 30, size: 20, health: 100 };
        const walls: Wall[] = [
          { x: player.x, y: player.y + BLOCK_SIZE, size: BLOCK_SIZE },
        ];
        const state: State = { ...defaultState, keysDown, player, walls };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state, player: { ...player, x: 41 } };
        expect(newState).toEqual(expected);
      });

      it("moves player left when arrowup/arrowleft are down and player's on top boundary", () => {
        const keysDown = new Set(["arrowup", "arrowleft"]);
        const player: Player = { x: 40, y: 0, size: 20, health: 100 };
        const state: State = { ...defaultState, keysDown, player };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state, player: { ...player, x: 39 } };
        expect(newState).toEqual(expected);
      });

      it("doesn't move when arrowdown/arrowright are down and player's on bottom right boundary", () => {
        const keysDown = new Set(["arrowdown", "arrowright"]);
        const player: Player = {
          x: SCREEN_SIZE - BLOCK_SIZE,
          y: SCREEN_SIZE - BLOCK_SIZE,
          size: BLOCK_SIZE,
          health: 100,
        };
        const state: State = { ...defaultState, keysDown, player };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = state;
        expect(newState).toEqual(expected);
      });

      it("shows new word and removes monster if player overlaps with no health monster", () => {
        const mandarinWord: MandarinWord = {
          word: "1",
          pronunciation: "2",
          meaning: "3",
          context: "4",
        };
        const player: Player = { x: 40, y: 30, size: 20, health: 100 };
        const monsters: Monster[] = [
          { x: 40, y: 49, size: 20, health: 0, target: null },
        ];
        const state: State = {
          ...defaultState,
          status: { type: "ACTIVE" },
          mandarinWords: [mandarinWord],
          unknownWords: [mandarinWord.word],
          player,
          itemCount: 0,
          monsters,
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          status: { type: "SHOWING_NEW_WORD", word: mandarinWord },
          itemCount: 1,
          monsters: [],
        };
        expect(newState).toEqual(expected);
      });

      it("player can't go to exit if there are still monsters", () => {
        const keysDown = new Set(["arrowup"]);
        const player: Player = { x: 0, y: 20, size: 20, health: 100 };
        const monsters: Monster[] = [
          { x: 40, y: 49, size: 20, health: 0, target: null },
        ];
        const exits: Exit[] = [{ x: 0, y: 0, size: 20 }];
        const state: State = {
          ...defaultState,
          keysDown,
          player,
          monsters,
          exits,
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state };
        expect(newState).toEqual(expected);
      });

      it("allows player to go to exit if there aren't any monsters, then it sets status to SHOWING_LEVEL_REVIEW", () => {
        const keysDown = new Set(["arrowup"]);
        const player: Player = { x: 0, y: 20, size: 20, health: 100 };
        const exits: Exit[] = [{ x: 0, y: 0, size: 20 }];
        const mandarinWord: MandarinWord = {
          word: "word-1",
          pronunciation: "pronunciation-1",
          meaning: "meaning-1",
          context: "context-1",
        };
        const state: State = {
          ...defaultState,
          mandarinWords: [mandarinWord],
          unknownWords: ["word-1"],
          keysDown,
          player,
          monsters: [],
          exits,
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          player: { ...player, y: 19 },
          status: { type: "SHOWING_LEVEL_REVIEW", words: [mandarinWord] },
        };
        expect(newState).toEqual(expected);
      });
    });

    describe("bullets firing", () => {
      it("shoots at the nearest alive monster on 'w' keydown", () => {
        const keysDown = new Set(["w"]);
        const player: Player = { x: 0, y: 0, size: 20, health: 100 };
        const monsters: Monster[] = [
          { x: 100, y: 0, size: 20, health: 100, target: null },
          { x: 0, y: 50, size: 20, health: 0, target: null },
        ];
        const state: State = { ...defaultState, keysDown, player, monsters };
        const action: Action = tick({ time: 1234 });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          bullets: [
            { x: player.x, y: player.y, dx: 2, dy: 0, size: BULLET_SIZE },
          ],
          lastBulletFiredAt: 1234,
        };
        expect(newState).toEqual(expected);
      });

      it("shoots a bullet at the closest monster at bottom", () => {
        const keysDown = new Set(["w"]);
        const player: Player = { x: 0, y: 0, size: 20, health: 100 };
        const monsters: Monster[] = [
          { x: 100, y: 0, size: 20, health: 100, target: null },
          { x: 0, y: 50, size: 20, health: 100, target: null },
        ];
        const state: State = {
          ...defaultState,
          keysDown,
          player,
          monsters,
          bullets: [],
        };
        const action: Action = tick({ time: 1234 });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          bullets: [{ x: 0, y: 0, dx: 0, dy: BULLET_SPEED, size: 4 }],
          lastBulletFiredAt: 1234,
        };
        expect(newState).toEqual(expected);
      });

      it("shoots a bullet at the closest monster at top", () => {
        const keysDown = new Set(["w"]);
        const player: Player = { x: 100, y: 100, size: 20, health: 100 };
        const monsters: Monster[] = [
          { x: 100, y: 0, size: 20, health: 100, target: null },
          { x: 0, y: 0, size: 20, health: 100, target: null },
        ];
        const state: State = {
          ...defaultState,
          keysDown,
          player,
          monsters,
          bullets: [],
        };
        const action: Action = tick({ time: 1234 });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          bullets: [
            { x: player.x, y: player.y, dx: 0, dy: -BULLET_SPEED, size: 4 },
          ],
          lastBulletFiredAt: 1234,
        };
        expect(newState).toEqual(expected);
      });

      it("shoots a bullet at the closest monster at top-left", () => {
        const keysDown = new Set(["w"]);
        const player: Player = { x: 100, y: 100, size: 20, health: 100 };
        const monsters: Monster[] = [
          { x: 0, y: 0, size: 20, health: 100, target: null },
        ];
        const state: State = {
          ...defaultState,
          keysDown,
          player,
          monsters,
          bullets: [],
        };
        const action: Action = tick({ time: 1234 });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          bullets: [{ x: player.x, y: player.y, dx: -1.4, dy: -1.4, size: 4 }],
          lastBulletFiredAt: 1234,
        };
        expect(newState).toEqual(expected);
      });

      it("shoots a bullet at the closest monster at bottom-left", () => {
        const keysDown = new Set(["w"]);
        const player: Player = { x: 100, y: 0, size: 20, health: 100 };
        const monsters: Monster[] = [
          { x: 0, y: 100, size: 20, health: 100, target: null },
        ];
        const state: State = {
          ...defaultState,
          keysDown,
          player,
          monsters,
          bullets: [],
        };
        const action: Action = tick({ time: 1234 });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          bullets: [{ x: player.x, y: player.y, dx: -1.4, dy: 1.4, size: 4 }],
          lastBulletFiredAt: 1234,
        };
        expect(newState).toEqual(expected);
      });

      it("doesn't fire if the lastBulletFiredAt was recent", () => {
        const keysDown = new Set(["w"]);
        const player: Player = { x: 40, y: 30, size: 20, health: 100 };
        const state: State = {
          ...defaultState,
          keysDown,
          player,
          bullets: [],
          lastBulletFiredAt: 1234,
        };
        const action: Action = tick({ time: 1234 });
        const newState: State = reducer(state, action);
        const expected: State = state;
        expect(newState).toEqual(expected);
      });

      it("doesn't fire if there are no living monsters", () => {
        const keysDown = new Set(["w"]);
        const player: Player = { x: 40, y: 30, size: BLOCK_SIZE, health: 100 };
        const monsters: Monster[] = [
          { x: 0, y: 0, health: 0, size: BLOCK_SIZE, target: null },
        ];
        const state: State = { ...defaultState, keysDown, player, monsters };
        const action: Action = tick({ time: 1234 });
        const newState: State = reducer(state, action);
        const expected: State = { ...state };
        expect(newState).toEqual(expected);
      });
    });

    describe("bullet movement", () => {
      it("moves in the bottom right direction", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: BULLET_SPEED,
          dy: BULLET_SPEED,
          size: 4,
        };
        const state: State = { ...defaultState, bullets: [bullet] };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          bullets: [
            { ...bullet, x: bullet.x + bullet.dx, y: bullet.y + bullet.dy },
          ],
        };
        expect(newState).toEqual(expected);
      });

      it("moves in the top left direction", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: -BULLET_SPEED,
          dy: -BULLET_SPEED,
          size: 4,
        };
        const state: State = { ...defaultState, bullets: [bullet] };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          bullets: [
            { ...bullet, x: bullet.x + bullet.dx, y: bullet.y + bullet.dy },
          ],
        };
        expect(newState).toEqual(expected);
      });
    });

    describe("bullet overlap", () => {
      it("disappears when it overlaps with a wall", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: -BULLET_SPEED,
          dy: -BULLET_SPEED,
          size: 4,
        };
        const walls: Wall[] = [{ x: 20, y: 30, size: 20 }];
        const state: State = { ...defaultState, bullets: [bullet], walls };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state, bullets: [] };
        expect(newState).toEqual(expected);
      });

      it("disappears when it overlaps with an exit", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: -BULLET_SPEED,
          dy: -BULLET_SPEED,
          size: 4,
        };
        const exits: Exit[] = [{ x: 20, y: 30, size: 20 }];
        const state: State = { ...defaultState, bullets: [bullet], exits };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state, bullets: [] };
        expect(newState).toEqual(expected);
      });

      it("still appears even if in its next frame it overlaps with a wall", () => {
        const bullet: Bullet = {
          x: 20,
          y: 20,
          dx: -BULLET_SPEED,
          dy: -BULLET_SPEED,
          size: 4,
        };
        const walls: Wall[] = [{ x: 0, y: 0, size: 20 }];
        const state: State = { ...defaultState, bullets: [bullet], walls };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const newBullet: Bullet = {
          ...bullet,
          x: bullet.x + bullet.dx,
          y: bullet.y + bullet.dy,
        };
        const expected: State = { ...state, bullets: [newBullet] };
        expect(newState).toEqual(expected);
      });

      it("disappears and brings down monster health when it overlaps with a monster", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: -BULLET_SPEED,
          dy: -BULLET_SPEED,
          size: 4,
        };
        const monster: Monster = {
          x: 20,
          y: 30,
          size: 20,
          target: null,
          health: 100,
        };
        const state: State = {
          ...defaultState,
          bullets: [bullet],
          monsters: [monster],
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          bullets: [],
          monsters: [{ ...monster, health: 90 }],
        };
        expect(newState).toEqual(expected);
      });

      it("still appears if it collides with a monster that already has no health", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: -BULLET_SPEED,
          dy: -BULLET_SPEED,
          size: 4,
        };
        const monster: Monster = {
          x: 20,
          y: 30,
          size: 20,
          target: null,
          health: 0,
        };
        const state: State = {
          ...defaultState,
          bullets: [bullet],
          monsters: [monster],
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          bullets: [
            { ...bullet, x: bullet.x + bullet.dx, y: bullet.y + bullet.dy },
          ],
        };
        expect(newState).toEqual(expected);
      });
    });

    describe("monster bullets firing", () => {
      it("shoots a bullet at the player towards bottom right if the monster move has a true shoot value", () => {
        const player: Player = { x: 40, y: 40, size: 20, health: 100 };
        const monster: Monster = {
          x: 0,
          y: 0,
          size: BLOCK_SIZE,
          health: 100,
          target: null,
        };
        const state: State = {
          ...defaultState,
          player,
          bullets: [],
          monsters: [monster],
        };
        const monsterMoves: MonsterMove[] = [{ shoot: true, target: null }];
        const action: Action = tick({ monsterMoves });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsters: [monster],
          monsterBullets: [{ x: 0, y: 0, dx: 1.4, dy: 1.4, size: BULLET_SIZE }],
        };
        expect(newState).toEqual(expected);
      });

      it("shoots a bullet at the player towards bottom left if the monster move has a true shoot value", () => {
        const player: Player = {
          x: 0,
          y: 20,
          size: 20,
          health: 100,
        };
        const monster: Monster = {
          x: 20,
          y: 0,
          size: BLOCK_SIZE,
          health: 100,
          target: null,
        };
        const state: State = {
          ...defaultState,
          player,
          bullets: [],
          monsters: [monster],
        };
        const monsterMoves: MonsterMove[] = [{ shoot: true, target: null }];
        const action: Action = tick({ monsterMoves });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsters: [monster],
          monsterBullets: [
            { x: 20, y: 0, dx: -1.4, dy: 1.4, size: BULLET_SIZE },
          ],
        };
        expect(newState).toEqual(expected);
      });

      it("shoots a bullet at the player towards top left if the monster move has a true shoot value", () => {
        const player: Player = { x: 0, y: 0, size: 20, health: 100 };
        const monster: Monster = {
          x: 40,
          y: 40,
          size: BLOCK_SIZE,
          health: 100,
          target: null,
        };
        const state: State = {
          ...defaultState,
          player,
          bullets: [],
          monsters: [monster],
        };
        const monsterMoves: MonsterMove[] = [{ shoot: true, target: null }];
        const action: Action = tick({ monsterMoves });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsters: [monster],
          monsterBullets: [
            { x: 40, y: 40, dx: -1.4, dy: -1.4, size: BULLET_SIZE },
          ],
        };
        expect(newState).toEqual(expected);
      });

      it("doesn't shoot bullets if the monster has no health even if shoot is true", () => {
        const player: Player = { x: 0, y: 0, size: 20, health: 100 };
        const monster: Monster = {
          x: 40,
          y: 40,
          size: BLOCK_SIZE,
          health: 0,
          target: null,
        };
        const state: State = {
          ...defaultState,
          player,
          monsters: [monster],
          monsterBullets: [],
        };
        const monsterMoves: MonsterMove[] = [{ shoot: true, target: null }];
        const action: Action = tick({ monsterMoves });
        const newState: State = reducer(state, action);
        const expected: State = state;
        expect(newState).toEqual(expected);
      });
    });

    describe("monster bullet movement", () => {
      it("moves in the bottom right direction", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: BULLET_SPEED,
          dy: BULLET_SPEED,
          size: 4,
        };
        const state: State = { ...defaultState, monsterBullets: [bullet] };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsterBullets: [
            { ...bullet, x: bullet.x + bullet.dx, y: bullet.y + bullet.dy },
          ],
        };
        expect(newState).toEqual(expected);
      });

      it("moves in the top left direction", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: -BULLET_SPEED,
          dy: -BULLET_SPEED,
          size: 4,
        };
        const state: State = { ...defaultState, monsterBullets: [bullet] };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsterBullets: [
            { ...bullet, x: bullet.x + bullet.dx, y: bullet.y + bullet.dy },
          ],
        };
        expect(newState).toEqual(expected);
      });
    });

    describe("monster bullet overlap", () => {
      it("disappears when it overlaps with a wall", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: -BULLET_SPEED,
          dy: -BULLET_SPEED,
          size: 4,
        };
        const walls: Wall[] = [{ x: 20, y: 30, size: 20 }];
        const state: State = {
          ...defaultState,
          monsterBullets: [bullet],
          walls,
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state, monsterBullets: [] };
        expect(newState).toEqual(expected);
      });

      it("disappears when it overlaps with an exit", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: -BULLET_SPEED,
          dy: -BULLET_SPEED,
          size: 4,
        };
        const exits: Exit[] = [{ x: 20, y: 30, size: 20 }];
        const state: State = {
          ...defaultState,
          monsterBullets: [bullet],
          exits,
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state, monsterBullets: [] };
        expect(newState).toEqual(expected);
      });

      it("still appears even if in its next frame it overlaps with a wall", () => {
        const bullet: Bullet = {
          x: 20,
          y: 20,
          dx: -BULLET_SPEED,
          dy: -BULLET_SPEED,
          size: 4,
        };
        const walls: Wall[] = [{ x: 0, y: 0, size: 20 }];
        const state: State = {
          ...defaultState,
          monsterBullets: [bullet],
          walls,
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const newBullet: Bullet = {
          ...bullet,
          x: bullet.x + bullet.dx,
          y: bullet.y + bullet.dy,
        };
        const expected: State = { ...state, monsterBullets: [newBullet] };
        expect(newState).toEqual(expected);
      });

      it("disappears and brings down player health when it overlaps with player", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: -BULLET_SPEED,
          dy: -BULLET_SPEED,
          size: 4,
        };
        const player: Player = { x: 20, y: 30, size: 20, health: 100 };
        const state: State = {
          ...defaultState,
          player,
          monsterBullets: [bullet],
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          player: { ...player, health: player.health - BULLET_DAMAGE },
          monsterBullets: [],
        };
        expect(newState).toEqual(expected);
      });

      it("still appears if it overlaps with a monster", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: BULLET_SPEED,
          dy: BULLET_SPEED,
          size: 4,
        };
        const monster: Monster = {
          x: bullet.x,
          y: bullet.y,
          health: 100,
          size: BLOCK_SIZE,
          target: null,
        };
        const state: State = {
          ...defaultState,
          monsters: [monster],
          monsterBullets: [bullet],
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsterBullets: [
            { ...bullet, x: bullet.x + bullet.dx, y: bullet.y + bullet.dy },
          ],
        };
        expect(newState).toEqual(expected);
      });
    });

    describe("monster movement", () => {
      it("doesn't move if target is null", () => {
        const monster: Monster = {
          x: 20,
          y: 20,
          size: 20,
          target: null,
          health: 100,
        };
        const state: State = { ...defaultState, monsters: [monster] };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = state;
        expect(newState).toEqual(expected);
      });

      it("doesn't move if it needs to go out of bounds in the upper left", () => {
        const target: Target = { x: -1, y: -1 };
        const monster: Monster = {
          x: 0,
          y: 0,
          size: 20,
          target,
          health: 100,
        };
        const state: State = { ...defaultState, monsters: [monster] };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsters: [{ ...monster, target: { x: -1, y: -1 } }],
        };
        expect(newState).toEqual(expected);
      });

      it("doesn't move if it needs to go out of bounds in the bottom right", () => {
        const target: Target = {
          x: SCREEN_SIZE - BLOCK_SIZE + 1,
          y: SCREEN_SIZE - BLOCK_SIZE + 1,
        };
        const monster: Monster = {
          x: SCREEN_SIZE - BLOCK_SIZE,
          y: SCREEN_SIZE - BLOCK_SIZE,
          size: 20,
          target,
          health: 100,
        };
        const state: State = { ...defaultState, monsters: [monster] };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsters: [{ ...monster, target }],
        };
        expect(newState).toEqual(expected);
      });

      it("doesn't move if it there's a wall in its way", () => {
        const target: Target = { x: 0, y: 0 };
        const monster: Monster = {
          x: 0,
          y: BLOCK_SIZE,
          size: BLOCK_SIZE,
          target,
          health: 100,
        };
        const walls: Wall[] = [{ x: 0, y: 0, size: BLOCK_SIZE }];
        const state: State = { ...defaultState, monsters: [monster], walls };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = state;
        expect(newState).toEqual(expected);
      });

      it("doesn't move if it there's an exit in its way", () => {
        const target: Target = { x: 0, y: 0 };
        const monster: Monster = {
          x: 0,
          y: BLOCK_SIZE,
          size: BLOCK_SIZE,
          target,
          health: 100,
        };
        const exits: Exit[] = [{ x: 0, y: 0, size: BLOCK_SIZE }];
        const state: State = { ...defaultState, monsters: [monster], exits };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = state;
        expect(newState).toEqual(expected);
      });

      it("moves a space in the direction of its target", () => {
        const target: Target = { x: 40, y: 0 };
        const monster: Monster = {
          x: 20,
          y: 20,
          size: 20,
          target,
          health: 100,
        };
        const state: State = { ...defaultState, monsters: [monster] };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsters: [{ ...monster, x: 21, y: 19 }],
        };
        expect(newState).toEqual(expected);
      });

      it("sets target to null once monster reaches target", () => {
        const target: Target = { x: 40, y: 0 };
        const monster: Monster = { x: 39, y: 1, size: 20, target, health: 100 };
        const state: State = { ...defaultState, monsters: [monster] };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsters: [{ ...monster, x: 40, y: 0, target: null }],
        };
        expect(newState).toEqual(expected);
      });

      it("sets monster targets to the new targets passed in and monsters move toward the new targets", () => {
        const target: Target = { x: 40, y: 0 };
        const monster: Monster = { x: 39, y: 1, size: 20, target, health: 100 };
        const monster2: Monster = {
          x: 70,
          y: 40,
          size: 20,
          target: null,
          health: 100,
        };
        const monster3: Monster = {
          x: 60,
          y: 30,
          size: 20,
          target,
          health: 100,
        };
        const monsters: Monster[] = [monster, monster2, monster3];
        const state: State = { ...defaultState, monsters };
        const newTarget: Target = { x: 1, y: 1 };
        const newTarget2: Target = { x: 2, y: 2 };
        const newTarget3: Target = { x: 3, y: 3 };
        const monsterMoves: MonsterMove[] = [
          newTarget,
          newTarget2,
          newTarget3,
        ].map((target) => ({ shoot: false, target }));
        const action: Action = tick({ monsterMoves });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsters: [
            { ...monster, x: 38, y: 1, target: newTarget },
            { ...monster2, x: 69, y: 39, target: newTarget2 },
            { ...monster3, x: 59, y: 29, target: newTarget3 },
          ],
        };
        expect(newState).toEqual(expected);
      });

      it("sets monster targets to the new targets passed in and keeps target the same if its new target is null", () => {
        const target: Target = { x: 40, y: 0 };
        const monster: Monster = { x: 39, y: 1, size: 20, target, health: 100 };
        const monster2: Monster = {
          x: 70,
          y: 40,
          size: 20,
          target: null,
          health: 100,
        };
        const monster3: Monster = {
          x: 60,
          y: 30,
          size: 20,
          target,
          health: 100,
        };
        const monsters: Monster[] = [monster, monster2, monster3];
        const state: State = { ...defaultState, monsters };
        const newTarget: Target = { x: 1, y: 1 };
        const monsterMoves: MonsterMove[] = [newTarget, null, null].map(
          (target) => ({ shoot: false, target })
        );
        const action: Action = tick({ monsterMoves });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsters: [
            { ...monster, x: 38, y: 1, target: newTarget },
            { ...monster2, x: 70, y: 40 },
            { ...monster3, x: 59, y: 29 },
          ],
        };
        expect(newState).toEqual(expected);
      });

      it("doesn't move if it has no health and sets target to null", () => {
        const target: Target = { x: 40, y: 0 };
        const monster: Monster = { x: 39, y: 1, size: 20, target, health: 0 };
        const monster2: Monster = {
          x: 70,
          y: 40,
          size: 20,
          target: null,
          health: 0,
        };
        const monster3: Monster = {
          x: 60,
          y: 30,
          size: 20,
          target,
          health: 0,
        };
        const monsters: Monster[] = [monster, monster2, monster3];
        const state: State = { ...defaultState, monsters };
        const newTarget: Target = { x: 1, y: 1 };
        const monsterMoves: MonsterMove[] = [newTarget, null, null].map(
          (target) => ({ shoot: false, target })
        );
        const action: Action = tick({ monsterMoves });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsters: [
            { ...monster, target: null },
            { ...monster2, target: null },
            { ...monster3, target: null },
          ],
        };
        expect(newState).toEqual(expected);
      });
    });
  });
});
