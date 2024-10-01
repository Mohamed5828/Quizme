import React, { useMemo } from "react";
import StudentList from "./StudentList";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchData } from "../../hooks/useFetchData";
import { Person } from "./StudentList";
import BasicSpinner from "../Basic/BasicSpinner";
import noDataImage from "../../images/no-data-bro.png";

const ExamAllStudent = () => {
  const { examCode } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useFetchData<Person[]>(
    `/attempts?examCode=${examCode}/`
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BasicSpinner />
      </div>
    );
  }
  const handleViewAnswers = () => {
    navigate(`/answer/${examCode}`);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-lg font-semibold">
          Error loading data: {error.message}
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
        <button
          onClick={handleViewAnswers}
          className="px-6 py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-400 transition duration-300 mb-6"
        >
          View Answers
        </button>
        <img src={noDataImage} alt="No data" className="w-80 h-80" />
        <p className="text-emerald-600 text-xl font-bold mt-4">
          No students found.
        </p>
      </div>
    );
  }

  const sortedStudents = useMemo(() => {
    return [...data].sort((a, b) => Number(b.score) - Number(a.score));
  }, [data]);

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-3xl font-bold text-emerald-700 mb-4">
        Total Students: {sortedStudents.length}
      </h2>

      <div className="w-4/5 lg:w-3/5 bg-white rounded-lg shadow-lg p-6 mb-6">
        <StudentList students={sortedStudents} />
      </div>

      <button
        onClick={handleViewAnswers}
        className="px-6 py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-400 transition duration-300"
      >
        View Answers
      </button>
    </div>
  );
};

export default ExamAllStudent;
