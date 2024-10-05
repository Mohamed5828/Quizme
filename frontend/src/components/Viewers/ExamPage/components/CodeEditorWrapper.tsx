import React, { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import CodeOutput from "../../../QuestionComponents/CodeOutput";
import postData from "../../../../utils/postData";
import { useUserContext } from "../../../../../context/UserContext";
import { useParams } from "react-router-dom";
import { Language } from "../../../QuestionComponents/constants";

interface StarterCode {
  language: Language;
  code: string;
  version: string;
}

interface CodeEditorWrapperProps {
  questionId: number;
  starterCode: StarterCode[] | null; // starterCode is fetched and may initially be null
}

const CodeEditorWrapper: React.FC<CodeEditorWrapperProps> = ({
  questionId,
  starterCode,
}) => {
  const { user } = useUserContext();
  const { examCode } = useParams();

  // Initialize state that depends on starterCode only when it becomes available
  const [answerCode, setAnswerCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [version, setVersion] = useState<string>("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const auth = user;

  // useEffect to initialize the code, language, and version once starterCode is available
  useEffect(() => {
    if (starterCode && starterCode.length > 0) {
      setAnswerCode(starterCode[0].code);
      setLanguage(starterCode[0].language);
      setVersion(starterCode[0].version);
    }
  }, [starterCode]);

  const handleSubmit = async () => {
    if (!answerCode || !auth) return;

    // Disable the button for 8 seconds
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 8000);

    const url = `/answers/evaluate-code`;
    const data = {
      code: answerCode,
      studentId: auth.id,
      questionId,
      examCode,
      language,
      version,
    };

    const { resData, error } = await postData(url, data);
    if (error) {
      console.error("Submission error:", error);
    } else {
      console.log("Submission successful:", resData);
      setTaskId(resData.taskId);
    }
  };

  // Only render the CodeEditor once the starterCode is available
  if (!starterCode || starterCode.length === 0) {
    return <div>Loading...</div>; // Or a loading spinner to indicate data fetching
  }

  return (
    <div>
      <CodeEditor
        questionId={questionId}
        starterCode={starterCode}
        answerCode={answerCode}
        setAnswerCode={setAnswerCode}
        language={language}
        setLanguage={setLanguage}
      />
      <button
        onClick={handleSubmit}
        disabled={isButtonDisabled}
        className={`mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors ${
          isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isButtonDisabled ? "Please wait..." : "Test Code"}
      </button>
      <CodeOutput key={taskId} taskId={taskId} />
    </div>
  );
};

export default CodeEditorWrapper;
