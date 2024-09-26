import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { Language } from "./constants";

interface StarterCode {
  language: Language;
  code: string;
}

interface CodeEditorProps {
  questionId: number;
  starterCode: StarterCode[];
  answerCode: string;
  setAnswerCode: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  questionId,
  starterCode,
  answerCode,
  setAnswerCode,
}) => {
  const [language, setLanguage] = useState<Language>(
    starterCode[0]?.language || ""
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const defaultCode =
      starterCode.find((sc) => sc.language === language)?.code || "";
    setAnswerCode(defaultCode);
  }, [language, starterCode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setIsDropdownOpen(false);
  };

  const availableLanguages = starterCode.map((sc) => sc.language);

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative" ref={dropdownRef}>
        <button
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span>{language}</span>
          <svg
            className="fill-current h-4 w-4 ml-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
            <ul className="py-1">
              {availableLanguages.map((lang) => (
                <li
                  key={lang}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onSelect(lang)}
                >
                  {lang}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <Editor
          height="75vh"
          language={language.toLowerCase()}
          value={answerCode}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          onChange={(newValue) => setAnswerCode(newValue || "")}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
