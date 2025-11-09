<template>
  <div class="bookings-section">
    <h2 class="title">📅 Bookings</h2>
    <p class="subtitle">Manage your client bookings efficiently</p>

    <!-- Loading State -->
    <div v-if="loading" class="loading-box">
      <span class="loader"></span>
      <p>Loading bookings...</p>
    </div>

    <!-- No Bookings -->
    <div v-else-if="bookings.length === 0" class="no-bookings">
      <p>No bookings yet 📭</p>
    </div>

    <!-- Bookings List -->
    <div v-else class="booking-list">
      <div
        class="booking-card"
        v-for="(b, i) in bookings"
        :key="i"
      >
        <!-- Header -->
        <div class="booking-header">
          <h3 class="client-name">{{ b.clientName }}</h3>
          <span class="status-badge" :class="b.status.toLowerCase()">
            {{ b.status }}
          </span>
        </div>

        <!-- Details -->
        <div class="booking-details">
          <p><i class="fa fa-calendar"></i> {{ b.date }}</p>
          <p><i class="fa fa-tools"></i> {{ b.service }}</p>
          <p><i class="fa fa-phone"></i> {{ b.phone }}</p>
        </div>

        <!-- Action Buttons -->
        <div v-if="b.status === 'Pending'" class="actions">
          <button class="btn accept" @click="handleStatus(i, 'Accepted')">
            Accept
          </button>
          <button class="btn reject" @click="handleStatus(i, 'Rejected')">
            Reject
          </button>
        </div>

        <!-- Already Handled Status -->
        <div v-else class="handled-message">
          <p>
            <i
              class="fa fa-check-circle"
              v-if="b.status === 'Accepted'"
            ></i>
            <i
              class="fa fa-times-circle"
              v-else
            ></i>
            This booking has been {{ b.status.toLowerCase() }}.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const loading = ref(true);

const bookings = ref([]);

/* ---------------------------------------------------
 ✅ Fetch Bookings (Backend-Ready)
   We will replace dummy data with API when backend is ready.
--------------------------------------------------- */
async function loadBookings() {
  loading.value = true;

  // TODO: Replace with backend API call
  // const token = localStorage.getItem("provider_token");
  // const res = await axios.get("/provider/bookings", {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // bookings.value = res.data;

  // Temporary Demo Data
  bookings.value = [
    { clientName: "Sara H.", date: "Oct 30, 2025", service: "House Wiring", phone: "+251 912 345 678", status: "Pending" },
    { clientName: "Michael A.", date: "Nov 3, 2025", service: "Maintenance", phone: "+251 911 223 344", status: "Accepted" },
    { clientName: "Lidiya T.", date: "Nov 4, 2025", service: "Painting", phone: "+251 910 111 222", status: "Pending" },
    { clientName: "Kebede G.", date: "Nov 5, 2025", service: "AC Installation", phone: "+251 913 222 555", status: "Rejected" },
    { clientName: "Selam A.", date: "Nov 6, 2025", service: "Plumbing Fix", phone: "+251 918 888 000", status: "Pending" },
  ];

  loading.value = false;
}

/* ---------------------------------------------------
 ✅ Update Booking Status (Backend Ready)
--------------------------------------------------- */
async function handleStatus(index, newStatus) {
  const booking = bookings.value[index];

  if (!confirm(`Mark this booking as ${newStatus}?`)) return;

  const oldStatus = booking.status;
  booking.status = newStatus;

  // TODO: Send to backend when ready
  // try {
  //   await axios.put(
  //     `/provider/bookings/${booking._id}`,
  //     { status: newStatus }
  //   );
  // } catch (error) {
  //   booking.status = oldStatus; // rollback
  // }

  // ✅ Optional: Add toast later
}

onMounted(() => {
  loadBookings();
});
</script>

<style scoped>
.bookings-section {
  padding: 1rem;
  font-family: "Poppins", sans-serif;
}

.title {
  font-size: 1.8rem;
  color: #1e40af;
  font-weight: 700;
}

.subtitle {
  color: #64748b;
  margin-bottom: 1rem;
}

/* Loading */
.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.loader {
  width: 26px;
  height: 26px;
  border: 4px solid #c7d2fe;
  border-top-color: #1e40af;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-bottom: 0.7rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Bookings Grid */
.booking-list {
  display: grid;
  gap: 1.2rem;
}

.booking-card {
  background: white;
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.booking-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}

/* Status Badge */
.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background: #fff3cd;
  color: #b45309;
}
.status-badge.accepted {
  background: #d1fae5;
  color: #065f46;
}
.status-badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}

/* Buttons */
.actions {
  display: flex;
  gap: 0.8rem;
}

.btn {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn.accept {
  background: #16a34a;
  color: white;
}
.btn.accept:hover {
  background: #15803d;
}

.btn.reject {
  background: #dc2626;
  color: white;
}
.btn.reject:hover {
  background: #b91c1c;
}

/* Handled Message */
.handled-message {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.9rem;
  color: #475569;
  text-align: center;
  margin-top: 0.5rem;
}

.handled-message i {
  margin-right: 6px;
}

/* Empty State */
.no-bookings {
  text-align: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  color: #64748b;
}
</style>
