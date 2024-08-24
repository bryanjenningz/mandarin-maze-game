import type { Action, State } from "../state/types";
import { classNames } from "./utils";

type GameStartProps = {
  dispatch: (action: Action) => void;
  state: State;
};

export const GameStart = ({ dispatch, state }: GameStartProps): JSX.Element => {
  return (
    <div className="text-white bg-black w-full h-[100svh] flex justify-center items-center">
      <div className="relative aspect-square w-full max-w-2xl bg-gray-800">
        <div className="w-full h-full flex flex-col items-center gap-4 justify-center">
          <h2 className="text-lg">
            Paste text with Mandarin words you want to learn
          </h2>
          <textarea
            className="text-lg w-4/5 bg-gray-600 p-2"
            value={state.mandarinText}
            onChange={(e) => {
              dispatch({
                type: "SET_MANDARIN_TEXT",
                mandarinText: e.target.value,
              });
            }}
          ></textarea>
          <div className="flex flex-wrap gap-4">
            {state.mandarinWords.map((mandarinWord, i) => {
              return (
                <button
                  key={`${mandarinWord.word}-${i}`}
                  className={classNames(
                    "text-white py-2 px-4 rounded-lg",
                    state.knownMandarinWords.includes(mandarinWord.word)
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  )}
                  onClick={() => {
                    dispatch({
                      type: "SET_MANDARIN_WORD_KNOWN",
                      word: mandarinWord.word,
                    });
                  }}
                >
                  {mandarinWord.word}
                </button>
              );
            })}
          </div>
          <button
            className="py-2 px-4 rounded-lg bg-blue-800 text-white hover:brightness-110 transition duration-300 text-lg"
            onClick={() => dispatch({ type: "START_GAME" })}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};
