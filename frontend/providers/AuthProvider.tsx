import { useContext, createContext, useState, type ReactNode, useEffect } from 'react';
import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL

interface AuthContextData {
  user: object | null // for now
  isAuthenticated: boolean
  authToken: string
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  loading: boolean
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: {children: ReactNode}) {
  const [ authToken, setAuthToken ] = useState<string>('');
  const [ user, setUser ] = useState<object | null>(null);  
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false);
  const [ loading, setLoading ] = useState<boolean>(true);

  async function login(username: string, password: string) {
    setLoading(true);
    try {
      // await do auth here, this gets authToken
      const res = await axios.post(`${apiURL}/auth/login`, 
        {username: username, password: password}
      );
      setAuthToken(res.data.token);
      // unpack authToken into set user (same as useEffect code below)
      setUser(JSON.parse(atob(authToken.split('.')[1])));
      window.localStorage.setItem("authToken", authToken);
      setIsAuthenticated(true);
      
      return res;
    } catch (error) {
      console.log(`Error when logging in as ${username}: ${error}`)
    } finally {
      setLoading(false);  
    }
  }

  async function register(username: string, password: string) {
    try {
      const res = await axios.post(`${apiURL}/auth/register`,
        {username, password}
      );
      console.log(res);
    } catch (error) {
      console.log(`Error when registering ${username}: ${error}`)

    }
  }

  // async function signOut() {
  //   setUser(null);
  // }

  useEffect(() => {
    if (authToken) {
      setUser(JSON.parse(atob(authToken.split(".")[1])))
    }
    setLoading(false);
  }, [authToken]);
  
  useEffect(() => {
    setLoading(true);
    const auth = window.localStorage.getItem("authToken");
    if (auth) {
      setAuthToken(auth);
    } else {
      setLoading(false);
    }
    
  }, []);

  return (
    <AuthContext.Provider value={{ user, authToken, isAuthenticated, login, register, loading}}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be wrapped within AuthProvider');
  return context;
}