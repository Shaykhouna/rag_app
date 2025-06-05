import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  email: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: unknown }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Simple mock authentication
  const login = async (email: string, password: string) => { //: Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password
        }),
      })

      const data: { message: any; user: any; token: string; } = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      setUser({ email: data.user.email, token: data.token })

      // return true
      return { success: true }
    } catch (error) {
      // return false;
      return { success: false, error: error };
    }
    // if (email && password.length >= 6) {
    //   setUser({ email });
    //   localStorage.setItem('user', JSON.stringify({ email }));
    //   return true;
    // }
    // return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
