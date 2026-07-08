import { createContext, useState, useEffect } from 'react';
import { getToken, getRole, setToken, setRole, clearAuth, decodeJwt } from '../utils/token';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());
  const [role, setRoleState] = useState(getRole());

  const login = (newToken) => {
    setToken(newToken);
    setTokenState(newToken);

    const decoded = decodeJwt(newToken);
    const newRole = decoded?.role || 'CANDIDATE';
    setRole(newRole);
    setRoleState(newRole);
  };

  const logout = () => {
    clearAuth();
    setTokenState(null);
    setRoleState(null);
  };

  // Check token expiration on mount and when token changes
  useEffect(() => {
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded) {
        if (!role && decoded.role) {
          setRole(decoded.role);
          setRoleState(decoded.role);
        }
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        }
      }
    }
  }, [token, role]);

  const isLogin = !!token;

  return (
    <AuthContext.Provider value={{ token, role, isLogin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
