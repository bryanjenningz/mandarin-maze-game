import type { MandarinWord } from "../state/types";
import { classNames } from "./utils";

type WordContextProps = {
  mandarinWord: MandarinWord;
};

export const WordContext = ({
  mandarinWord,
}: WordContextProps): JSX.Element => {
  const word = mandarinWord.word;
  const wordIndex = mandarinWord.context.indexOf(word);
  const CONTEXT_PADDING = 8;
  const contextSlice = mandarinWord.context.slice(
    Math.max(0, wordIndex - CONTEXT_PADDING),
    Math.max(0, wordIndex + word.length + CONTEXT_PADDING)
  );
  const wordIndexContextSlice = contextSlice.indexOf(word);
  return (
    <>
      {"..."}
      {contextSlice.split("").map((ch, i) => {
        const highlighted =
          i >= wordIndexContextSlice && i < wordIndexContextSlice + word.length;
        return (
          <span
            key={`${ch}-${i}`}
            className={classNames(highlighted && "bg-blue-800")}
          >
            {ch}
          </span>
        );
      })}
      {"..."}
    </>
  );
};
