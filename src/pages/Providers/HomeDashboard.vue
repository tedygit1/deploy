<!-- src/pages/Providers/HomeDashboard.vue -->
<template>
  <div class="home-dashboard">
    <h2 class="title">Welcome back, {{ provider?.fullname }} 👋</h2>
    <p class="subtitle">Here’s your business summary and recent activity</p>

    <!-- Top Stats -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.title">
        <div class="icon">{{ stat.icon }}</div>
        <div>
          <h3>{{ stat.value }}</h3>
          <p>{{ stat.title }}</p>
        </div>
      </div>
    </div>

    <!-- Insights -->
    <div class="overview-grid">
      <div class="overview-card bookings">
        <h3>Upcoming Bookings</h3>
        <ul>
          <li v-for="b in upcomingBookings" :key="b.id">
            <strong>{{ b.client }}</strong>
            <span class="booking-date">{{ b.date }}</span>
          </li>
        </ul>
      </div>

      <div class="overview-card performance">
        <h3>Performance Overview</h3>
        <div class="progress-wrap">
          <p>Earnings Goal</p>
          <div class="progress-bar">
            <div class="progress" :style="{ width: earningsProgress + '%' }"></div>
          </div>
          <span class="progress-value">{{ earningsProgress }}%</span>
        </div>
      </div>
    </div>

    <!-- Recent Messages -->
    <div class="messages-section">
      <h3>Recent Messages</h3>
      <div v-if="messages.length === 0" class="empty">No messages yet</div>
      <div v-else class="msg-card" v-for="m in messages" :key="m.id">
        <p><strong>{{ m.from }}</strong>: {{ m.content }}</p>
        <span class="muted">{{ m.date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// ✅ Receive provider from parent (Dashboard.vue)
const props = defineProps({
  provider: {
    type: Object,
    default: () => ({ fullname: 'Provider' })
  }
});

// Static demo data (no API calls needed here)
const stats = ref([
  { title: "Total Bookings", value: 23, icon: "📘" },
  { title: "Completed", value: 19, icon: "✅" },
  { title: "Active Services", value: 5, icon: "🧰" },
  { title: "Earnings ($)", value: "1,250", icon: "💰" },
]);

const upcomingBookings = ref([
  { id: 1, client: "Alice", date: "Nov 2, 2025" },
  { id: 2, client: "Mark", date: "Nov 5, 2025" },
]);

const earningsProgress = ref(68);

const messages = ref([
  { id: 1, from: "Sara", content: "Thanks for your great service!", date: "Oct 27, 2025" },
  { id: 2, from: "David", content: "Can we reschedule my booking?", date: "Oct 26, 2025" },
]);

// Animate stats
onMounted(() => {
  stats.value.forEach((stat) => {
    let count = 0;
    if (!isNaN(stat.value)) {
      const target = Number(stat.value.toString().replace(/,/g, ""));
      const interval = setInterval(() => {
        count += Math.ceil(target / 50);
        if (count >= target) {
          count = target;
          clearInterval(interval);
        }
        stat.value = count.toLocaleString();
      }, 20);
    }
  });
});
</script>

<style scoped>
/* Your existing styles — no change needed */
.title {
  font-size: 1.9rem;
  font-weight: 700;
  color: #003366;
}
.subtitle {
  color: #666;
  margin-bottom: 2rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: linear-gradient(135deg, #f0f8ff, #d6e4ff);
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
.stat-card .icon {
  font-size: 2.2rem;
}
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.overview-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.overview-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}
.bookings ul {
  list-style: none;
  padding: 0;
}
.bookings li {
  padding: 0.6rem 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  font-weight: 500;
}
.booking-date {
  font-size: 0.85rem;
  color: #555;
}
.progress-wrap {
  margin-top: 1rem;
  position: relative;
}
.progress-bar {
  background: #eee;
  height: 12px;
  border-radius: 12px;
  overflow: hidden;
  margin: 0.6rem 0;
}
.progress {
  background: #0077ff;
  height: 100%;
  border-radius: 12px;
  transition: width 1s ease-in-out;
}
.progress-value {
  font-weight: 600;
  color: #0077ff;
  margin-left: 0.4rem;
}
.messages-section {
  margin-top: 2rem;
}
.msg-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}
.msg-card:hover {
  transform: translateX(5px);
}
.muted {
  color: #888;
  font-size: 0.85rem;
}
.empty {
  color: #777;
}
</style>