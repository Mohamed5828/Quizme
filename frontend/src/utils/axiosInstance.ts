// import axios from "axios";
// import { createContext, useContext } from "react";

// // Create a context for the user data
// const UserContext = createContext<{
//   accessToken: string | null;
//   refreshAccessToken: () => Promise<void>;
// }>({
//   accessToken: null,
//   refreshAccessToken: async () => {},
// });

// // Custom hook to use the UserContext
// export const useUserContext = () => useContext(UserContext);

// export const axiosInstance = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
//   withCredentials: true,
// });

// // Add a request interceptor to include the access token if available
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const { accessToken } = useUserContext();
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//       console.log("Access token added to the request:", accessToken);
//     } else {
//       console.log("No access token found, proceeding without credentials.");
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
