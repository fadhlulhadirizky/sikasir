import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '../services/api';

interface User {
  id?: string;
  nama_lengkap?: string;
  email?: string;
  role?: 'admin' | 'pemilik' | 'kasir' | string;
  toko_id?: string;
  nama_toko?: string;
  is_active?: boolean;
  toko?: { is_active?: boolean } | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  validateSession: () => Promise<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const validateSession = async () => {
    try {
      const res = await api.getMe();
      const currentUser = res.data.user;

      if (!currentUser?.is_active || currentUser?.toko?.is_active === false) {
        logout();
        return false;
      }

      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!savedToken || !savedUser) {
        setIsLoading(false);
        return;
      }

      try {
        const ok = await validateSession();
        if (ok) {
          setToken(savedToken);
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        validateSession,
        isLoading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}