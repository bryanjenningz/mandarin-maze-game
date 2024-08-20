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
    const words = results.map((result) => result.traditional);
    for (const [i, word] of words.entries()) {
      const result = results[i];
      if (!seenWords.has(word) && result) {
        seenWords.add(word);
        dictionaryEntries.push(result);
      }
    }
    i += words[0]?.length || 1;
  }
  return dictionaryEntries;
};
