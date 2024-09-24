import React, { createContext, useState, ReactNode } from 'react';

// Define types for User data
interface User {
  email: string;
  // Add other user properties if needed
}

export interface UserContextType { // Exporting UserContextType
  user: User | null;
  accessToken: string | null;
  setUserData: (user: User | null, token: string | null) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleSetUser = (userData: User | null, token: string | null) => {
    setUser(userData);
    setAccessToken(token);
  };

  return (
    <UserContext.Provider value={{ user, accessToken, setUserData: handleSetUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Export UserContext for other uses if needed
export { UserContext };
