import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount (uses cookies automatically)
  useEffect(() => {
    console.log("🔍 Checking auth status with cookies...");
    axiosInstance
      .get("/auth/me")
      .then((res) => {
        console.log("✓ User already logged in:", res.data.user.email);
        setUser(res.data.user);
      })
      .catch((error) => {
        console.log("⚠ No valid session:", error.response?.status);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
