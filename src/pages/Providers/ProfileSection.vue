<template>
  <div class="profile-section">
    <!-- Header with Notification Icon -->
    <div class="profile-header">
      <h2>Manage Your Profile</h2>
      <div class="header-right">
        <!-- Notification Bell -->
        <button class="notif-btn">
          <i class="fa-solid fa-bell"></i>
          <span v-if="notificationCount > 0" class="notif-count">{{ notificationCount }}</span>
        </button>
        <!-- Edit Mode Toggle -->
        <button @click="editMode = !editMode" class="edit-btn">
          <i class="fa-solid fa-pen"></i>
        </button>
      </div>
    </div>

    <div class="profile-content">
      <!-- Left: Clickable Profile Picture -->
      <div class="profile-picture-wrapper">
        <div class="profile-picture" @click="triggerFileInput">
          <img v-if="profileImage" :src="profileImage" alt="Profile Picture" />
          <div v-else class="placeholder">
            <i class="fa-solid fa-user"></i>
          </div>
          <button class="edit-icon">
            <i class="fa-solid fa-pen"></i>
          </button>
          <input type="file" ref="fileInput" @change="onFileChange" />
        </div>
      </div>

      <!-- Right: Profile Info -->
      <div class="profile-info">
        <!-- Personal Info -->
        <h3>Personal Info</h3>
        <div class="field">
          <label>Full Name:</label>
          <input v-model="fullname" :disabled="!editMode" />
        </div>
        <div class="field">
          <label>Email:</label>
          <input v-model="email" :disabled="!editMode" />
        </div>
        <div class="field">
          <label>Phone:</label>
          <input v-model="phonenumber" :disabled="!editMode" />
        </div>
        <div class="field">
          <label>Location:</label>
          <input v-model="location" :disabled="!editMode" />
        </div>
        <div class="field">
          <label>FIN:</label>
          <input v-model="FIN" :disabled="!editMode" />
        </div>
        <div class="field">
          <label>Work Experience:</label>
          <textarea v-model="workExperience" :disabled="!editMode" rows="3"></textarea>
        </div>

        <!-- Save Button -->
        <button v-if="editMode" class="save-btn" @click="saveProfile">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/api/index.js";

export default {
  data() {
    return {
      // Profile fields
      fullname: '',
      email: '',
      phonenumber: '',
      location: '',
      FIN: '',
      workExperience: '',
      
      // Image
      profileImage: null,
      imageFile: null,
      
      // UI
      editMode: false,
      notificationCount: 0,
      loading: false,
      
      // Auth
      providerId: null,
    };
  },

  async mounted() {
    await this.loadProfile();
  },

  methods: {
    async loadProfile() {
      this.loading = true;
      try {
        // ✅ Get providerId from loggedProvider (source of truth)
        const loggedProvider = JSON.parse(localStorage.getItem("loggedProvider") || "{}");
        this.providerId = loggedProvider._id;

        // ✅ Fetch full profile
        const res = await http.get("/users/profile");
        const profile = res.data;

        // ✅ Map ALL registration fields
        this.fullname = profile.fullname || '';
        this.email = profile.email || '';
        this.phonenumber = profile.phonenumber || '';
        this.location = profile.location || '';
        this.FIN = profile.FIN || '';
        this.workExperience = profile.workExperience || '';
        this.profileImage = profile.profileImage || profile.avatar || null;

      } catch (err) {
        console.error("Profile load failed:", err);
        alert("Could not load your profile. Please log in again.");
        this.$router.push("/login");
      } finally {
        this.loading = false;
      }
    },

    triggerFileInput() {
      if (this.editMode) {
        this.$refs.fileInput.click();
      }
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    async saveProfile() {
      if (!this.fullname?.trim()) {
        alert("Full name is required.");
        return;
      }

      try {
        // ✅ Step 1: Upload image if selected
        if (this.imageFile) {
          const formData = new FormData();
          formData.append("photo", this.imageFile);

          // ✅ Use endpoint WITHOUT ID (recommended)
          await http.patch("/users/upload-photo", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          // Refresh profile to get new image URL
          await this.loadProfile();
        }

        // ✅ Step 2: Save profile fields
        const payload = {
          fullname: this.fullname,
          email: this.email,
          phonenumber: this.phonenumber,
          location: this.location,
          FIN: this.FIN,
          workExperience: this.workExperience,
        };

        await http.put("/users/profile", payload);

        alert("✅ Profile updated successfully!");
        this.editMode = false;
        await this.loadProfile();

      } catch (err) {
        const errorMsg = err.response?.data?.message || "Failed to update profile";
        console.error("Save error:", errorMsg);
        alert(`❌ ${errorMsg}`);
      }
    },
  },
};
</script>

<style scoped>
/* Keep all your existing styles */
.profile-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-right {
  display: flex;
  gap: 15px;
  align-items: center;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.notif-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  color: #333;
}

.notif-count {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: red;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  border-radius: 50%;
  padding: 2px 6px;
}

.profile-content {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.profile-picture-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: start;
}

.profile-picture {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  cursor: pointer;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  font-size: 3rem;
  color: #aaa;
}

.edit-icon {
  position: absolute;
  bottom: -10px;
  right: -10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  font-size: 1rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.profile-picture input[type="file"] {
  display: none;
}

.profile-info {
  flex: 2;
  min-width: 300px;
}

.profile-info h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 1.2rem;
  color: #333;
}

.field {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}

.field label {
  min-width: 150px;
  font-weight: bold;
}

.field input[type="text"],
.field input[type="email"],
.field textarea {
  flex: 1;
  padding: 6px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.save-btn {
  margin-top: 20px;
  padding: 10px 20px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
}
</style>