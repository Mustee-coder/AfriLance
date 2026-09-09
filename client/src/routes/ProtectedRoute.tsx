
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

interface ProtectedRouteProps {
  allowedRoles?: ("developer" | "client" | "admin")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
