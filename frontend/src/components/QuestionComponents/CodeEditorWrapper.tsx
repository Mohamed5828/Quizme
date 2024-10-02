import React, { useState } from "react";
import CodeEditor from "./CodeEditor";
import CodeOutput from "./CodeOutput";
import { Language } from "./constants";
import postData from "../../utils/postData";
import { User } from "../authentication/Profile";
import { useUserContext } from "../../../context/UserContext";
import { useParams } from "react-router-dom";

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
  const { user } = useUserContext();
  const [answerCode, setAnswerCode] = useState<string>(
    starterCode[0]?.code || ""
  );
  const [taskId, setTaskId] = useState<string | null>(null);
  const auth: User | null = user;
  const { examCode } = useParams();

  const handleSubmit = async () => {
    if (!answerCode || !auth) return;
    const url = `/answers/evaluate-code`;
    const data = {
      code: answerCode,
      studentId: auth.id,
      questionId: questionId,
      examCode: examCode,
      language: "javascript",
      version: "18.15.0",
    };
    const { resData, error } = await postData(url, data);
    if (error) {
      console.error("Submission error:", error);
    } else {
      console.log("Submission successful:", resData);
      setTaskId(resData.taskId);
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
      <CodeOutput key={taskId} taskId={taskId} />{" "}
    </div>
  );
};
export default CodeEditorWrapper;
