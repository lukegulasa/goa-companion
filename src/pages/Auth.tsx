
import React, { useEffect } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // If user is authenticated, redirect to game stats
  if (user && !isLoading) {
    return <Navigate to="/game-stats" replace />;
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Authentication</h1>
        <p className="text-muted-foreground mt-1">Login or sign up to manage game statistics</p>
      </header>
      
      <div className="grid place-items-center py-8">
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
