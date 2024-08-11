import { describe, expect, it } from "vitest";
import { reducer } from "./reducer";
import type {
  Action,
  Bullet,
  Monster,
  MonsterMove,
  Player,
  State,
  Target,
  Wall,
} from "./types";
import {
  BLOCK_SIZE,
  BULLET_SIZE,
  BULLET_SPEED,
  SCREEN_SIZE,
} from "./constants";

const defaultState: State = {
  keysDown: new Set(),
  player: { x: -20, y: -20, size: 20 },
  itemCount: 0,
  monsters: [],
  bullets: [],
  lastBulletFiredAt: 0,
  monsterBullets: [],
  walls: [],
};

describe("reducer", () => {
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

    describe("player movement", () => {
      it("moves the player to the left and up when the arrowleft and arrowup keys are down", () => {
        const keysDown = new Set(["arrowleft", "arrowup"]);
        const player: Player = { x: 40, y: 30, size: 20 };
        const state: State = { ...defaultState, keysDown, player };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          player: { ...player, x: 39, y: 29 },
        };
        expect(newState).toEqual(expected);
      });

      it("moves the player to the right and bottom when the arrowright and arrowdown keys are down", () => {
        const keysDown = new Set(["arrowright", "arrowdown"]);
        const player: Player = { x: 40, y: 30, size: 20 };
        const state: State = { ...defaultState, keysDown, player };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          player: { ...player, x: 41, y: 31 },
        };
        expect(newState).toEqual(expected);
      });

      it("moves the player up if arrowup and arrowleft keys are down if there's a wall on the left", () => {
        const keysDown = new Set(["arrowleft", "arrowup"]);
        const player: Player = { x: 40, y: 30, size: 20 };
        const walls: Wall[] = [{ x: 20, y: 30, size: 20 }];
        const state: State = { ...defaultState, keysDown, player, walls };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state, player: { ...player, y: 29 } };
        expect(newState).toEqual(expected);
      });

      it("moves the player right if arrowdown and arrowright keys are down if there's a wall below", () => {
        const keysDown = new Set(["arrowdown", "arrowright"]);
        const player: Player = { x: 40, y: 30, size: 20 };
        const walls: Wall[] = [{ x: 40, y: 50, size: 20 }];
        const state: State = { ...defaultState, keysDown, player, walls };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state, player: { ...player, x: 41 } };
        expect(newState).toEqual(expected);
      });

      it("moves to the left if arrowup and arrowleft keys are down and player is at the top of screen", () => {
        const keysDown = new Set(["arrowup", "arrowleft"]);
        const player: Player = { x: 40, y: 0, size: 20 };
        const state: State = { ...defaultState, keysDown, player };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state, player: { ...player, x: 39 } };
        expect(newState).toEqual(expected);
      });

      it("doesn't move if arrowdown and arrowright keys are down and player is at the bottom right of screen", () => {
        const keysDown = new Set(["arrowdown", "arrowright"]);
        const player: Player = {
          x: SCREEN_SIZE - 20,
          y: SCREEN_SIZE - 20,
          size: 20,
        };
        const state: State = { ...defaultState, keysDown, player };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = state;
        expect(newState).toEqual(expected);
      });

      it("picks up item and removes monster if player overlaps with no health monster", () => {
        const player: Player = { x: 40, y: 30, size: 20 };
        const monsters: Monster[] = [
          { x: 40, y: 49, size: 20, health: 0, target: null },
        ];
        const state: State = {
          ...defaultState,
          player,
          itemCount: 0,
          monsters,
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state, itemCount: 1, monsters: [] };
        expect(newState).toEqual(expected);
      });
    });

    describe("bullets firing", () => {
      it("shoots a bullet up when the player holds down the 'w' key", () => {
        const keysDown = new Set(["w"]);
        const player: Player = { x: 40, y: 30, size: 20 };
        const state: State = { ...defaultState, keysDown, player, bullets: [] };
        const action: Action = tick({ time: 1234 });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          bullets: [{ x: 40, y: 30, dx: 0, dy: -BULLET_SPEED, size: 4 }],
          lastBulletFiredAt: 1234,
        };
        expect(newState).toEqual(expected);
      });

      it("shoots a bullet up and to the left when the player holds down the 'w' and 'a' keys", () => {
        const keysDown = new Set(["w", "a"]);
        const player: Player = { x: 40, y: 30, size: 20 };
        const state: State = { ...defaultState, keysDown, player, bullets: [] };
        const action: Action = tick({ time: 1234 });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          bullets: [
            { x: 40, y: 30, dx: -BULLET_SPEED, dy: -BULLET_SPEED, size: 4 },
          ],
          lastBulletFiredAt: 1234,
        };
        expect(newState).toEqual(expected);
      });

      it("shoots a bullet down and to the right when the player holds down the 's' and 'd' keys", () => {
        const keysDown = new Set(["s", "d"]);
        const player: Player = { x: 40, y: 30, size: 20 };
        const state: State = { ...defaultState, keysDown, player, bullets: [] };
        const action: Action = tick({ time: 1234 });
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          bullets: [
            { x: 40, y: 30, dx: BULLET_SPEED, dy: BULLET_SPEED, size: 4 },
          ],
          lastBulletFiredAt: 1234,
        };
        expect(newState).toEqual(expected);
      });

      it("doesn't fire if the lastBulletFiredAt was recent", () => {
        const keysDown = new Set(["s"]);
        const player: Player = { x: 40, y: 30, size: 20 };
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
        const player: Player = { x: 40, y: 40, size: 20 };
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
        const player: Player = { x: 0, y: 20, size: 20 };
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
        const player: Player = { x: 0, y: 0, size: 20 };
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
        const player: Player = { x: 0, y: 0, size: 20 };
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

      it("disappears when it overlaps with player", () => {
        const bullet: Bullet = {
          x: 20,
          y: 30,
          dx: -BULLET_SPEED,
          dy: -BULLET_SPEED,
          size: 4,
        };
        const player: Player = { x: 20, y: 30, size: 20 };
        const state: State = {
          ...defaultState,
          player,
          monsterBullets: [bullet],
        };
        const action: Action = tick();
        const newState: State = reducer(state, action);
        const expected: State = { ...state, monsterBullets: [] };
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
