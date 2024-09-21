import React from "react";
import { LANGUAGE_VERSIONS } from "./constants";

type Language = keyof typeof LANGUAGE_VERSIONS;

interface LanguageSelectorProps {
  language: Language;
  onSelect: (language: Language) => void;
}

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onSelect,
}) => {
  return (
    <div className="ml-2 mb-4">
      <label className="block text-lg font-medium text-white mb-2">
        Language:
      </label>
      <div className="relative inline-block w-full text-gray-900">
        {/* Dropdown Button */}
        <button className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
          {language}
        </button>

        {/* Dropdown Menu */}
        <div className="absolute z-10 mt-2 w-full bg-gray-900 border border-gray-700 rounded shadow-lg">
          {languages.map(([lang, version]) => (
            <button
              key={lang}
              onClick={() => onSelect(lang as Language)}
              className={`block w-full text-left px-4 py-2 text-white hover:bg-gray-800 ${
                lang === language ? "bg-gray-700 text-blue-400" : ""
              }`}
            >
              {lang}
              <span className="text-gray-500 text-sm ml-2">({version})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
