import { Link } from "react-router-dom";

export interface ExamQuestions {
  id: number;
  desc: string;
  type: "code" | "mcq";
  difficulty?: "easy" | "medium" | "hard";
  tags?: string;
  grade: number;
  choices?: string[];
  test_cases?: string[];
  code?: string;
}

export interface ExamInstance {
  exam_code: string;
  duration: string;
  created_at: string;
  expiration_date: string;
  questions: ExamQuestions[];
}

interface ExamListProps {
  exams: ExamInstance[];
}

export default function ExamsList({ exams }: ExamListProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Your Created Exams</h2>
      <ul
        role="list"
        className="divide-y divide-gray-200 bg-white shadow rounded-lg"
      >
        {exams &&
          exams.map((exam) => (
            <Link
              to={`/exam-result/${exam.exam_code}`}
              key={exam.exam_code}
              className="flex justify-between items-center gap-x-6 py-4 hover:bg-gray-100 rounded-lg transition duration-300 p-3"
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {exam.exam_code}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {exam.duration}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Created:</span>
                <p className="text-sm leading-6 text-gray-900">
                  {exam.created_at}
                </p>
                <span className="text-xs text-gray-500">Expires:</span>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {exam.expiration_date}
                </p>
              </div>
            </Link>
          ))}
      </ul>
    </div>
  );
}
