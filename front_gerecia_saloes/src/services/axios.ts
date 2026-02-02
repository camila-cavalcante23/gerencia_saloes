import axios, { AxiosInstance } from "axios";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api: AxiosInstance = axios.create({
  baseURL: `${apiUrl}/api`, 
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;