<template>
  <div class="analytics-section">
    <h2 class="title">📊 Analytics Overview</h2>
    <p class="subtitle">Visual insights into your service performance</p>

    <!-- Chart Placeholder -->
    <div class="chart-placeholder">
      <span v-if="!chartLoaded">Chart visualization coming soon…</span>
      <!-- Later: ApexCharts or Chart.js will be injected here -->
    </div>

    <!-- Analytics Summary Cards -->
    <div class="analytics-cards">
      <div class="analytic-card top-service">
        <h3>Top Service</h3>
        <p>{{ analytics.topService }}</p>
      </div>

      <div class="analytic-card satisfaction">
        <h3>Customer Satisfaction</h3>
        <p>{{ animatedSatisfaction }}%</p>
      </div>

      <div class="analytic-card response-time">
        <h3>Avg Response Time</h3>
        <p>{{ analytics.responseTime }} hrs</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

/* ---------------------------------------
 ✅ Analytics Data (Dynamic Backend-Ready)
--------------------------------------- */
const analytics = ref({
  topService: "Loading...",
  satisfaction: 0,
  responseTime: 0,
});

const animatedSatisfaction = ref(0);

const chartLoaded = ref(false);

/* ---------------------------------------
 ✅ Animate Satisfaction Percentage
--------------------------------------- */
function animateSatisfaction(target) {
  let current = 0;
  const step = Math.ceil(target / 40);

  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    animatedSatisfaction.value = current;
  }, 20);
}

/* ---------------------------------------
 ✅ Fetch Analytics Data (Backend Ready)
--------------------------------------- */
async function fetchAnalytics() {
  try {
    // When backend is ready, uncomment:
    // const token = localStorage.getItem("provider_token");
    // const res = await axios.get(
    //   "https://your-backend-url/analytics",
    //   { headers: { Authorization: `Bearer ${token}` } }
    // );
    // const data = res.data;

    // ✅ TEMP Demo Data (until backend is ready)
    const data = {
      topService: "Electrical Maintenance",
      satisfaction: 94,
      responseTime: 2,
    };

    analytics.value = data;

    // ✅ Trigger animation
    animateSatisfaction(data.satisfaction);

  } catch (error) {
    console.error("Failed to load analytics:", error);
  }
}

onMounted(() => {
  fetchAnalytics();

  // Future: When real chart loads from ApexCharts/ChartJs
  setTimeout(() => {
    chartLoaded.value = true;
  }, 800);
});
</script>

<style scoped>
.analytics-section {
  padding: 1rem;
  color: #1e293b;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.3rem;
}

.subtitle {
  color: #64748b;
  margin-bottom: 1.5rem;
}

/* ----- Chart Placeholder ----- */
.chart-placeholder {
  height: 280px;
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  color: #475569;
  font-style: italic;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
}

/* ----- Analytics Cards Grid ----- */
.analytics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
}

.analytic-card {
  background: white;
  border-radius: 14px;
  padding: 1.2rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border-top: 4px solid transparent;
}

.analytic-card h3 {
  font-size: 1.1rem;
  color: #334155;
  margin-bottom: 0.4rem;
}

.analytic-card p {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.analytic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.top-service { border-top-color: #3b82f6; }
.satisfaction { border-top-color: #10b981; }
.response-time { border-top-color: #f59e0b; }
</style>
