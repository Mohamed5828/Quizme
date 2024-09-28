import { Link } from "react-router-dom";

export interface Person {
  first_name: string;
  last_name: string;
  email: string;
  score: string | number;
  duration: string;
}

interface StudentListProps {
  students: Person[];
}

export default function StudentList({ students }: StudentListProps) {
  return (
    <ul
      role="list"
      className="divide-y divide-gray-200 bg-white shadow rounded-lg p-4"
    >
      {students &&
        students.map((student) => (
          <Link
            to={`/exam/:exam-code/${student.email}`}
            key={student.email}
            className="flex justify-between gap-x-6 py-5 hover:bg-gray-100 rounded-lg transition duration-300 p-3"
          >
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {student.first_name} {student.last_name}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {student.email}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">{student.score}</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                {student.duration}
              </p>
            </div>
          </Link>
        ))}
    </ul>
  );
}
