import { AxiosError, isAxiosError } from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import { useUserContext } from "../../context/UserContext";
import { getAxiosInstance } from "../utils/axiosInstance";

interface UseFetchDataResponse<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  refetch: () => void;
}

export function useFetchData<T>(
  url: string,
  apiVersion: string = "/v1"
): UseFetchDataResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const { refreshAccessToken } = useUserContext();
  const axiosInstanceRef = useRef(getAxiosInstance(apiVersion));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstanceRef.current.get<T>(url);
      setData(response.data);
      setError(null);
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error);
        console.error("Error during request:", error.message);

        if (error.response?.status === 401 && refreshAccessToken) {
          await refreshAccessToken();
          // Retry fetching after refreshing token
          try {
            const retryResponse = await axiosInstanceRef.current.get<T>(url);
            setData(retryResponse.data);
            setError(null);
          } catch (retryError) {
            if (isAxiosError(retryError)) {
              setError(retryError);
            }
          }
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
