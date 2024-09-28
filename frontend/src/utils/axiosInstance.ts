import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Function to create an Axios instance with dynamic baseURL
const createAxiosInstance = (apiVersion: string): AxiosInstance => {
  return axios.create({
    baseURL: `http://127.0.0.1:8000/api${apiVersion}`,
    withCredentials: true,
  });
};

// Interceptor to add access token to headers
const setupInterceptors = (axiosInstance: AxiosInstance): void => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptor to handle token refresh
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response, // Return response if no error
    async (error: AxiosError): Promise<AxiosError> => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };
      const refreshToken = localStorage.getItem("refreshToken");

      if (
        error.response?.status === 401 &&
        refreshToken &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const { data } = await axios.post<{ accessToken: string }>(
            "/api/v1/auth/token/refresh",
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );
          localStorage.setItem("accessToken", data.accessToken);
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${data.accessToken}`,
          };
          return axiosInstance(originalRequest); // Retry the original request
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          // Handle token refresh failure (e.g., force logout)
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login"; // Redirect to login
        }
      }
      return Promise.reject(error);
    }
  );
};

// Export a function to get Axios instance, passing only "v1" or "v2"
export const getAxiosInstance = (apiVersion: string = "v1"): AxiosInstance => {
  const instance = createAxiosInstance(apiVersion);
  setupInterceptors(instance);
  return instance;
};
