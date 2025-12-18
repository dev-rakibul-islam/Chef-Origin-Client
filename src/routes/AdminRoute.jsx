import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import LoadingPage from "../pages/LoadingPage";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [role, roleLoading] = useRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <LoadingPage />;
  }

  if (user && role === "admin") {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
