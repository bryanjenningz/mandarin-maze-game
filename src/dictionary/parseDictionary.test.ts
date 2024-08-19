import { describe, expect, it } from "vitest";
import type { Dictionary, DictionaryEntry } from "./types";
import { parseDictionary, parseLine } from "./parseDictionary";

describe("parseDictionary", () => {
  it("turns dictionary text into a dictionary", () => {
    const dictionaryText = `你們 你们 [nǐ men] /you (plural)/
你好 你好 [nǐ hǎo] /hello/hi/`;
    const dictionary = parseDictionary(dictionaryText);
    const expected: Dictionary = {
      traditional: [
        "你們 你们 [nǐ men] /you (plural)/",
        "你好 你好 [nǐ hǎo] /hello/hi/",
      ],
      simplified: [
        "你們 你们 [nǐ men] /you (plural)/",
        "你好 你好 [nǐ hǎo] /hello/hi/",
      ],
    };
    expect(dictionary).toEqual(expected);
  });
});

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

  it("turns a dictionary line into a dictionary entry with commas between multiple meanings", () => {
    const line =
      "你情我願 你情我愿 [nǐ qíng wǒ yuàn] /to both be willing/mutual consent/both willing/";
    const entry = parseLine(line);
    const expected: DictionaryEntry = {
      traditional: "你情我願",
      simplified: "你情我愿",
      pronunciation: "nǐ qíng wǒ yuàn",
      meaning: "to both be willing, mutual consent, both willing",
    };
    expect(entry).toEqual(expected);
  });
});
