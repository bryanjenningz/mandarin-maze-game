import { parseLine } from "./parseDictionary";
import type { Dictionary, DictionaryEntry } from "./types";

const MAX_ENTRIES = 10;

export const searchDictionary = (
  dictionary: Dictionary,
  word: string
): DictionaryEntry[] => {
  const entries: DictionaryEntry[] = [];
  while (word.length > 0) {
    const result = [
      binarySearch(
        dictionary.traditional,
        word,
        (line) => parseLine(line)?.traditional ?? null
      ),
      binarySearch(
        dictionary.simplified,
        word,
        (line) => parseLine(line)?.simplified ?? null
      ),
    ].find(Boolean);
    if (result) return result;
    word = word.slice(0, -1);
  }
  return entries;
};

const binarySearch = (
  lines: string[],
  target: string,
  transformLine: (line: string) => string | null
): DictionaryEntry[] | null => {
  let low = 0;
  let high = lines.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const entry = lines[mid] ? transformLine(lines[mid]) : null;
    if (!entry) {
      console.warn(`Invalid line at index ${mid}: ${lines[mid]}`);
      return null;
    }
    if (entry === target) {
      let start = mid;
      let startLine = lines[start];
      while (start >= 0 && startLine && transformLine(startLine) === entry) {
        start -= 1;
        startLine = lines[start];
      }
      start += 1;

      let end = mid;
      let endLine = lines[end];
      while (
        end < lines.length &&
        endLine &&
        transformLine(endLine) === entry
      ) {
        end += 1;
        endLine = lines[end];
      }

      return lines
        .slice(start, end)
        .slice(0, MAX_ENTRIES)
        .map(parseLine)
        .filter(Boolean);
    }
    if (entry < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return null;
};
