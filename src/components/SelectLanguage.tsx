import { LANGUAGES } from "../state/constants";
import { type Language } from "../state/types";

const languageToString = (language: Language): string => {
  switch (language) {
    case "MANDARIN":
      return "Mandarin";
    case "JAPANESE":
      return "Japanese";
    case "SPANISH":
      return "Spanish";
  }
};

type SelectLanguageProps = {
  setLanguage: (language: Language) => void;
};

export const SelectLanguage = ({ setLanguage }: SelectLanguageProps) => {
  return (
    <div className="text-white bg-black w-full h-[100svh] flex justify-center items-center">
      <div className="relative aspect-square w-full max-w-2xl bg-gray-800">
        <div className="flex flex-col gap-4 justify-center items-center w-full h-full">
          <h1 className="text-xl">Select the language you want to learn</h1>
          <div className="flex flex-wrap gap-4">
            {LANGUAGES.map((language) => {
              return (
                <button
                  key={language}
                  className="py-2 px-4 bg-blue-700 text-white rounded-lg hover:brightness-110 transition-colors"
                  onClick={() => setLanguage(language)}
                >
                  {languageToString(language)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
