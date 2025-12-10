<!-- src/pages/Auth/Login.vue - UPDATED -->
<template>
  <div class="auth-page">
    <!-- Visual Section -->
    <div class="auth-visual">
      <div class="visual-overlay"></div>
      <div class="visual-content">
        <div class="visual-logo">
          <span class="logo-icon">∞</span>
          <span class="logo-text">Infinity-Booking</span>
        </div>
        <h2 class="visual-title">Welcome Back</h2>
        <p class="visual-subtitle">Access your provider dashboard and manage your services</p>
        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">📅</span>
            <span>Manage appointments & schedule</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">👥</span>
            <span>Connect with new clients</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📈</span>
            <span>Track your business growth</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Form -->
    <div class="auth-form-section">
      <div class="auth-form-container">
        <div class="form-header">
          <h1 class="form-title">Sign In</h1>
          <p class="form-subtitle">Enter your credentials to access your account</p>
        </div>

        <form class="auth-form" @submit.prevent="handleLogin">
          <!-- Email Field -->
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              v-model="loginEmail"
              type="email"
              placeholder="Enter your email"
              required
              class="form-input"
              :class="{ 'error': emailError }"
              @blur="validateEmail"
            />
            <div v-if="emailError" class="field-error">{{ emailError }}</div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <div class="label-row">
              <label for="password" class="form-label">Password</label>
              <button 
                type="button" 
                class="forgot-link" 
                @click="goToForgotPassword"
              >
                Forgot Password?
              </button>
            </div>
            <div class="password-input-wrapper">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="loginPassword"
                placeholder="Enter your password"
                required
                class="form-input"
                :class="{ 'error': passwordError }"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="togglePassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <span class="toggle-icon">{{ showPassword ? '🙈' : '👁️' }}</span>
              </button>
            </div>
            <div v-if="passwordError" class="field-error">{{ passwordError }}</div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="loginLoading"
            :class="{ 'loading': loginLoading }"
          >
            <span v-if="loginLoading" class="btn-spinner"></span>
            <span>{{ loginLoading ? 'Signing In...' : 'Sign In' }}</span>
          </button>

          <!-- Status Messages -->
          <div v-if="loginError" class="message error-message" role="alert">
            {{ loginError }}
          </div>

          <div v-if="statusMessage" class="message status-message" :class="statusType">
            {{ statusMessage }}
          </div>

          <!-- Sign Up Link -->
          <div class="auth-switch">
            <p>Don't have an account? 
              <button type="button" class="switch-link" @click="goToRegister">
                Sign up now
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import http from "@/api/index.js";

const router = useRouter();

// Reactive data
const loginEmail = ref("");
const loginPassword = ref("");
const showPassword = ref(false);
const loginLoading = ref(false);
const loginError = ref("");
const statusMessage = ref("");
const statusType = ref("");
const emailError = ref("");
const passwordError = ref("");

// Validation functions
const validateEmail = () => {
  const email = loginEmail.value.trim();
  if (!email) {
    emailError.value = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    emailError.value = "Please enter a valid email address";
  } else {
    emailError.value = "";
  }
};

const validatePassword = () => {
  if (!loginPassword.value) {
    passwordError.value = "Password is required";
  } else {
    passwordError.value = "";
  }
};

// Form submission
async function handleLogin() {
  // Clear previous messages
  loginError.value = "";
  statusMessage.value = "";
  statusType.value = "";
  
  // Validate fields
  validateEmail();
  validatePassword();
  
  if (emailError.value || passwordError.value) {
    return;
  }

  loginLoading.value = true;

  try {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    console.log('🔐 Attempting login for:', email);

    // Make the request WITHOUT the interceptor throwing an error
    const response = await http.post("/auth/login", { email, password }, {
      // Disable throwing on error - we'll handle it manually
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Accept all 2xx and 4xx responses
      }
    });
    
    console.log('📥 Raw response:', response);
    
    // Check if it's a success (200-299)
    if (response.status >= 200 && response.status < 300) {
      // Successful login
      const { token, user } = response.data;

      if (!token || !user?._id) {
        throw new Error("Invalid response from server");
      }

      // Handle user status
      const status = user.status?.toLowerCase().trim();

      // Case 1: Account is pending/under review
      if (status === 'pending' || status === 'under review' || status === 'unapproved') {
        statusMessage.value = "Your account is under review. Please check your email for updates. You'll be able to login once approved.";
        statusType.value = "pending";
        
        // Clear password field for security
        loginPassword.value = "";
        
      // Case 2: Account was rejected
      } else if (status === 'rejected' || status === 'denied') {
        statusMessage.value = "Your account application was not approved. Please contact our support team for more information.";
        statusType.value = "rejected";
        
        // Clear password field for security
        loginPassword.value = "";
        
      // Case 3: Account is approved/active - SUCCESS!
      } else if (status === 'approved' || status === 'active' || status === 'confirmed' || !status) {
        // Successful login - Account is confirmed
        statusMessage.value = "Successfully signed in! Redirecting to your dashboard...";
        statusType.value = "success";

        // Store auth data
        localStorage.setItem("provider_token", token);
        localStorage.setItem("provider_id", user._id);
        
        localStorage.setItem("loggedProvider", JSON.stringify({
          _id: user._id,
          email: user.email,
          fullname: user.fullname,
          role: user.role,
          status: user.status,
          serviceCategoryId: user.serviceCategoryId,
          categoryId: user.categoryId,
          categoryName: user.categoryName,
          category: user.category
        }));

        // Redirect after short delay
        setTimeout(() => {
          router.push({ name: "ProviderHome" });
        }, 1500);
        
      // Case 4: Unknown status
      } else {
        statusMessage.value = "Your account status needs verification. Please contact support.";
        statusType.value = "pending";
      }
    } 
    // It's an error response (400-499)
    else {
      const errorData = response.data || {};
      const errorMessage = errorData.message || "";
      const errorStatus = response.status;
      
      console.log('⚠️ Error response:', errorData);
      console.log('⚠️ Status code:', errorStatus);
      
      // Clear password for security
      loginPassword.value = "";
      
      // Handle 401 Unauthorized specifically
      if (errorStatus === 401) {
        if (errorMessage.includes('not approved') || 
            errorMessage.includes('admin') ||
            errorMessage.includes('confirmation') ||
            errorMessage.includes('wait')) {
          
          // Show the EXACT backend message for unapproved accounts
          statusMessage.value = errorMessage || "Your account is under review. Please wait for admin approval.";
          statusType.value = "pending";
          loginError.value = "";
          
        } else if (errorMessage.includes('credentials') || 
                   errorMessage.includes('invalid') ||
                   errorMessage.includes('Unauthorized')) {
          
          // Invalid credentials
          loginError.value = "Invalid email or password. Please try again.";
          
        } else {
          // Generic 401
          loginError.value = errorMessage || "Authentication failed. Please check your credentials.";
        }
      }
      // Handle other error statuses
      else if (errorStatus === 400) {
        loginError.value = errorMessage || "Bad request. Please check your input.";
      } else if (errorStatus === 404) {
        loginError.value = "User not found. Please check your email or register.";
      } else if (errorStatus >= 500) {
        loginError.value = "Server error. Please try again later.";
      } else {
        loginError.value = errorMessage || "Login failed. Please try again.";
      }
    }
    
  } catch (error) {
    console.error('❌ Catch block error:', error);
    
    // Clear password field
    loginPassword.value = "";
    
    // This catch is only for network/unknown errors
    if (error.code === 'ECONNABORTED') {
      loginError.value = "Request timeout. Please check your connection and try again.";
    } else if (error.message?.includes('Network Error') || !error.response) {
      loginError.value = "Network error. Please check your internet connection.";
    } else {
      loginError.value = "An unexpected error occurred. Please try again.";
    }
  } finally {
    loginLoading.value = false;
  }
}

// Helper functions
function togglePassword() {
  showPassword.value = !showPassword.value;
}

function goToRegister() {
  router.push("/register");
}

function goToForgotPassword() {
  router.push("/forgot-password");
}
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.auth-page {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ===== VISUAL SECTION ===== */
.auth-visual {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: white;
}

.visual-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}

.visual-content {
  position: relative;
  z-index: 2;
  max-width: 440px;
  text-align: center;
}

.visual-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}

.logo-icon {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.visual-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.2;
}

.visual-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 32px;
  line-height: 1.5;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  opacity: 0.9;
}

.feature-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

/* ===== FORM SECTION ===== */
.auth-form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f8fafc;
}

.auth-form-container {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
}

/* ===== FORM STYLES ===== */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  padding: 0;
}

.forgot-link:hover {
  color: #5a6fd8;
  text-decoration: underline;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.password-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
}

.toggle-icon {
  font-size: 1.1rem;
}

.field-error {
  font-size: 0.8rem;
  color: #ef4444;
  margin-top: 4px;
}

/* ===== BUTTON STYLES ===== */
.submit-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
}

.submit-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-btn.loading {
  cursor: wait;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* ===== MESSAGE STYLES ===== */
.message {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  line-height: 1.4;
  text-align: center;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.status-message {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.status-message.pending {
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #fed7aa;
}

.status-message.rejected {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.status-message.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

/* ===== AUTH SWITCH ===== */
.auth-switch {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.auth-switch p {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.switch-link {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  padding: 0;
}

.switch-link:hover {
  color: #5a6fd8;
  text-decoration: underline;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .auth-page {
    flex-direction: column;
  }
  
  .auth-visual {
    padding: 32px 24px;
    min-height: 300px;
  }
  
  .visual-content {
    max-width: 100%;
  }
  
  .visual-title {
    font-size: 1.75rem;
  }
  
  .auth-form-section {
    padding: 32px 24px;
  }
  
  .auth-form-container {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .auth-visual {
    padding: 24px 20px;
    min-height: 280px;
  }
  
  .visual-title {
    font-size: 1.5rem;
  }
  
  .visual-subtitle {
    font-size: 0.9rem;
  }
  
  .auth-form-section {
    padding: 24px 20px;
  }
  
  .auth-form-container {
    padding: 24px 20px;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
}

/* ===== ANIMATIONS ===== */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>