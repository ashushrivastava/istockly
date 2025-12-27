// frontend/src/components/ProtectedRoute.jsx
// Route protection component

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (adminOnly) {
    const isAdmin = user?.primaryEmailAddress?.emailAddress === 'ashubitmesra121@gmail.com';
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;