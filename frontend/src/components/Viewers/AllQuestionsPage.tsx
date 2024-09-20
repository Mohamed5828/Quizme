import React, { useState, useEffect } from "react";
import QuestionContainer from "../QuestionComponents/QuestionContainer";
import Timer from "../QuestionComponents/Timer"; // Assuming you have a Timer component

interface UserAnswer {
  questionId: number;
  answer: string | number;
}

function AllQuestionsPage() {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(3600); // 1 hour in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time is up
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    console.log("Submitting answers:", userAnswers);
    // Implement your API call here
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <Timer timeRemaining={timeRemaining} />
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
