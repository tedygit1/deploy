<!-- src/pages/Providers/Services/ServiceSection.vue -->
<template>
  <div class="services-section">
    <!-- Header Section -->
    <div class="section-header">
      <h1 class="section-title">My Services</h1>
      <p class="section-subtitle">Manage your service offerings and availability</p>
    </div>

    <!-- Status Summary Card -->
    <div class="status-summary-card">
      <div class="status-stats">
        <div class="status-stat">
          <div class="stat-icon total">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ services.length }}</span>
            <span class="stat-label">Total Services</span>
          </div>
        </div>
        <div class="status-stat">
          <div class="stat-icon active">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ activeServicesCount }}</span>
            <span class="stat-label">Active</span>
          </div>
        </div>
        <div class="status-stat">
          <div class="stat-icon draft">
            <i class="fa-solid fa-pen-to-square"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ draftServicesCount }}</span>
            <span class="stat-label">Draft</span>
          </div>
        </div>
      </div>
      
      <!-- Controls Bar -->
      <div class="controls-bar">
        <div class="controls-left">
          <div class="search-input">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search services..."
            />
          </div>
          <div class="status-filter">
            <select v-model="statusFilter" class="form-control">
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="draft">Draft Only</option>
            </select>
          </div>
        </div>
        <div class="controls-right">
          <button class="btn debug-btn" @click="debugMode = !debugMode">
            <i class="fa-solid fa-bug"></i> {{ debugMode ? 'Hide Debug' : 'Show Debug' }}
          </button>
          <button class="btn add-service-btn" @click="openForm(null)">
            <i class="fa-solid fa-plus"></i> Add New Service
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      <i class="fa-solid fa-circle-exclamation"></i>
      <span>{{ errorMessage }}</span>
      <button class="close-error" @click="errorMessage = ''">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="success-message">
      <i class="fa-solid fa-circle-check"></i>
      <span>{{ successMessage }}</span>
      <button class="close-success" @click="successMessage = ''">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Loading your services...</p>
      <p v-if="debugMode" class="debug-info">Fetching from backend...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="services.length === 0" class="empty-state">
      <i class="fa-solid fa-box-open"></i>
      <h3>No services found</h3>
      <p>You haven't added any services yet.<br />Start by creating your first service!</p>
      <button class="btn primary-btn" @click="openForm(null)">Create Service</button>
    </div>

    <!-- Services Grid -->
    <div v-else class="services-grid">
      <div
        v-for="service in filteredServices"
        :key="getServiceKey(service)"
        class="service-card"
        :class="{ 'draft-service': getServiceStatus(service) === 'draft' }"
      >
        <!-- Status Badge -->
        <div class="service-status-badge" :class="getServiceStatus(service)">
          {{ getServiceStatus(service) === 'draft' ? 'Draft' : 'Active' }}
        </div>

        <!-- Banner -->
        <div class="card-banner">
          <img
            v-if="service?.banner"
            :src="service.banner"
            :alt="service?.title || 'Service'"
            class="banner-img"
          />
          <div v-else class="banner-placeholder">
            <i class="fa-solid fa-scissors"></i>
          </div>
        </div>

        <!-- Content -->
        <div class="card-content">
          <!-- View Mode - DEFAULT -->
          <div class="view-mode">
            <div class="card-header">
              <h3 class="service-title">{{ service?.title || 'Untitled Service' }}</h3>
              
              <!-- Category & Subcategories Section -->
              <div class="categories-section">
                <!-- Main Category -->
                <div class="category-tag">
                  {{ getCategoryName(service?.categoryId || service?.category) }}
                </div>
                
                <!-- Subcategories -->
                <div v-if="hasSubcategories(service)" class="subcategories-tags">
                  <span 
                    v-for="subcategory in getSubcategories(service)" 
                    :key="subcategory._id"
                    class="subcategory-tag"
                  >
                    {{ subcategory.name }}
                  </span>
                </div>
              </div>

              <!-- Debug: Show Service ID -->
              <div class="service-id-debug" v-if="debugMode">
                <small>ID: {{ getServiceId(service) || 'No ID' }}</small>
                <small>Status: {{ getServiceStatus(service) }}</small>
              </div>
            </div>
            <p class="service-description">
              {{ service?.description || 'No description available' }}
            </p>
            <!-- 🗑️ REMOVED: Provider Contact Information Section -->
            <div class="service-meta">
              <div class="price">
                <span class="total-price">{{ service?.totalPrice || 0 }} ETB</span>
                <span v-if="service?.bookingPrice" class="booking-price">({{ service.bookingPrice }} ETB deposit)</span>
              </div>
              <div class="payment" v-if="service?.paymentMethod">
                <i class="fa-solid fa-wallet"></i> {{ service.paymentMethod }}
              </div>
            </div>
            <!-- Availability Summary -->
            <div class="availability-summary">
              <template v-if="getServiceStatus(service) === 'active'">
                <span class="availability-badge" :class="{ available: hasAnyRealAvailability(service) }">
                  {{ hasAnyRealAvailability(service) ? 'Available' : 'Not Available' }}
                </span>
                <!-- ✅ UPDATED: Use accurate days count method -->
                <span class="days-count" v-if="hasAnyRealAvailability(service)">
                  ({{ getAccurateAvailableDaysCount(service) }} days)
                </span>
                <!-- Manage Time Slots Button -->
                <div class="manage-slots-section">
                  <button class="btn manage-slots-btn" @click="toggleTimeSlots(service)">
                    <i class="fa-solid fa-calendar-edit"></i> Manage Time Slots
                  </button>
                </div>
              </template>
              <template v-else>
                <!-- DRAFT SERVICE: Add Time Slots Button -->
                <div class="draft-actions">
                  <div class="draft-notice">
                    <i class="fa-solid fa-clock"></i>
                    <span>Add time slots to activate service</span>
                  </div>
                  <button class="btn add-slots-btn" @click="toggleTimeSlots(service)">
                    <i class="fa-solid fa-calendar-plus"></i> Add Time Slots
                  </button>
                </div>
              </template>
            </div>
          </div>

          <!-- Edit Mode - Only show when editing this specific service -->
          <div v-if="editingServiceId === getServiceId(service)" class="edit-mode">
            <div class="edit-header">
              <h3>Edit Service</h3>
              <button class="btn cancel-btn" @click="cancelEdit()">
                Cancel
              </button>
            </div>
            <!-- Title -->
            <div class="form-group">
              <label>Title</label>
              <input
                v-model="editingServiceData.title"
                type="text"
                class="form-control"
                placeholder="Service title"
              />
            </div>
            <!-- Description -->
            <div class="form-group">
              <label>Description</label>
              <textarea
                v-model="editingServiceData.description"
                class="form-control"
                rows="4"
                placeholder="Service description"
              ></textarea>
            </div>
            <!-- Pricing -->
            <div class="form-group">
              <label>Total Price (ETB)</label>
              <input
                v-model.number="editingServiceData.totalPrice"
                type="number"
                class="form-control"
                min="0"
                step="1"
              />
            </div>
            <div class="form-group">
              <label>Booking Deposit (ETB)</label>
              <input
                v-model.number="editingServiceData.bookingPrice"
                type="number"
                class="form-control"
                min="0"
                step="1"
              />
            </div>
            <!-- Payment Method -->
            <div class="form-group">
              <label>Payment Method</label>
              <select v-model="editingServiceData.paymentMethod" class="form-control">
                <option value="">Select payment method</option>
                <option value="Telebirr">Telebirr</option>
                <option value="Chapa">Chapa</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
            <!-- 🗑️ REMOVED: Provider Information Edit Section -->
            <!-- Service Status Display -->
            <div class="form-group">
              <label>Service Status</label>
              <div class="status-display">
                <span class="status-badge" :class="getServiceStatus(editingServiceData)">
                  {{ getServiceStatus(editingServiceData) === 'draft' ? 'Draft' : 'Active' }}
                </span>
                <p class="status-note" v-if="getServiceStatus(editingServiceData) === 'draft'">
                  <i class="fa-solid fa-info-circle"></i>
                  Service will become active when you add time slots
                </p>
              </div>
            </div>
            <!-- Quick Availability Toggle (Simple version) -->
            <div class="form-group">
              <h4>Quick Availability</h4>
              <div class="quick-availability">
                <label class="availability-toggle">
                  <input
                    type="checkbox"
                    :checked="hasAnyRealAvailability(editingServiceData)"
                    @change="toggleQuickAvailability($event.target.checked)"
                  />
                  <span class="toggle-label">Service is available for booking</span>
                </label>
                <p class="availability-note">
                  Use the "Manage Time Slots" button for detailed calendar scheduling
                </p>
              </div>
            </div>
            <!-- Save Button -->
            <div class="edit-actions">
              <button class="btn save-btn" @click="saveService()" :disabled="saving">
                <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Actions - ONLY EDIT AND DELETE -->
        <div class="card-actions">
          <button class="action-btn edit" @click.stop="startEdit(service)" :disabled="!getServiceId(service)">
            <i class="fa-solid fa-pen"></i> 
            Edit {{ getServiceId(service) ? '' : '(No ID)' }}
          </button>
          <button class="action-btn delete" @click.stop="confirmDelete(getServiceId(service), service?.title)" :disabled="!getServiceId(service)">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>

        <!-- ✨ IN-PLACE TIME SLOTS PANEL (slides down below service details) -->
        <transition name="slide-down">
          <div v-if="expandedServiceId === getServiceId(service)" class="time-slots-panel">
            <div class="time-slots-panel-header">
              <h4>
                {{ getServiceStatus(service) === 'draft' ? 'Add Time Slots' : 'Manage Time Slots' }}
              </h4>
              <button class="btn close-panel-btn" @click="closeTimeSlotsPanel()">
                <i class="fa-solid fa-xmark"></i> Close
              </button>
            </div>
            <div class="time-slots-panel-content">
              <TimeSlots 
                :service="service"
                :serviceId="getServiceId(service)"
                @close="closeTimeSlotsPanel"
                @saved="handleTimeSlotsSaved"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Debug Panel -->
    <div v-if="debugMode && !showTimeSlotsModal" class="debug-panel">
      <h4>Debug Information</h4>
      <p>Total Services: {{ services.length }}</p>
      <p>Active Services: {{ activeServicesCount }}</p>
      <p>Draft Services: {{ draftServicesCount }}</p>
      <p>Services with IDs: {{ services.filter(s => getServiceId(s)).length }}</p>
      <p>Loading: {{ loading }}</p>
      <p>Last Error: {{ lastError }}</p>
      <div v-for="(service, index) in services" :key="index">
        Service {{ index }}: "{{ service?.title || 'NULL SERVICE' }}" - 
        ID: {{ getServiceId(service) || 'MISSING' }} - 
        Status: {{ getServiceStatus(service) }}
      </div>
    </div>

    <!-- Service Form Modal -->
    <transition name="modal-fade">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal service-form-modal" @click.stop>
          <div class="modal-header">
            <h2>{{ editingService ? 'Edit Service' : 'Create New Service' }}</h2>
            <button class="close-btn" @click="closeForm" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <ServiceForm
            :service="editingService"
            @save="onServiceSaved"
            @close="closeForm"
          />
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal-fade">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
        <div class="modal delete-modal" @click.stop>
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete "<strong>{{ serviceToDeleteTitle }}</strong>"? This action cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn cancel-btn" @click="showDeleteConfirm = false">Cancel</button>
            <button class="btn delete-btn" @click="deleteService" :disabled="deleting">
              <i v-if="deleting" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-trash"></i>
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ServiceForm from './ServiceForm.vue';
import TimeSlots from './TimeSlots.vue';
import http from "@/api/index.js";

export default {
  name: 'ServiceSection',
  components: { ServiceForm, TimeSlots },
  data() {
    return {
      services: [],
      categories: [],
      loading: false,
      showForm: false,
      editingService: null,
      editingServiceId: null,
      editingServiceData: null,
      searchQuery: '',
      statusFilter: 'all',
      showDeleteConfirm: false,
      serviceToDelete: null,
      serviceToDeleteTitle: '',
      deleting: false,
      saving: false,
      errorMessage: '',
      successMessage: '',
      debugMode: false,
      lastError: null,
      expandedServiceId: null,
      selectedService: null,
      selectedServiceId: null,
      daysOfWeek: [
        { key: 'monday', name: 'monday', label: 'Monday' },
        { key: 'tuesday', name: 'tuesday', label: 'Tuesday' },
        { key: 'wednesday', name: 'wednesday', label: 'Wednesday' },
        { key: 'thursday', name: 'thursday', label: 'Thursday' },
        { key: 'friday', name: 'friday', label: 'Friday' },
        { key: 'saturday', name: 'saturday', label: 'Saturday' },
        { key: 'sunday', name: 'sunday', label: 'Sunday' }
      ]
    };
  },
  computed: {
    filteredServices() {
      let result = this.services.filter(service => service != null);
      if (this.statusFilter !== 'all') {
        result = result.filter(s => this.getServiceStatus(s) === this.statusFilter);
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        result = result.filter(s =>
          (s?.title || '').toLowerCase().includes(q) ||
          (s?.description || '').toLowerCase().includes(q) ||
          this.getCategoryName(s?.categoryId || s?.category).toLowerCase().includes(q) ||
          this.getSubcategoryNames(s).toLowerCase().includes(q) // ✅ ADDED: Search subcategories
        );
      }
      return result;
    },
    activeServicesCount() {
      return this.services.filter(s => this.getServiceStatus(s) === 'active').length;
    },
    draftServicesCount() {
      return this.services.filter(s => this.getServiceStatus(s) === 'draft').length;
    }
  },
  async created() {
    await this.fetchCategories();
    await this.fetchServices();
  },
  methods: {
    // ✅ Service Status Detection
    getServiceStatus(service) {
      if (!service) return 'draft';
      if (!service.slots || !Array.isArray(service.slots) || service.slots.length === 0) {
        return 'draft';
      }
      const hasRealSlots = service.slots.some(slot => {
        if (!slot) return false;
        if (slot.weeklySchedule && Array.isArray(slot.weeklySchedule)) {
          return slot.weeklySchedule.some(week => 
            week && 
            week.timeSlots && 
            Array.isArray(week.timeSlots) && 
            week.timeSlots.length > 0
          );
        }
        return false;
      });
      return hasRealSlots ? 'active' : 'draft';
    },
    // ✅ Real Availability Check
    hasAnyRealAvailability(service) {
      return this.getServiceStatus(service) === 'active';
    },
    // ✅ FIXED: ULTRA-ACCURATE Available Days Count
    getAccurateAvailableDaysCount(service) {
      if (!service || !service.slots || !Array.isArray(service.slots)) return 0;
      console.log('🎯 ULTRA-ACCURATE Day Count Analysis for:', service?.title);
      const availableDays = new Set();
      service.slots.forEach(slot => {
        if (slot && slot.weeklySchedule && Array.isArray(slot.weeklySchedule)) {
          slot.weeklySchedule.forEach(daySchedule => {
            // Check if this day should be counted
            if (this.shouldCountDay(daySchedule)) {
              availableDays.add(daySchedule.day);
              console.log(`🎯 COUNTING: ${daySchedule.day} - Working: ${daySchedule.isWorkingDay}, Slots: ${daySchedule.timeSlots?.length}`);
            } else {
              console.log(`🚫 NOT COUNTING: ${daySchedule.day} - Working: ${daySchedule.isWorkingDay}, Slots: ${daySchedule.timeSlots?.length}`);
            }
          });
        }
      });
      const count = availableDays.size;
      console.log(`🎯 FINAL ACCURATE COUNT: ${count} days for ${service?.title}`);
      return count;
    },
    // ✅ Helper: Determine if a day should be counted
    shouldCountDay(daySchedule) {
      if (!daySchedule) return false;
      // Day must be explicitly marked as working day
      if (daySchedule.isWorkingDay !== true) return false;
      // Must have time slots
      if (!daySchedule.timeSlots || !Array.isArray(daySchedule.timeSlots)) return false;
      // Must have at least one available time slot
      return daySchedule.timeSlots.some(slot => 
        slot && slot.isAvailable === true
      );
    },
    // ✅ Keep old method for backward compatibility
    getAvailableDaysCount(service) {
      // Use the ultra-accurate method
      return this.getAccurateAvailableDaysCount(service);
    },
    // ✅ Toggle Time Slots Panel (in-place expansion)
    toggleTimeSlots(service) {
      console.log('🚀 Toggling Time Slots for:', service?.title);
      // Debug current availability before opening
      const accurateCount = this.getAccurateAvailableDaysCount(service);
      console.log(`📊 Accurate days count: ${accurateCount}`);
      const serviceId = this.getServiceId(service);
      if (this.expandedServiceId === serviceId) {
        this.closeTimeSlotsPanel();
      } else {
        this.expandedServiceId = serviceId;
        this.selectedService = service;
        this.selectedServiceId = serviceId;
      }
    },
    closeTimeSlotsPanel() {
      this.expandedServiceId = null;
      this.selectedService = null;
      this.selectedServiceId = null;
    },
    // ✅ Handle time slots saved
    async handleTimeSlotsSaved(result) {
      console.log('🔄 Time slots saved successfully');
      try {
        await this.fetchServices();
        this.showNotification('Time slots saved successfully!', 'success');
      } catch (error) {
        console.error('❌ Error handling time slots save:', error);
        this.showNotification('Time slots saved successfully!', 'success');
      } finally {
        this.closeTimeSlotsPanel();
      }
    },
    // Notification helper method
    showNotification(message, type = 'info') {
      const notificationEl = document.createElement('div');
      notificationEl.className = `global-notification global-notification-${type}`;
      notificationEl.textContent = message;
      notificationEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#dc2626' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 400px;
        word-wrap: break-word;
      `;
      document.body.appendChild(notificationEl);
      setTimeout(() => {
        if (document.body.contains(notificationEl)) {
          document.body.removeChild(notificationEl);
        }
      }, 4000);
    },
    // Service ID methods
    getServiceId(service) {
      if (!service) return null;
      return service.serviceId || service._id || service.id || null;
    },
    getServiceKey(service) {
      if (!service) return Math.random();
      return this.getServiceId(service) || service.title || Math.random();
    },
    setError(message) {
      this.errorMessage = message;
      this.lastError = message;
      setTimeout(() => { this.errorMessage = ''; }, 5000);
    },
    setSuccess(message) {
      this.successMessage = message;
      setTimeout(() => { this.successMessage = ''; }, 3000);
    },
    closeForm() {
      this.showForm = false;
      this.editingService = null;
    },
    async fetchCategories() {
      try {
        const res = await http.get("/categories");
        this.categories = res.data;
      } catch (err) {
        console.warn("Failed to load categories for display");
      }
    },
    getCategoryName(idOrName) {
      if (!idOrName) return "Uncategorized";
      if (typeof idOrName === 'string' && /[a-zA-Z]/.test(idOrName)) {
        return idOrName;
      }
      const cat = this.categories.find(c => c._id === idOrName);
      return cat ? cat.name : "Unknown";
    },
    // ✅ NEW: Check if service has subcategories
    // ✅ NEW: Check if service has subcategories (array of strings)
hasSubcategories(service) {
  if (!service) return false;
  return Array.isArray(service.subcategories) && 
         service.subcategories.length > 0 &&
         service.subcategories[0] && typeof service.subcategories[0] === 'string';
},

// ✅ NEW: Get subcategories as simple strings
getSubcategories(service) {
  if (!service || !Array.isArray(service.subcategories)) {
    return [];
  }
  return service.subcategories.filter(name => name && typeof name === 'string');
},

// ✅ NEW: Get subcategory names as string (for search)
getSubcategoryNames(service) {
  return this.getSubcategories(service).join(', ');
},
    // ✅ NEW: Get subcategories array
    getSubcategories(service) {
      if (!service || !service.subcategories || !Array.isArray(service.subcategories)) {
        return [];
      }
      return service.subcategories.filter(sub => sub && sub.name);
    },
    // ✅ NEW: Get subcategory names as string (for search/filter)
    getSubcategoryNames(service) {
      const subcategories = this.getSubcategories(service);
      return subcategories.map(sub => sub.name).join(', ');
    },
    async fetchServices() {
      this.loading = true;
      this.errorMessage = '';
      this.lastError = null;
      try {
        const res = await http.get('/services');
        const servicesData = res.data;
        let processedServices = [];
        if (Array.isArray(servicesData)) {
          processedServices = servicesData.filter(service => 
            service != null && typeof service === 'object'
          );
        } else {
          console.warn('Unexpected services data format:', typeof servicesData);
          processedServices = [];
        }
        this.services = processedServices;
      } catch (err) {
        console.error("Failed to fetch services:", err);
        const errorMsg = err.response?.data?.message || err.message || "Could not load services";
        this.setError(errorMsg);
        this.services = [];
      } finally {
        this.loading = false;
      }
    },
    // Edit methods
    startEdit(service) {
      if (!service) {
        this.setError("Cannot edit service: Service data is missing");
        return;
      }
      const serviceId = this.getServiceId(service);
      if (!serviceId) {
        this.setError("This service cannot be edited (missing service ID).");
        return;
      }
      this.editingServiceData = JSON.parse(JSON.stringify(service));
      this.editingServiceId = serviceId;
      if (!this.editingServiceData.slots) {
        this.editingServiceData.slots = [];
      }
    },
    confirmDelete(serviceId, serviceTitle) {
      if (!serviceId) {
        this.setError("Cannot delete service: No ID found");
        return;
      }
      this.serviceToDelete = serviceId;
      this.serviceToDeleteTitle = serviceTitle || 'this service';
      this.showDeleteConfirm = true;
    },
    async deleteService() {
      if (!this.serviceToDelete) return;
      this.deleting = true;
      try {
        await http.delete(`/services/${this.serviceToDelete}`);
        await this.fetchServices();
        this.showDeleteConfirm = false;
        this.setSuccess("Service deleted successfully!");
      } catch (err) {
        console.error("Failed to delete service:", err);
        const msg = err.response?.data?.message || err.message || "Failed to delete service";
        this.setError(msg);
      } finally {
        this.deleting = false;
        this.serviceToDelete = null;
        this.serviceToDeleteTitle = '';
      }
    },
    async saveService() {
      if (!this.editingServiceData || !this.editingServiceId) {
        this.setError("No service data to save.");
        return;
      }
      this.saving = true;
      try {
        const serviceData = {
          title: String(this.editingServiceData.title || '').trim(),
          description: String(this.editingServiceData.description || '').trim(),
          totalPrice: Math.max(0, Number(this.editingServiceData.totalPrice) || 0),
          bookingPrice: Math.max(0, Number(this.editingServiceData.bookingPrice) || 0),
          paymentMethod: String(this.editingServiceData.paymentMethod || 'Telebirr'),
          serviceType: String(this.editingServiceData.serviceType || 'fixed'),
          priceUnit: String(this.editingServiceData.priceUnit || 'ETB'),
          location: String(this.editingServiceData.location || ''),
          email: String(this.editingServiceData.email || ''),
          phone: String(this.editingServiceData.phone || ''),
          experience: String(this.editingServiceData.experience || '')
        };
        if (this.editingServiceData.categoryId && this.editingServiceData.categoryId.length > 5) {
          serviceData.categoryId = String(this.editingServiceData.categoryId);
        }
        if (this.editingServiceData.slots && Array.isArray(this.editingServiceData.slots)) {
          serviceData.slots = this.editingServiceData.slots;
        } else {
          serviceData.slots = [];
        }
        await http.put(`/services/${this.editingServiceId}`, serviceData);
        this.setSuccess("Service updated successfully!");
        this.editingServiceId = null;
        this.editingServiceData = null;
        await this.fetchServices();
      } catch (err) {
        console.error('Save failed:', err);
        let errorMessage = "Failed to save service";
        if (err.response?.status === 500) {
          errorMessage = "Backend server error. The service might be temporarily unavailable.";
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = "Request timeout. Please try again.";
        } else if (err.response?.data?.message) {
          errorMessage = `Backend error: ${err.response.data.message}`;
        } else if (err.message) {
          errorMessage = `Error: ${err.message}`;
        }
        this.setError(errorMessage);
      } finally {
        this.saving = false;
      }
    },
    openForm(service) {
      this.editingService = service ? { ...service } : null;
      this.showForm = true;
    },
    async onServiceSaved(savedService) {
      await this.fetchServices();
      this.closeForm();
      this.setSuccess("Service saved successfully! Now add time slots to activate it.");
    },
    cancelEdit() {
      this.editingServiceId = null;
      this.editingServiceData = null;
    },
    // Quick availability toggle
    toggleQuickAvailability(isAvailable) {
      if (!this.editingServiceData) return;
      if (isAvailable) {
        if (!this.editingServiceData.slots || this.editingServiceData.slots.length === 0) {
          this.editingServiceData.slots = [{
            dayOfWeek: 'monday',
            slotLabel: 'Default Schedule',
            isActive: true,
            weeklySchedule: [{
              day: 'monday',
              isWorkingDay: true,
              timeSlots: [
                { startTime: "09:00", endTime: "17:00", isAvailable: true }
              ]
            }]
          }];
        }
      } else {
        this.editingServiceData.slots = [];
      }
    }
  }
};
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.services-section {
  padding: 2rem;
  background: #f8fafc;
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
}

/* ===== SECTION HEADER ===== */
.section-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 20px;
}

.section-title {
  font-size: 2.5rem;
  color: #0f172a;
  margin-bottom: 12px;
  font-weight: 800;
  background: linear-gradient(135deg, #0f172a, #334155);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.section-subtitle {
  color: #64748b;
  font-size: 1.2rem;
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

/* ===== STATUS SUMMARY CARD ===== */
.status-summary-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.status-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.status-stat {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.status-stat::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
}

.status-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.stat-icon.total {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #475569;
}

.stat-icon.active {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #16a34a;
}

.stat-icon.draft {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #d97706;
}

.stat-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
  color: #0f172a;
}

.stat-label {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== CONTROLS BAR ===== */
.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.controls-left {
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;
  max-width: 500px;
}

.controls-right {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-input i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  z-index: 2;
}

.search-input input {
  width: 100%;
  padding: 12px 12px 12px 42px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.search-input input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.status-filter {
  min-width: 140px;
}

.status-filter select {
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.status-filter select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.add-service-btn {
  background: linear-gradient(120deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.95rem;
}

.add-service-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.debug-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.debug-btn:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

/* ===== ERROR & SUCCESS MESSAGES ===== */
.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

.success-message {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-error, .close-success {
  background: none;
  border: none;
  color: inherit;
  margin-left: auto;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.close-error:hover, .close-success:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* ===== LOADING STATE ===== */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
}

.loading-state i {
  font-size: 3rem;
  color: #3b82f6;
  margin-bottom: 20px;
}

.loading-state p {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.loading-state .debug-info {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-top: 8px;
  font-style: italic;
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 2px dashed #e2e8f0;
}

.empty-state i {
  font-size: 4rem;
  color: #94a3b8;
  margin-bottom: 24px;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.8rem;
  color: #334155;
  margin-bottom: 16px;
  font-weight: 700;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.1rem;
  line-height: 1.6;
}

.primary-btn {
  background: linear-gradient(120deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.3);
}

/* ===== SERVICES GRID ===== */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px; /* Increased gap for better spacing */
  align-items: start;
}

/* ===== SERVICE CARD - COMPACT & PROFESSIONAL ===== */
.service-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  position: relative;
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-width: 100%;
  /* 👇 NEW: More compact card sizing */
  min-height: 380px;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e1;
}

.service-card.draft-service {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
}

/* ===== CARD BANNER - SMALLER ===== */
.card-banner {
  position: relative;
  height: 120px; /* Reduced from 160px */
  overflow: hidden;
  border-radius: 16px 16px 0 0;
  margin: 0;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.service-card:hover .banner-img {
  transform: scale(1.05);
}

.banner-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #f0fdf4, #dcfce7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
  font-size: 2rem; /* Reduced from 2.5rem */
}

/* ===== SERVICE STATUS BADGE ===== */
.service-status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.service-status-badge.draft {
  background: rgba(254, 243, 199, 0.95);
  color: #d97706;
  border: 1px solid #f59e0b;
}

.service-status-badge.active {
  background: rgba(220, 252, 231, 0.95);
  color: #166534;
  border: 1px solid #22c55e;
}

/* ===== CARD CONTENT - MORE COMPACT ===== */
.card-content {
  padding: 16px; /* Reduced from 20px */
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px; /* Reduced from 16px */
}

/* ===== CARD HEADER ===== */
.card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px; /* Reduced from 12px */
}

.service-title {
  font-size: 1.2rem; /* Reduced from 1.3rem */
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
  width: 100%;
  word-wrap: break-word;
}

/* ===== CATEGORIES & SUBCATEGORIES SECTION ===== */
.categories-section {
  display: flex;
  flex-direction: column;
  gap: 6px; /* Reduced from 8px */
  width: 100%;
}

.category-tag {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  align-self: flex-start;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.subcategories-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.subcategory-tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  border: 1px solid #bae6fd;
  white-space: nowrap;
}

/* ===== SERVICE DESCRIPTION - MORE COMPACT ===== */
.service-description {
  color: #475569;
  line-height: 1.5;
  min-height: 36px; /* Reduced from 40px */
  font-size: 0.85rem; /* Reduced from 0.9rem */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

/* ===== SERVICE META - MORE COMPACT ===== */
.service-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0; /* Reduced from 16px */
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}

.price .total-price {
  font-weight: 700;
  color: #0f172a;
  font-size: 1.1rem; /* Reduced from 1.2rem */
}

.price .booking-price {
  color: #64748b;
  font-size: 0.8rem; /* Reduced from 0.85rem */
  margin-left: 8px;
}

.payment {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.8rem; /* Reduced from 0.85rem */
}

/* ===== AVAILABILITY SUMMARY - MORE COMPACT ===== */
.availability-summary {
  margin: 0;
  padding: 12px; /* Reduced from 16px */
  background: #f8fafc;
  border-radius: 10px; /* Reduced from 12px */
  border: 1px solid #e2e8f0;
}

.availability-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  display: inline-block;
  margin-right: 8px;
}

.availability-badge.available {
  background: #dcfce7;
  color: #166534;
}

.availability-badge:not(.available) {
  background: #fef2f2;
  color: #991b1b;
}

.days-count {
  color: #64748b;
  font-size: 0.8rem;
}

/* ===== MANAGE SLOTS BUTTON ===== */
.manage-slots-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.manage-slots-btn {
  background: linear-gradient(120deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.manage-slots-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* ===== DRAFT ACTIONS - MORE COMPACT ===== */
.draft-actions {
  text-align: center;
  padding: 12px; /* Reduced from 16px */
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border-radius: 10px; /* Reduced from 12px */
  border: 2px dashed #f59e0b;
}

.draft-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px; /* Reduced from 12px */
  color: #d97706;
  font-weight: 600;
  font-size: 0.85rem; /* Reduced from 0.9rem */
}

.add-slots-btn {
  background: linear-gradient(120deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 10px 16px; /* Reduced from 12px 20px */
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
  font-size: 0.85rem; /* Reduced from 0.9rem */
  transition: all 0.3s ease;
}

.add-slots-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

/* ===== CARD ACTIONS - MORE COMPACT ===== */
.card-actions {
  display: flex;
  padding: 0 16px 16px; /* Reduced from 20px */
  gap: 8px;
  flex-shrink: 0;
  margin-top: auto;
}

.action-btn {
  flex: 1;
  padding: 8px 12px; /* Reduced from 10px 16px */
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  font-size: 0.8rem; /* Reduced from 0.85rem */
  transition: all 0.3s ease;
  min-height: 40px; /* Reduced from 44px */
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.action-btn.edit {
  background: #dbeafe;
  color: #1d4ed8;
}

.action-btn.edit:hover:not(:disabled) {
  background: #bfdbfe;
}

.action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover:not(:disabled) {
  background: #fecaca;
}

/* ===== IN-PLACE TIME SLOTS PANEL - IMPROVED VISIBILITY ===== */
.time-slots-panel {
  border-top: 2px solid #e2e8f0;
  background: #fafbff;
  border-radius: 0 0 16px 16px;
  overflow: hidden;
  box-shadow: inset 0 4px 16px rgba(0, 0, 0, 0.04);
  position: relative;
  z-index: 10;
  /* 👇 NEW: Ensure proper spacing and visibility */
  margin-top: 8px;
  border: 1px solid #e2e8f0;
  border-top: none;
}

.time-slots-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px; /* Increased padding */
  background: linear-gradient(135deg, #1e40af, #1d4ed8);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  position: sticky;
  top: 0;
  z-index: 11;
}

.time-slots-panel-header h4 {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}

.close-panel-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 10px 18px; /* Increased padding */
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.close-panel-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.time-slots-panel-content {
  padding: 24px; /* Increased padding */
  background: white;
  max-height: 80vh; /* Increased from 70vh */
  overflow-y: auto;
  position: relative;
  /* 👇 NEW: Better scroll handling */
  scroll-behavior: smooth;
}

.time-slots-panel-content >>> .time-slots-container {
  width: 100%;
  max-width: none;
  padding: 0;
}

.time-slots-panel-content::-webkit-scrollbar {
  width: 8px; /* Increased from 6px */
}

.time-slots-panel-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.time-slots-panel-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.time-slots-panel-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 👇 IMPROVED SLIDE ANIMATION FOR BETTER VISIBILITY */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 1000px; /* Increased for better visibility */
  overflow: hidden;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

/* ===== EDIT MODE ===== */
.edit-mode {
  background: #f8fafc;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  margin-top: 16px;
  animation: slideDown 0.3s ease-out;
  border-radius: 0 0 16px 16px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.edit-header h3 {
  font-size: 1.3rem;
  color: #0f172a;
  margin: 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.status-display {
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  margin-bottom: 8px;
}

.status-badge.draft {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-note {
  color: #64748b;
  font-size: 0.85rem;
  margin: 8px 0 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.4;
}

.quick-availability {
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.availability-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  margin-bottom: 8px;
}

.availability-toggle input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  border-radius: 4px;
}

.toggle-label {
  font-size: 1rem;
}

.availability-note {
  color: #64748b;
  font-size: 0.85rem;
  margin: 0;
  font-style: italic;
  line-height: 1.4;
}

.edit-actions {
  margin-top: 24px;
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.save-btn {
  background: linear-gradient(120deg, #16a34a, #15803d);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cancel-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

/* ===== DEBUG PANEL ===== */
.debug-panel {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  color: #e2e8f0;
}

.debug-panel h4 {
  color: #94a3b8;
  margin-bottom: 12px;
  font-size: 1rem;
  font-weight: 600;
}

.debug-panel p {
  margin-bottom: 8px;
  color: #cbd5e1;
}

.debug-panel div {
  margin-bottom: 6px;
  padding: 8px;
  background: #1e293b;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
  word-break: break-all;
}

.debug-info {
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 8px;
  font-style: italic;
}

/* ===== MODALS ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  backdrop-filter: blur(8px);
  padding: 20px;
  box-sizing: border-box;
}

.modal {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: modalAppear 0.3s ease-out;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.service-form-modal {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 20px 20px 0 0;
  flex-shrink: 0;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: #0f172a;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
  transform: rotate(90deg);
}

.delete-modal {
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.delete-modal h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #0f172a;
  font-weight: 700;
}

.delete-modal p {
  color: #64748b;
  line-height: 1.6;
  font-size: 1.1rem;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.modal-actions .cancel-btn {
  flex: 1;
  background: #f1f5f9;
  color: #475569;
  padding: 14px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 48px;
}

.modal-actions .cancel-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.modal-actions .delete-btn {
  flex: 1;
  background: linear-gradient(120deg, #ef4444, #dc2626);
  color: white;
  padding: 14px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  min-height: 48px;
}

.modal-actions .delete-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.modal-actions .delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ===== RESPONSIVE DESIGN ===== */

/* Large Desktop */
@media (min-width: 1440px) {
  .services-section {
    padding: 3rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .services-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* Reduced from 380px */
    gap: 32px;
  }
  
  .section-title {
    font-size: 3rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Reduced from 350px */
    gap: 32px;
  }
  
  .card-banner {
    height: 140px; /* Reduced from 180px */
  }
  
  .service-title {
    font-size: 1.3rem; /* Reduced from 1.4rem */
  }
}

/* Tablet */
@media (max-width: 1024px) and (min-width: 768px) {
  .services-section {
    padding: 1.5rem;
  }
  
  .services-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Reduced from 320px */
    gap: 24px;
  }
  
  .status-stats {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .controls-bar {
    gap: 20px;
  }
}

/* Mobile Landscape / Small Tablet */
@media (max-width: 768px) {
  .services-section {
    padding: 1rem;
  }
  
  .section-header {
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1.1rem;
  }
  
  .status-summary-card {
    padding: 20px;
    border-radius: 16px;
  }
  
  .status-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .status-stat {
    padding: 14px;
  }
  
  .controls-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .controls-left {
    flex-direction: column;
    gap: 12px;
    max-width: none;
  }
  
  .controls-right {
    flex-direction: column;
    gap: 12px;
  }
  
  .search-input,
  .status-filter {
    min-width: auto;
    width: 100%;
  }
  
  .add-service-btn,
  .debug-btn {
    width: 100%;
    justify-content: center;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
    gap: 24px; /* Increased from 20px for better spacing */
  }
  
  .service-card {
    border-radius: 16px;
    min-height: 360px; /* Adjusted for mobile */
  }
  
  .card-banner {
    height: 120px; /* Reduced from 140px */
    border-radius: 16px 16px 0 0;
  }
  
  .card-content {
    padding: 16px;
    gap: 12px;
  }
  
  .service-title {
    font-size: 1.2rem;
  }
  
  .service-meta {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .card-actions {
    padding: 0 16px 16px;
    flex-direction: column;
    gap: 8px;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .time-slots-panel-header {
    padding: 16px; /* Increased from 12px */
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .time-slots-panel-header h4 {
    text-align: center;
    font-size: 1.1rem;
  }
  
  .time-slots-panel-content {
    padding: 20px; /* Increased from 16px */
    max-height: 70vh; /* Increased from 60vh */
  }
  
  .modal-overlay {
    padding: 16px;
  }
  
  .modal {
    border-radius: 16px;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .services-section {
    padding: 0.75rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .status-summary-card {
    padding: 16px;
    border-radius: 12px;
  }
  
  .status-stat {
    padding: 12px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .services-grid {
    gap: 20px; /* Increased from 16px */
  }
  
  .service-card {
    border-radius: 12px;
    min-height: 340px; /* Adjusted for small mobile */
  }
  
  .card-banner {
    height: 100px; /* Reduced from 120px */
  }
  
  .card-content {
    padding: 12px;
    gap: 10px;
  }
  
  .service-title {
    font-size: 1.1rem;
  }
  
  .service-description {
    font-size: 0.85rem;
    min-height: 36px;
  }
  
  .price .total-price {
    font-size: 1.1rem;
  }
  
  .availability-summary {
    padding: 12px;
  }
  
  .draft-actions {
    padding: 12px;
  }
  
  .edit-mode {
    padding: 16px;
  }
  
  .time-slots-panel-content {
    padding: 16px; /* Increased from 12px */
    max-height: 60vh; /* Increased from 50vh */
  }
  
  .modal-overlay {
    padding: 12px;
  }
  
  .modal-header {
    padding: 16px;
  }
  
  .modal-header h2 {
    font-size: 1.3rem;
  }
  
  .delete-modal {
    padding: 20px;
  }
  
  .delete-modal h3 {
    font-size: 1.3rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .services-section {
    padding: 0.5rem;
  }
  
  .section-title {
    font-size: 1.6rem;
  }
  
  .status-summary-card {
    padding: 12px;
  }
  
  .service-card {
    border-radius: 10px;
    min-height: 320px; /* Adjusted for extra small mobile */
  }
  
  .card-banner {
    height: 90px; /* Reduced from 100px */
  }
  
  .service-status-badge {
    top: 8px;
    right: 8px;
    padding: 4px 8px;
    font-size: 0.7rem;
  }
  
  .category-tag {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  
  .subcategory-tag {
    font-size: 0.65rem;
    padding: 3px 6px;
  }
}

/* ===== PRINT STYLES ===== */
@media print {
  .services-section {
    background: white;
    padding: 0;
  }
  
  .debug-btn,
  .card-actions,
  .service-status-badge,
  .controls-bar {
    display: none !important;
  }
  
  .service-card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
    margin-bottom: 20px;
  }
  
  .services-grid {
    display: block;
  }
}

/* ===== ACCESSIBILITY IMPROVEMENTS ===== */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles for keyboard navigation */
.action-btn:focus-visible,
.add-service-btn:focus-visible,
.close-btn:focus-visible,
.manage-slots-btn:focus-visible,
.add-slots-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .service-card {
    border: 2px solid #000;
  }
  
  .service-status-badge {
    border: 2px solid;
  }
  
  .stat-icon {
    border: 1px solid;
  }
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  .services-section {
    background: #0f172a;
    color: #e2e8f0;
  }
  
  .status-summary-card,
  .service-card,
  .empty-state,
  .loading-state {
    background: #1e293b;
    color: #e2e8f0;
    border-color: #334155;
  }
  
  .section-title,
  .service-title {
    color: #f1f5f9;
  }
  
  .section-subtitle,
  .service-description {
    color: #94a3b8;
  }
}
</style>