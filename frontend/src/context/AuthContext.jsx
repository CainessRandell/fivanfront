import { createContext, useContext, useMemo, useState } from 'react';
import { debugError, debugLog } from '../utils/debug';

const TOKEN_KEY = 'fivam_token';
const USER_KEY = 'fivam_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      debugLog('auth', 'Recovered user from localStorage', { user: parsed });
      return parsed;
    } catch (error) {
      debugError('auth', 'Failed to parse persisted user', { message: error.message });
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  const login = ({ token: nextToken, user: nextUser }) => {
    debugLog('auth', 'Persisting session after login', {
      hasToken: Boolean(nextToken),
      user: nextUser
    });

    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    debugLog('auth', 'Clearing session on logout');

    setToken('');
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}