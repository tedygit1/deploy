<template>
  <div class="auth-page">
    <!-- Left Side Visual Section -->
    <div class="auth-image">
      <div class="overlay"></div>
      <img
        src="@/assets/provider-login-illustration.png"
        alt="Provider Illustration"
        class="floating-image"
      />
      <div class="image-text">
        <h2>Hey Beloved Provider</h2>
        <p>Login to manage your bookings, grow your services, and connect with clients.</p>
        <div class="motivations">
          <p><i class="fas fa-calendar-check"></i> Schedule your work hours easily</p>
          <p><i class="fas fa-users"></i> Reach hundreds of new customers</p>
          <p><i class="fas fa-bolt"></i> Boost your business productivity</p>
        </div>
      </div>
    </div>

    <!-- Login Card -->
    <div class="auth-container">
      <h1 class="title">Provider Login</h1>

      <form class="form" @submit.prevent="handleLogin">
        <input v-model="loginEmail" type="email" placeholder="Email" required />

        <div class="password-field">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="loginPassword"
            placeholder="Password"
            required
          />
          <span class="toggle-password" @click="showPassword = !showPassword">
            <i v-if="showPassword" class="fa fa-eye-slash"></i>
            <i v-else class="fa fa-eye"></i>
          </span>
        </div>

        <div class="forgot-password">
          <span @click="goToForgotPassword">Forgot Password?</span>
        </div>

        <button type="submit" class="btn" :disabled="loginLoading">
          {{ loginLoading ? "Logging in..." : "Login" }}
        </button>

        <p class="switch-text">
          Don’t have an account?
          <span @click="goToRegister" style="font-size: 20px;">Register</span>
        </p>

        <div v-if="loginError" style="color:red; margin-top:8px;">
          ❌ {{ loginError }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

// Login state
const loginEmail = ref("");
const loginPassword = ref("");
const showPassword = ref(false);
const loginLoading = ref(false);
const loginError = ref(null);

// ✅ Fixed: Correct base URL (no trailing spaces)
const BASE_URL = "https://infinity-booking-backend1.onrender.com/infinity-booking";

async function handleLogin() {
  loginLoading.value = true;
  loginError.value = null;

  if (!loginEmail.value || !loginPassword.value) {
    loginError.value = "Email and password are required";
    loginLoading.value = false;
    return;
  }

  try {
    // ✅ Send login request
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: loginEmail.value.trim(),
      password: loginPassword.value,
    });

    const token = res.data?.token;
    const user = res.data?.user || res.data;

    // ✅ CRITICAL FIX: Validate and save provider_id
    if (!token || !user?._id) {
      throw new Error("Invalid login response: missing token or user ID");
    }

    // ✅ Save ALL required auth data
    localStorage.setItem("provider_token", token);
    localStorage.setItem("provider_id", user._id); // 🔑 THIS WAS MISSING!
    localStorage.setItem("loggedProvider", JSON.stringify(user));

    const fullname = user?.fullname || "Provider";
    alert(`✅ Welcome back, ${fullname}!`);

    router.push({ name: "ProviderHome" });

  } catch (err) {
    console.error("❌ Login error:", err.response?.data || err.message);
    loginError.value = err.response?.data?.message || "Login failed. Please try again.";
  } finally {
    loginLoading.value = false;
  }
}

function goToRegister() {
  router.push("/register");
}

function goToForgotPassword() {
  router.push("/forgot-password");
}
</script>

<style scoped>
/* ====== Same styles as before ====== */
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #93c5fd, #a7f3d0);
  font-family: "Poppins", sans-serif;
  padding: 2rem;
  overflow: hidden;
}

.auth-image {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 25px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  height: 500px;
}

.auth-image img {
  width: 100%;
  max-width: 550px;
  border-radius: 25px;
  object-fit: cover;
  z-index: 2;
  opacity: 0.95;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(37, 99, 235, 0.5),
    rgba(16, 185, 129, 0.5)
  );
  z-index: 1;
}

.image-text {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-align: center;
  z-index: 3;
  max-width: 85%;
}

.image-text h2 {
  font-size: 2rem;
  font-weight: 700;
}

.image-text p {
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.5rem;
}

.motivations {
  margin-top: 1.2rem;
  text-align: left;
}

.motivations p {
  font-size: 0.95rem;
  color: #f0fdf4;
  margin: 6px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.motivations i {
  color: #ffcc00;
}

.floating-image {
  animation: float 5s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.auth-container {
  flex: 1;
  max-width: 420px;
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-left: 3rem;
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #2563eb;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 6px rgba(37, 99, 235, 0.4);
}

.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.password-field input {
  width: 100%;
  padding-right: 42px;
  box-sizing: border-box;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #2563eb;
  cursor: pointer;
  font-size: 16px;
}

.forgot-password {
  text-align: right;
  font-size: 0.9rem;
  color: #2563eb;
  cursor: pointer;
  margin-top: -0.5rem;
}

.forgot-password span:hover {
  text-decoration: underline;
}

.btn {
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn:hover {
  background: #1d4ed8;
}

.switch-text {
  margin-top: 1rem;
  font-size: 14px;
  color: #374151;
}

.switch-text span {
  color: #2563eb;
  cursor: pointer;
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.2s;
}

.switch-text span:hover {
  color: #1d4ed8;
}

@media (max-width: 900px) {
  .auth-page {
    flex-direction: column;
    padding: 2rem 1rem;
  }

  .auth-image {
    order: 2;
    margin-top: 2rem;
    width: 100%;
    height: 250px;
  }

  .auth-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .auth-container {
    margin-left: 0;
    width: 100%;
  }
}
</style>