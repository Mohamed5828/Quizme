import React, { useMemo } from "react";
import StudentList from "./StudentList";
import { useParams } from "react-router-dom";
import { useFetchData } from "../../hooks/useFetchData";
import { Person } from "./StudentList";
import BasicSpinner from "../Basic/BasicSpinner";

const ExamAllStudent = () => {
  const { examCode } = useParams();

  const { data, loading, error } = useFetchData<Person[]>(
    `/attempts?examCode=${examCode}/`
  );

  if (loading) {
    return <BasicSpinner />;
  }

  if (error) {
    return <p>Error loading data: {error.message}</p>;
  }

  if (!data || data.length === 0) {
    return <p>No students found.</p>;
  }

  const sortedStudents = useMemo(() => {
    return [...data].sort((a, b) => Number(b.score) - Number(a.score));
  }, [data]);

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Total Students: {sortedStudents.length}
      </h2>

      <div className="w-4/5 lg:w-3/5">
        <StudentList students={sortedStudents} />
      </div>
    </div>
  );
};

export default ExamAllStudent;
