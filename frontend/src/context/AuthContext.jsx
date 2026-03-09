import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance, { setAuthToken } from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    console.log("🔍 Checking auth status...");
    
    // First, restore token from sessionStorage if it exists
    const savedToken = sessionStorage.getItem("authToken");
    if (savedToken) {
      console.log("✓ Found token in sessionStorage");
      setAuthToken(savedToken);
    }

    // Then verify with /auth/me
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

  const handleSetUser = (userData) => {
    if (userData) {
      console.log("✓ Setting user:", userData.email);
      setUser(userData);
    } else {
      console.log("🔄 Clearing user");
      setUser(null);
      setAuthToken(null); // Clear token on logout
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
