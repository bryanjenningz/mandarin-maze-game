import { useEffect } from "react";
import { loadDictionary } from "../dictionary/loadDictionary";
import { parseDictionary } from "../dictionary/parseDictionary";
import type { Action } from "../state/types";

export const useDictionary = (dispatch: React.Dispatch<Action>): void => {
  useEffect(() => {
    void (async () => {
      const dictionaryText = await loadDictionary();
      const mandarinDictionary = parseDictionary(dictionaryText);
      dispatch({ type: "SET_MANDARIN_DICTIONARY", mandarinDictionary });
    })();
  }, []);
};
