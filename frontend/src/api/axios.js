import axios from "axios";

// Automatically detect API URL based on environment
const getBaseURL = () => {
  // Local development (same domain)
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:3000/api";
  }
  // Production (different domain - need Authorization header)
  return "https://task-management-7czz.onrender.com/api";
};

const BASE_URL = getBaseURL();
console.log("API URL:", BASE_URL);

// Store token from login response
let authToken = null;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add token to Authorization header if available
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
      console.log("→ Request with token:", config.url);
    } else {
      console.log("→ Request:", config.method.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✓ Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log("✗ Error:", error.response?.status, error.config?.url);
    if (error.response?.status === 401) {
      authToken = null;
    }
    return Promise.reject(error);
  }
);

export const setToken = (token) => {
  authToken = token;
  console.log(authToken ? "✓ Token set" : "🔄 Token cleared");
};

export const getToken = () => authToken;

export default axiosInstance;
