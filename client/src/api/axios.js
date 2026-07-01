
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// auto-attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("shophub_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`🔍 API Request: ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor
// Response interceptor - DON'T auto-redirect on 401
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.log(`❌ API Error: ${error.config?.url}`, error.response?.status);
    console.log("❌ Error details:", error.response?.data);
    
    // ONLY handle 401 for non-wishlist/collection requests
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      
      // ✅ Skip redirect for wishlist and collection endpoints
      if (url.includes('/wishlist') || url.includes('/collections')) {
        console.log(`⏭️ Skipping 401 redirect for ${url} - letting component handle it`);
        return Promise.reject(error);
      }
      
      // Only redirect for protected routes like /cart, /checkout, /profile
      console.log("🔴 401 Unauthorized for protected route - clearing tokens");
      localStorage.removeItem("token");
      localStorage.removeItem("shophub_token");
      localStorage.removeItem("user");
      localStorage.removeItem("shophub_user");
      
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login" && 
          !url.includes('/login') &&
          !url.includes('/register')) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;