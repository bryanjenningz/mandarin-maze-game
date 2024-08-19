import { describe, expect, it } from "vitest";
import type { DictionaryEntry } from "./types";
import { parseLine } from "./parseDictionary";

describe("parseLine", () => {
  it("turns a dictionary line into a dictionary entry", () => {
    const line = "你們 你们 [nǐ men] /you (plural)/";
    const entry = parseLine(line);
    const expected: DictionaryEntry = {
      traditional: "你們",
      simplified: "你们",
      pronunciation: "nǐ men",
      meaning: "you (plural)",
    };
    expect(entry).toEqual(expected);
  });
});
