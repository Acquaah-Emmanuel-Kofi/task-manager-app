import axios from "axios";
import Cookies from "js-cookie";
import router from "next/router";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatically log out on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      router.push({
        pathname: "/login",
        query: { expired: "1" },
      });
    }
    return Promise.reject(error);
  }
);

export default api;
