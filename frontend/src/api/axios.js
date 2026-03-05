import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://task-management-7czz.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;
