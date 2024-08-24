import type { Action, State } from "../state/types";
import { classNames } from "./utils";

type GameStartProps = {
  dispatch: (action: Action) => void;
  state: State;
};

export const GameStart = ({ dispatch, state }: GameStartProps): JSX.Element => {
  return (
    <div className="text-white bg-black w-full h-[100svh] flex justify-center items-center">
      <div className="w-full h-screen max-w-2xl">
        <div className="w-full h-full flex flex-col items-center gap-4 p-4 justify-center">
          <h2>Paste Mandarin text you want to learn</h2>
          <textarea
            className="text-lg min-h-32 w-full bg-gray-600 p-2 rounded-lg resize-none"
            value={state.mandarinText}
            onChange={(e) => {
              dispatch({
                type: "SET_MANDARIN_TEXT",
                mandarinText: e.target.value,
              });
            }}
          ></textarea>
          <h2>Select words you want to know</h2>
          <div className="flex flex-wrap gap-2 justify-center overflow-auto">
            {state.mandarinWords.map((mandarinWord, i) => {
              return (
                <button
                  key={`${mandarinWord.word}-${i}`}
                  className={classNames(
                    "text-white py-2 px-4 rounded-lg",
                    state.unknownWords.includes(mandarinWord.word)
                      ? "bg-blue-800"
                      : "bg-gray-600"
                  )}
                  onClick={() => {
                    dispatch({
                      type: "TOGGLE_MANDARIN_WORD_KNOWN",
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
            className={classNames(
              "py-2 px-4 rounded-lg bg-blue-800 text-white hover:brightness-110 transition duration-300 text-lg",
              state.unknownWords.length === 0 ? "opacity-0" : "opacity-100"
            )}
            aria-hidden={state.unknownWords.length === 0}
            disabled={state.unknownWords.length === 0}
            onClick={() => {
              if (state.unknownWords.length === 0) return;
              dispatch({ type: "START_GAME" });
            }}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};
