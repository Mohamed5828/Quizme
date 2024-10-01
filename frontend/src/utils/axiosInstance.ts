// import axios, { AxiosInstance } from "axios";

// const BASE_URL = "http://127.0.0.1:8000/api"; // Replace with your API base URL

// // Helper function to get token from localStorage
// const getToken = (): string | null => {
//   return localStorage.getItem("accessToken") || null; // Use the key defined in your store
// };

// export const getAxiosInstance = (
//   apiVersion: string = "v1",
//   needAuth: boolean = true
// ): AxiosInstance => {
//   const token = needAuth ? getToken() : null;

//   return axios.create({
//     baseURL: `${BASE_URL}/${apiVersion}`,
//     timeout: 5000,
//     headers: {
//       "Content-Type": "application/json",
//       ...(needAuth && token ? { Authorization: token } : {}),
//     },
//   });
// };

// export const useAxiosInstance = (
//   apiVersion: string = "v1",
//   needAuth: boolean = true
// ): AxiosInstance => {
//   return getAxiosInstance(apiVersion, needAuth);
// };

// export default useAxiosInstance;

import axios, { AxiosInstance } from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; // Replace with your API base URL

// Helper function to get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem("accessToken") || null;
};

export const getAxiosInstance = (
  apiVersion: string = "v1",
  needAuth: boolean = true
): AxiosInstance => {
  const token = needAuth ? getToken() : null;

  const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/${apiVersion}`,
    // timeout: 5000,
    headers: {
      // "Content-Type": "application/json",
      ...(needAuth && token ? { Authorization: token } : {}),
    },
  });

  // Adding request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log("Request made with config:", config);
      console.log("Request data:", config.data);
      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const useAxiosInstance = (
  apiVersion: string = "v1",
  needAuth: boolean = true
): AxiosInstance => {
  return getAxiosInstance(apiVersion, needAuth);
};

export default useAxiosInstance;
