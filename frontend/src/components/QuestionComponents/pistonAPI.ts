import axios, { AxiosInstance } from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

// Define types for our API response and parameters
interface ExecuteCodeResponse {
  // Define the structure of your API response here
  // For example:
  output: string;
  status: "success" | "error";
  executionTime?: number;
}

interface ExecuteCodeParams {
  language: string;
  code: string;
  questionId: number;
}

// Create a type for the LANGUAGE_VERSIONS object
type LanguageVersions = {
  [key: string]: string;
};

// Assert that LANGUAGE_VERSIONS matches the LanguageVersions type
const languageVersions: LanguageVersions = LANGUAGE_VERSIONS;

// Create the API instance
const API: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

/**
 * Executes code for a given language and question.
 *
 * @param language - The programming language of the code
 * @param code - The code to be executed
 * @param questionId - The ID of the question
 * @returns A promise that resolves to the execution result
 * @throws Will throw an error if the API call fails
 */
export const executeCode = async ({
  language,
  code,
  questionId,
}: ExecuteCodeParams): Promise<ExecuteCodeResponse> => {
  try {
    const response = await API.post<ExecuteCodeResponse>(`run/${questionId}`, {
      language,
      code,
      version: languageVersions[language],
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error executing code:", error);
    throw error;
  }
};
