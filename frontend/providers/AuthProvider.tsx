import { useContext, createContext, useState, type ReactNode, useEffect } from 'react';

interface AuthContextData {
  user: object | null // for now
  isAuthenticated: boolean
  key: String
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: {children: ReactNode}) {
  const [ authToken, setAuthToken ] = useState<string>('');
  const [ user, setUser ] = useState<object | null>(null);  
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ key, setKey ] = useState<String>('');

  async function signIn() {
    // setLoading(true);
    // await do auth here, this gets authToken
    setUser({ name: 'john', key: 'johnsecretkey' });
    window.localStorage.setItem("authToken", "dsadsadsada");
    // setLoading(false);
  }

  async function signOut() {
    setUser(null);
  }

  useEffect(() => {
    setUser(JSON.parse(atob(authToken ?? "")))
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, key}}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
}