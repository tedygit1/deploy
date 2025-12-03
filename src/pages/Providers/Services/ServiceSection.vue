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
          <i :class="getServiceStatus(service) === 'draft' ? 'fa-solid fa-clock' : 'fa-solid fa-check-circle'"></i>
          {{ getServiceStatus(service) === 'draft' ? 'Draft' : 'Active' }}
        </div>

        <!-- Banner -->
        <div class="card-banner">
          <div class="banner-actions">
            <button class="btn edit-banner-btn" @click.stop="openBannerEditor(service)">
              <i class="fa-solid fa-camera"></i>
              Edit Banner
            </button>
          </div>
          <div class="banner-gradient"></div>
          <img
            v-if="service?.banner"
            :src="service.banner"
            :alt="service?.title || 'Service'"
            class="banner-img"
            @error="handleBannerError(service)"
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
                  <i class="fa-solid fa-tag"></i>
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
                <div class="price-label">Price</div>
                <div class="price-amount">
                  <span class="total-price">{{ service?.totalPrice || 0 }} ETB</span>
                  <span v-if="service?.bookingPrice" class="booking-price">({{ service.bookingPrice }} ETB deposit)</span>
                </div>
              </div>
              <div class="payment" v-if="service?.paymentMethod">
                <i class="fa-solid fa-wallet"></i> {{ service.paymentMethod }}
              </div>
            </div>
            <!-- Availability Summary -->
            <div class="availability-summary">
              <template v-if="getServiceStatus(service) === 'active'">
                <div class="availability-header">
                  <span class="availability-badge" :class="{ available: hasAnyRealAvailability(service) }">
                    <i :class="hasAnyRealAvailability(service) ? 'fa-solid fa-calendar-check' : 'fa-solid fa-calendar-xmark'"></i>
                    {{ hasAnyRealAvailability(service) ? 'Available' : 'Not Available' }}
                  </span>
                  <!-- ✅ UPDATED: Use accurate days count method -->
                  <span class="days-count" v-if="hasAnyRealAvailability(service)">
                    ({{ getAccurateAvailableDaysCount(service) }} days)
                  </span>
                </div>
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

    <!-- Banner Editor Modal -->
    <transition name="modal-fade">
      <div v-if="showBannerEditor" class="modal-overlay" @click.self="closeBannerEditor">
        <div class="modal banner-editor-modal" @click.stop>
          <div class="modal-header">
            <h2>Edit Service Banner</h2>
            <button class="close-btn" @click="closeBannerEditor" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-content">
            <!-- Current Banner Preview -->
            <div class="current-banner-section">
              <h4>Current Banner</h4>
              <div class="current-banner-preview">
                <div v-if="bannerEditorService?.banner" class="banner-preview">
                  <img :src="bannerEditorService.banner" :alt="bannerEditorService?.title" />
                  <div class="banner-overlay">
                    <button class="btn remove-banner-btn" @click="removeBanner">
                      <i class="fa-solid fa-trash"></i> Remove Banner
                    </button>
                  </div>
                </div>
                <div v-else class="no-banner-message">
                  <i class="fa-solid fa-image"></i>
                  <p>No banner uploaded yet</p>
                </div>
              </div>
            </div>

            <!-- Upload New Banner -->
            <div class="upload-banner-section">
              <h4>Upload New Banner</h4>
              <div class="upload-area" 
                   @dragover.prevent="dragover = true"
                   @dragleave.prevent="dragover = false"
                   @drop.prevent="handleDrop"
                   :class="{ 'dragover': dragover }">
                <div v-if="!selectedFile" class="upload-prompt">
                  <i class="fa-solid fa-cloud-arrow-up"></i>
                  <p>Drag & drop your image here</p>
                  <p class="upload-subtext">or click to browse</p>
                  <input 
                    type="file" 
                    ref="fileInput"
                    accept="image/*"
                    @change="handleFileSelect"
                    style="display: none"
                  />
                  <button class="btn browse-btn" @click="triggerFileInput">
                    <i class="fa-solid fa-folder-open"></i> Browse Files
                  </button>
                  <p class="file-requirements">
                    Supported formats: JPG, PNG, GIF<br>
                    Max size: 5MB
                  </p>
                </div>
                <div v-else class="file-selected">
                  <i class="fa-solid fa-file-image"></i>
                  <p class="file-name">{{ selectedFile.name }}</p>
                  <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
                  <div class="file-actions">
                    <button class="btn change-btn" @click="triggerFileInput">
                      <i class="fa-solid fa-rotate"></i> Change
                    </button>
                    <button class="btn remove-file-btn" @click="selectedFile = null">
                      <i class="fa-solid fa-times"></i> Remove
                    </button>
                  </div>
                </div>
              </div>

              <!-- Image Preview -->
              <div v-if="imagePreview" class="image-preview">
                <h5>Preview</h5>
                <img :src="imagePreview" alt="Preview" class="preview-img" />
              </div>
            </div>

            <!-- Upload Progress -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
              </div>
              <p class="progress-text">Uploading... {{ uploadProgress }}%</p>
            </div>

            <!-- Error Message -->
            <div v-if="uploadError" class="upload-error">
              <i class="fa-solid fa-circle-exclamation"></i>
              <span>{{ uploadError }}</span>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button class="btn cancel-btn" @click="closeBannerEditor" :disabled="uploading">
                Cancel
              </button>
              <button class="btn upload-btn" @click="uploadBanner" :disabled="!selectedFile || uploading">
                <i v-if="uploading" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-upload"></i>
                {{ uploading ? 'Uploading...' : 'Upload Banner' }}
              </button>
            </div>
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
      ],
      // Banner Editor State
      showBannerEditor: false,
      bannerEditorService: null,
      selectedFile: null,
      imagePreview: null,
      dragover: false,
      uploading: false,
      uploadProgress: 0,
      uploadError: null
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
          this.getSubcategoryNames(s).toLowerCase().includes(q)
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
    // ===== BANNER EDITOR METHODS =====
    openBannerEditor(service) {
      if (!service) {
        this.setError("Cannot edit banner: Service data is missing");
        return;
      }
      
      const serviceId = this.getServiceId(service);
      if (!serviceId) {
        this.setError("Cannot edit banner: Service ID is missing");
        return;
      }
      
      this.bannerEditorService = { ...service };
      this.selectedFile = null;
      this.imagePreview = null;
      this.uploadError = null;
      this.uploadProgress = 0;
      this.showBannerEditor = true;
    },
    
    closeBannerEditor() {
      if (this.uploading) return;
      this.showBannerEditor = false;
      this.bannerEditorService = null;
      this.selectedFile = null;
      this.imagePreview = null;
      this.uploadError = null;
      this.uploadProgress = 0;
      this.dragover = false;
    },
    
    triggerFileInput() {
      this.$refs.fileInput?.click();
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.validateAndSetFile(file);
      }
    },
    
    handleDrop(event) {
      this.dragover = false;
      const file = event.dataTransfer.files[0];
      if (file) {
        this.validateAndSetFile(file);
      }
    },
    
    validateAndSetFile(file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.uploadError = 'Please select a valid image file (JPG, PNG, GIF, WebP)';
        return;
      }
      
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.uploadError = 'File size must be less than 5MB';
        return;
      }
      
      this.selectedFile = file;
      this.uploadError = null;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    async removeBanner() {
      if (!this.bannerEditorService) return;
      
      try {
        const serviceId = this.getServiceId(this.bannerEditorService);
        await http.put(`/services/${serviceId}`, {
          ...this.bannerEditorService,
          banner: null
        });
        
        // Update local state
        const serviceIndex = this.services.findIndex(s => this.getServiceId(s) === serviceId);
        if (serviceIndex !== -1) {
          this.services[serviceIndex].banner = null;
        }
        
        this.setSuccess("Banner removed successfully!");
        this.closeBannerEditor();
      } catch (error) {
        console.error("Failed to remove banner:", error);
        this.setError("Failed to remove banner. Please try again.");
      }
    },
    
    async uploadBanner() {
      if (!this.selectedFile || !this.bannerEditorService) return;
      
      const serviceId = this.getServiceId(this.bannerEditorService);
      if (!serviceId) {
        this.setError("Cannot upload banner: Service ID is missing");
        return;
      }
      
      this.uploading = true;
      this.uploadError = null;
      this.uploadProgress = 10;
      
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('banner', this.selectedFile);
        formData.append('serviceId', serviceId);
        
        // Simulate upload progress (replace with actual progress tracking)
        const progressInterval = setInterval(() => {
          if (this.uploadProgress < 90) {
            this.uploadProgress += 10;
          }
        }, 200);
        
        // Upload the banner
        const response = await http.post('/services/upload-banner', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
          // Add onUploadProgress callback if your API supports it
        });
        
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        
        const bannerUrl = response.data.bannerUrl;
        
        // Update service with new banner URL
        await http.put(`/services/${serviceId}`, {
          ...this.bannerEditorService,
          banner: bannerUrl
        });
        
        // Update local state
        const serviceIndex = this.services.findIndex(s => this.getServiceId(s) === serviceId);
        if (serviceIndex !== -1) {
          this.services[serviceIndex].banner = bannerUrl;
        }
        
        this.setSuccess("Banner updated successfully!");
        setTimeout(() => {
          this.closeBannerEditor();
        }, 500);
        
      } catch (error) {
        console.error("Failed to upload banner:", error);
        this.uploadError = error.response?.data?.message || "Failed to upload banner. Please try again.";
      } finally {
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },
    
    // ===== EXISTING METHODS (keep all your existing methods) =====
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
    
    hasAnyRealAvailability(service) {
      return this.getServiceStatus(service) === 'active';
    },
    
    getAccurateAvailableDaysCount(service) {
      if (!service || !service.slots || !Array.isArray(service.slots)) return 0;
      const availableDays = new Set();
      service.slots.forEach(slot => {
        if (slot && slot.weeklySchedule && Array.isArray(slot.weeklySchedule)) {
          slot.weeklySchedule.forEach(daySchedule => {
            if (this.shouldCountDay(daySchedule)) {
              availableDays.add(daySchedule.day);
            }
          });
        }
      });
      return availableDays.size;
    },
    
    shouldCountDay(daySchedule) {
      if (!daySchedule) return false;
      if (daySchedule.isWorkingDay !== true) return false;
      if (!daySchedule.timeSlots || !Array.isArray(daySchedule.timeSlots)) return false;
      return daySchedule.timeSlots.some(slot => 
        slot && slot.isAvailable === true
      );
    },
    
    getAvailableDaysCount(service) {
      return this.getAccurateAvailableDaysCount(service);
    },
    
    toggleTimeSlots(service) {
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
    
    async handleTimeSlotsSaved(result) {
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
    
    hasSubcategories(service) {
      if (!service) return false;
      return Array.isArray(service.subcategories) && 
             service.subcategories.length > 0 &&
             service.subcategories[0] && typeof service.subcategories[0] === 'string';
    },
    
    getSubcategories(service) {
      if (!service || !Array.isArray(service.subcategories)) {
        return [];
      }
      return service.subcategories.filter(name => name && typeof name === 'string');
    },
    
    getSubcategoryNames(service) {
      return this.getSubcategories(service).join(', ');
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
    
    handleBannerError(service) {
      console.error('❌ Banner failed to load:', service?.banner);
      service.banner = null;
    },
    
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
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  max-width: 100%;
  overflow-x: hidden;
}

/* ===== SECTION HEADER ===== */
.section-header {
  text-align: left;
  margin-bottom: 2.5rem;
  padding: 0;
}

.section-title {
  font-size: 2.5rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.section-subtitle {
  color: #718096;
  font-size: 1.1rem;
  font-weight: 400;
  max-width: 600px;
  margin: 0;
  line-height: 1.5;
}

/* ===== STATUS SUMMARY CARD ===== */
.status-summary-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.status-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  transition: all 0.2s ease;
}

.status-stat:hover {
  border-color: #3182ce;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.stat-icon.total {
  background: #edf2f7;
  color: #4a5568;
}

.stat-icon.active {
  background: #c6f6d5;
  color: #38a169;
}

.stat-icon.draft {
  background: #fed7d7;
  color: #e53e3e;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== CONTROLS BAR ===== */
.controls-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

@media (min-width: 768px) {
  .controls-bar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.controls-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

@media (min-width: 768px) {
  .controls-left {
    flex-direction: row;
    align-items: center;
    width: auto;
    flex: 1;
    max-width: 600px;
  }
}

.controls-right {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

@media (min-width: 768px) {
  .controls-right {
    flex-direction: row;
    align-items: center;
    width: auto;
  }
}

.search-input {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-input i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  z-index: 2;
}

.search-input input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-input input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.status-filter {
  min-width: 160px;
}

.status-filter select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a0aec0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px;
  padding-right: 2.5rem;
}

.status-filter select:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.add-service-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  width: 100%;
}

@media (min-width: 768px) {
  .add-service-btn {
    width: auto;
  }
}

.add-service-btn:hover {
  background: #2c5282;
  transform: translateY(-1px);
}

.debug-btn {
  background: #718096;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  width: 100%;
}

@media (min-width: 768px) {
  .debug-btn {
    width: auto;
  }
}

.debug-btn:hover {
  background: #4a5568;
  transform: translateY(-1px);
}

/* ===== SERVICES GRID ===== */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
  width: 100%;
}

/* ===== SERVICE CARD ===== */
.service-card {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  border: 1px solid #e2e8f0;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #3182ce;
}

/* ===== CARD BANNER ===== */
.card-banner {
  position: relative;
  height: 160px;
  overflow: hidden;
  background: #edf2f7;
}

.banner-actions {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 3;
}

.edit-banner-btn {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.edit-banner-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-1px);
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
  background: #3182ce;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

/* ===== SERVICE STATUS BADGE ===== */
.service-status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

.service-status-badge.draft {
  color: #e53e3e;
}

.service-status-badge.active {
  color: #38a169;
}

/* ===== CARD CONTENT ===== */
.card-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== CARD HEADER ===== */
.card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.service-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  line-height: 1.4;
}

/* ===== CATEGORIES SECTION ===== */
.categories-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-tag {
  background: #3182ce;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.subcategories-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.subcategory-tag {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
}

/* ===== SERVICE DESCRIPTION ===== */
.service-description {
  color: #718096;
  line-height: 1.5;
  font-size: 0.9rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== SERVICE META ===== */
.service-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  margin: 0.5rem 0;
}

.price {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.price-amount {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.total-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.booking-price {
  font-size: 0.875rem;
  color: #718096;
}

.payment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
}

/* ===== AVAILABILITY SUMMARY ===== */
.availability-summary {
  margin: 0.5rem 0;
}

.availability-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.availability-badge {
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.availability-badge.available {
  background: #c6f6d5;
  color: #38a169;
}

.days-count {
  color: #718096;
  font-size: 0.875rem;
}

/* ===== MANAGE SLOTS BUTTON ===== */
.manage-slots-section {
  margin-top: 1rem;
}

.manage-slots-btn {
  width: 100%;
  padding: 0.75rem;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.manage-slots-btn:hover {
  background: #2c5282;
  transform: translateY(-1px);
}

/* ===== DRAFT ACTIONS ===== */
.draft-actions {
  text-align: center;
  padding: 0.75rem;
  background: #fff5f5;
  border-radius: 8px;
  border: 1px dashed #fed7d7;
}

.draft-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #e53e3e;
  font-weight: 600;
  font-size: 0.875rem;
}

.add-slots-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  justify-content: center;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.add-slots-btn:hover {
  background: #c53030;
  transform: translateY(-1px);
}

/* ===== TIME SLOTS PANEL ===== */
.time-slots-panel {
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
}

.time-slots-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.time-slots-panel-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.close-panel-btn {
  background: #718096;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
}

.close-panel-btn:hover {
  background: #4a5568;
}

.time-slots-panel-content {
  padding: 1.25rem;
  max-height: 400px;
  overflow-y: auto;
}

/* ===== CARD ACTIONS ===== */
.card-actions {
  display: flex;
  padding: 0.75rem 1.25rem;
  gap: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

.action-btn {
  flex: 1;
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  border: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.edit {
  background: #bee3f8;
  color: #2b6cb0;
}

.action-btn.edit:hover:not(:disabled) {
  background: #90cdf4;
}

.action-btn.delete {
  background: #fed7d7;
  color: #c53030;
}

.action-btn.delete:hover:not(:disabled) {
  background: #feb2b2;
}

/* ===== EDIT MODE ===== */
.edit-mode {
  background: #f7fafc;
  padding: 1.25rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.edit-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.cancel-btn {
  background: #718096;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  background: white;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.save-btn {
  width: 100%;
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.save-btn:hover:not(:disabled) {
  background: #2c5282;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== ERROR & SUCCESS MESSAGES ===== */
.error-message {
  background: #fed7d7;
  border: 1px solid #fc8181;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.success-message {
  background: #c6f6d5;
  border: 1px solid #9ae6b4;
  color: #38a169;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.close-error,
.close-success {
  margin-left: auto;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
}

/* ===== LOADING STATE ===== */
.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin: 2rem 0;
}

.loading-state i {
  font-size: 2rem;
  color: #3182ce;
  margin-bottom: 1rem;
}

.loading-state p {
  color: #718096;
  margin-bottom: 0.5rem;
}

.loading-state .debug-info {
  font-size: 0.875rem;
  color: #a0aec0;
  font-style: italic;
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin: 2rem 0;
}

.empty-state i {
  font-size: 3rem;
  color: #a0aec0;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
  font-weight: 600;
}

.empty-state p {
  color: #718096;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

.primary-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.primary-btn:hover {
  background: #2c5282;
  transform: translateY(-1px);
}

/* ===== DEBUG PANEL ===== */
.debug-panel {
  background: #1a202c;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 2rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
}

.debug-panel h4 {
  color: #a0aec0;
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.debug-panel p {
  margin: 0.5rem 0;
}

/* ===== BANNER EDITOR MODAL ===== */
.banner-editor-modal {
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.banner-editor-modal .modal-content {
  padding: 1.5rem;
}

.current-banner-section h4,
.upload-banner-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.current-banner-preview {
  margin-bottom: 1.5rem;
}

.banner-preview {
  position: relative;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.banner-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.75rem;
  display: flex;
  justify-content: center;
}

.remove-banner-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.remove-banner-btn:hover {
  background: #c53030;
}

.no-banner-message {
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  color: #a0aec0;
}

.no-banner-message i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.upload-area {
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: #f7fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
}

.upload-area.dragover {
  border-color: #3182ce;
  background: #ebf8ff;
}

.upload-prompt i {
  font-size: 2.5rem;
  color: #a0aec0;
  margin-bottom: 1rem;
}

.upload-prompt p {
  color: #718096;
  margin-bottom: 0.5rem;
}

.upload-subtext {
  font-size: 0.875rem;
  color: #a0aec0;
}

.browse-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: all 0.2s ease;
}

.browse-btn:hover {
  background: #2c5282;
}

.file-requirements {
  font-size: 0.75rem;
  color: #a0aec0;
  margin-top: 0.75rem;
  line-height: 1.4;
}

.file-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-selected i {
  font-size: 2rem;
  color: #38a169;
  margin-bottom: 0.5rem;
}

.file-name {
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.25rem;
  word-break: break-all;
  text-align: center;
}

.file-size {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1rem;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
}

.change-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.change-btn:hover {
  background: #2c5282;
}

.remove-file-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.remove-file-btn:hover {
  background: #c53030;
}

.image-preview {
  margin-top: 1rem;
}

.image-preview h5 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.preview-img {
  width: 100%;
  max-height: 150px;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.upload-progress {
  margin: 1rem 0;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3182ce;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: #718096;
  text-align: center;
  margin-top: 0.5rem;
}

.upload-error {
  background: #fed7d7;
  border: 1px solid #fc8181;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 6px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.upload-btn {
  background: #38a169;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.upload-btn:hover:not(:disabled) {
  background: #2f855a;
}

.upload-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== MODALS ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  box-sizing: border-box;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: modalAppear 0.2s ease-out;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.25rem;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #2d3748;
}

.delete-modal {
  max-width: 400px;
}

.delete-modal h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1rem 0;
}

.delete-modal p {
  color: #718096;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.delete-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
}

.delete-btn:hover:not(:disabled) {
  background: #c53030;
}

/* ===== ANIMATIONS ===== */
@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-down-enter-active {
  animation: slideDown 0.3s ease;
}

.slide-down-leave-active {
  animation: slideUp 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    max-height: 500px;
  }
  to {
    opacity: 0;
    max-height: 0;
  }
}

/* ===== RESPONSIVE BREAKPOINTS ===== */

/* Large Desktop */
@media (min-width: 1400px) {
  .services-section {
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet */
@media (max-width: 1024px) and (min-width: 768px) {
  .services-section {
    padding: 1.5rem;
  }
  
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile Landscape / Small Tablet */
@media (max-width: 768px) {
  .services-section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .service-card {
    min-height: 380px;
  }
  
  .card-banner {
    height: 140px;
  }
  
  .status-stats {
    grid-template-columns: 1fr;
  }
  
  .controls-left,
  .controls-right {
    flex-direction: column;
  }
  
  .search-input,
  .status-filter {
    width: 100%;
  }
  
  .banner-editor-modal {
    max-width: 90%;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .services-section {
    padding: 0.75rem;
  }
  
  .service-card {
    min-height: 350px;
  }
  
  .card-banner {
    height: 120px;
  }
  
  .service-title {
    font-size: 1.125rem;
  }
  
  .total-price {
    font-size: 1.125rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .time-slots-panel-header {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
  
  .time-slots-panel-header h4 {
    font-size: 0.95rem;
  }
  
  .banner-editor-modal .modal-content {
    padding: 1rem;
  }
  
  .upload-area {
    padding: 1.5rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .services-section {
    padding: 0.5rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .service-card {
    min-height: 320px;
  }
  
  .card-banner {
    height: 100px;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .service-title {
    font-size: 1rem;
  }
  
  .total-price {
    font-size: 1rem;
  }
  
  .status-stat {
    padding: 0.75rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .edit-banner-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles */
.action-btn:focus-visible,
.add-service-btn:focus-visible,
.close-btn:focus-visible,
.manage-slots-btn:focus-visible,
.add-slots-btn:focus-visible,
.search-input input:focus-visible,
.status-filter select:focus-visible,
.edit-banner-btn:focus-visible {
  outline: 2px solid #3182ce;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .service-card {
    border: 2px solid #000;
  }
  
  .service-status-badge {
    border: 1px solid;
  }
  
  .stat-icon {
    border: 1px solid;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .services-section {
    background: #1a202c;
  }
  
  .status-summary-card,
  .service-card,
  .empty-state,
  .loading-state,
  .modal {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .section-title,
  .service-title {
    color: #f7fafc;
  }
  
  .section-subtitle,
  .service-description {
    color: #cbd5e0;
  }
  
  .total-price {
    color: #f7fafc;
  }
  
  .stat-number {
    color: #f7fafc;
  }
  
  .search-input input,
  .status-filter select,
  .form-control {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .edit-banner-btn {
    background: rgba(255, 255, 255, 0.2);
  }
}

/* Print styles */
@media print {
  .debug-btn,
  .card-actions,
  .service-status-badge,
  .controls-bar,
  .add-service-btn,
  .edit-banner-btn {
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
</style>