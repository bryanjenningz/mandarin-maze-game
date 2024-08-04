import { describe, expect, it } from "vitest";
import {
  reducer,
  type Action,
  type Monster,
  type Player,
  type State,
  type Target,
} from "./reducer";

const defaultState = {
  keysDown: new Set(),
  player: { x: 20, y: 20, size: 20 },
  monsters: [{ x: 40, y: 40, size: 20, target: null }],
} as const satisfies State;

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
    describe("player movement", () => {
      it("moves the player to the left and up when the arrowleft and arrowup keys are down", () => {
        const keysDown = new Set(["arrowleft", "arrowup"]);
        const player: Player = { x: 40, y: 30, size: 20 };
        const state: State = { ...defaultState, keysDown, player };
        const action: Action = { type: "TICK" };
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
        const action: Action = { type: "TICK" };
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          player: { ...player, x: 41, y: 31 },
        };
        expect(newState).toEqual(expected);
      });
    });

    describe("monster movement", () => {
      it("doesn't move if target is null", () => {
        const monster: Monster = { x: 20, y: 20, size: 20, target: null };
        const state: State = { ...defaultState, monsters: [monster] };
        const action: Action = { type: "TICK" };
        const newState: State = reducer(state, action);
        const expected: State = state;
        expect(newState).toEqual(expected);
      });

      it("moves a space in the direction of its target", () => {
        const target: Target = { x: 40, y: 0 };
        const monster: Monster = { x: 20, y: 20, size: 20, target };
        const state: State = { ...defaultState, monsters: [monster] };
        const action: Action = { type: "TICK" };
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsters: [{ ...monster, x: 21, y: 19 }],
        };
        expect(newState).toEqual(expected);
      });

      it("sets target to null once monster reaches target", () => {
        const target: Target = { x: 40, y: 0 };
        const monster: Monster = { x: target.x, y: target.y, size: 20, target };
        const state: State = { ...defaultState, monsters: [monster] };
        const action: Action = { type: "TICK" };
        const newState: State = reducer(state, action);
        const expected: State = {
          ...state,
          monsters: [{ ...monster, target: null }],
        };
        expect(newState).toEqual(expected);
      });
    });
  });
});
