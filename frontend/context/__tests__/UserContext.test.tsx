// import React from "react";
// import { render, screen, waitFor } from "@testing-library/react";
// import { act } from "react-dom/test-utils";
// import { UserProvider, useUserContext } from "../UserContext"; // Update the path as necessary
// import postData from "../../src/utils/postData";
// import jwtDecode from "jwt-decode";

// // Mock the postData function
// jest.mock("../../src/utils/postData");
// jest.mock("jwt-decode");

// // Mock localStorage
// const localStorageMock = (() => {
//   let store: Record<string, string> = {};
//   return {
//     getItem: (key: string) => store[key] || null,
//     setItem: (key: string, value: string) => {
//       store[key] = value.toString();
//     },
//     removeItem: (key: string) => {
//       delete store[key];
//     },
//     clear: () => {
//       store = {};
//     },
//   };
// })();

// Object.defineProperty(window, "localStorage", {
//   value: localStorageMock,
// });

// const mockUser = {
//   email: "user@example.com",
//   username: "testuser",
//   id: 1,
//   role: "admin",
// };

// const MockComponent = () => {
//   const {
//     user,
//     isLoggedIn,
//     refreshAccessToken,
//     setUserData,
//     accessToken,
//     refreshToken,
//   } = useUserContext();

//   return (
//     <div>
//       <p>User: {user ? user.username : "No user"}</p>
//       <p>Logged In: {isLoggedIn ? "Yes" : "No"}</p>
//       <p>Access Token: {accessToken}</p>
//       <p>Refresh Token: {refreshToken}</p>
//       <button
//         onClick={() =>
//           setUserData(mockUser, "newAccessToken", "newRefreshToken")
//         }
//       >
//         Set User Data
//       </button>
//       <button onClick={refreshAccessToken}>Refresh Token</button>
//     </div>
//   );
// };

// describe("UserProvider", () => {
//   beforeEach(() => {
//     localStorage.clear();
//     jest.clearAllMocks();
//   });

//   it("provides default context values", () => {
//     render(
//       <UserProvider>
//         <MockComponent />
//       </UserProvider>
//     );

//     expect(screen.getByText("User: No user")).toBeInTheDocument();
//     expect(screen.getByText("Logged In: No")).toBeInTheDocument();
//     expect(screen.getByText("Access Token:")).toBeInTheDocument();
//     expect(screen.getByText("Refresh Token:")).toBeInTheDocument();
//   });

//   it("sets and retrieves user data from localStorage", async () => {
//     render(
//       <UserProvider>
//         <MockComponent />
//       </UserProvider>
//     );

//     const setUserDataButton = screen.getByText("Set User Data");
//     act(() => {
//       setUserDataButton.click();
//     });

//     expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
//     expect(localStorage.getItem("accessToken")).toBe("newAccessToken");
//     expect(localStorage.getItem("refreshToken")).toBe("newRefreshToken");

//     expect(screen.getByText("User: testuser")).toBeInTheDocument();
//     expect(screen.getByText("Logged In: Yes")).toBeInTheDocument();
//   });

//   it("refreshes access token when near expiration", async () => {
//     const mockDecodedToken = { exp: Math.floor(Date.now() / 1000) + 10 }; // Expire in 10 seconds
//     (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

//     (postData as jest.Mock).mockResolvedValue({
//       resData: { accessToken: "newAccessToken123" },
//     });

//     localStorage.setItem("accessToken", "oldAccessToken");
//     localStorage.setItem("refreshToken", "refreshToken");

//     render(
//       <UserProvider>
//         <MockComponent />
//       </UserProvider>
//     );

//     const refreshTokenButton = screen.getByText("Refresh Token");

//     act(() => {
//       refreshTokenButton.click();
//     });

//     await waitFor(() =>
//       expect(postData).toHaveBeenCalledWith(
//         "/auth/token/refresh",
//         { refreshToken: "refreshToken" },
//         "/v1"
//       )
//     );

//     expect(localStorage.getItem("accessToken")).toBe("newAccessToken123");
//     expect(
//       screen.getByText("Access Token: newAccessToken123")
//     ).toBeInTheDocument();
//   });

//   it("handles token refresh errors and clears data", async () => {
//     (postData as jest.Mock).mockResolvedValue({ error: "Invalid token" });

//     localStorage.setItem("accessToken", "oldAccessToken");
//     localStorage.setItem("refreshToken", "refreshToken");

//     render(
//       <UserProvider>
//         <MockComponent />
//       </UserProvider>
//     );

//     const refreshTokenButton = screen.getByText("Refresh Token");

//     act(() => {
//       refreshTokenButton.click();
//     });

//     await waitFor(() => expect(postData).toHaveBeenCalled());

//     expect(localStorage.getItem("user")).toBeNull();
//     expect(localStorage.getItem("accessToken")).toBeNull();
//     expect(localStorage.getItem("refreshToken")).toBeNull();
//     expect(screen.getByText("User: No user")).toBeInTheDocument();
//     expect(screen.getByText("Logged In: No")).toBeInTheDocument();
//   });
// });
