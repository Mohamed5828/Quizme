import { axiosInstance } from "./axiosInstance";
import { AxiosError, isAxiosError, AxiosRequestConfig } from "axios";

interface PostDataResponse<T> {
  resData: T | null;
  loading: boolean;
  error: AxiosError | null;
}

async function postData<T>(
  url: string,
  data: T,
  headers: Record<string, string> = {}
): Promise<PostDataResponse<T>> {
  let loading = true;
  let error: AxiosError | null = null;
  let resData: T | null = null;

  const config: AxiosRequestConfig = {
    headers: { ...axiosInstance.defaults.headers.common, ...headers },
  };

  try {
    const response = await axiosInstance.post<T>(url, data, config);
    resData = response.data;
  } catch (e) {
    if (isAxiosError(e)) {
      error = e;
    } else {
      error = new AxiosError("An unexpected error occurred");
    }
  } finally {
    loading = false;
  }

  return { resData, loading, error };
}

export default postData;
