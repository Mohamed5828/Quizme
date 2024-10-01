import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentExamEntry: React.FC = () => {
  const [examCode, setExamCode] = useState("");
  const navigate = useNavigate();

  // Function to handle the navigation to the exam entry page
  const handleNext = () => {
    if (examCode.trim() !== "") {
      navigate(`/enter-exam/${examCode}`);
    } else {
      alert("Please enter a valid exam code.");
    }
  };

  return (
    <div className="bg-emerald-100 flex items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-emerald-600 mb-6">
          Enter Exam Code
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Please enter your exam code to proceed to the exam.
        </p>
        <input
          type="text"
          value={examCode}
          onChange={(e) => setExamCode(e.target.value)}
          placeholder="Enter Exam Code"
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={handleNext}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentExamEntry;
