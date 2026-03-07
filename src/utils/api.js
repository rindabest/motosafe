import axios from "axios";

// Provide fallback to localhost:5275 (typical ASP.NET HTTP port without IIS Express)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5275/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor: Attach Bearer token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token"); // AuthController returns 'token'
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.cookie = "access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      const originalRequest = error?.config || {};
      if (!originalRequest?.skipAuthRedirect && window.location.pathname !== "/login") {
        window.location.href = `/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
