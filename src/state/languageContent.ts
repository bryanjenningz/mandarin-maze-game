import type { Language } from "./types";

export type Vocab = MandarinVocab | SpanishVocab;

export type MandarinVocab = {
  type: "MANDARIN";
  word: string;
  wordPronunciation: string;
  wordMeaning: string;
  sentence: string;
  sentencePronunciation: string;
  sentenceMeaning: string;
};

export type SpanishVocab = {
  type: "SPANISH";
  word: string;
  wordMeaning: string;
  sentence: string;
  sentenceMeaning: string;
};

export const languageVocab: Record<Language, Vocab>[] = [
  {
    MANDARIN: {
      type: "MANDARIN",
      word: "來",
      wordPronunciation: "lai2",
      wordMeaning: "come",
      sentence: "來一下！",
      sentencePronunciation: "lai2 yi2 xia4",
      sentenceMeaning: "Come over here!",
    },
    SPANISH: {
      type: "SPANISH",
      word: "venir",
      wordMeaning: "come",
      sentence: "Ven acá",
      sentenceMeaning: "Come over here!",
    },
  },

  {
    MANDARIN: {
      type: "MANDARIN",
      word: "等",
      wordPronunciation: "deng3",
      wordMeaning: "wait",
      sentence: "等一下！",
      sentencePronunciation: "deng3 yi2 xia4",
      sentenceMeaning: "Wait a second!",
    },
    SPANISH: {
      type: "SPANISH",
      word: "esperar",
      wordMeaning: "to wait",
      sentence: "Espera un momento",
      sentenceMeaning: "Wait a moment!",
    },
  },

  {
    MANDARIN: {
      type: "MANDARIN",
      word: "快",
      wordPronunciation: "kuai4",
      wordMeaning: "fast",
      sentence: "快一點！",
      sentencePronunciation: "kuai4 yi4 dian3",
      sentenceMeaning: "Hurry up!",
    },
    SPANISH: {
      type: "SPANISH",
      word: "rápido",
      wordMeaning: "fast",
      sentence: "¡Ve más rápido!",
      sentenceMeaning: "Go faster!",
    },
  },

  {
    MANDARIN: {
      type: "MANDARIN",
      word: "哪",
      wordPronunciation: "na3",
      wordMeaning: "which",
      sentence: "哪一個？",
      sentencePronunciation: "na3 yi2 ge4",
      sentenceMeaning: "Which one?",
    },
    SPANISH: {
      type: "SPANISH",
      word: "cuál",
      wordMeaning: "which",
      sentence: "¿Cuál es bueno?",
      sentenceMeaning: "Which one is good?",
    },
  },

  {
    MANDARIN: {
      type: "MANDARIN",
      word: "试",
      wordPronunciation: "shi4",
      wordMeaning: "to try",
      sentence: "试一试！",
      sentencePronunciation: "shi4 yi2 shi4",
      sentenceMeaning: "Try it!",
    },
    SPANISH: {
      type: "SPANISH",
      word: "intentar",
      wordMeaning: "to try to do something",
      sentence: "Intentaré hacerlo",
      sentenceMeaning: "I'll try to do it",
    },
  },
];
