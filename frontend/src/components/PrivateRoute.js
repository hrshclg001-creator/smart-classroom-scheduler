import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Display an access denied message for unauthorized users
    return (
      <div className="container mt-5">
        <div className="alert alert-error">Access denied. You don't have the required permissions.</div>
      </div>
    );
  }

  // Render the protected route's components
  return children;
};

export default PrivateRoute;