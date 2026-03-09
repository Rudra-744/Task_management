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
  withCredentials: true, // ← Automatically sends cookies
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("→ Request:", config.method.toUpperCase(), config.url);
    console.log("  withCredentials:", config.withCredentials);
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

export default axiosInstance;
