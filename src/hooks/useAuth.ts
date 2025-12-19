import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authStatus = localStorage.getItem('faunora_authenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  useEffect(() => {
    if (isAuthenticated === false && location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const logout = () => {
    localStorage.removeItem('faunora_authenticated');
    setIsAuthenticated(false);
    navigate('/auth');
  };

  return { isAuthenticated, logout };
}
