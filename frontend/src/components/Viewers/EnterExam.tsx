import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import laptopImage from "../../images/laptop.jpg";
import { useFetchData } from "../../hooks/useFetchData";
import BasicSpinner from "../Basic/BasicSpinner";

interface ExamData {
  duration: string;
}

const ExamEntry: React.FC = () => {
  const { examCode } = useParams();
  const navigate = useNavigate();

  // Assuming useFetchData returns data of type ExamData or null/undefined in case of an error
  const { data, loading, error } = useFetchData<ExamData>(
    `exams/exam-durations/${examCode}`,
    "v2"
  );

  useEffect(() => {
    if (!loading && (!data || !data.duration)) {
      navigate("/permission-denied");
    }
  }, [loading, data, navigate]);

  // Function to handle starting the exam
  const enterExam = () => {
    alert("Exam started. Please stay focused and avoid switching tabs.");
    navigate(`/exam/${examCode}`);
  };

  if (loading) {
    return <BasicSpinner />;
  }

  return (
    <div className="bg-emerald-100 flex items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-emerald-600 mb-4 text-center">
          Exam Entry
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          Exam Code:{" "}
          <span className="font-semibold text-emerald-700">{examCode}</span>
        </p>
        <p className="text-lg text-gray-700 mb-2">
          Exam Duration:{" "}
          <span className="font-semibold text-emerald-700">
            {data?.duration}
          </span>
        </p>
        <img
          src={laptopImage}
          alt="Student looking at laptop"
          className="mx-auto my-6 rounded-lg shadow-sm"
        />

        <p className="text-md text-gray-700 mb-4">
          Please note that while taking the exam, your camera will be monitored
          by AI-based cheating detection. This footage will{" "}
          <span className="font-semibold text-emerald-700">NOT</span> be
          recorded or stored; it's solely analyzed to detect any cheating
          attempts. Please ensure that you:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Stay focused on the screen during the exam.</li>
          <li>Avoid looking away frequently.</li>
          <li>
            Avoid switching tabs or minimizing your browser, as these actions
            will be tracked.
          </li>
        </ul>
        <p className="text-md text-gray-700 mb-6">
          Once you start the exam, you{" "}
          <span className="font-semibold text-emerald-700">
            cannot pause or stop
          </span>{" "}
          it, and your entry will be counted. If the time runs out before
          submission, your answers will be automatically submitted.
        </p>

        <button
          onClick={enterExam}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition duration-200"
        >
          Enter Exam
        </button>
      </div>
    </div>
  );
};

export default ExamEntry;
