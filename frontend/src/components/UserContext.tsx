import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface User {
  email: string;
  // Add other user properties if needed
}

interface UserContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setUserData: (
    user: User | null,
    accessToken: string | null,
    refreshToken: string | null
  ) => void;
  refreshAccessToken: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedAccessToken && storedRefreshToken && storedUser) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const setUserData = (
    userData: User | null,
    newAccessToken: string | null,
    newRefreshToken: string | null
  ) => {
    setUser(userData);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    if (newAccessToken) localStorage.setItem("accessToken", newAccessToken);
    else localStorage.removeItem("accessToken");

    if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
    else localStorage.removeItem("refreshToken");

    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    else localStorage.removeItem("user");
  };

  // Function to refresh the access token using the refresh token
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return;

    try {
      // Call your backend API to refresh the token using the refreshToken
      const response = await fetch("/api/v1/auth/token/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.accessToken) {
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken); // Update localStorage with the new accessToken
      } else {
        console.error("Failed to refresh access token");
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      // Handle error, potentially force user logout
    }
  }, [refreshToken]);

  // Auto-refresh the access token if needed when the component mounts or the token changes
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (accessToken) {
        const tokenPayload = JSON.parse(atob(accessToken.split(".")[1])); // Decode JWT
        const expirationTime = tokenPayload.exp * 1000; // Convert to milliseconds
        const currentTime = new Date().getTime();

        // If token is about to expire in 1 minute, refresh it
        if (expirationTime - currentTime < 60 * 1000) {
          await refreshAccessToken();
        }
      }
    };

    checkAndRefreshToken();
  }, [accessToken, refreshAccessToken]);

  return (
    <UserContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        setUserData,
        refreshAccessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
