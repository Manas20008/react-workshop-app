import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ userRole, allowedRoles, children }) {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default ProtectedRoute;
