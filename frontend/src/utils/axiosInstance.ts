import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

// Interceptor to add access token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response, // Return response if no error
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken");

    // If token expired and there's a refresh token, try refreshing the token
    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          "/api/v1/auth/token/refresh",
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        localStorage.setItem("accessToken", data.accessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
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

export default axiosInstance;
