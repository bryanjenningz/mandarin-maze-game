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
    const expected: DictionaryEntry[] = [
      {
        meaning:
          "to react, to respond, reaction, response, reply, chemical reaction, CL:個|个[gè]",
        pronunciation: "fǎn yìng",
        simplified: "反应",
        traditional: "反應",
      },
      {
        meaning:
          "(once) again, also, both... and..., and yet, (used for emphasis) anyway",
        pronunciation: "yòu",
        simplified: "又",
        traditional: "又",
      },
      {
        meaning:
          "rapid, quick, speed, rate, soon, almost, to make haste, clever, sharp (of knives or wits), forthright, plainspoken, gratified, pleased, pleasant",
        pronunciation: "kuài",
        simplified: "快",
        traditional: "快",
      },
      {
        meaning: "logic (loanword)",
        pronunciation: "luó ji",
        simplified: "逻辑",
        traditional: "邏輯",
      },
      {
        meaning:
          "clear-cut; definite; explicit, to clarify; to specify; to make definite",
        pronunciation: "míng qùe",
        simplified: "明确",
        traditional: "明確",
      },
    ];
    expect(dictionaryEntries).toEqual(expected);
  });
});
