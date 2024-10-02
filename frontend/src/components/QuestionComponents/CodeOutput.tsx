import React, { useEffect } from "react";
import { useFetchData } from "../../hooks/useFetchData";
import BasicSpinner from "../Basic/BasicSpinner";

interface CodeOutputProps {
  taskId: string | null;
}

interface TestResult {
  testCase: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTime: string;
}

interface TaskResult {
  status: string;
  error_type?: string;
  details?: string;
  test_case?: number;
  result?: {
    message: string;
    results: TestResult[];
  };
}

const CodeOutput: React.FC<CodeOutputProps> = ({ taskId }) => {
  const {
    data: result,
    loading,
    error,
    refetch,
  } = useFetchData<TaskResult>(
    taskId ? `/answers/evaluate-code?task_id=${taskId}` : ""
  );

  useEffect(() => {
    let interval: any;
    let delay = 1000; // start with 1 second

    const poll = () => {
      refetch();
      if (
        error ||
        (result && (result.status === "Success" || result.status === "Error"))
      ) {
        clearInterval(interval);
      } else {
        // Increase delay exponentially
        delay = Math.min(delay * 2, 32000); // Cap at 32 seconds
        interval = setTimeout(poll, delay);
      }
    };

    if (taskId) {
      poll();
      return () => clearInterval(interval);
    }
  }, [taskId, result, error, refetch]);

  if (loading) {
    return <BasicSpinner />;
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  if (result.status === "Error") {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{result.error_type}</span>
        <p>{result.details}</p>
        {result.test_case && <p>Failed at test case: {result.test_case}</p>}
      </div>
    );
  }

  // Ensure the result has a valid 'result' property before destructuring
  if (result.status === "Success" && result.result) {
    const { message, results } = result.result;

    return (
      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Execution Results</h3>
        <p
          className={
            message === "All tests passed" ? "text-green-600" : "text-red-600"
          }
        >
          {message}
        </p>
        {results.map((testResult, index) => (
          <div
            key={index}
            className={`mt-2 p-2 ${
              testResult.passed ? "bg-green-100" : "bg-red-100"
            } rounded`}
          >
            <p>
              Test Case {testResult.testCase}:{" "}
              {testResult.passed ? "Passed" : "Failed"}
            </p>
            <p>Input: {testResult.input}</p>
            <p>Expected Output: {testResult.expectedOutput}</p>
            <p>Actual Output: {testResult.actualOutput}</p>
            <p>Execution Time: {testResult.executionTime}</p>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default CodeOutput;
