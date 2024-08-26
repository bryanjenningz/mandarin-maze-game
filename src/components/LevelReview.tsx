import type { MandarinWord } from "../state/types";
import { PlayAudioButton } from "./PlayAudioButton";

type LevelReviewProps = {
  mandarinWord: MandarinWord;
  passReview: () => void;
  failReview: () => void;
};

export const LevelReview = ({
  mandarinWord,
  passReview,
  failReview,
}: LevelReviewProps): JSX.Element => {
  return (
    <div className="absolute inset-0 bg-gray-800 text-white p-4 max-w-2xl w-full flex flex-col items-center justify-center gap-4 z-20">
      <h2 className="text-2xl">{mandarinWord.word}</h2>
      <PlayAudioButton text={mandarinWord.word} />
      <div>{mandarinWord.pronunciation}</div>
      <div>{mandarinWord.meaning}</div>
      <div>{mandarinWord.context}</div>
      <div className="w-full flex gap-4">
        <button
          className="grow py-2 px-4 bg-red-800 hover:brightness-110 transition duration-300 rounded-lg text-white"
          onClick={failReview}
        >
          Fail
        </button>
        <button
          className="grow py-2 px-4 bg-blue-800 hover:brightness-110 transition duration-300 rounded-lg text-white"
          onClick={passReview}
        >
          Pass
        </button>
      </div>
    </div>
  );
};
