import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function RoleRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default RoleRoute;
