import React from "react";
import clock from "../../../../images/clockred.webp";

const ExamExpiredPage = ({ endTime }) => {
  const examEndDate = new Date(endTime);

  return (
    <section className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center">
      <div className="bg-white bg-opacity-90 shadow-2xl rounded-lg p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-6">
          The Exam Has Expired
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Unfortunately, the time to take this exam has ended. If you have any
          questions, please contact your instructor or check for further
          instructions.
        </p>

        <img
          src={clock}
          alt="Clock"
          className="w-48 mx-auto mb-6 rounded-full shadow-md border-4 border-red-500"
        />

        <p className="text-lg text-red-700 font-semibold">
          The exam ended at{" "}
          <span className="font-bold">
            {examEndDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
          .
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors shadow-lg hover:shadow-red-600/50"
        >
          Go to Home Page
        </button>
      </div>
    </section>
  );
};

export default ExamExpiredPage;
