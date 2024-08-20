import { beforeAll, describe, expect, it } from "vitest";
import { textToDictionaryEntries } from "./textToDictionaryEntries";
import type { Dictionary, DictionaryEntry } from "./types";
import { parseDictionary } from "./parseDictionary";
import * as fs from "fs/promises";

const loadDictionary = async (): Promise<Dictionary> => {
  const buffer = await fs.readFile("./public/dictionary.txt");
  const text = buffer.toString();
  return parseDictionary(text);
};

let dictionary: Dictionary;

describe("textToDictionaryEntries", () => {
  beforeAll(async () => {
    dictionary = await loadDictionary();
  });

  it("converts empty text to an empty array", () => {
    const text = "";
    const dictionaryEntries = textToDictionaryEntries(dictionary, text);
    const expected: DictionaryEntry[] = [];
    expect(dictionaryEntries).toEqual(expected);
  });

  it("converts text to a dictionary entries", () => {
    const text = "反應又快又邏輯明確";
    const dictionaryEntries = textToDictionaryEntries(dictionary, text);
    const expected: DictionaryEntry[] = [];
    expect(dictionaryEntries).toEqual(expected);
  });
});
