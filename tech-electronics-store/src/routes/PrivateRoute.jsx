import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader/Loader";

export function PrivateRoute() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Loader />;
  return user
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

export function AdminRoute() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
