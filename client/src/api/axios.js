// // import axios from "axios";

// // const api = axios.create({
// //   baseURL: "/api",
// // });

// // // auto-attach token to every request
// // api.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("token");
// //   if (token) config.headers.Authorization = `Bearer ${token}`;
// //   return config;
// // });

// // export default api;
// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api",
// });

// // auto-attach token to every request
// api.interceptors.request.use((config) => {
//   // Use "token" since that's what's in localStorage
//   const token = localStorage.getItem("token"); // Changed from "shophub_token" to "token"
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Response interceptor - handle 401
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log("🔴 401 Unauthorized - clearing token");
//       localStorage.removeItem("token");
//       localStorage.removeItem("user"); // or whatever key you use for user
      
//       if (window.location.pathname !== "/login") {
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from "axios";

// Use environment variable or default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.log(`❌ API Error: ${error.config?.url}`, error.response?.status);
    console.log("❌ Error details:", error.response?.data);
    
    if (error.response?.status === 401) {
      console.log("🔴 401 Unauthorized - clearing tokens");
      localStorage.removeItem("token");
      localStorage.removeItem("shophub_token");
      localStorage.removeItem("user");
      localStorage.removeItem("shophub_user");
      
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;