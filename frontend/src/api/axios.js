import axios from "axios";

// Automatically detect API URL based on environment
const getBaseURL = () => {
  // Local development
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:3000/api";
  }
  // Production
  return "https://task-management-7czz.onrender.com/api";
};

const BASE_URL = getBaseURL();
console.log("API URL:", BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ← Try to send cookies
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from sessionStorage
    const token = sessionStorage.getItem("authToken");
    
    // Add token to Authorization header if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("→ Request with Bearer token:", config.url);
    } else {
      console.log("→ Request:", config.method.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✓ Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log("✗ Error:", error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

// Export function to set/clear token
export const setAuthToken = (token) => {
  if (token) {
    sessionStorage.setItem("authToken", token);
    console.log("✓ Token stored in sessionStorage");
  } else {
    sessionStorage.removeItem("authToken");
    console.log("🔄 Token cleared from sessionStorage");
  }
};

export default axiosInstance;
