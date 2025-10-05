import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export const apiURL = 'https://api-mojo.alahdal.ca';

export type User = any;

export interface AuthContextData {
  authToken: string | undefined;
  user: User | undefined;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be wrapped within AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function login(username: string, password: string) {
    setLoading(true);
    const { data } = await axios.post<{ token: string }>(`${apiURL}/auth/login`, {
      username,
      password,
    });
    localStorage.setItem('authToken', data.token);
    setAuthToken(data.token);
    setLoading(false);
  }

  async function register(username: string, password: string) {
    setLoading(true);
    const { status } = await axios.post<{ message: string }>(`${apiURL}/auth/register`, {
      username,
      password,
    });
    if (status !== 200) {
      setLoading(false);
      throw new Error('Failed to register');
    }
    login(username, password);
    setLoading(false);
  }

  function logout() {
    setAuthToken(undefined);
    setUser(undefined);
    setIsAuthenticated(false);
    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
