import axios from "axios";

const defaultBaseURL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://decisionhub-api.vercel.app/api";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || defaultBaseURL
).replace(/\/+$/, "");

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/i, "");

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;