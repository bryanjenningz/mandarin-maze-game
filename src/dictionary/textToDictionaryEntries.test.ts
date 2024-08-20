import { describe, expect, it } from "vitest";
import { textToDictionaryEntries } from "./textToDictionaryEntries";
import type { DictionaryEntry } from "./types";
import { parseDictionary } from "./parseDictionary";

describe("textToDictionaryEntries", () => {
  it("converts empty text to an empty array", () => {
    const dictionary = parseDictionary("");
    const text = "";
    const dictionaryEntries = textToDictionaryEntries(dictionary, text);
    const expected: DictionaryEntry[] = [];
    expect(dictionaryEntries).toEqual(expected);
  });

  it("converts text to a dictionary entries", () => {
    const dictionary = parseDictionary(``);
    const text = "反應又快又邏輯明確";
    const dictionaryEntries = textToDictionaryEntries(dictionary, text);
    const expected: DictionaryEntry[] = [];
    expect(dictionaryEntries).toEqual(expected);
  });
});
