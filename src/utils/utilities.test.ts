import { describe, test, expect } from "vitest";
import { clamp } from "./utilities";

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
