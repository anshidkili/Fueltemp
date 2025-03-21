import React, { createContext, useContext, useState, useEffect } from "react";
import { signIn, signOut, getCurrentUser, AuthUser } from "../../api/auth";

type UserRole = "superadmin" | "admin" | "employee" | "customer";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: "",
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Mock user data for demo purposes when MongoDB is not connected
const MOCK_USERS = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@example.com",
    password: "password123",
    role: "superadmin" as UserRole,
    avatar: "",
  },
  {
    id: "2",
    name: "Station Admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin" as UserRole,
    avatar: "",
  },
  {
    id: "3",
    name: "Station Employee",
    email: "employee@example.com",
    password: "password123",
    role: "employee" as UserRole,
    avatar: "",
  },
  {
    id: "4",
    name: "Credit Customer",
    email: "customer@example.com",
    password: "password123",
    role: "customer" as UserRole,
    avatar: "",
  },
];

// Check if MongoDB connection is available
const isMongoDBConfigured = () => {
  // For now, we'll assume MongoDB is configured
  // In a real app, you might check for environment variables
  return true;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initAuth = async () => {
      try {
        // For demo purposes, always use localStorage
        try {
          const savedUser = localStorage.getItem("fuelstation_user");
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch (e) {
              console.error("Failed to parse saved user", e);
              localStorage.removeItem("fuelstation_user");
            }
          }
        } catch (e) {
          console.error("Error accessing localStorage:", e);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Helper to map AuthUser to our User type
  const mapAuthUserToUser = (authUser: AuthUser): User => {
    return {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      avatar: authUser.avatar,
    };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError("");

    try {
      // For demo purposes, always use mock auth
      // This avoids JWT and MongoDB issues in the browser
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const foundUser = MOCK_USERS.find(
        (user) => user.email === email && user.password === password,
      );

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        try {
          localStorage.setItem(
            "fuelstation_user",
            JSON.stringify(userWithoutPassword),
          );
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
        return true;
      } else {
        setError("Invalid email or password");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      try {
        localStorage.removeItem("fuelstation_user");
        localStorage.removeItem("auth_token");
      } catch (e) {
        console.error("Error removing from localStorage:", e);
      }
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
