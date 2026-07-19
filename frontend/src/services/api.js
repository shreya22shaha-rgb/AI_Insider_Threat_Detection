import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("username");
      localStorage.removeItem("loggedInUser");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const forgotPasswordRequest = (username_or_email) =>
  api.post("/forgot-password", { username_or_email });

export const resetPasswordRequest = (token, new_password) =>
  api.post("/reset-password", { token, new_password });

export default api;