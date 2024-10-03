import React, { useEffect, useState } from "react";
import BasicSpinner from "../Basic/BasicSpinner";

interface CodeOutputProps {
  taskId: string | null;
}
interface TestResult {
  testCase: number;
  passed: boolean;
  input: string;
  expected_output: string;
  actual_output: string;
  execution_time: string;
}

interface TaskResult {
  status: string;
  error_type?: string;
  details?: string;
  test_case?: number;
  result?: {
    message: string;
    score?: number;
    max_score?: number;
    results?: TestResult[];
  };
}

const CodeOutput: React.FC<CodeOutputProps> = ({ taskId }) => {
  const [result, setResult] = useState<TaskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const eventSource = new EventSource(
      `http://127.0.0.1:8000/api/v1/answers/evaluate-code/${taskId}`
    );

    eventSource.onmessage = (event) => {
      const data: TaskResult = JSON.parse(event.data);
      setResult(data);
      console.log(data);

      if (["Success", "Error", "Failure"].includes(data.status)) {
        setLoading(false);
        eventSource.close(); // Close SSE when done
      }
    };

    eventSource.onerror = () => {
      setError("An error occurred while evaluating the code.");
      setLoading(false);
      eventSource.close();
    };

    // Clean up on component unmount
    return () => {
      eventSource.close();
    };
  }, [taskId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <BasicSpinner />
        <span className="ml-2">Evaluating code...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  if (result.status === "Error") {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg space-y-2"
        role="alert"
      >
        <div className="font-bold">Error Type: {result.error_type}</div>
        {result.details && <div>{result.details}</div>}
        {result.test_case && <div>Failed at test case: {result.test_case}</div>}
      </div>
    );
  }

  if (result.status === "Success" && result.result) {
    return (
      <div className="mt-4 space-y-4">
        <div className="flex items-center">
          <h3 className="text-xl font-bold">Execution Results</h3>
          <span
            className={`ml-4 px-3 py-1 rounded-full text-sm ${
              result.result.message === "All tests passed"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {result.result.message}
          </span>
        </div>
        <div>
          {result.result.results ? (
            result.result.results.map((test, index) => (
              <div
                key={index}
                className={`mt-2 p-4 rounded-lg border ${
                  test.passed
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">
                    Test Case {test.testCase}:{" "}
                    <span
                      className={
                        test.passed ? "text-green-600" : "text-red-600"
                      }
                    >
                      {test.passed ? "Passed" : "Failed"}
                    </span>
                  </h4>
                  <span className="text-sm text-gray-600">
                    Time: {test.execution_time}
                  </span>
                </div>
                <p>
                  <span className="font-medium">Input:</span> {test.input}
                </p>
                <p>
                  <span className="font-medium">Expected:</span>{" "}
                  {test.expected_output}
                </p>
                <p>
                  <span className="font-medium">Actual:</span>{" "}
                  {test.actual_output}
                </p>
              </div>
            ))
          ) : (
            <div className="mt-2 p-4 rounded-lg border bg-green-50 border-green-200">
              <h4 className="font-semibold text-green-600">
                {result.result.message}
              </h4>
              <p>
                <span className="font-medium">Score:</span>{" "}
                {result.result.score}/{result.result.max_score}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default CodeOutput;
