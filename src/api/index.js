// src/api/index.js
import axios from "axios";

// ✅ CORRECT BASE URL — no spaces, includes /infinity-booking
const http = axios.create({
  baseURL: "https://infinity-booking-backend1.onrender.com/infinity-booking",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach provider token if available
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("provider_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error logging
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔍 Log full error details for debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    return Promise.reject(
      error.response?.data || { message: "⚠️ Network or server error" }
    );
  }
);

export default http;