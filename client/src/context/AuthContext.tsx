import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  type LoginData,
  type RegisterData,
} from "../api/auth.api";

import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshUser();
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginData) => {
    const response = await loginUser(data);
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await registerUser(data);
    setUser(response.user);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
};
