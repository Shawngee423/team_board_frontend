import axios from "axios";

// Create a base axios instance with common configurations
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
