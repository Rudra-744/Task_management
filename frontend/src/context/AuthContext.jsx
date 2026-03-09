import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance, { setToken, getToken } from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    console.log("🔍 Checking auth status...");
    
    // If token exists, restore user
    const token = getToken();
    if (token) {
      console.log("✓ Token found, verifying...");
    }
    
    axiosInstance
      .get("/auth/me")
      .then((res) => {
        console.log("✓ User authenticated:", res.data.user.email);
        setUserState(res.data.user);
      })
      .catch((error) => {
        console.log("⚠ Auth failed:", error.response?.status);
        setUserState(null);
        setToken(null); // Clear token on failed auth
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSetUser = (userData) => {
    if (userData) {
      console.log("✓ Setting user:", userData.email);
      setUserState(userData);
    } else {
      console.log("🔄 Clearing user and token");
      setUserState(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
