import { useEffect } from "react";
import type { MandarinWord } from "../state/types";
import { classNames } from "./utils";
import { textToSpeech } from "../dictionary/textToSpeech";
import { PlayAudioButton } from "./PlayAudioButton";

type NewWordProps = {
  mandarinWord: MandarinWord;
  resumeGame: () => void;
};

export const NewWord = ({
  mandarinWord,
  resumeGame,
}: NewWordProps): JSX.Element => {
  useEffect(() => {
    textToSpeech(mandarinWord.word);
  }, []);

  return (
    <div className="absolute inset-0 bg-gray-800 text-white p-4 max-w-2xl w-full flex flex-col items-center justify-center gap-4 z-20">
      <h2 className="text-xl">You found a new word!</h2>
      <div className="flex gap-4">
        <div className="text-lg font-bold">{mandarinWord.word}</div>
        <div className="text-lg">{mandarinWord.pronunciation}</div>
        <PlayAudioButton text={mandarinWord.word} />
      </div>
      <div className="text-gray-200">{mandarinWord.meaning}</div>
      <div className="text-gray-200">
        {((): JSX.Element => {
          const word = mandarinWord.word;
          const wordIndex = mandarinWord.context.indexOf(word);
          return (
            <>
              {mandarinWord.context.split("").map((ch, i) => {
                const highlighted =
                  i >= wordIndex && i < wordIndex + word.length;
                return (
                  <span
                    key={`${ch}-${i}`}
                    className={classNames(highlighted && "bg-blue-400")}
                  >
                    {ch}
                  </span>
                );
              })}
            </>
          );
        })()}
      </div>
      <button
        className="py-2 px-4 rounded-lg bg-blue-800 text-white hover:brightness-110 transition duration-300 text-lg"
        onClick={resumeGame}
      >
        Got it!
      </button>
    </div>
  );
};
