import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import {
  CODE_SNIPPETS,
  Language,
  LANGUAGE_VERSIONS,
} from "../../../QuestionComponents/constants";
import { CodeData } from "../../../Viewers/ExamPage/components/QuestionContainer";
import BasicSpinner from "../../../Basic/BasicSpinner";

interface CodeInputsProps {
  codeData: CodeData;
  onChange: (data: Partial<CodeData>) => void;
}

const CodeInputs: React.FC<CodeInputsProps> = ({ codeData, onChange }) => {
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Single state for dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Click outside handler
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize default values only on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      if (!codeData.language) {
        // Send all updates at once
        onChange({
          language: "javascript",
          version: LANGUAGE_VERSIONS["javascript"],
          body: CODE_SNIPPETS["javascript"],
        });
      }
    }
  }, []);

  // Language selection handler
  const handleLanguageSelect = (selectedLanguage: Language) => {
    // Update all related fields at once
    onChange({
      language: selectedLanguage,
      version: LANGUAGE_VERSIONS[selectedLanguage],
      body: CODE_SNIPPETS[selectedLanguage],
    });
    setIsDropdownOpen(false);
  };

  // Code change handler
  const handleCodeChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange({ body: newValue });
    }
  };

  // Get available languages
  const availableLanguages = Object.keys(LANGUAGE_VERSIONS) as Language[];

  return (
    <div className="code-inputs-container">
      {/* Language Selector Dropdown */}
      <div className="relative mb-4" ref={dropdownRef}>
        <button
          type="button"
          className="w-full md:w-48 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded 
                     inline-flex items-center justify-between hover:bg-gray-300 transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="capitalize">
            {codeData.language || "javascript"}
          </span>
          <svg
            className={`fill-current h-4 w-4 ml-2 transform transition-transform 
                       ${isDropdownOpen ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute mt-1 w-full md:w-48 rounded-md bg-white shadow-lg z-10 border border-gray-200">
            <ul className="py-1 max-h-60 overflow-auto">
              {availableLanguages.map((lang) => (
                <li
                  key={lang}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                  onClick={() => handleLanguageSelect(lang)}
                >
                  {lang}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <Editor
          height="75vh"
          language={codeData.language?.toLowerCase() || "javascript"}
          value={codeData.body || ""}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            wrappingStrategy: "advanced",
            padding: { top: 10, bottom: 10 },
          }}
          onChange={handleCodeChange}
          loading={<div className="p-4">Loading editor...</div>}
        />
      </div>
    </div>
  );
};

export default React.memo(CodeInputs);
