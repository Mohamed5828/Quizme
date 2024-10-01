import { Navigate } from "react-router-dom";
import { useUserContext } from "../../../context/UserContext";

const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { isLoggedIn } = useUserContext();

  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
