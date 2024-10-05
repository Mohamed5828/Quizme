import React, { useState } from "react";
import SingleQuestionComponent from "./SingleQuestionComponent";
import CodeEditorWrapper from "./CodeEditorWrapper";
import { useFetchData } from "../../../../hooks/useFetchData";
import BasicSpinner from "../../../Basic/BasicSpinner";
import { useParams } from "react-router-dom";
import useQuestionNavMonitor from "../../../../hooks/useQuestionNavMonitor";

interface Choice {
  desc: string;
  isCorrect: string;
}

interface TestCase {
  input: string;
  output: string;
}
export interface CodeData {
  body: string;
  language: string;
  version: string;
}

interface Question {
  id: number;
  desc: string;
  type: "code" | "mcq";
  difficulty: string;
  tags: string[];
  grade: number;
  choices: Choice[];
  testCases: TestCase[];
  code: CodeData;
}

interface ExamData {
  id: string;
  examCode: string;
  duration: string;
  maxGrade: number;
  startDate: string;
  expirationDate: string;
  questions: Question[];
}

interface UserAnswer {
  questionId: number;
  answer: string | number;
}

interface QuestionContainerProps {
  userAnswers: UserAnswer[];
  setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswer[]>>;
}

function QuestionContainer({
  userAnswers,
  setUserAnswers,
}: QuestionContainerProps) {
  const { examCode } = useParams();

  const {
    data: examData,
    loading,
    error,
  } = useFetchData<ExamData>(`/exams/${examCode}`, "v2");
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  );
  useQuestionNavMonitor(currentQuestionId);

  if (loading)
    return (
      <div>
        <BasicSpinner />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  if (!examData) return null;

  const activeQuestion = examData.questions.find(
    (q) => q.id === currentQuestionId
  );

  const handleAnswerSelection = (answer: string | number) => {
    setUserAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (a) => a.questionId === currentQuestionId
      );
      if (existingAnswerIndex !== -1) {
        const newAnswers = [...prevAnswers];
        newAnswers[existingAnswerIndex].answer = answer;
        return newAnswers;
      } else {
        return [...prevAnswers, { questionId: currentQuestionId!, answer }];
      }
    });
  };

  return (
    <div className="flex h-full overflow-hidden bg-gray-100">
      <div className="w-1/3 overflow-y-auto border-r border-gray-300 bg-white shadow-md">
        <ul className="divide-y divide-gray-200">
          {examData.questions.map((question) => (
            <SingleQuestionComponent
              key={question.id}
              question={question}
              setActiveQuestion={setCurrentQuestionId}
              isAnswered={userAnswers.some((a) => a.questionId === question.id)}
            />
          ))}
        </ul>
      </div>

      <div className="w-2/3 overflow-y-auto p-6 bg-white shadow-md">
        {activeQuestion ? (
          <div>
            <h1 className="text-l font-bold mb-4 text-gray-800">
              {activeQuestion.desc}
            </h1>
            <p className="mb-6 text-gray-600">
              Difficulty: {activeQuestion.difficulty}, Grade:{" "}
              {activeQuestion.grade}
            </p>
            <div className="mb-4">
              <strong>Tags:</strong> {activeQuestion.tags.join(", ")}
            </div>

            {activeQuestion.type === "code" ? (
              <div className="mb-6">
                <CodeEditorWrapper
                  questionId={activeQuestion.id}
                  starterCode={[
                    {
                      language: activeQuestion.code.language,
                      code: activeQuestion.code.body,
                      version: activeQuestion.code.version,
                    },
                  ]}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {activeQuestion.choices.map((choice, index) => (
                  <button
                    key={index}
                    className={`block w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      userAnswers.find(
                        (a) => a.questionId === activeQuestion.id
                      )?.answer === index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => handleAnswerSelection(index)}
                  >
                    {choice.desc}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-10">
            Select a question to view details.
          </p>
        )}
      </div>
    </div>
  );
}

export default QuestionContainer;
