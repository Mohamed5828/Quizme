import { useContext } from 'react';
import { UserContext, UserContextType } from './UserContext';

const UserData = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserData;
