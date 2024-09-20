import React, { useState, useEffect } from "react";
import SingleQuestionComponent from "./SingleQuestionComponent";
import CodeEditor from "./CodeEditor";
import questData from "../../data/quest.json";
import { Language } from "./constants";

interface StarterCode {
  language: Language;
  code: string;
}

interface Question {
  id: number;
  question: string;
  type: "code" | "multiple-choice";
  correct_answer: number;
  answers?: string[];
  description?: string;
  starter_code?: StarterCode[];
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  );

  useEffect(() => {
    setQuestions(questData as Question[]);
  }, []);

  const activeQuestion = questions.find((q) => q.id === currentQuestionId);

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
          {questions.map((question) => (
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
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              {activeQuestion.question}
            </h1>
            {activeQuestion.description && (
              <p className="mb-6 text-gray-600">{activeQuestion.description}</p>
            )}

            {activeQuestion.type === "code" ? (
              <div className="mb-6">
                <CodeEditor
                  questionId={activeQuestion.id}
                  starterCode={activeQuestion.starter_code || []}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {activeQuestion.answers?.map((answer, index) => (
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
                    {answer}
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
