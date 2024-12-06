import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from './LoginForm';

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginForm />;
  }

  return <>{children}</>;
};