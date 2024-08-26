import { textToSpeech } from "../dictionary/textToSpeech";
import { VolumeUpIcon } from "../icons/VolumeUp";

type PlayAudioButtonProps = {
  text: string;
};

export const PlayAudioButton = ({
  text,
}: PlayAudioButtonProps): JSX.Element => {
  return (
    <button onClick={() => textToSpeech(text)}>
      <VolumeUpIcon />
      <span className="sr-only">Play audio</span>
    </button>
  );
};
