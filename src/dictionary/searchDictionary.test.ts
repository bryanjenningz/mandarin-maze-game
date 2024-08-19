import { describe, expect, it } from "vitest";
import { searchDictionary } from "./searchDictionary";
import { parseDictionary } from "./parseDictionary";
import type { DictionaryEntry } from "./types";

describe("searchDictionary", () => {
  it("searches for traditional '你情我願'", () => {
    const word = "你情我願";
    const dictionary =
      parseDictionary(`你情我願 你情我愿 [nǐ qíng wǒ yuàn] /to both be willing/mutual consent/
你我 你我 [nǐ wǒ] /you and I/everyone/all of us (in society)/we (people in general)/
你死我活 你死我活 [nǐ sǐ wǒ huó] /lit. you die, I live (idiom); irreconcilable adversaries/two parties cannot coexist/
你爭我奪 你争我夺 [nǐ zhēng wǒ duó] /lit. you fight, I snatch (idiom); to compete fiercely offering no quarter/fierce rivalry/tug-of-war/`);
    const entries = searchDictionary(dictionary, word);
    const expected: DictionaryEntry[] = [
      {
        traditional: "你情我願",
        simplified: "你情我愿",
        pronunciation: "nǐ qíng wǒ yuàn",
        meaning: "to both be willing, mutual consent",
      },
    ];
    expect(entries).toEqual(expected);
  });
});
