import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedClientRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Check if user is authenticated and is a client
  if (!token || role !== "Client") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedClientRoute;
