import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ExamResult: React.FC = () => {
  const { examCode } = useParams();
  const navigate = useNavigate();

  // Function to handle navigating to the user's profile
  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="bg-emerald-100 flex items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-emerald-600 mb-4 text-center">
          Exam Submission Confirmed
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          Exam Code:{" "}
          <span className="font-semibold text-emerald-700">{examCode}</span>
        </p>
        <p className="text-md text-gray-700 mb-6">
          Your exam has been submitted successfully. It will now be analyzed by
          the instructor. You will be notified once the evaluation is complete.
        </p>

        <p className="text-md text-gray-700 mb-6">
          You can safely close this page, or head to your{" "}
          <span className="font-semibold text-emerald-700">profile</span> to
          review your exam history and personal details.
        </p>

        <div className="flex gap-4">
          <button
            onClick={goToProfile}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            Go to Profile
          </button>
          <button
            onClick={() => window.close()}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            Close Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
