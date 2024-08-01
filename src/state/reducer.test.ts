import { describe, expect, it } from "vitest";
import { initState, reducer, type Action, type State } from "./reducer";

describe("reducer", () => {
  describe("KEY_DOWN", () => {
    it("adds lowercase 'a' key down to state when you press 'A'", () => {
      const state: State = initState;
      const action: Action = { type: "KEY_DOWN", key: "A" };
      const newState: State = reducer(state, action);
      const expected: State = { ...state, keysDown: new Set(["a"]) };
      expect(newState).toEqual(expected);
    });
  });
});
