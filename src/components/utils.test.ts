import { describe, expect, it } from "vitest";
import { classNames } from "./utils";

describe("classNames", () => {
  const testCases: [(string | null | false)[], string][] = [
    [["hi", null, false, "hello"], "hi hello"],
    [["hi", "", "hello"], "hi hello"],
    [["hi", "hello"], "hi hello"],
    [["hi"], "hi"],
    [[], ""],
  ];
  it.each(testCases)("classNames(...%j) -> %j", (args, expected) => {
    expect(classNames(...args)).toEqual(expected);
  });
});
