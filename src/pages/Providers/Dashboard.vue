<!-- src/pages/Providers/Dashboard.vue -->
<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="dashboard-sidebar">
      <div class="sidebar-top">
        <h2 class="sidebar-title">Provider Dashboard</h2>

        <!-- Welcome Message -->
        <div class="welcome-message" v-if="provider">
          Welcome back, {{ provider.fullname }} 👋
        </div>

        <ul class="sidebar-menu">
          <li @click="goTo('home')" :class="{ active: activeTab === 'home' }">Home</li>
          <li @click="goTo('profile')" :class="{ active: activeTab === 'profile' }">My Profile</li>
          <li @click="goTo('services')" :class="{ active: activeTab === 'services' }">My Services</li>
          <li @click="goTo('bookings')" :class="{ active: activeTab === 'bookings' }">Bookings</li>
          <li @click="goTo('earnings')" :class="{ active: activeTab === 'earnings' }">Earnings</li>
          <li @click="goTo('messages')" :class="{ active: activeTab === 'messages' }">Messages</li>
          <li @click="goTo('analytics')" :class="{ active: activeTab === 'analytics' }">Analytics</li>
          <li @click="goTo('reviews')" :class="{ active: activeTab === 'reviews' }">Reviews</li>
          <li @click="goTo('settings')" :class="{ active: activeTab === 'settings' }">Settings</li>
        </ul>
      </div>

      <div class="sidebar-bottom">
        <button @click="logout" :disabled="loggingOut" class="logout-btn">
          <span v-if="!loggingOut">Logout</span>
          <span v-else>Logging out...</span>
        </button>
      </div>
    </aside>

    <!-- Main Dynamic Content -->
    <main class="dashboard-main">
      <component :is="currentView" :provider="provider" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import http from "@/api/index.js";

// Components
import HomeDashboard from "./HomeDashboard.vue";
import ProfileSection from "./ProfileSection.vue";
import ServicesSection from "./Services/ServicesSection.vue";
import BookingsSection from "./BookingsSection.vue";
import EarningsSection from "./EarningsSection.vue";
import MessagesSection from "./MessagesSection.vue";
import AnalyticsSection from "./AnalyticsSection.vue";
import ReviewsSection from "./ReviewsSection.vue";
import SettingsSection from "./SettingsSection.vue";

const router = useRouter();
const activeTab = ref("home");
const loggingOut = ref(false);
const provider = ref(null);

const viewMap = {
  home: HomeDashboard,
  profile: ProfileSection,
  services: ServicesSection,
  bookings: BookingsSection,
  earnings: EarningsSection,
  messages: MessagesSection,
  analytics: AnalyticsSection,
  reviews: ReviewsSection,
  settings: SettingsSection,
};

const currentView = computed(() => viewMap[activeTab.value]);

function goTo(tab) {
  activeTab.value = tab;
}

async function logout() {
  loggingOut.value = true;
  localStorage.removeItem("provider_token");
  localStorage.removeItem("loggedProvider");
  localStorage.removeItem("provider_id");
  await router.push({ name: "Login" });
  loggingOut.value = false;
}

async function fetchProvider() {
  const token = localStorage.getItem("provider_token");
  if (!token) return router.push({ name: "Login" });

  try {
    const res = await http.get("/users/profile");
    provider.value = res.data;
    if (res.data._id) {
      localStorage.setItem("provider_id", res.data._id);
    }
  } catch (err) {
    console.error("Profile load failed:", err);
    localStorage.removeItem("provider_token");
    localStorage.removeItem("provider_id");
    router.push({ name: "Login" });
  }
}

onMounted(() => {
  fetchProvider();
});
</script>

<style scoped>
/* Your existing styles — no change needed */
.dashboard-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
}
.dashboard-sidebar {
  width: 240px;
  background: linear-gradient(180deg, #0056cc, #0077ff);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.8rem 1rem;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}
.sidebar-top {
  overflow-y: auto;
}
.sidebar-title {
  text-align: center;
  font-size: 1.6rem;
  margin-bottom: 1rem;
}
.welcome-message {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  color: #fff;
}
.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-menu li {
  padding: 0.7rem 1rem;
  border-radius: 6px;
  margin: 0.4rem 0;
  cursor: pointer;
  transition: background 0.3s;
}
.sidebar-menu li.active,
.sidebar-menu li:hover {
  background: rgba(255, 255, 255, 0.25);
}
.sidebar-bottom {
  margin-top: auto;
  text-align: center;
}
.logout-btn {
  background: #ff4d4f;
  color: #fff;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  width: 100%;
}
.dashboard-main {
  flex: 1;
  margin-left: 240px;
  background: #f5f9ff;
  padding: 2rem;
  height: 100vh;
  overflow-y: auto;
}
</style>