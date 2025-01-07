export const textToSpeech = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-TW";
  utterance.rate = 0.6;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};
