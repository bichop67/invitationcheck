import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { adminAuthAtom, checkAuthStatus } from '../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAtom(adminAuthAtom);

  useEffect(() => {
    const isAuthenticated = checkAuthStatus();
    setAuth(prev => ({ ...prev, isAuthenticated }));
    
    if (!isAuthenticated) {
      navigate('/admin/connexion');
    }
  }, [navigate, setAuth]);

  if (!auth.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;