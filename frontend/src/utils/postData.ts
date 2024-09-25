import { AxiosError, isAxiosError, AxiosRequestConfig } from "axios";
import { useUserContext } from "../components/UserContext";
import axiosInstance from "./axiosInstance";

interface PostDataResponse<T> {
  resData: T | null;
  loading: boolean;
  error: AxiosError | null;
}

async function postData<T>(
  url: string,
  data: any,
  headers: Record<string, string> = {}
): Promise<PostDataResponse<T>> {
  const { refreshAccessToken } = useUserContext();
  let loading = true;
  let error: AxiosError | null = null;
  let resData: T | null = null;

  const config: AxiosRequestConfig = {
    headers: { ...headers },
  };

  try {
    const response = await axiosInstance.post<T>(url, data, config);
    resData = response.data;
  } catch (e) {
    if (isAxiosError(e)) {
      error = e;
      console.error("Error during request:", e.message);

      // Handle token expiration
      if (e.response?.status === 401 && refreshAccessToken) {
        try {
          await refreshAccessToken();
          // Retry the request after token refresh
          const retryResponse = await axiosInstance.post<T>(url, data, config);
          resData = retryResponse.data;
          error = null; // Clear the error if retry is successful
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          error = isAxiosError(refreshError)
            ? refreshError
            : new AxiosError(
                "An unexpected error occurred during token refresh"
              );
        }
      }
    } else {
      error = new AxiosError("An unexpected error occurred");
    }
  } finally {
    loading = false;
  }

  return { resData, loading, error };
}

export default postData;
