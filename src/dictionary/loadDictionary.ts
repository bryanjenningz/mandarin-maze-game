const DICTIONARY_URL = "/dictionary.txt";

export const loadDictionary = async (): Promise<string> => {
  const response = await fetch(DICTIONARY_URL);
  const dictionaryText = await response.text();
  return dictionaryText;
};
