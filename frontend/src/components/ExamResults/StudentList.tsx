import { Link } from "react-router-dom";
import React from "react";

// Define the type for Student
interface Student {
  id: number;
  username: string;
  email: string;
  role: string;
  category: string;
}

// Define the type for ExamResult
export interface ExamResult {
  id: number;
  answers: any[];
  student: Student;
  score: number | null;
  startTime: string;
  endTime: string | null;
  cheatingMetric: number | null;
  studentId: number;
  examId: number;
}

// Define the type for the props of StudentList
interface StudentListProps {
  students: ExamResult[];
  examCode: string | undefined;
}

export default function StudentList({ students, examCode }: StudentListProps) {
  // Function to calculate duration between two dates
  function calculateDuration(
    startDate: string,
    endDate: string | null
  ): string {
    if (!endDate) {
      return "In Progress";
    }

    // Parse the dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the duration in milliseconds
    let durationMs = end.getTime() - start.getTime();

    if (durationMs < 0) {
      return "Invalid Time";
    }

    // Calculate time components
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    durationMs %= 1000 * 60 * 60;

    const minutes = Math.floor(durationMs / (1000 * 60));
    durationMs %= 1000 * 60;

    const seconds = Math.floor(durationMs / 1000);

    // Format the time to HH:MM:SS
    const formattedDuration = [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ].join(":");

    return formattedDuration;
  }

  return (
    <ul
      role="list"
      className="divide-y divide-gray-200 bg-white shadow rounded-lg p-4"
    >
      {students &&
        students.map((examResult) => (
          <Link
            to={`/attempt/${examResult.id}`}
            key={examResult.student.email}
            className="flex justify-between gap-x-6 py-5 hover:bg-gray-100 rounded-lg transition duration-300 p-3"
          >
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {examResult.student.username}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {examResult.student.email}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">
                {examResult.score !== null ? examResult.score : "N/A"}
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                {calculateDuration(examResult.startTime, examResult.endTime)}
              </p>
            </div>
          </Link>
        ))}
    </ul>
  );
}
