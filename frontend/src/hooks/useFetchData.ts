import { AxiosError, isAxiosError } from "axios";
import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../utils/axiosInstance";

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<T>(url);
      setData(response.data);
      setError(null);
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error);
      } else {
        setError(new AxiosError("An unexpected error occurred"));
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

export async function fetchData<T>(
  url: string
): Promise<{ data: T | null; loading: boolean; error: AxiosError | null }> {
  let loading = true;
  let error: AxiosError | null = null;
  let data: T | null = null;

  try {
    const response = await axiosInstance.get<T>(url);
    data = response.data;
  } catch (e) {
    if (isAxiosError(e)) {
      error = e;
    } else {
      error = new AxiosError("An unexpected error occurred");
    }
  } finally {
    loading = false;
  }

  return { data, loading, error };
}
