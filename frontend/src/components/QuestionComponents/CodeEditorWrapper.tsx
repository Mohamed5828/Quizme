import React, { useState } from "react";
import CodeEditor from "./CodeEditor";
import { Language } from "./constants";
import postData from "../../utils/postData";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { User } from "../authentication/Profile";

interface CodeEditorWrapperProps {
  questionId: number;
  starterCode: StarterCode[];
}

interface StarterCode {
  language: Language;
  code: string;
}

const CodeEditorWrapper: React.FC<CodeEditorWrapperProps> = ({
  questionId,
  starterCode,
}) => {
  const [answerCode, setAnswerCode] = useState<string>(
    starterCode[0]?.code || ""
  );
  const auth: User | null = useAuthUser();

  const handleSubmit = async () => {
    if (!answerCode || !auth) return;
    const url = `/api/submit-answer/${questionId}`;
    const data = { answerCode, userId: auth.id };
    const { resData, error } = await postData(url, data);
    if (error) {
      console.error("Submission error:", error);
    } else {
      console.log("Submission successful:", resData);
    }
  };

  return (
    <div>
      <CodeEditor
        questionId={questionId}
        starterCode={starterCode}
        answerCode={answerCode}
        setAnswerCode={setAnswerCode}
      />
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
      >
        Test Code
      </button>
    </div>
  );
};

export default CodeEditorWrapper;
