import { AxiosError, isAxiosError } from "axios";
import { useState, useEffect, useCallback } from "react";
// import { axiosInstance } from "../utils/axiosInstance";
import { useUserContext } from "../components/UserContext";
import axiosInstance from "../utils/axiosInstance";

interface UseFetchDataResponse<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  refetch: () => void;
}

export function useFetchData<T>(url: string): UseFetchDataResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const { refreshAccessToken } = useUserContext();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<T>(url);
      setData(response.data);
      setError(null);
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error);
        console.error("Error during request:", error.message);

        if (error.response?.status === 401 && refreshAccessToken) {
          await refreshAccessToken();
          fetchData(); // Retry fetching after refreshing token
        }
      } else {
        setError(new AxiosError("An unexpected error occurred"));
      }
    } finally {
      setLoading(false);
    }
  }, [url, refreshAccessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
