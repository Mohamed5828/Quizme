import React from "react";

interface Question {
  id: number;
  desc: string;
  type: "code" | "mcq";
}

interface SingleQuestionComponentProps {
  question: Question;
  setActiveQuestion: (id: number) => void;
  isAnswered: boolean;
}

const SingleQuestionComponent: React.FC<SingleQuestionComponentProps> = ({
  question,
  setActiveQuestion,
  isAnswered,
}) => {
  return (
    <li
      className={`flex justify-between gap-x-6 py-5 px-4 cursor-pointer hover:bg-gray-100 ${
        isAnswered ? "bg-green-50" : ""
      }`}
      onClick={() => setActiveQuestion(question.id)}
    >
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {question.desc && question.desc.length > 40
              ? `${question.desc.slice(0, 40)}...`
              : question.desc}
          </p>
          <p className="text-xs text-gray-500">{question.type.toUpperCase()}</p>
        </div>
      </div>
      {isAnswered && (
        <div className="shrink-0 flex items-center">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
        </div>
      )}
    </li>
  );
};

export default SingleQuestionComponent;
