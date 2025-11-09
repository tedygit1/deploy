<template>
  <div class="settings-section">
    <h2 class="title">Settings</h2>
    <p class="subtitle">Manage your account preferences</p>

    <!-- Account Privacy -->
    <div class="setting-card">
      <h3>Account Privacy</h3>
      <label>
        <input type="checkbox" v-model="settings.publicProfile" /> Public Profile
      </label>
    </div>

    <!-- Notifications -->
    <div class="setting-card">
      <h3>Notifications</h3>
      <label>
        <input type="checkbox" v-model="settings.emailNotif" /> Email Notifications
      </label>
      <label>
        <input type="checkbox" v-model="settings.smsNotif" /> SMS Notifications
      </label>
    </div>

    <!-- Change Password -->
    <div class="setting-card">
      <h3>Change Password</h3>
      <input type="password" v-model="newPassword" placeholder="New Password" />
      <button class="btn primary" @click="changePassword">Update Password</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const settings = ref({
  publicProfile: true,
  emailNotif: true,
  smsNotif: false,
});
const newPassword = ref("");

function changePassword() {
  if (!newPassword.value) {
    alert("Enter new password");
    return;
  }
  alert("Password updated successfully!");
  newPassword.value = "";
}
</script>

<style scoped>
.settings-section {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  font-family: "Poppins", sans-serif;
}

.title {
  font-size: 1.8rem;
  color: #0077ff;
  text-align: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 1.5rem;
}

.setting-card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.setting-card h3 {
  margin: 0;
  color: #003366;
  font-weight: 600;
}

label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #444;
  font-weight: 500;
}

input[type="password"] {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 1rem;
  margin-top: 0.4rem;
}

.btn.primary {
  margin-top: 0.8rem;
  background: #0077ff;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn.primary:hover {
  background: #005fd1;
}
</style>
