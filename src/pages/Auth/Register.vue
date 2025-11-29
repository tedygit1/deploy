<!-- src/pages/Auth/Register.vue -->
<template>
  <div class="auth-page">
    <!-- Left Section -->
    <div class="auth-left">
      <div class="left-content">
        <h2>Join <span>Infinity-Booking</span></h2>
        <p>
          Register to <span>Infinity-Booking</span><br />
          Showcase your professional skills and connect with customers looking for trusted providers.
        </p>
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="Provider illustration"
          class="animated-img"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Registration Card -->
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="title">Create Provider Account</h1>
        <p class="subtitle">Join thousands of professionals growing their business with us</p>
      </div>

      <form class="form" @submit.prevent="handleSignup">
        <div class="input-group">
          <label for="fullname">Full Name</label>
          <input
            id="fullname"
            v-model="signup.fullname"
            type="text"
            placeholder="Enter your full name"
            required
            autocomplete="name"
          />
        </div>

        <div class="input-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="signup.email"
            type="email"
            placeholder="Enter your email"
            required
            autocomplete="email"
          />
        </div>

        <div class="input-group">
          <label for="phonenumber">Phone Number</label>
          <input
            id="phonenumber"
            v-model="signup.phonenumber"
            type="tel"
            inputmode="numeric"
            placeholder="+2519XXXXXXXX or 09XXXXXXXX"
            required
          />
        </div>

        <div class="input-group">
          <label for="location">Location</label>
          <input
            id="location"
            v-model="signup.location"
            type="text"
            placeholder="Your Location (e.g., Addis Ababa)"
            required
          />
        </div>

        <div class="input-group">
          <label for="fin">FIN Number <span class="optional">(optional)</span></label>
          <input
            id="fin"
            v-model="signup.FIN"
            type="text"
            placeholder="Enter FIN number if available"
          />
        </div>

        <!-- Service Selection -->
        <div class="input-group">
          <label for="service-category">Service Category</label>
          <div class="service-select">
            <div class="service-dropdown" @click="toggleServiceDropdown" :class="{ open: serviceDropdownOpen }">
              <span v-if="!selectedCategoryName">Select your service category</span>
              <span v-else>{{ selectedCategoryName }}</span>
              <i class="fa fa-chevron-down dropdown-icon"></i>
            </div>
            <div v-if="serviceDropdownOpen" class="service-options">
              <div
                v-for="cat in categories"
                :key="cat._id"
                class="service-option"
                :class="{ selected: signup.serviceCategoryId === cat._id }"
                @click.stop="selectCategory(cat)"
              >
                {{ cat.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="input-group">
          <label for="experience">Work Experience <span class="optional">(optional)</span></label>
          <textarea
            id="experience"
            v-model="signup.workExperience"
            placeholder="Describe your professional experience and qualifications..."
            rows="3"
          ></textarea>
        </div>

        <!-- Certificate Upload -->
        <div class="input-group">
          <label>Certificate <span class="optional">(optional)</span></label>
          <div class="file-upload work-section" @click="$refs.certInput.click()">
            <input ref="certInput" @change="handleCertificateUpload" type="file" accept=".pdf,.jpg,.png" hidden />
            <div class="work-upload">
              <i class="fa fa-upload"></i>
              <span v-if="!signup.certificate">Upload Certificate (PDF, JPG, PNG)</span>
              <span v-else class="file-name">{{ signup.certificate.name }}</span>
            </div>
          </div>
        </div>

        <!-- Password Fields -->
        <div class="input-group">
          <label for="password">Password</label>
          <div class="password-field">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="signup.password"
              placeholder="Create a strong password"
              required
            />
            <span class="toggle-password" @click="showPassword = !showPassword">
              <i v-if="showPassword" class="fa fa-eye-slash"></i>
              <i v-else class="fa fa-eye"></i>
            </span>
          </div>
        </div>

        <div class="input-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="password-field">
            <input
              id="confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              v-model="signup.confirmPassword"
              placeholder="Confirm your password"
              required
            />
            <span class="toggle-password" @click="showConfirm = !showConfirm">
              <i v-if="showConfirm" class="fa fa-eye-slash"></i>
              <i v-else class="fa fa-eye"></i>
            </span>
          </div>
        </div>

        <label class="terms">
          <input v-model="signup.accept" type="checkbox" required />
          <span>I agree to the <a href="#" class="link">Terms & Conditions</a> and <a href="#" class="link">Privacy Policy</a>.</span>
        </label>

        <button type="submit" class="btn" :disabled="loading">
          <span v-if="loading" class="btn-loading">
            <i class="fa fa-spinner fa-spin"></i>
            Registering...
          </span>
          <span v-else>Create Account</span>
        </button>

        <p class="switch-text">
          Already have an account?
          <router-link to="/login" class="link">Login here</router-link>
        </p>
      </form>
    </div>

    <!-- Toast Notifications -->
    <transition-group name="toast-slide" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
      >
        <i :class="getToastIcon(toast.type)"></i>
        <span>{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import http from "@/api/index.js";

const router = useRouter();
const loading = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);
const serviceDropdownOpen = ref(false);
const categories = ref([]);
const toasts = ref([]);
const signup = ref({
  fullname: '',
  email: '',
  phonenumber: '',
  location: '',
  FIN: '',
  serviceCategoryId: '',
  workExperience: '',
  certificate: null,
  password: '',
  confirmPassword: '',
  accept: false,
});

// ✅ Preserve your original dropdown behavior
const selectedCategoryName = computed(() => {
  const cat = categories.value.find(c => c._id === signup.value.serviceCategoryId);
  return cat ? cat.name : '';
});

const toggleServiceDropdown = () => {
  serviceDropdownOpen.value = !serviceDropdownOpen.value;
};

const selectCategory = (cat) => {
  signup.value.serviceCategoryId = cat._id;
  serviceDropdownOpen.value = false;
};

// Toast system
const showToast = (message, type = 'info') => {
  const id = Date.now() + Math.random();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 4000);
};

const getToastIcon = (type) => {
  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-exclamation',
    info: 'fa-solid fa-circle-info'
  };
  return icons[type] || icons.info;
};

// Fetch categories on mount
onMounted(async () => {
  try {
    const res = await http.get("/categories");
    categories.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Failed to load categories:", err);
    showToast("Could not load service categories.", "error");
  }
});

const handleCertificateUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    signup.value.certificate = file;
  }
};

const goToLogin = () => {
  router.push('/login');
};

const handleSignup = async () => {
  // Validation
  if (!signup.value.serviceCategoryId) {
    showToast("Please select a service category.", "error");
    return;
  }
  if (signup.value.password !== signup.value.confirmPassword) {
    showToast("Passwords do not match!", "error");
    return;
  }
  if (!signup.value.accept) {
    showToast("Please agree to the Terms & Conditions.", "error");
    return;
  }

  const formData = new FormData();
  formData.append('fullname', signup.value.fullname.trim());
  formData.append('email', signup.value.email.trim());
  formData.append('phonenumber', signup.value.phonenumber.trim());
  formData.append('location', signup.value.location.trim());
  if (signup.value.FIN) formData.append('FIN', signup.value.FIN.trim());

  // ✅ FINAL FIX: Send category NAME as PLAIN STRING (not JSON array)
  if (signup.value.serviceCategoryId) {
    const selectedCat = categories.value.find(c => c._id === signup.value.serviceCategoryId);
    if (selectedCat) {
      formData.append('serviceCategories', selectedCat.name);
    }
  }

  if (signup.value.workExperience) formData.append('workExperience', signup.value.workExperience.trim());
  if (signup.value.certificate) formData.append('certificate', signup.value.certificate);
  formData.append('password', signup.value.password);
  formData.append('confirmPassword', signup.value.confirmPassword);

  try {
    loading.value = true;
    await http.post("/auth/register/provider", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    showToast("Registration successful! Redirecting to login...", "success");
    router.push('/login');
  } catch (err) {
    console.error("❌ Registration error:", err);
    const msg = err.response?.data?.message || "Registration failed. Please try again.";
    showToast(msg, "error");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* ===== FIXED STYLES WITH VISIBLE TITLE ===== */
.auth-page {
  display: flex;
  align-items: stretch;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
  font-family: "Poppins", sans-serif;
  color: #fff;
  padding: 0;
  margin: 0;
}

.auth-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-right: 1px solid rgba(255, 255, 255, 0.15);
}

.left-content {
  text-align: top;
  max-width: 420px;
  animation: fadeInUp 0.6s ease-out;
  margin-top: 1rem;
  margin-block: auto;
}

.left-content h2 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.3;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.left-content span {
  color: #facc15;
  background: linear-gradient(135deg, #facc15, #eab308);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.left-content p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #e2e8f0;
  line-height: 1.6;
  font-weight: 400;
}
.animated-img {
  width: 90%;
  max-width: 380px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  animation: float 6s ease-in-out infinite;
  margin-top: 1rem;
}

.auth-container {
  flex: 1;
  background: #ffffff;
  color: #1e293b;
  border-radius: 20px 0 0 20px;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.3);
  padding: 3rem;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.5s ease-out;
  overflow-y: auto;
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 0 1rem;
}

/* FIXED: Title now has high contrast and is clearly visible */
.title {
  color: #1e3a8a !important; /* High contrast dark blue */
  font-size: 2.2rem !important; /* Larger size */
  margin-bottom: 0.5rem;
  font-weight: 800 !important; /* Bolder weight */
  position: relative;
  text-shadow: none !important; /* Remove any shadows that might reduce visibility */
  background: none !important; /* Ensure no background gradients */
  -webkit-text-fill-color: #1e3a8a !important; /* Solid color */
  opacity: 1 !important; /* Full opacity */
  margin-top: 2rem;
}

.title::after {
  content: '';
  display: block;
  width: 80px;
  height: 5px;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  margin: 1rem auto;
  border-radius: 4px;
}

.subtitle {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.optional {
  color: #6b7280;
  font-weight: 400;
  font-size: 0.9rem;
}

input,
textarea {
  width: 100%;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #1f2937;
  font-family: "Poppins", sans-serif;
}
input:focus,
textarea:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background: #ffffff;
  transform: translateY(-1px);
}

input::placeholder,
textarea::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

/* ✅ IMPROVED DROPDOWN STYLE */
.service-select {
  position: relative;
}

.service-dropdown {
  padding: 1rem 1.2rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  transition: all 0.25s ease;
  color: #1f2937;
  font-weight: 500;
}
.service-dropdown:hover,
.service-dropdown.open {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.dropdown-icon {
  transition: transform 0.3s ease;
  color: #6b7280;
}
.service-dropdown.open .dropdown-icon {
  transform: rotate(180deg);
  color: #3b82f6;
}

.service-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  margin-top: 8px;
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
}

.service-option {
  padding: 1rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  color: #374151;
  font-weight: 500;
}
.service-option:hover {
  background-color: #f0f9ff;
  color: #1e40af;
}
.service-option.selected {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: #ffffff;
  font-weight: 600;
}

.password-field {
  position: relative;
}
.password-field input {
  padding-right: 50px;
}
.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6b7280;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}
.toggle-password:hover {
  color: #3b82f6;
  background: #f3f4f6;
}

.file-upload {
  cursor: pointer;
}

.work-upload {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  color: #6b7280;
  background: #f9fafb;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}
.work-upload:hover {
  background: #f0f9ff;
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
}
.work-upload i {
  font-size: 1.5rem;
}
.file-name {
  color: #059669;
  font-weight: 600;
}

.btn {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  padding: 1.2rem;
  border: none;
  border-radius: 14px;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
  margin-top: 1rem;
}
.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 64, 175, 0.5);
}
.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.terms {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.5;
  margin-top: 1rem;
}
.terms input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #1e40af;
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
}
.terms span {
  color: #374151;
  font-weight: 500;
}

.link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}
.link:hover {
  color: #1e40af;
  text-decoration: underline;
}

.switch-text {
  margin-top: 1.5rem;
  font-size: 1rem;
  text-align: center;
  color: #6b7280;
  font-weight: 500;
}

/* Toast Styles */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 5000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  max-width: 350px;
  pointer-events: all;
  backdrop-filter: blur(10px);
}
.toast--success { 
  background: linear-gradient(135deg, #059669, #10b981);
}
.toast--error { 
  background: linear-gradient(135deg, #dc2626, #ef4444);
}
.toast--info { 
  background: linear-gradient(135deg, #1e40af, #3b82f6);
}
.toast i { 
  font-size: 1.2rem; 
}
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}
.toast-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.toast-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* ===== MOBILE-FIRST RESPONSIVE ===== */
@media (max-width: 900px) {
  .auth-page {
    flex-direction: column;
    padding: 1.5rem;
    min-height: auto;
  }

  .auth-left {
    padding: 2rem;
    background: rgba(255, 255, 255, 0.08);
    border-right: none;
    border-radius: 20px;
    margin-bottom: 2rem;
    width: 100%;
    order: 1;
  }

  .auth-container {
    width: 100%;
    max-width: 100%;
    border-radius: 20px !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    padding: 2.5rem;
    order: 2;
  }

  .left-content h2 { font-size: 1.9rem; }
  .left-content p { font-size: 1.05rem; }
  .animated-img { max-width: 320px; margin-top: 1.5rem; }
  .title { 
    font-size: 2rem !important; 
    color: #1e3a8a !important;
  }
  .subtitle { font-size: 0.95rem; }
}

@media (max-width: 600px) {
  .auth-page { padding: 1.2rem; }
  .auth-left { padding: 1.8rem; }
  .left-content h2 { font-size: 1.7rem; }
  .auth-container { padding: 2rem; }
  .title { 
    font-size: 1.8rem !important;
    color: #1e3a8a !important;
  }
  input, textarea, .service-dropdown, .work-upload { 
    padding: 1.1rem; 
    font-size: 1.02rem; 
  }
  .btn { padding: 1.15rem; font-size: 1.1rem; }
}

@media (max-width: 420px) {
  .auth-page { padding: 1rem; }
  .left-content h2 { font-size: 1.5rem; }
  .auth-container { padding: 1.8rem; }
  .title { 
    font-size: 1.6rem !important;
    color: #1e3a8a !important;
  }
  input, textarea, .service-dropdown, .work-upload { padding: 1.2rem; }
}

/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>