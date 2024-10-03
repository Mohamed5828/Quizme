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
      setError(err as AxiosError);
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
