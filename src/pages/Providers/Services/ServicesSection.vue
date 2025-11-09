<template>
  <div class="services-section">

    <!-- Header -->
    <div class="header-row">
      <div>
        <h1>Your Services</h1>
        <p class="subtitle">Manage and showcase the services you offer to customers.</p>
      </div>
      <div class="header-actions">
        <button class="btn primary" @click="toggleForm">
          <i class="fa-solid fa-plus"></i> {{ showForm ? 'Close Form' : 'Add Service' }}
        </button>
      </div>
    </div>

    <!-- Inline Add/Edit Form -->
    <ServiceForm
      v-if="showForm"
      :service="editingService"
      @save="handleSave"
      @close="closeForm"
    />

    <!-- Services List / Cards -->
    <div v-if="services.length" class="grid">
      <ServiceCard
        v-for="service in services"
        :key="service._id"
        :service="service"
        :editable="true"
        @edit="editService"
        @delete="deleteService"
        @book="openBooking(service)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-card">
        <i class="fa-solid fa-briefcase"></i>
        <h3>No services yet</h3>
        <p>Create your first service so customers can find and book you.</p>
        <button class="btn primary" @click="showForm = true">
          <i class="fa-solid fa-plus"></i> Create Service
        </button>
      </div>
    </div>

    <!-- Booking Modal -->
    <BookingModel
      v-if="showBooking"
      :service="selectedService"
      @close="showBooking = false"
    />

  </div>
</template>

<script>
import ServiceCard from './ServiceCard.vue'
import ServiceForm from './ServiceForm.vue'
import BookingModel from './BookingModel.vue'
import http from "@/api";

export default {
  components: { ServiceCard, ServiceForm, BookingModel },

  data() {
    return {
      showForm: false,
      editingService: null,
      showBooking: false,
      selectedService: null,
      providerId: null, // ✅ Start as null
      services: []
    }
  },

  methods: {
    async fetchServices() {
      const id = localStorage.getItem("provider_id");
      if (!id) {
        console.warn("No provider_id in localStorage. Redirecting to login...");
        this.$router.push("/login");
        return;
      }
      this.providerId = id; // ✅ Always refresh from localStorage

      try {
        const res = await http.get(`/services/provider/${this.providerId}`);
        this.services = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error("Error fetching services:", err);
        alert("Failed to load services. Please log in again.");
        this.$router.push("/login");
      }
    },

    toggleForm() {
      this.showForm = !this.showForm;
      this.editingService = null;
    },

    handleSave(savedService) {
      const idx = this.services.findIndex(s => s._id === savedService._id);
      if (idx !== -1) {
        this.services.splice(idx, 1, savedService);
      } else {
        this.services.unshift(savedService);
      }
      this.closeForm();
    },

    closeForm() {
      this.showForm = false;
      this.editingService = null;
    },

    editService(service) {
      this.editingService = { ...service };
      this.showForm = true;
    },

    async deleteService(id) {
      if (!confirm("Are you sure you want to delete this service?")) return;
      try {
        await http.delete(`/services/${id}`);
        this.services = this.services.filter(s => s._id !== id);
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Could not delete service. Please try again.");
      }
    },

    openBooking(service) {
      this.selectedService = service;
      this.showBooking = true;
    }
  },

  mounted() {
    this.fetchServices(); // ✅ Now fetches fresh provider_id
  }
}
</script>

<style scoped>
.services-section {
  max-width: 1200px;
  margin: 24px auto;
  padding: 20px;
  background: #f7faf9;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(16,24,40,0.04);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.header-row h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #0f172a;
}

.subtitle {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background: #22c55e;
  color: white;
  border: none;
}
.btn.primary:hover {
  background: #16a34a;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
  margin-top: 18px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-card {
  display: inline-block;
  text-align: center;
  background: white;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(2,6,23,0.04);
}

.empty-card i {
  font-size: 36px;
  color: #22c55e;
  margin-bottom: 10px;
}
</style>
