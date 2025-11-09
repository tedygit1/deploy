<template>
  <div class="auth-page">
    <!-- Left Section -->
    <div class="auth-left">
      <div class="left-content">
        <h2>Join <span>Infinity-Booking</span></h2>
        <p>
          Register to <span style="font-size: larger;color: chartreuse;">Infinity-Booking</span><br />
          Showcase your professional skills and connect with customers looking for trusted providers.
        </p>
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="Provider illustration"
          class="animated-img"
        />
      </div>
    </div>

    <!-- Registration Card -->
    <div class="auth-container">
      <h1 class="title">Create Provider Account</h1>

      <form class="form" @submit.prevent="handleSignup">
        <input v-model="signup.fullname" type="text" placeholder="Full Name" required />
        <input v-model="signup.email" type="email" placeholder="Email" required />
        <input v-model="signup.phonenumber" type="tel" placeholder="+2519XXXXXXXX" required />
        <input v-model="signup.location" type="text" placeholder="Your Location" required />
        <input v-model="signup.FIN" type="text" placeholder="FIN (optional)" />

        <!-- Service Selection -->
        <div class="service-select">
          <div class="service-dropdown" @click="toggleServiceDropdown">
            <span v-if="signup.serviceCategories.length === 0">Select your services</span>
            <span v-else>{{ signup.serviceCategories.join(', ') }}</span>
            <i class="fa fa-chevron-down dropdown-icon"></i>
          </div>
          <div v-if="serviceDropdownOpen" class="service-options">
            <div
              v-for="service in availableServices"
              :key="service"
              class="service-option"
              :class="{ selected: signup.serviceCategories.includes(service) }"
              @click.stop="toggleService(service)"
            >
              {{ service }}
            </div>
          </div>
        </div>

        <textarea v-model="signup.workExperience" placeholder="Your experience (optional)" rows="2"></textarea>

        <!-- Certificate Upload -->
        <div class="file-upload work-section" @click="$refs.certInput.click()">
          <input ref="certInput" @change="handleCertificateUpload" type="file" accept=".pdf,.jpg,.png" hidden />
          <div class="work-upload">
            <span v-if="!signup.certificate">Upload Certificate (optional)</span>
            <span v-else>{{ signup.certificate.name }}</span>
          </div>
        </div>

        <!-- Password Fields -->
        <div class="password-field">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="signup.password"
            placeholder="Password"
            required
          />
          <span class="toggle-password" @click="showPassword = !showPassword">
            <i v-if="showPassword" class="fa fa-eye-slash"></i>
            <i v-else class="fa fa-eye"></i>
          </span>
        </div>

        <div class="password-field">
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model="signup.confirmPassword"
            placeholder="Confirm Password"
            required
          />
          <span class="toggle-password" @click="showConfirm = !showConfirm">
            <i v-if="showConfirm" class="fa fa-eye-slash"></i>
            <i v-else class="fa fa-eye"></i>
          </span>
        </div>

        <label class="terms">
          <input v-model="signup.accept" type="checkbox" required />
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>

        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? "Registering..." : "Create Account" }}
        </button>

        <p class="switch-text">
          Already have an account?
          <span @click="goToLogin">Login</span>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const BASE_URL = "https://infinity-booking-backend1.onrender.com/infinity-booking";

const signup = ref({
  fullname: "",
  email: "",
  phonenumber: "",
  location: "",
  serviceCategories: [],
  workExperience: "",
  certificate: null,
  FIN: "",
  password: "",
  confirmPassword: "",
  accept: false,
});

const showPassword = ref(false);
const showConfirm = ref(false);
const serviceDropdownOpen = ref(false);
const loading = ref(false);

const availableServices = [
  "Home Services",
  "Beauty & Salon",
  "Education & Tutoring",
  "Other",
];

function toggleServiceDropdown() {
  serviceDropdownOpen.value = !serviceDropdownOpen.value;
}

function toggleService(service) {
  const index = signup.value.serviceCategories.indexOf(service);
  if (index === -1) signup.value.serviceCategories.push(service);
  else signup.value.serviceCategories.splice(index, 1);
}

function handleCertificateUpload(e) {
  const file = e.target.files[0];
  if (file) signup.value.certificate = file;
}

async function handleSignup() {
  // ✅ Frontend validation
  if (!signup.value.fullname.trim()) return alert("Full name is required");
  if (!signup.value.email) return alert("Email is required");
  if (!signup.value.phonenumber) return alert("Phone number is required");
  const phoneRegex = /^(?:\+2519\d{8}|09\d{8})$/;
  if (!phoneRegex.test(signup.value.phonenumber))
    return alert("Phone number must be valid (e.g. +2519XXXXXXXX or 09XXXXXXXX)");
  if (!signup.value.location) return alert("Location is required");
  if (!signup.value.serviceCategories.length)
    return alert("Select at least one service category");
  if (!signup.value.password || !signup.value.confirmPassword)
    return alert("Password and confirm password are required");
  if (!signup.value.accept) return alert("Please accept the Terms & Conditions");

  const pass = signup.value.password;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
  if (pass.length < 8) return alert("Password must be at least 8 characters");
  if (!regex.test(pass))
    return alert(
      "Password must include uppercase, lowercase, number, and special character"
    );
  if (pass !== signup.value.confirmPassword) return alert("Passwords do not match");

  try {
    loading.value = true;

    const formData = new FormData();
    formData.append("fullname", signup.value.fullname);
    formData.append("email", signup.value.email);
    formData.append("phonenumber", signup.value.phonenumber);
    formData.append("location", signup.value.location);
    formData.append("FIN", signup.value.FIN);
    formData.append("workExperience", signup.value.workExperience);
    formData.append("password", signup.value.password);
    formData.append("confirmPassword", signup.value.confirmPassword);
    if (signup.value.certificate) formData.append("certificate", signup.value.certificate);

    // Send service categories as JSON array
    formData.append(
      "serviceCategories",
      JSON.stringify(signup.value.serviceCategories)
    );

    await axios.post(`${BASE_URL}/auth/register/provider`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("✅ Registration successful! Redirecting to login...");
    router.push("/login");
  } catch (err) {
    console.error("❌ Registration error:", err.response?.data || err.message);
    alert("Registration failed: " + (err.response?.data?.message || err.message));
  } finally {
    loading.value = false;
  }
}

function goToLogin() {
  router.push("/login");
}
</script>

<style scoped>
/* ✅ Styles from former Register.vue retained */
.auth-page {
  display: flex;
  align-items: stretch;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e40af, #22d3ee);
  font-family: "Poppins", sans-serif;
  color: #fff;
}

.auth-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.left-content {
  text-align: center;
  max-width: 400px;
}

.left-content h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.left-content span {
  color: #facc15;
}
.left-content p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #f9fafb;
}
.animated-img {
  width: 90%;
  max-width: 380px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.auth-container {
  flex: 1;
  background: #fff;
  color: #111;
  border-radius: 16px 0 0 16px;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
  padding: 3rem;
  max-width: 500px;
}

.title {
  color: #1e40af;
  font-size: 1.9rem;
  margin-bottom: 1.8rem;
  font-weight: 700;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input,
textarea {
  width: 100%;
  padding: 0.8rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  transition: 0.3s;
}
input:focus,
textarea:focus {
  border-color: #1e40af;
  outline: none;
}

.service-select {
  display: flex;
  flex-direction: column;
  position: relative;
}

.service-dropdown {
  padding: 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-dropdown:hover {
  border-color: #1e40af;
}

.dropdown-icon {
  margin-left: 0.5rem;
}

.service-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  margin-top: 4px;
  z-index: 50;
  max-height: 150px;
  overflow-y: auto;
}

.service-option {
  padding: 0.8rem;
  cursor: pointer;
}

.service-option:hover {
  background-color: #f0f9ff;
}

.service-option.selected {
  background-color: #1e40af;
  color: #fff;
}

.password-field {
  position: relative;
}
.password-field input {
  width: 100%;
  padding-right: 40px;
}
.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #1e40af;
}

.work-upload {
  border: 1px dashed #1e40af;
  border-radius: 10px;
  padding: 0.8rem;
  text-align: center;
  cursor: pointer;
  color: #555;
  transition: 0.3s;
}
.work-upload:hover {
  background: #eff6ff;
  border-color: #2563eb;
}

.btn {
  background: #1e40af;
  color: white;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.btn:hover {
  background: #1d4ed8;
}

.terms {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  font-size: 0.9rem;
  color: #444;
  text-align: left;
  line-height: 1.4;
  margin-top: 0.5rem;
}

.terms input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #1e40af;
  cursor: pointer;
  flex-shrink: 0;
}

.terms span {
  color: #333;
  font-weight: 500;
}

.switch-text {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
}
.switch-text span {
  color: #1e40af;
  cursor: pointer;
  font-weight: 600;
}
</style>
