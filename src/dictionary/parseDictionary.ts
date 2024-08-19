import type { DictionaryEntry } from "./types";

const LINE_PATTERN =
  /^(?<traditional>[^ ]+) (?<simplified>[^ ]+) \[(?<pronunciation>[^\]]+)\] \/(?<meaning>.+)\/$/;

export const parseLine = (line: string): DictionaryEntry | null => {
  const { traditional, simplified, pronunciation, meaning } =
    line.match(LINE_PATTERN)?.groups ?? {};
  if (!traditional || !simplified || !pronunciation || !meaning) return null;
  return { traditional, simplified, pronunciation, meaning };
};
