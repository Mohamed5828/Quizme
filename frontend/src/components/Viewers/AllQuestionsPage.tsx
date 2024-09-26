import React, { useState, useRef, useCallback } from "react";
import QuestionContainer from "../QuestionComponents/QuestionContainer";
import Timer from "../QuestionComponents/Timer";

interface UserAnswer {
  questionId: number;
  answer: string | number;
}

function AllQuestionsPage() {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const timerRef = useRef<{ timeRemaining: number }>({
    timeRemaining: 300, // 5 min
  });

  const handleSubmit = useCallback(() => {
    console.log("Submitting answers:", userAnswers);
  }, [userAnswers]);

  const handleTimerEnd = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <Timer timerRef={timerRef} onTimerEnd={handleTimerEnd} />
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
          onClick={handleSubmit}
        >
          Submit Answers
        </button>
      </div>
      <div className="flex-grow mt-4 overflow-hidden">
        <QuestionContainer
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
        />
      </div>
    </div>
  );
}

export default AllQuestionsPage;
