
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();

  // Handle the token returned by Google OAuth.
  const params = new URLSearchParams(location.search);
  const googleToken = params.get("token");

  if (googleToken) {
    localStorage.setItem("token", googleToken);

    // Remove the token from the URL after saving it.
    window.history.replaceState(
      {},
      document.title,
      location.pathname
    );
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
