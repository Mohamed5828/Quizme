import React from "react";
import BasicSpinner from "../Basic/BasicSpinner";
import ExamsList, { Attempt } from "./ExamsList";
import { useFetchData } from "../../hooks/useFetchData";

function AllExams() {
  const { data, loading, error } = useFetchData<Attempt[]>(`/attempts/`, "v1");

  if (loading) {
    return <BasicSpinner />;
  }

  if (error) {
    return <p>Error loading data: {error.message}</p>;
  }

  if (!data || data.length === 0) {
    return <p style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '10vh' }}>No exams found.</p>;
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Total Exams: {data.length}</h2>
      <div className="w-full max-w-3xl">
        <ExamsList attempts={data} />
      </div>
    </div>
  );
}

export default AllExams;
