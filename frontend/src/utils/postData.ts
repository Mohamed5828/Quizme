import axios, { AxiosError } from "axios";
import useAxiosInstance from "./axiosInstance";

interface PostDataResponse<T> {
  resData: T | null;
  loading: boolean;
  error: AxiosError | null;
}

export default async function postData<T>(
  url: string,
  data: any,
  apiVersion: string = "v1",
  needAuth: boolean = true,
  headers: Record<string, string> = {}
): Promise<PostDataResponse<T>> {
  let loading = true;
  let error: AxiosError | null = null;
  let resData: T | null = null;

  const axiosInstance = useAxiosInstance(apiVersion, needAuth);

  try {
    const response = await axiosInstance.post<T>(url, data, { headers });
    resData = response.data;
    error = null; // Reset error if the request is successful
  } catch (err) {
    error = err as AxiosError;
  } finally {
    loading = false;
  }

  return { resData, loading, error };
}
