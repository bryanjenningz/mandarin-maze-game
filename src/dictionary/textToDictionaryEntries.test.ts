import { describe, expect, it } from "vitest";
import { textToDictionaryEntries } from "./textToDictionaryEntries";
import type { DictionaryEntry } from "./types";

describe("textToDictionaryEntries", () => {
  it("converts empty text to an empty array", () => {
    const text = "";
    const dictionaryEntries = textToDictionaryEntries(text);
    const expected: DictionaryEntry[] = [];
    expect(dictionaryEntries).toEqual(expected);
  });
});
