import axios from "axios";

const getSubdomain = () => {
  const hostParts = window.location.hostname.split(".");
  return hostParts[0] || "default";
};

const BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_PROTOCOL}://${getSubdomain()}${import.meta.env.VITE_API_SUFFIX}`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default apiClient;