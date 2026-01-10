import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "cliente" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("impertula_user");
    const storedToken = localStorage.getItem("impertula_token");
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        localStorage.removeItem("impertula_user");
        localStorage.removeItem("impertula_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Crear un timeout de 10 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('https://login-api-f245.onrender.com/api/auth/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok && data.success && data.user && data.token) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role as UserRole,
          name: data.user.name
        };
        
        setUser(userData);
        setToken(data.token);
        localStorage.setItem("impertula_user", JSON.stringify(userData));
        localStorage.setItem("impertula_token", data.token);
        
        return { success: true };
      } else {
        return { success: false, error: data.message || "Credenciales incorrectas" };
      }
    } catch (error: any) {
      console.error("Error en login:", error);
      
      if (error.name === 'AbortError') {
        return { success: false, error: "Tiempo de espera agotado. El servidor está tardando demasiado en responder." };
      }
      
      return { success: false, error: "Error al conectar con el servidor. Por favor intenta nuevamente." };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("impertula_user");
    localStorage.removeItem("impertula_token");
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}