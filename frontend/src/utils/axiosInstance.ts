// import { JwtPayload, jwtDecode } from "jwt-decode";
// import axios, { AxiosInstance } from "axios";

// const BASE_URL = "http://127.0.0.1:8000/api"; // Replace with your API base URL

// // Helper function to get token from localStorage
// const getToken = (): string | null => {
//   return localStorage.getItem("accessToken") || null; // Use the key defined in your store
// };

// // Helper function to check if token is expired
// const isTokenExpired = (token: string): boolean => {
//   try {
//     const decoded = jwtDecode<JwtPayload>(token);
//     if (!decoded.exp) {
//       return true; // If the token doesn't have an expiration, assume it's expired
//     }
//     const currentTime = Math.floor(Date.now() / 1000);
//     return decoded.exp < currentTime;
//   } catch (error) {
//     return true; // If decoding fails, assume it's expired
//   }
// };

// // Create an Axios instance with optional token validation
// export const getAxiosInstance = (
//   apiVersion: string = "v1",
//   needAuth: boolean = true
// ): AxiosInstance => {
//   const token = needAuth ? getToken() : null;

//   const instance = axios.create({
//     baseURL: `${BASE_URL}/${apiVersion}`,
//     headers: {
//       ...(needAuth && token ? { Authorization: `${token}` } : {}),
//     },
//   });

//   // Add a request interceptor to check if the token is expired
//   instance.interceptors.request.use(
//     (config) => {
//       if (needAuth && token) {
//         if (isTokenExpired(token)) {
//           localStorage.removeItem("accessToken"); // Remove expired token
//           throw new Error("Token expired");
//         }
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   return instance;
// };

// // Use the Axios instance
// export const useAxiosInstance = (
//   apiVersion: string = "v1",
//   needAuth: boolean = true
// ): AxiosInstance => {
//   return getAxiosInstance(apiVersion, needAuth);
// };

// export default useAxiosInstance;

import axios, { AxiosError, AxiosInstance } from "axios";

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
  axiosInstance.interceptors.response.use(
    (response) => response, // If the response is successful, just return it
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Trigger an event or use a callback to show the login modal
        const event = new CustomEvent("showLoginModal");
        window.dispatchEvent(event);
        console.log("dispateched");
      }

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
