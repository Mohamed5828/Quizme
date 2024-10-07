import React, { useState, useEffect } from "react";
import clock from "../../../../images/clock.png";

const ExamWaitingPage = ({ startTime }) => {
  // Parsing the startTime prop as a Date object
  const examDate = new Date(startTime);

  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    return examDate > now ? Math.floor((examDate - now) / 1000) : 0;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-300 via-teal-300 to-emerald-500 flex items-center justify-center">
      <div className="bg-white bg-opacity-90 shadow-2xl rounded-lg p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-emerald-600 mb-6">
          The Exam Hasn't Started Yet
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          The exam starts at{" "}
          <span className="font-semibold text-emerald-700">
            {examDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
          . Please refresh the page when the time comes to begin.
        </p>
        <img
          src={clock}
          alt="Clock"
          className="w-48 h-48 mx-auto mb-6 rounded-full shadow-md border-4 border-emerald-500"
        />

        {timeLeft > 0 ? (
          <div className="mb-6">
            <p className="text-lg text-gray-800">
              Time left until the exam starts:
            </p>
            <p className="text-2xl font-bold text-emerald-700 mt-2">
              {formatTime(timeLeft)}
            </p>
          </div>
        ) : (
          <p className="text-lg text-emerald-700 font-semibold">
            It's time! Please refresh the page to start the exam.
          </p>
        )}

        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-full hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-600/50"
        >
          Refresh Page
        </button>
      </div>
    </section>
  );
};

export default ExamWaitingPage;
