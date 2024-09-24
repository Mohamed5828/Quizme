import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Check if the error is due to token expiration
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        const response = await axiosInstance.post('http://127.0.0.1:8000/api/auth/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.tokens.access;
        localStorage.setItem('accessToken', newAccessToken);

        // Update the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., log out the user)
        console.error('Refresh token failed:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
