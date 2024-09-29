import { AxiosError, isAxiosError, AxiosRequestConfig } from "axios";
import { getAxiosInstance } from "./axiosInstance";

interface PutDataResponse<T> {
  resData: T | null;
  loading: boolean;
  error: AxiosError | null;
}

async function putData<T>(
  url: string,
  data: any,
  apiVersion: string = "v1",
  needAuth: boolean = true,
  headers: Record<string, string> = {}
): Promise<PutDataResponse<T>> {
  let loading = true;
  let error: AxiosError | null = null;
  let resData: T | null = null;

  const axiosInstance = getAxiosInstance(apiVersion, needAuth);

  const config: AxiosRequestConfig = {
    headers: { ...headers },
  };

  try {
    const response = await axiosInstance.put<T>(url, data, config);
    resData = response.data;
  } catch (e) {
    if (isAxiosError(e)) {
      error = e;
      console.error("Error during request:", e.message);
    } else {
      error = new AxiosError("An unexpected error occurred");
    }
  } finally {
    loading = false;
  }

  return { resData, loading, error };
}

export default putData;
