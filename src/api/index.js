// src/api/index.js
import axios from "axios";

// ✅ SMART URL CONFIGURATION
const getBaseURL = () => {
  const hostname = window.location.hostname;
  
  // Local development - use proxy
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168.')) {
    console.log("🚀 Development mode: Using proxy /api");
    return "/api";
  } 
  // Vercel deployment - use direct URL but with CORS-safe headers
  else if (hostname.includes('vercel.app') || hostname.includes('provider-board')) {
    console.log("🌐 Production (Vercel): Using direct backend URL");
    return "https://infinity-booking-backend1-1.onrender.com/infinity-booking";
  }
  // Fallback
  else {
    console.log("⚡ Unknown environment, using direct URL");
    return "https://infinity-booking-backend1-1.onrender.com/infinity-booking";
  }
};

const http = axios.create({
  baseURL: getBaseURL(),
  timeout: 8000, // ⚠️ REDUCED FROM 15000ms to 8000ms (8 seconds)
  // ⚠️ REMOVE problematic headers that cause CORS issues
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
    // ⚠️ DO NOT include 'Pragma', 'Cache-Control', or other headers that trigger preflight
  },
});

// ✅ Enhanced request logging
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("provider_token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ⚠️ Remove any problematic headers from specific requests
    delete config.headers['Pragma'];
    delete config.headers['Cache-Control'];
    
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Enhanced error logging with CORS detection
http.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Success`);
    return response;
  },
  (error) => {
    console.error("❌ API Error Details:", {
      fullURL: error.config?.baseURL + error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code
    });

    // Check for CORS error
    if (error.message && (error.message.includes('CORS') || error.message.includes('cross-origin'))) {
      console.error("⚠️ CORS ERROR DETECTED!");
      return Promise.reject({ 
        message: "CORS Error: The server is blocking cross-origin requests. This is a backend configuration issue.",
        code: 'CORS_ERROR',
        details: `Request from: ${window.location.origin} to: ${error.config?.baseURL}`
      });
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ 
        message: "Request timeout. Server is taking too long to respond.",
        code: 'ECONNABORTED'
      });
    }

    if (!error.response) {
      return Promise.reject({ 
        message: "Cannot connect to server. Please check your internet connection.",
        code: 'NETWORK_ERROR'
      });
    }

    return Promise.reject(
      error.response?.data || { message: "Server error occurred" }
    );
  }
);

export default http;