import axios from "axios";
// import { useAuth } from "../context/AuthContext"; // Adjust the path as needed

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = "asdf"; // Using the context to get the token
    // const { token } = useAuth(); // Using the context to get the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };
