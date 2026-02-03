import axios from "axios";

export const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.authorization = token;
//   }
//   return config;
// });
