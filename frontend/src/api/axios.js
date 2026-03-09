import axios from "axios";

// Use environment variable or localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
