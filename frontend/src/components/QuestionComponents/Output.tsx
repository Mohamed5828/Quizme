import React, { useState } from "react";
import { executeCode } from "./pistonAPI";

interface OutputProps {
  code: string;
  language: string;
  questionId: number;
}

const Output: React.FC<OutputProps> = ({ code, language, questionId }) => {
  const [output, setOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [passed, setPassed] = useState(false);

  const runCode = async () => {
    if (!code) return;

    setIsLoading(true);
    setIsError(false);
    setPassed(false);

    try {
      const result = await executeCode({ language, code, questionId });
      setOutput(result);

      let testPassed = true;
      if (Array.isArray(result)) {
        result.forEach((test) => {
          if (
            parseFloat(test.expectedOutput).toFixed(3) !==
            parseFloat(test.output).toFixed(3)
          ) {
            testPassed = false;
          }
        });
      } else {
        testPassed = false;
      }

      setIsError(!testPassed);
      setPassed(testPassed);
    } catch (error) {
      console.error("Error executing code:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-1/4">
      <p className="mb-2 text-lg">Output</p>
      <button
        onClick={runCode}
        disabled={isLoading}
        className={`px-4 py-2 mb-4 border rounded ${
          isLoading ? "bg-gray-500" : "bg-green-500 text-white"
        }`}
      >
        {isLoading ? "Running..." : "Run Code"}
      </button>
      <button
        onClick={() => {
          // Submit logic
        }}
        disabled={!passed}
        className={`ml-4 px-4 py-2 border rounded ${
          passed ? "bg-blue-500 text-white" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Submit
      </button>
      <div
        className={`mt-4 p-2 border rounded overflow-auto h-96 ${
          isError
            ? "text-red-400 border-red-500"
            : passed
              ? "text-green-400 border-green-500"
              : ""
        }`}
      >
        {output &&
          Array.isArray(output) &&
          output.map((test, i) => (
            <div key={i} className="mb-4">
              <p>Test ID: {test.test_id}</p>
              <p>Input: {test.input}</p>
              <p>Output: {test.output}</p>
              <p>
                Expected Output: {parseFloat(test.expectedOutput).toFixed(3)}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Output;
