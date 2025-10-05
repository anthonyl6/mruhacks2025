import { useContext, createContext, useState, type ReactNode, useEffect } from 'react';
import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL
const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

interface AuthContextData {
  user: object | null // for now
  isAuthenticated: boolean
  key: String
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: {children: ReactNode}) {
  const [ authToken, setAuthToken ] = useState<string>('');
  const [ user, setUser ] = useState<object | null>(null);  
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ key, setKey ] = useState<String>('');

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

      return res;
    } catch (error) {
      console.log(`Error when logging in as ${username}: ${error}`)
    } finally {
      setLoading(false);
    }
  }

  async function register(username: string, password: string) {
    try {
      const formData = JSON.stringify({username: username, password: password});
      const res = await axios.post(`${apiURL}/auth/register`,
        formData
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
      console.log(JSON.parse(atob(authToken.split(".")[1])))
    }
  }, [authToken]);

  useEffect(() => {
    const auth = window.localStorage.getItem("authToken");
    if (auth) {
      setAuthToken(auth);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, key, login, register}}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be wrapped within AuthProvider');
  return context;
}