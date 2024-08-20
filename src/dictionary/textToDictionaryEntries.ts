import { searchDictionary } from "./searchDictionary";
import type { Dictionary, DictionaryEntry } from "./types";

const MAX_WORD_LENGTH = 12;

export const textToDictionaryEntries = (
  dictionary: Dictionary,
  text: string
): DictionaryEntry[] => {
  const dictionaryEntries: DictionaryEntry[] = [];
  const seenWords = new Set<string>();
  let i = 0;
  while (i < text.length) {
    const results = searchDictionary(
      dictionary,
      text.slice(i, i + MAX_WORD_LENGTH)
    );
    const word = results[0]?.traditional;
    if (word && !seenWords.has(word)) {
      seenWords.add(word);
      dictionaryEntries.push(...results);
    }
    i += word?.length ?? 1;
  }
  return dictionaryEntries;
};
