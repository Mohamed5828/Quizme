import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import useAxiosInstance from "../utils/axiosInstance";

interface UseFetchDataResponse<T> {
  data: T | null;
  statusCode: number | null;
  loading: boolean;
  error: AxiosError | null;
  refetch: () => void;
}

export function useFetchData<T>(
  url: string,
  apiVersion: string = "v1",
  needAuth: boolean = true
): UseFetchDataResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const axiosInstance = useAxiosInstance(apiVersion, needAuth);

  // Function to fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<T>(url);
      setData(response.data);
      setStatusCode(response.status);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);
      if (axiosError.response) {
        // If there is an error response from the server, update the status code
        setStatusCode(axiosError.response.status);
      } else {
        // Otherwise, reset the status code (for non-server errors, e.g., network errors)
        setStatusCode(null);
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Effect to fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return the data, loading state, error, and refetch function
  return {
    data,
    loading,
    error,
    statusCode,
    refetch: fetchData,
  };
}
