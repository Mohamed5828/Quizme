import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetchData } from "../../hooks/useFetchData";
import BasicSpinner from "../Basic/BasicSpinner";

interface TestCase {
  input: string;
  output: string;
}

interface Choice {
  desc: string;
  isCorrect: boolean;
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
  code: string;
}

interface ExamData {
  examCode: string;
  duration: string;
  maxGrade: number;
  startDate: string;
  expirationDate: string;
  questions: Question[];
}
const ModelAnswersPage = () => {
  const { examCode } = useParams<{ examCode: string }>();
  const {
    data: examData,
    loading,
    error,
  } = useFetchData<ExamData>(`/exams/${examCode}`, "v2");

  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (examData && examData.questions.length > 0) {
      setCurrentQuestionId(examData.questions[0].id);
    }
  }, [examData]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <BasicSpinner />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  if (!examData) return null;

  const activeQuestion = examData.questions.find(
    (q) => q.id === currentQuestionId
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Model Answers - Exam: {examData.examCode}
        </h1>
        <p className="text-gray-600 mt-2">
          Duration: {examData.duration} | Max Grade: {examData.maxGrade}
        </p>
      </header>
      <main className="flex-grow flex overflow-hidden">
        <aside className="w-1/3 bg-white shadow-lg overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {examData.questions.map((question) => (
              <li
                key={question.id}
                className={`p-4 cursor-pointer transition-colors duration-150 ease-in-out
                  ${question.id === currentQuestionId ? "bg-blue-100 border-l-4 border-blue-500" : "hover:bg-gray-50"}`}
                onClick={() => setCurrentQuestionId(question.id)}
              >
                <h3 className="font-semibold text-gray-800">{question.desc}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Type: {question.type} | Difficulty: {question.difficulty}
                </p>
              </li>
            ))}
          </ul>
        </aside>
        <section className="w-2/3 overflow-y-auto p-8 bg-white shadow-lg ml-4 mr-4 my-4 rounded-lg">
          {activeQuestion ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {activeQuestion.desc}
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {activeQuestion.type}
                </p>
                <p>
                  <span className="font-semibold">Difficulty:</span>{" "}
                  {activeQuestion.difficulty}
                </p>
                <p>
                  <span className="font-semibold">Grade:</span>{" "}
                  {activeQuestion.grade}
                </p>
                <p>
                  <span className="font-semibold">Tags:</span>{" "}
                  {activeQuestion.tags.join(", ")}
                </p>
              </div>

              {activeQuestion.type === "code" ? (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Starter Code:</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{activeQuestion.code.body}</code>
                  </pre>
                  <h3 className="font-semibold text-lg mt-6 mb-2">
                    Test Cases:
                  </h3>
                  <ul className="space-y-2">
                    {activeQuestion.testCases.map((testCase, index) => (
                      <li key={index} className="bg-gray-50 p-3 rounded-md">
                        <span className="font-semibold">Input:</span>{" "}
                        {testCase.input}
                        <br />
                        <span className="font-semibold">Output:</span>{" "}
                        {testCase.output}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Choices:</h3>
                  <ul className="space-y-2">
                    {activeQuestion.choices.map((choice, index) => (
                      <li
                        key={index}
                        className={`p-3 rounded-md ${
                          choice.isCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-50"
                        }`}
                      >
                        {choice.desc}{" "}
                        {choice.isCorrect && (
                          <span className="ml-2 font-semibold">(Correct)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-10">
              Select a question to view details.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ModelAnswersPage;
