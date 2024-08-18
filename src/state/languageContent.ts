import type { Language } from "./types";

export type Vocab = {
  word: string;
  wordPronunciation: string;
  wordMeaning: string;
  sentence: string;
  sentencePronunciation: string;
  sentenceMeaning: string;
};

export const languageVocab: Record<Language, Vocab>[] = [
  {
    MANDARIN: {
      word: "來",
      wordPronunciation: "lai2",
      wordMeaning: "come",
      sentence: "來一下！",
      sentencePronunciation: "lai2 yi2 xia4",
      sentenceMeaning: "Come over here!",
    },
    SPANISH: {
      word: "venir",
      wordPronunciation: "",
      wordMeaning: "come",
      sentence: "Ven acá",
      sentencePronunciation: "",
      sentenceMeaning: "Come over here!",
    },
  },

  {
    MANDARIN: {
      word: "等",
      wordPronunciation: "deng3",
      wordMeaning: "wait",
      sentence: "等一下！",
      sentencePronunciation: "deng3 yi2 xia4",
      sentenceMeaning: "Wait a second!",
    },
    SPANISH: {
      word: "esperar",
      wordPronunciation: "",
      wordMeaning: "to wait",
      sentence: "Espera un momento",
      sentencePronunciation: "",
      sentenceMeaning: "Wait a moment!",
    },
  },

  {
    MANDARIN: {
      word: "快",
      wordPronunciation: "kuai4",
      wordMeaning: "fast",
      sentence: "快一點！",
      sentencePronunciation: "kuai4 yi4 dian3",
      sentenceMeaning: "Hurry up!",
    },
    SPANISH: {
      word: "rápido",
      wordPronunciation: "",
      wordMeaning: "fast",
      sentence: "¡Ve más rápido!",
      sentencePronunciation: "",
      sentenceMeaning: "Go faster!",
    },
  },

  {
    MANDARIN: {
      word: "哪",
      wordPronunciation: "na3",
      wordMeaning: "which",
      sentence: "哪一個？",
      sentencePronunciation: "na3 yi2 ge4",
      sentenceMeaning: "Which one?",
    },
    SPANISH: {
      word: "cuál",
      wordPronunciation: "",
      wordMeaning: "which",
      sentence: "¿Cuál es bueno?",
      sentencePronunciation: "",
      sentenceMeaning: "Which one is good?",
    },
  },

  {
    MANDARIN: {
      word: "试",
      wordPronunciation: "shi4",
      wordMeaning: "to try",
      sentence: "试一试！",
      sentencePronunciation: "shi4 yi2 shi4",
      sentenceMeaning: "Try it!",
    },
    SPANISH: {
      word: "intentar",
      wordPronunciation: "",
      wordMeaning: "to try to do something",
      sentence: "Intentaré hacerlo",
      sentencePronunciation: "",
      sentenceMeaning: "I'll try to do it",
    },
  },
];
