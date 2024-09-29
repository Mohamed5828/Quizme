import { AxiosError, isAxiosError, AxiosRequestConfig } from "axios";
import { getAxiosInstance } from "./axiosInstance";

interface DeleteDataResponse<T> {
  resData: T | null;
  loading: boolean;
  error: AxiosError | null;
}

async function deleteData<T>(
  url: string,
  apiVersion: string = "v1",
  needAuth: boolean = true,
  headers: Record<string, string> = {}
): Promise<DeleteDataResponse<T>> {
  let loading = true;
  let error: AxiosError | null = null;
  let resData: T | null = null;

  const axiosInstance = getAxiosInstance(apiVersion, needAuth);

  const config: AxiosRequestConfig = {
    headers: { ...headers },
  };

  try {
    const response = await axiosInstance.delete<T>(url, config);
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

export default deleteData;
