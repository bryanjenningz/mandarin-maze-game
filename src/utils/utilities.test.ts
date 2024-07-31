import { describe, test, expect } from "vitest";
import { clamp, range } from "./utilities";

describe("clamp", () => {
  const expectations: [number, number, number, number][] = [
    [1, 2, 3, 2],
    [1, 4, 3, 3],
    [1, 0, 3, 1],
    [-1, 0, 1, 0],
    [-1, 20, 1, 1],
    [-1, -20, 1, -1],
    [-1, -1, 1, -1],
    [-1, 1, 1, 1],
  ];
  test.each(expectations)(
    "clamp(%i, %i, %i) -> %i",
    (lower, mid, upper, expected) => {
      expect(clamp(lower, mid, upper)).toEqual(expected);
    }
  );
});

describe("range", () => {
  const expectations: [number, number, number[]][] = [
    [0, 0, []],
    [1, 1, []],
    [2, 2, []],
    [2, 0, []],
    [2, 1, []],
    [1, 2, [1]],
    [0, 2, [0, 1]],
    [0, 3, [0, 1, 2]],
    [0, 4, [0, 1, 2, 3]],
    [3, 8, [3, 4, 5, 6, 7]],
    [-3, 0, [-3, -2, -1]],
    [-3, 3, [-3, -2, -1, 0, 1, 2]],
  ];
  test.each(expectations)("range(%i, %i) -> %j", (lower, upper, expected) => {
    expect(range(lower, upper)).toEqual(expected);
  });
});
