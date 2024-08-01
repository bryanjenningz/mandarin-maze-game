import { describe, expect, test } from "vitest";
import { initState, reducer, type State } from "./state";
import type { Action, Bullet, Monster } from "../components/game";

describe("reducer", () => {
  test("bullets lower monster health", () => {
    const monster: Monster = { x: 40, y: 40, health: 100, target: null };
    const bullet: Bullet = { x: 60, y: 40, dx: -2, dy: 0 };
    const state: State = {
      ...initState,
      monsters: [monster],
      bullets: [bullet],
    };
    const action: Action = {
      type: "TICK",
      time: 10_000,
      monsterRandomness: [{ dx: -2, dy: -2, override: false }],
    };
    const newState: State = reducer(state, action);
    const expectedNewState: State = {
      ...state,
      monsters: [
        { ...monster, health: 90, x: 39, y: 39, target: { x: 38, y: 38 } },
      ],
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
