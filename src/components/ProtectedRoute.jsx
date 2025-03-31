import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // ✅ Redirect to login if no token is present
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
