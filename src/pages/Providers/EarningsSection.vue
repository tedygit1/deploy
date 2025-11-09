<template>
  <div class="earnings-section">
    <h2 class="title">💰 Earnings Overview</h2>
    <p class="subtitle">Track your income, payments & financial growth</p>

    <!-- Summary Cards -->
    <div class="earnings-summary">
      <div v-for="(card, index) in summaryCards" :key="index" class="summary-card">
        <h3>{{ card.title }}</h3>
        <p class="amount">{{ formatETB(card.value) }}</p>
      </div>
    </div>

    <!-- Earnings Table -->
    <div class="table-wrapper">
      <table class="earnings-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Service</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="e in earnings" :key="e.id">
            <td>{{ e.date }}</td>
            <td>{{ e.client }}</td>
            <td>{{ e.service }}</td>
            <td>{{ formatETB(e.amount) }}</td>
            <td :class="['status-badge', e.status.toLowerCase()]">{{ e.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="earnings.length === 0" class="empty-state">
      <p>No earnings recorded yet 📭</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

/* ===========
   STATE
=============*/
const earnings = ref([]);

const summaryCards = ref([
  { title: "Total Earnings", value: 0 },
  { title: "This Month", value: 0 },
  { title: "Pending Payments", value: 0 },
]);

/* ===========
   HELPERS
=============*/
function formatETB(value) {
  return `${value.toLocaleString()} ETB`;
}

/* ===========
   MOCK DATA — replace later with API
=============*/
onMounted(() => {
  earnings.value = [
    { id: 1, date: "Oct 25", client: "Sara", service: "massaging", amount: 500, status: "Paid" },
    { id: 2, date: "Oct 20", client: "Dawit", service: "male hair ", amount: 900, status: "Paid" },
    { id: 3, date: "Oct 18", client: "Mekdes", service: "Maintenance", amount: 800, status: "Pending" },
  ];

  const total = earnings.value.reduce((sum, e) => sum + e.amount, 0);
  const pending = earnings.value
    .filter(e => e.status === "Pending")
    .reduce((sum, e) => sum + e.amount, 0);

  summaryCards.value = [
    { title: "Total Earnings", value: total },
    { title: "This Month", value: 3400 },
    { title: "Pending Payments", value: pending },
  ];
});
</script>

<style scoped>
.earnings-section {
  padding: 1rem 1.5rem;
  font-family: "Poppins", sans-serif;
}

.title {
  font-size: 1.9rem;
  font-weight: 700;
  color: #1e40af;
}

.subtitle {
  color: #64748b;
  margin-bottom: 1.8rem;
}

/* SUMMARY CARDS */
.earnings-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  padding: 1.4rem;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.06);
  transition: 0.3s;
  border-top: 4px solid #3b82f6;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08);
}

.amount {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0077ff;
  margin-top: 0.4rem;
}

/* TABLE */
.table-wrapper {
  overflow-x: auto;
}

.earnings-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.earnings-table th {
  background: #eff6ff;
  color: #1e3a8a;
  font-weight: 600;
  padding: 0.9rem;
}

.earnings-table td {
  padding: 0.85rem;
  border-bottom: 1px solid #e5e7eb;
}

/* STATUS BADGES */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: capitalize;
  font-size: 0.85rem;
}

.status-badge.paid {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background: #fff3cd;
  color: #a16207;
}

/* EMPTY STATE */
.empty-state {
  margin-top: 2rem;
  text-align: center;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  color: #8091a7;
  font-size: 1rem;
}
</style>
