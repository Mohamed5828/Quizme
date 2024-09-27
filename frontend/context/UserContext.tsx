import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import postData from "../src/utils/postData";

interface User {
  email: string;
  username: string;
  id: number;
  role: string;
  // Add other user properties if needed
}

interface DecodedToken {
  exp: number;
  // Add other properties you expect in your JWT payload
}

interface UserContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoggedIn: boolean;
  userRole: string | null;
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
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");
    if (storedAccessToken && storedRefreshToken && storedUser) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      setUserRole(parsedUser.role);
    }
  }, []);

  const setUserData = useCallback(
    (
      userData: User | null,
      newAccessToken: string | null,
      newRefreshToken: string | null
    ) => {
      setUser(userData);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUserRole(userData?.role || null);

      if (newAccessToken) localStorage.setItem("accessToken", newAccessToken);
      else localStorage.removeItem("accessToken");

      if (newRefreshToken)
        localStorage.setItem("refreshToken", newRefreshToken);
      else localStorage.removeItem("refreshToken");

      if (userData) localStorage.setItem("user", JSON.stringify(userData));
      else localStorage.removeItem("user");
    },
    []
  );

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      console.error("No refresh token available");
      setUserData(null, null, null);
      return;
    }

    try {
      const { resData, error } = await postData<{ accessToken: string }>(
        "/auth/token/refresh",
        { refreshToken },
        "/v1"
      );

      if (error) {
        throw error;
      }

      if (resData?.accessToken) {
        setAccessToken(resData.accessToken);
        localStorage.setItem("accessToken", resData.accessToken);
      } else {
        throw new Error("No access token in response");
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      setUserData(null, null, null);
    }
  }, [refreshToken, setUserData]);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (accessToken) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(accessToken);
          const expirationTime = decodedToken.exp * 1000;
          const currentTime = new Date().getTime();

          if (expirationTime - currentTime < 60 * 1000) {
            await refreshAccessToken();
          }
        } catch (error) {
          console.error("Error decoding or refreshing token:", error);
          setUserData(null, null, null);
        }
      }
    };

    checkAndRefreshToken();
  }, [accessToken, refreshAccessToken, setUserData]);

  const isLoggedIn = !!user;

  return (
    <UserContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        isLoggedIn,
        userRole,
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
