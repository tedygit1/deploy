// src/api/auth.api.js
import axios from "axios";

const API_BASE = "https://infinity-booking-backend1.onrender.com/infinity-booking/auth";

// Automatically handle JSON or FormData
export async function registerProvider(data) {
  try {
    const headers = {};

    // If data is FormData, let axios handle the content type
    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await axios.post(`${API_BASE}/register/provider`, data, { headers });
    return response.data;
  } catch (error) {
    console.error("❌ Provider registration error:", error.response?.data || error.message);
    throw error;
  }
}

// Login remains the same
export async function loginProvider(credentials) {
  try {
    const response = await axios.post(`${API_BASE}/login/provider`, credentials);
    return response.data;
  } catch (error) {
    console.error("❌ Provider login error:", error.response?.data || error.message);
    throw error;
  }
}
