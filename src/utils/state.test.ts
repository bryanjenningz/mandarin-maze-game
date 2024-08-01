import { describe, expect, test } from "vitest";
import { initState, reducer, type State } from "./state";
import type { Action, Bullet, Monster } from "../components/game";

describe("reducer", () => {
  test("bullets lower monster health", () => {
    const monster: Monster = { x: 20, y: 20, health: 100, target: null };
    const bullet: Bullet = { x: 22, y: 20, dx: -2, dy: 0 };
    const state: State = {
      ...initState,
      monsters: [monster],
      bullets: [bullet],
    };
    const action: Action = {
      type: "TICK",
      time: 10_000,
      monsterRandomness: [{ dx: -1, dy: -1, override: false }],
    };
    const newState: State = reducer(state, action);
    const expectedNewState: State = {
      ...state,
      monsters: [{ ...monster, health: 90, y: 19, target: { x: 19, y: 19 } }],
      bullets: [],
    };
    expect(newState).toEqual(expectedNewState);
  });

  test("bullets come out diagonally when user is holding down keys", () => {
    const state: State = {
      ...initState,
      player: { x: 20, y: 20 },
      keysDown: new Set(["s", "d"]),
    };
    const action: Action = {
      type: "TICK",
      time: 10_000,
      monsterRandomness: [],
    };
    const newState: State = reducer(state, action);
    const expectedNewState: State = {
      ...state,
      lastBulletShotTime: 10_000,
      bullets: [{ x: 20, y: 20, dx: 2, dy: 2 }],
    };
    expect(newState).toEqual(expectedNewState);
  });
});
