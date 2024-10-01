import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User } from "../src/components/authentication/Profile";

interface UserContextType {
  accessToken: string | null;
  user: User | null;
  isLoggedIn: boolean;
  userRole: string | null;
  setUserData: (user: User | null, accessToken: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (storedAccessToken && storedUser) {
      setAccessToken(storedAccessToken);
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      setUserRole(parsedUser.role);
    }
  }, []);

  const setUserData = useCallback(
    (userData: User | null, newAccessToken: string | null) => {
      setUser(userData);
      setAccessToken(newAccessToken ? `Bearer ${newAccessToken}` : null);
      setUserRole(userData?.role || null);

      if (newAccessToken) {
        localStorage.setItem("accessToken", `Bearer ${newAccessToken}`);
      } else {
        localStorage.removeItem("accessToken");
      }

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        localStorage.removeItem("user");
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setUserRole(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }, []);

  const isLoggedIn = !!user;

  const contextValue: UserContextType = {
    accessToken,
    user,
    isLoggedIn,
    userRole,
    setUserData,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
