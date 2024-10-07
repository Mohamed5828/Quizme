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

interface Answer {
  id: number;
  createdAt: string;
  score: number | null;
  choices: string[];
  code: { body: string; language: string; version: string } | null;
  questionId: number;
}

interface Student {
  id: number;
  username: string;
  email: string;
  role: string;
  category: string;
}

interface RequestAttempt {
  id: number;
  answers: Answer[];
  student: Student;
  score: number;
  startTime: string;
  endTime: string;
  cheatingMetric: any | null;
  studentId: number;
  examId: number;
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
  code: string | null;
}

interface ExamData {
  examCode: string;
  duration: string;
  maxGrade: number;
  startDate: string;
  expirationDate: string;
  questions: Question[];
}

const StudentAnswer = () => {
  const { examCode } = useParams<{ examCode: string }>();
  const { attemptId } = useParams<{ attemptId: string }>();
  const {
    data: examData,
    loading: examLoading,
    error: examError,
  } = useFetchData<ExamData>(`/exams/${examCode}`, "v2");

  const {
    data: studAns,
    loading: studLoading,
    error: studError,
  } = useFetchData<RequestAttempt>(`/attempts/${attemptId}`);

  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (examData?.questions?.length > 0) {
      setCurrentQuestionId(examData.questions[0].id);
    }
  }, [examData]);

  // Find student's answer for current question
  const getStudentAnswer = (questionId: number) => {
    return studAns?.answers?.find((answer) => answer.questionId === questionId);
  };

  if (examLoading || studLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BasicSpinner />
      </div>
    );
  }

  // Handle errors properly
  if (examError || studError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 p-4 rounded-lg bg-red-50">
          <h3 className="font-bold mb-2">Error</h3>
          <p>
            {examError?.message || studError?.message || "An error occurred"}
          </p>
        </div>
      </div>
    );
  }

  if (!examData || !studAns) return null;

  const activeQuestion = examData.questions.find(
    (q) => q.id === currentQuestionId
  );
  const activeStudentAnswer = currentQuestionId
    ? getStudentAnswer(currentQuestionId)
    : null;

  const renderCodeSection = () => {
    if (!activeQuestion) return null;
    const modelSolutionCode =
      typeof activeQuestion.code === "string"
        ? activeQuestion.code
        : activeQuestion.code?.body || "No model solution available";

    // Get the student's solution code safely
    const studentSolutionCode =
      activeStudentAnswer?.code?.body || "No solution submitted";

    return (
      <div className="space-y-6">
        {/* Model Solution */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Model Solution:</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{modelSolutionCode}</code>
          </pre>
        </div>

        {/* Student's Solution */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Student's Solution:</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{studentSolutionCode}</code>
          </pre>
        </div>

        {/* Test Cases */}
        {activeQuestion.testCases && activeQuestion.testCases.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Test Cases:</h3>
            <ul className="space-y-2">
              {activeQuestion.testCases.map((testCase, index) => (
                <li key={index} className="bg-gray-50 p-3 rounded-md">
                  <span className="font-semibold">Input:</span> {testCase.input}
                  <br />
                  <span className="font-semibold">Expected Output:</span>{" "}
                  {testCase.output}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Model Answers - Exam: {examData.examCode}
        </h1>
        <p className="text-gray-600 mt-2">
          Duration: {examData.duration} | Max Grade: {examData.maxGrade}
        </p>
        <p className="text-gray-600">
          Student: {studAns.student.username} | Score: {studAns.score}
        </p>
      </header>
      <main className="flex-grow flex overflow-hidden">
        <aside className="w-1/3 bg-white shadow-lg overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {examData.questions.map((question) => {
              const studentAnswer = getStudentAnswer(question.id);
              return (
                <li
                  key={question.id}
                  className={`p-4 cursor-pointer transition-colors duration-150 ease-in-out
                    ${
                      question.id === currentQuestionId
                        ? "bg-blue-100 border-l-4 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                  onClick={() => setCurrentQuestionId(question.id)}
                >
                  <h3 className="font-semibold text-gray-800">
                    {question.desc && question.desc.length > 40
                      ? `${question.desc.slice(0, 40)}...`
                      : question.desc}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Type: {question.type} | Score:{" "}
                    {studentAnswer?.score ?? "N/A"}
                  </p>
                </li>
              );
            })}
          </ul>
        </aside>
        <section className="w-2/3 overflow-y-auto p-8 bg-white shadow-lg ml-4 mr-4 my-4 rounded-lg">
          {activeQuestion ? (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
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
                  <span className="font-semibold">Student Score:</span>{" "}
                  {activeStudentAnswer?.score ?? "N/A"}
                </p>
              </div>

              {activeQuestion.type === "code" ? (
                renderCodeSection()
              ) : (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Choices:</h3>
                  <ul className="space-y-2">
                    {activeQuestion.choices.map((choice, index) => {
                      const isStudentChoice =
                        activeStudentAnswer?.choices?.includes(choice.desc);
                      return (
                        <li
                          key={index}
                          className={`p-3 rounded-md ${
                            choice.isCorrect && isStudentChoice
                              ? "bg-green-100 text-green-800"
                              : choice.isCorrect
                                ? "bg-green-50 text-green-800"
                                : isStudentChoice
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-50"
                          }`}
                        >
                          {choice.desc}{" "}
                          {choice.isCorrect && (
                            <span className="ml-2 font-semibold">
                              (Correct Answer)
                            </span>
                          )}
                          {isStudentChoice && (
                            <span className="ml-2 font-semibold">
                              (Student's Answer)
                            </span>
                          )}
                        </li>
                      );
                    })}
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

export default StudentAnswer;
