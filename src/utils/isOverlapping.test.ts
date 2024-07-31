import { describe, expect, test } from "vitest";
import { isOverlapping } from "./isOverlapping";

describe("isOverlapping", () => {
  const expectations: [
    x: number,
    y: number,
    size: number,
    expected: boolean
  ][] = [
    [0, 0, 20, false],
    [0, 1, 20, false],
    [1, 1, 20, true],
    [0, 0, 21, true],
    [20, 20, 20, true],
    [40, 20, 20, false],
    [39, 20, 20, true],
    [39, 39, 20, true],
    [39, 39, 1, true],
    [39, 1, 20, true],
    [1, 39, 20, true],
    [1, 40, 20, false],
    [40, 1, 20, false],
  ];
  test.each(expectations)(
    "isOverlapping({ x: %i, y: %i, size: %i }, { x: 20, y: 20, size: 20 }) -> %j",
    (x, y, size, expected) => {
      expect(isOverlapping({ x, y, size }, { x: 20, y: 20, size: 20 })).toEqual(
        expected
      );
    }
  );
});
