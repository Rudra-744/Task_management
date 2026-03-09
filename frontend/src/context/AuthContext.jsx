import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    console.log("🔍 Checking auth status...");
    axiosInstance
      .get("/auth/me")
      .then((res) => {
        console.log("✓ User logged in:", res.data.user.email);
        setUser(res.data.user);
      })
      .catch((error) => {
        console.log("⚠ Not logged in:", error.response?.status);
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
