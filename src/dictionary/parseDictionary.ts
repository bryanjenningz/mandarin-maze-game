import type { Dictionary, DictionaryEntry } from "./types";

export const parseDictionary = (dictionaryText: string): Dictionary => {
  const lines = dictionaryText.split("\n");
  const traditional = lines.sort((a, b) => {
    const parsedA = parseLine(a);
    const parsedB = parseLine(b);
    if (!parsedA || !parsedB) return 0;
    if (parsedA.traditional < parsedB.traditional) return -1;
    if (parsedA.traditional > parsedB.traditional) return 1;
    return 0;
  });
  const simplified = lines.slice().sort((a, b) => {
    const parsedA = parseLine(a);
    const parsedB = parseLine(b);
    if (!parsedA || !parsedB) return 0;
    if (parsedA.simplified < parsedB.simplified) return -1;
    if (parsedA.simplified > parsedB.simplified) return 1;
    return 0;
  });
  return { traditional, simplified };
};

const LINE_PATTERN =
  /^(?<traditional>[^ ]+) (?<simplified>[^ ]+) \[(?<pronunciation>[^\]]+)\] \/(?<meaning>.+)\/$/;

export const parseLine = (line: string): DictionaryEntry | null => {
  const { traditional, simplified, pronunciation, meaning } =
    line.match(LINE_PATTERN)?.groups ?? {};
  if (!traditional || !simplified || !pronunciation || !meaning) return null;
  return { traditional, simplified, pronunciation, meaning };
};
