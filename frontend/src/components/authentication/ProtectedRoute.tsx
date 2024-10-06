import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const isLoggedIn = !!localStorage.getItem("user"); // Check if 'user' exists in local storage

  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
