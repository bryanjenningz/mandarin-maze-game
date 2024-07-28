import { describe, expect, test } from "vitest";
import { clamp } from "../../utils/clamp";

describe("clamp", () => {
  const expectations: [number, number, number, number][] = [
    [1, 2, 3, 2],
    [1, 4, 3, 3],
    [1, 0, 3, 1],
  ];
  test.each(expectations)(
    "clamp(%i, %i, %i) -> %i",
    (lower, mid, upper, expected) => {
      expect(clamp(lower, mid, upper)).toEqual(expected);
    }
  );
});
