<template>
  <div class="forgot-page">
    <div class="forgot-card">
      <h2>Reset Password</h2>
      <p class="subtitle">
        Enter your registered email and set a new password.
      </p>

      <form class="form" @submit.prevent="resetPassword">
        <input
          v-model="email"
          type="email"
          placeholder="Registered Email"
          required
        />
        <input
          v-model="newPassword"
          type="password"
          placeholder="New Password"
          required
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm New Password"
          required
        />

        <button type="submit" class="btn">Reset Password</button>
        <p class="back-text">
          Remembered your password?
          <span @click="goToLogin">Go back to Login</span>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

function getUsers() {
  return JSON.parse(localStorage.getItem("providers") || "[]");
}
function saveUsers(users) {
  localStorage.setItem("providers", JSON.stringify(users));
}

function resetPassword() {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.email === email.value);

  if (userIndex === -1) {
    alert("❌ No provider found with this email.");
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert("Passwords do not match.");
    return;
  }

  users[userIndex].password = newPassword.value;
  saveUsers(users);

  alert("✅ Password reset successful! Please login again.");
  router.push("/login");
}

function goToLogin() {
  router.push("/login");
}
</script>

<style scoped>
.forgot-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #93c5fd, #a7f3d0);
  font-family: "Poppins", sans-serif;
  padding: 2rem;
}

.forgot-card {
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

h2 {
  color: #2563eb;
  font-weight: 700;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 15px;
}

.btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.btn:hover {
  background: #1d4ed8;
}

.back-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #374151;
}

.back-text span {
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
}
</style>
