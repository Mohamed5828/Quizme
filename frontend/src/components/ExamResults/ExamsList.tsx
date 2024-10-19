export interface Attempt {
  examId: number;
  score: number;
  startTime: string;
  endTime: string;
}

interface ExamsListProps {
  attempts: Attempt[];
}

export default function ExamsList({ attempts }: ExamsListProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Your Exam Attempts</h2>
      <ul
        role="list"
        className="divide-y divide-gray-200 bg-white shadow rounded-lg"
      >
        {attempts &&
          attempts.map((attempt) => (
            <li
              key={attempt.examId}
              className="flex justify-between items-center gap-x-6 py-4 hover:bg-gray-100 rounded-lg transition duration-300 p-3"
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    Exam ID: {attempt.examId}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    Start Time: {new Date(attempt.startTime).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm leading-6 text-gray-900">
                  Score: {attempt.score}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  End Time: {new Date(attempt.endTime).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
