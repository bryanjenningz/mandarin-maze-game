import { describe, expect, test } from "vitest";
import { isInBounds } from "./isInBounds";

describe("isInBounds", () => {
  const expectations: [
    x: number,
    y: number,
    size: number,
    expected: boolean
  ][] = [
    [0, 0, 20, true],
    [-1, 0, 20, false],
    [380, 0, 20, true],
    [381, 0, 20, false],
    [0, 0, 20, true],
    [0, -1, 20, false],
    [0, 380, 20, true],
    [0, 381, 20, false],
    [1, 2, 3, true],
    [1, 397, 3, true],
    [1, 398, 3, false],
  ];
  test.each(expectations)(
    "isInBounds({ x: %i, y: %i, size: %i }) -> %j",
    (x, y, size, expected) => {
      expect(isInBounds({ x, y, size })).toEqual(expected);
    }
  );
});
