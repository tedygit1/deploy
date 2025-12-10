<!-- src/pages/Auth/Register.vue - COMPLETELY FIXED NO LOADING -->
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
        <h2 class="visual-title">Start Your Journey</h2>
        <p class="visual-subtitle">Join our platform and grow your service business</p>
        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">🚀</span>
            <span>Reach new customers</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💼</span>
            <span>Manage your bookings</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📈</span>
            <span>Grow your business</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Registration Form -->
    <div class="auth-form-section">
      <div class="auth-form-container">
        <div class="form-header">
          <h1 class="form-title">Create Account</h1>
          <p class="form-subtitle">Join as a service provider</p>
        </div>

        <form class="auth-form" @submit.prevent="handleSignup">
          <!-- Personal Information -->
          <div class="form-row">
            <div class="form-group">
              <label for="fullname" class="form-label">Full Name *</label>
              <input
                id="fullname"
                v-model="signup.fullname"
                type="text"
                placeholder="Enter your full name"
                required
                class="form-input"
                :class="{ 'error': fieldErrors.fullname }"
                @blur="validateField('fullname')"
              />
              <div v-if="fieldErrors.fullname" class="field-error">{{ fieldErrors.fullname }}</div>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email Address *</label>
              <input
                id="email"
                v-model="signup.email"
                type="email"
                placeholder="Enter your email"
                required
                class="form-input"
                :class="{ 'error': fieldErrors.email }"
                @blur="validateField('email')"
              />
              <div v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="form-row">
            <div class="form-group">
              <label for="phonenumber" class="form-label">Phone Number *</label>
              <input
                id="phonenumber"
                v-model="signup.phonenumber"
                type="tel"
                placeholder="+251 XXX XXX XXX"
                required
                class="form-input"
                :class="{ 'error': fieldErrors.phonenumber }"
                @blur="validateField('phonenumber')"
              />
              <div v-if="fieldErrors.phonenumber" class="field-error">{{ fieldErrors.phonenumber }}</div>
            </div>

            <div class="form-group">
              <label for="location" class="form-label">Location *</label>
              <input
                id="location"
                v-model="signup.location"
                type="text"
                placeholder="Your city or area"
                required
                class="form-input"
                :class="{ 'error': fieldErrors.location }"
                @blur="validateField('location')"
              />
              <div v-if="fieldErrors.location" class="field-error">{{ fieldErrors.location }}</div>
            </div>
          </div>

          <!-- Optional Fields -->
          <div class="form-row">
            <div class="form-group">
              <label for="fin" class="form-label">FIN Number</label>
              <input
                id="fin"
                v-model="signup.FIN"
                type="text"
                placeholder="Optional"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="service-category" class="form-label">Service Category *</label>
              <div class="select-wrapper">
                <select
                  id="service-category"
                  v-model="signup.serviceCategoryId"
                  required
                  class="form-select"
                  :class="{ 'error': fieldErrors.serviceCategoryId }"
                  @change="validateField('serviceCategoryId')"
                  @focus="loadCategoriesIfNeeded"
                >
                  <option value="">Select your service</option>
                  <option 
                    v-for="category in categories" 
                    :key="category._id" 
                    :value="category._id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div v-if="fieldErrors.serviceCategoryId" class="field-error">{{ fieldErrors.serviceCategoryId }}</div>
            </div>
          </div>

          <!-- Experience -->
          <div class="form-group">
            <label for="experience" class="form-label">Work Experience</label>
            <textarea
              id="experience"
              v-model="signup.workExperience"
              placeholder="Tell us about your professional experience..."
              rows="3"
              class="form-textarea"
            ></textarea>
          </div>

          <!-- Certificate Upload -->
          <div class="form-group">
            <label class="form-label">Certificate</label>
            <div class="file-upload-area" @click="triggerFileInput">
              <input 
                ref="fileInput"
                type="file" 
                @change="handleCertificateUpload" 
                accept=".pdf,.jpg,.png,.jpeg"
                class="file-input"
              />
              <div class="upload-content">
                <span class="upload-icon">📎</span>
                <div class="upload-text">
                  <div class="upload-title">
                    {{ signup.certificate ? signup.certificate.name : 'Upload certificate (PDF, JPG, PNG)' }}
                  </div>
                  <div class="upload-subtitle">Max file size: 5MB</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Password Fields -->
          <div class="form-row">
            <div class="form-group">
              <label for="password" class="form-label">Password *</label>
              <div class="password-input-wrapper">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="signup.password"
                  placeholder="Create a password"
                  required
                  class="form-input"
                  :class="{ 'error': fieldErrors.password }"
                  @blur="validateField('password')"
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
              <div v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm Password *</label>
              <div class="password-input-wrapper">
                <input
                  id="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="signup.confirmPassword"
                  placeholder="Confirm your password"
                  required
                  class="form-input"
                  :class="{ 'error': fieldErrors.confirmPassword }"
                  @blur="validateField('confirmPassword')"
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="toggleConfirmPassword"
                  :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                >
                  <span class="toggle-icon">{{ showConfirmPassword ? '🙈' : '👁️' }}</span>
                </button>
              </div>
              <div v-if="fieldErrors.confirmPassword" class="field-error">{{ fieldErrors.confirmPassword }}</div>
            </div>
          </div>

          <!-- Terms Agreement -->
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="signup.accept" 
                required
                class="checkbox-input"
              />
              <span class="checkbox-text">
                I agree to the 
                <a href="#" class="link">Terms & Conditions</a> 
                and 
                <a href="#" class="link">Privacy Policy</a>
              </span>
            </label>
            <div v-if="fieldErrors.accept" class="field-error">{{ fieldErrors.accept }}</div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="loading"
            :class="{ 'loading': loading }"
          >
            <span v-if="loading" class="btn-spinner"></span>
            <span>{{ loading ? 'Creating Account...' : 'Create Account' }}</span>
          </button>

          <!-- Status Messages -->
          <div v-if="errorMessage" class="message error-message" role="alert">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="message success-message">
            {{ successMessage }}
          </div>

          <!-- Login Link -->
          <div class="auth-switch">
            <p>Already have an account? 
              <router-link to="/login" class="switch-link">Sign in</router-link>
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

const categories = ref([]);
const categoriesLoaded = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const fieldErrors = ref({
  fullname: '',
  email: '',
  phonenumber: '',
  location: '',
  serviceCategoryId: '',
  password: '',
  confirmPassword: '',
  accept: '',
});

// Validation functions
const validateField = (field) => {
  const value = signup.value[field];
  
  switch (field) {
    case 'fullname':
      fieldErrors.value.fullname = value.trim().length < 2 ? 'Full name must be at least 2 characters' : '';
      break;
    case 'email':
      const emailRegex = /^\S+@\S+\.\S+$/;
      fieldErrors.value.email = !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      break;
    case 'phonenumber':
      fieldErrors.value.phonenumber = value.trim().length < 10 ? 'Please enter a valid phone number' : '';
      break;
    case 'location':
      fieldErrors.value.location = value.trim().length < 2 ? 'Please enter your location' : '';
      break;
    case 'serviceCategoryId':
      fieldErrors.value.serviceCategoryId = !value ? 'Please select a service category' : '';
      break;
    case 'password':
      fieldErrors.value.password = value.length < 6 ? 'Password must be at least 6 characters' : '';
      break;
    case 'confirmPassword':
      fieldErrors.value.confirmPassword = value !== signup.value.password ? 'Passwords do not match' : '';
      break;
    case 'accept':
      fieldErrors.value.accept = !value ? 'Please accept the terms and conditions' : '';
      break;
  }
};

const validateForm = () => {
  Object.keys(fieldErrors.value).forEach(field => {
    if (field !== 'FIN' && field !== 'workExperience' && field !== 'certificate') {
      validateField(field);
    }
  });
  
  return !Object.values(fieldErrors.value).some(error => error !== '');
};

// File handling
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleCertificateUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'File size must be less than 5MB';
      return;
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      errorMessage.value = 'Please upload PDF, JPG, or PNG files only';
      return;
    }
    
    signup.value.certificate = file;
    errorMessage.value = '';
  }
};


// Form submission - UPDATED with review message and redirect
const handleSignup = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!validateForm()) {
    errorMessage.value = 'Please fix the errors above';
    return;
  }

  loading.value = true;

  try {
    const formData = new FormData();
    formData.append('fullname', signup.value.fullname.trim());
    formData.append('email', signup.value.email.trim());
    formData.append('phonenumber', signup.value.phonenumber.trim());
    formData.append('location', signup.value.location.trim());
    
    if (signup.value.FIN) formData.append('FIN', signup.value.FIN.trim());
    
    // Send category name
    if (signup.value.serviceCategoryId) {
      const selectedCategory = categories.value.find(cat => cat._id === signup.value.serviceCategoryId);
      if (selectedCategory) {
        formData.append('serviceCategories', selectedCategory.name);
      }
    }
    
    if (signup.value.workExperience) formData.append('workExperience', signup.value.workExperience.trim());
    if (signup.value.certificate) formData.append('certificate', signup.value.certificate);
    formData.append('password', signup.value.password);
    formData.append('confirmPassword', signup.value.confirmPassword);

    const response = await http.post("/auth/register/provider", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // UPDATED: Short and informative review message with redirect
    successMessage.value = "Registration submitted successfully! Your account is now under review. You'll receive an email notification once approved.";
    
    // Clear the form after successful registration
    setTimeout(() => {
      // Reset form
      signup.value = {
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
      };
      
      // Clear file input
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    }, 1000);

    // Redirect to login after 4 seconds (gives user time to read the message)
    setTimeout(() => {
      router.push('/login');
    }, 4000);

  } catch (error) {
    console.error('Registration error:', error);
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Helper functions
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// 🔥🔥🔥 CRITICAL FIX: Fetch categories ONLY when needed (on dropdown focus)
const loadCategoriesIfNeeded = () => {
  if (!categoriesLoaded.value && categories.value.length === 0) {
    // 🔥 Fetch in background without showing loading
    http.get("/categories")
      .then(response => {
        categories.value = Array.isArray(response.data) ? response.data : [];
        categoriesLoaded.value = true;
      })
      .catch(error => {
        console.error('Failed to load categories:', error);
        // Provide fallback options silently
        categories.value = [
          { _id: '1', name: 'Beauty & Salon' },
          { _id: '2', name: 'Home Services' },
          { _id: '3', name: 'Education & Tutoring' },
          { _id: '4', name: 'Health & Wellness' },
          { _id: '5', name: 'Business Services' }
        ];
        categoriesLoaded.value = true;
      });
  }
};

// 🔥🔥🔥 REMOVED the onMounted() category fetch - this was causing the issue!
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
  overflow-y: auto;
}

.auth-form-container {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 600px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.select-wrapper {
  position: relative;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

/* ===== FILE UPLOAD ===== */
.file-input {
  display: none;
}

.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.file-upload-area:hover {
  border-color: #667eea;
  background: #f0f9ff;
}

.upload-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  font-size: 1.5rem;
}

.upload-text {
  flex: 1;
}

.upload-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
}

.upload-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
}

/* ===== PASSWORD FIELDS ===== */
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

/* ===== CHECKBOX ===== */
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #374151;
  line-height: 1.4;
}

.checkbox-input {
  margin-top: 2px;
  accent-color: #667eea;
}

.checkbox-text {
  flex: 1;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
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

.success-message {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.field-error {
  font-size: 0.8rem;
  color: #ef4444;
  margin-top: 4px;
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
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
}

.switch-link:hover {
  text-decoration: underline;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1024px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

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