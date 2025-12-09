<!-- src/pages/Providers/ProfileSection.vue - FULLY RESPONSIVE -->
<template>
  <div class="profile-section">
    <!-- Enhanced Header with Visual Effects -->
    <div class="profile-header">
      <div class="header-background"></div>
      <div class="header-content">
        <div class="header-text">
          <h2 class="title-gradient">Manage Your Profile</h2>
          <p class="subtitle">Update your professional information and preferences</p>
        </div>
        <div class="header-right">
          <div class="status-display">
            <span class="status-label">Status:</span>
            <div class="status-badge" :class="providerStatus">
              <i :class="getStatusIcon(providerStatus)"></i>
              {{ formatStatus(providerStatus) }}
            </div>
          </div>
          <button @click="editMode = !editMode" class="edit-btn" :class="{ active: editMode }">
            <i class="fa-solid" :class="editMode ? 'fa-times' : 'fa-pen-to-square'"></i>
            {{ editMode ? 'Cancel' : 'Edit Profile' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content with Enhanced Layout -->
    <div class="profile-content">
      <!-- Profile Picture Section with Enhanced Design -->
      <div class="profile-picture-section">
        <div class="picture-card">
          <div class="card-header">
            <h3><i class="fa-solid fa-camera"></i> Profile Photo</h3>
          </div>
          <div class="picture-content">
            <div class="profile-picture-wrapper" @click="triggerFileInput">
              <div class="profile-picture" :class="{ uploading: uploadingPhoto }">
                <img v-if="profileImage" :src="profileImage" alt="Profile" />
                <div v-else class="placeholder">
                  <i class="fa-solid fa-user"></i>
                </div>
                <div class="edit-overlay">
                  <i class="fa-solid fa-camera"></i>
                  <span>Change Photo</span>
                </div>
              </div>
              <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" />
            </div>
            <div v-if="uploadingPhoto" class="upload-progress">
              <div class="progress-spinner">
                <i class="fa-solid fa-spinner fa-spin"></i>
              </div>
              <span>Uploading...</span>
            </div>
            <div class="photo-tips">
              <p><i class="fa-solid fa-lightbulb"></i> Recommended: Square image, 500x500px or larger</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Information Section with Enhanced Design -->
      <div class="profile-info-section">
        <div class="info-card">
          <div class="card-header">
            <h3><i class="fa-solid fa-user-circle"></i> Personal Information</h3>
            <div class="card-actions">
              <button v-if="editMode" class="save-btn" @click="saveProfileFields" :disabled="saving">
                <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-floppy-disk"></i>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>

          <div class="card-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-signature"></i>
                  Full Name
                  <span class="required">*</span>
                </label>
                <input 
                  v-model="fullname" 
                  :disabled="!editMode" 
                  class="form-input"
                  placeholder="Enter your full name"
                  :class="{ error: !fullname?.trim() && editMode }"
                />
                <div v-if="!fullname?.trim() && editMode" class="error-message">
                  Full name is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-envelope"></i>
                  Email Address
                </label>
                <input v-model="email" disabled class="form-input" />
                <div class="field-note">Email cannot be changed</div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-phone"></i>
                  Phone Number
                </label>
                <input 
                  v-model="phonenumber" 
                  :disabled="!editMode" 
                  class="form-input"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-location-dot"></i>
                  Location
                </label>
                <input 
                  v-model="location" 
                  :disabled="!editMode" 
                  class="form-input"
                  placeholder="Your city and country"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-id-card"></i>
                  FIN Number
                </label>
                <input 
                  v-model="FIN" 
                  :disabled="!editMode" 
                  class="form-input"
                  placeholder="Your financial identification number"
                />
              </div>

              <div class="form-group full-width">
                <label class="form-label">
                  <i class="fa-solid fa-briefcase"></i>
                  Work Experience
                </label>
                <textarea 
                  v-model="workExperience" 
                  :disabled="!editMode" 
                  class="form-textarea"
                  rows="4"
                  placeholder="Describe your professional experience, skills, and expertise..."
                ></textarea>
                <div class="field-note">
                  Share your professional background to build trust with clients
                </div>
              </div>

              <!-- Service Categories -->
              <div class="form-group full-width">
                <label class="form-label">
                  <i class="fa-solid fa-tags"></i>
                  Service Categories
                </label>
                <div class="categories-display" v-if="categoriesArray.length > 0">
                  <span v-for="(category, index) in categoriesArray" :key="index" class="category-tag">
                    <i class="fa-solid fa-hashtag"></i>
                    {{ category }}
                  </span>
                </div>
                <div v-else class="no-categories">
                  <i class="fa-solid fa-inbox"></i>
                  No categories added
                </div>
              </div>

              <!-- Certificate -->
              <div v-if="certificate" class="form-group full-width">
                <label class="form-label">
                  <i class="fa-solid fa-file-certificate"></i>
                  Professional Certificate
                </label>
                <div class="certificate-display">
                  <i class="fa-solid fa-file-pdf"></i>
                  <span>Verified Certificate</span>
                  <a :href="certificate" target="_blank" class="certificate-link">
                    <i class="fa-solid fa-eye"></i>
                    View Certificate
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Toast Notifications -->
    <transition-group name="toast-bounce" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
      >
        <div class="toast-icon">
          <i :class="getToastIcon(toast.type)"></i>
        </div>
        <div class="toast-content">
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" @click="removeToast(toast.id)">
          <i class="fa-solid fa-times"></i>
        </button>
        <div class="toast-progress"></div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import http from "@/api/index.js";

export default {
  name: 'ProfileSection',
  props: {
    provider: { 
      type: Object, 
      required: true, 
      default: () => ({}) 
    }
  },

  data() {
    return {
      fullname: '',
      email: '',
      phonenumber: '',
      location: '',
      FIN: '',
      workExperience: '',
      certificate: '',
      profileImage: null,
      editMode: false,
      uploadingPhoto: false,
      saving: false,
      categoriesText: '',
      categoriesArray: [],
      toasts: []
    };
  },

  computed: {
    providerStatus() {
      return this.provider?.providerProfile?.status || this.provider?.status || 'pending';
    }
  },

  watch: {
    provider: {
      handler(newVal) {
        if (!newVal) return;
        const profile = newVal.providerProfile || {};
        this.fullname = newVal.fullname || '';
        this.email = newVal.email || '';
        this.phonenumber = profile.phonenumber || '';
        this.location = profile.location || '';
        this.FIN = profile.FIN || '';
        this.workExperience = profile.workExperience || '';
        this.certificate = profile.certificate || '';
        this.profileImage = newVal.profilePhoto || null;
        
        let categoriesFromData = [];
        
        if (newVal.serviceCategoryNames && Array.isArray(newVal.serviceCategoryNames)) {
          categoriesFromData = [...newVal.serviceCategoryNames];
        } else if (newVal.serviceCategories && Array.isArray(newVal.serviceCategories)) {
          categoriesFromData = newVal.serviceCategories.map(cat => {
            if (cat.name) return cat.name;
            if (cat.categoryName) return cat.categoryName;
            return '';
          }).filter(Boolean);
        }
        
        this.categoriesArray = categoriesFromData;
        this.categoriesText = categoriesFromData.join(', ') || '';
      },
      immediate: true
    }
  },

  methods: {
    showToast(message, type = 'info') {
      const id = Date.now() + Math.random();
      this.toasts.push({ id, message, type });
      setTimeout(() => {
        this.removeToast(id);
      }, 5000);
    },

    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    },

    getToastIcon(type) {
      const icons = {
        success: 'fa-solid fa-circle-check',
        error: 'fa-solid fa-circle-exclamation',
        info: 'fa-solid fa-circle-info'
      };
      return icons[type] || icons.info;
    },

    getStatusIcon(status) {
      const icons = {
        confirmed: 'fa-solid fa-check-circle',
        pending: 'fa-solid fa-clock',
        rejected: 'fa-solid fa-times-circle'
      };
      return icons[status] || 'fa-solid fa-question-circle';
    },

    formatStatus(status) {
      const statusMap = {
        confirmed: 'Verified',
        pending: 'Under Review',
        rejected: 'Rejected'
      };
      return statusMap[status] || status;
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async onFileChange(event) {
      const file = event.target.files?.[0];
      if (!file || !file.type.startsWith('image/')) {
        this.showToast('Please select a valid image file (JPEG/PNG).', 'error');
        return;
      }
      event.target.value = '';

      const reader = new FileReader();
      reader.onload = e => this.profileImage = e.target.result;
      reader.readAsDataURL(file);

      this.uploadingPhoto = true;
      try {
        const fd = new FormData();
        fd.append("photo", file);

        const res = await http.patch('/users/profile-photo/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data?.profilePhoto) {
          this.profileImage = res.data.profilePhoto;
          this.$emit('profileUpdated');
          this.showToast('Profile photo updated successfully!', 'success');
        } else {
          throw new Error('No photo URL returned');
        }
      } catch (err) {
        console.error('Photo upload failed:', err);
        this.profileImage = this.provider.profilePhoto || null;
        const msg = err.response?.data?.message || 'Failed to upload photo. Please try again.';
        this.showToast(msg, 'error');
      } finally {
        this.uploadingPhoto = false;
      }
    },

    async saveProfileFields() {
      if (!this.fullname?.trim()) {
        this.showToast('Full name is required.', 'error');
        return;
      }

      const providerId = this.provider?._id;
      if (!providerId) {
        this.showToast('User ID missing.', 'error');
        return;
      }

      this.saving = true;
      try {
        const payload = {
          fullname: this.fullname.trim(),
          phonenumber: this.phonenumber?.trim(),
          location: this.location?.trim(),
          FIN: this.FIN?.trim(),
          workExperience: this.workExperience?.trim()
        };

        await http.patch(`/users/${providerId}`, payload);

        this.showToast('Profile updated successfully!', 'success');
        this.editMode = false;
        this.$emit('profileUpdated');
      } catch (err) {
        console.error('Profile update failed:', err);
        const msg = err.response?.data?.message || 'Failed to update profile. Please try again.';
        this.showToast(msg, 'error');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
/* ===== ENHANCED & FULLY RESPONSIVE PROFILE SECTION ===== */
.profile-section {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0;
  background: rgb(201, 201, 210);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  overflow: hidden;
  position: relative;
}

/* Enhanced Header */
.profile-header {
  background: linear-gradient(135deg, #5c5e65 0%, #555984 100%);
  padding: clamp(16px, 4vw, 24px) clamp(16px, 5vw, 32px);
  position: relative;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="rgba(255,255,255,0.1)"><path d="M0 50 Q 250 0 500 50 T 1000 50 V 100 H 0 Z"/></svg>') bottom center/cover no-repeat;
}

.header-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: clamp(12px, 3vw, 20px);
  position: relative;
  z-index: 2;
}

.header-text .title-gradient {
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-text .subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(0.9rem, 3.5vw, 1.1rem);
  margin: 0;
  font-weight: 500;
}

.header-right {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(12px, 3vw, 16px);
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.status-display {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(64, 194, 97, 0.15);
  padding: 8px 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(15, 247, 66, 0.2);
  white-space: nowrap;
}

.status-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 600;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: capitalize;
  background: rgba(30, 205, 120, 0.2);
  color: rgb(247, 250, 254);
  backdrop-filter: blur(10px);
}

.status-badge.confirmed { background: rgba(34, 197, 94, 0.3); }
.status-badge.pending { background: rgba(245, 158, 11, 0.3); }
.status-badge.rejected { background: rgba(239, 68, 68, 0.3); }

.edit-btn {
  background: rgba(37, 18, 27, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  min-width: 140px;
  white-space: nowrap;
}

.edit-btn:hover,
.edit-btn.active {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Main Content Layout */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 500px;
}

@media (min-width: 769px) {
  .profile-content {
    flex-direction: row;
  }

  .profile-picture-section {
    border-right: 1px solid #e2e8f0;
    border-bottom: none;
  }
}

/* Profile Picture Section */
.profile-picture-section {
  background: #4c5055;
  padding: 24px 20px;
  border-bottom: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .profile-picture-section {
    padding: 20px 16px;
  }
}

.picture-card {
  background: rgb(190, 190, 218);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
}

.picture-card .card-header {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.picture-card .card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 10px;
}

.picture-content {
  padding: 20px;
  text-align: center;
}

.profile-picture-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-bottom: 16px;
}

.profile-picture {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
  transition: all 0.3s ease;
  position: relative;
}

@media (max-width: 768px) {
  .profile-picture {
    width: 140px;
    height: 140px;
  }
}

@media (max-width: 480px) {
  .profile-picture {
    width: 120px;
    height: 120px;
  }

  .placeholder {
    font-size: 2.8rem;
  }
}

.profile-picture:hover {
  border-color: #394252;
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.3);
  transform: scale(1.02);
}

.profile-picture.uploading {
  opacity: 0.7;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  font-size: 3.5rem;
  color: #cbd5e1;
}

.edit-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(222, 225, 231, 0.8), rgba(130, 148, 223, 0.8));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  color: white;
  font-weight: 600;
}

.profile-picture:hover .edit-overlay {
  opacity: 1;
}

.edit-overlay i {
  font-size: 1.3rem;
  margin-bottom: 6px;
}

.profile-picture input[type="file"] {
  display: none;
}

.upload-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 16px 0;
  color: #3b82f6;
  font-weight: 600;
}

.progress-spinner {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-tips {
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}

.photo-tips p {
  margin: 0;
  font-size: 0.85rem;
  color: #0369a1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* Profile Information Section */
.profile-info-section {
  padding: 24px 20px;
  background-color: #a9b3c2;
}

@media (max-width: 768px) {
  .profile-info-section {
    padding: 20px 16px;
  }
}

.info-card {
  background: rgb(252, 252, 253);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(99, 109, 136, 0.06);
  border: 1px solid #65717c;
}

.info-card .card-header {
  background: linear-gradient(135deg, #2b3741, #b2b9c1);
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

@media (max-width: 768px) {
  .info-card .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .card-actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}

.info-card .card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fafcff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-body {
  padding: 24px;
}

@media (max-width: 768px) {
  .card-body {
    padding: 20px;
  }
}

/* Form Styles */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 769px) {
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #4468a2;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-label i {
  color: #2e4a82;
  width: 16px;
  font-size: 0.95rem;
}

.required {
  color: #ef4444;
}

.form-input,
.form-textarea {
  padding: 12px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #f7f7f9;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 480px) {
  .form-input,
  .form-textarea {
    padding: 10px 12px;
    font-size: 0.9rem;
  }

  .form-label {
    font-size: 0.85rem;
  }
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgb(43, 40, 54);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.form-input:disabled,
.form-textarea:disabled {
  background: #f8fafc;
  color: #a6adb6;
  cursor: not-allowed;
}

.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 6px;
  font-weight: 500;
}

.field-note {
  color: #294782;
  font-size: 0.8rem;
  margin-top: 6px;
  font-style: italic;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Save Button */
.save-btn {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .edit-btn,
  .save-btn {
    width: 100%;
    justify-content: center;
  }
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Categories Display */
.categories-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  background: #f8fafc;
  min-height: 60px;
}

.category-tag {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
}

@media (max-width: 480px) {
  .category-tag {
    padding: 5px 10px;
    font-size: 0.75rem;
  }
}

.no-categories {
  padding: 16px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
  color: #6b7280;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
}

/* Certificate Display */
.certificate-display {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 12px;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .certificate-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .certificate-link {
    align-self: flex-end;
  }
}

.certificate-display i.fa-file-pdf {
  font-size: 1.4rem;
  color: #ef4444;
}

.certificate-display span {
  flex: 1;
  font-weight: 600;
  color: #0369a1;
  min-width: 120px;
}

.certificate-link {
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.certificate-link:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* Enhanced Toast Notifications */
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
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  max-width: 360px;
  pointer-events: all;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.toast--success {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.toast--error {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.toast--info {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.toast-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-message {
  font-size: 0.9rem;
  line-height: 1.4;
}

.toast-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.5);
  animation: progress 5s linear forwards;
}

@keyframes progress {
  to { width: 100%; }
}

.toast-bounce-enter-active {
  animation: bounceIn 0.6s;
}

.toast-bounce-leave-active {
  animation: bounceOut 0.6s;
}

@keyframes bounceIn {
  0% { transform: translateX(100%) scale(0.3); opacity: 0; }
  50% { transform: translateX(-30px) scale(1.05); }
  70% { transform: translateX(15px) scale(0.9); }
  100% { transform: translateX(0) scale(1); opacity: 1; }
}

@keyframes bounceOut {
  0% { transform: translateX(0) scale(1); opacity: 1; }
  20% { transform: translateX(-20px) scale(1.05); }
  100% { transform: translateX(100%) scale(0.3); opacity: 0; }
}

/* Mobile Padding Margin Adjustments */
@media (max-width: 480px) {
  .profile-section {
    margin: 8px;
    border-radius: 16px;
  }

  .profile-header {
    padding: 16px;
  }

  .title-gradient {
    font-size: 1.6rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>