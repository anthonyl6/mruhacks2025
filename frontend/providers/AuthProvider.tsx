import {
  useContext,
  createContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import type { User } from "../models/user";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
const apiURL = import.meta.env.VITE_API_URL;

interface AuthContextData {
  user: User | null; // for now
  isAuthenticated: boolean;
  authToken: string | undefined;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string, fname: string, lname: string, email: string) => Promise<AuthContextData>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken] = useState<string | undefined>(
    window.localStorage.getItem("authToken") ?? undefined
  );
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  async function login(username: string, password: string) {
    setLoading(true);
    const {
      data: { token },
    } = await axios.post<{ token: string }>(`${apiURL}/auth/login`, {
      username: username,
      password: password,
    });
    setAuthToken(token);
    window.localStorage.setItem("authToken", token);
    setLoading(false);
    navigate("/pay");
  }

  async function register(username: string, password: string, fname: string, lname: string, email: string) {
    setLoading(true);
    const { status } = await axios.post<{ message: string }>(
      `${apiURL}/auth/register`,
      {
        username,
        password,
        fname,
        lname,
        email
      }
    );

    if (status !== 200) {
      setLoading(false);
      throw new Error("Failed to register");
    }
    setLoading(false);
  }

  function logout() {
    setAuthToken(undefined);
    window.localStorage.removeItem("authToken");
  }

  useEffect(() => {
    // console.log("authToken", authToken); 
    if (authToken) {
      setUser(JSON.parse(atob(authToken.split(".")[1])));
      setIsAuthenticated(true);
    } else {
      setUser(undefined);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [authToken]);

  useEffect(() => {
    // setLoading(true);
    const auth = window.localStorage.getItem("authToken");
    if (auth) {
      setAuthToken(auth);
    } else {
      // setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        isAuthenticated,
        login,
        register,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be wrapped within AuthProvider");
  return context;
}

export const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
        <Loader2Icon className="w-10 h-10 animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
