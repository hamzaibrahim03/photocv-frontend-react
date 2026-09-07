import axios from "axios";
const getSubdomain = () => {
  const hostParts = window.location.hostname.split(".");
  return hostParts[0] || "default";
};
export const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_PROTOCOL}://${getSubdomain()}${import.meta.env.VITE_API_SUFFIX}`;
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
export default apiClient;
export const readApiResponse = async (response) => {
  const body = await response.text();
  if (!body) {
    return {};
  }
  try {
    return JSON.parse(body);
  } catch {
    return {
      message: response.ok
        ? "The server returned an invalid response."
        : `Request failed with status ${response.status}.`,
    };
  }
};