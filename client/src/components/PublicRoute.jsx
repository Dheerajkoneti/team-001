import { Navigate, useLocation } from "react-router-dom";

function PublicRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Always show the Landing Page at the root URL.
  if (location.pathname === "/") {
    return children;
  }

  // If no token exists, allow Login, Register,
  // and password recovery pages.
  if (!token) {
    return children;
  }

  // A token exists; redirect away from auth pages.
  // The backend must validate token expiry and authenticity.
  return <Navigate to="/dashboard" replace />;
}

export default PublicRoute;