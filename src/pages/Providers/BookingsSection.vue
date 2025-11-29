<template>
  <div class="bookings-section">
    <!-- Header Section -->
    <div class="header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="title">📅 Bookings Management</h1>
          <p class="subtitle">Manage all your client appointments and service bookings</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="loadBookings">
            <i class="fa-solid fa-rotate"></i> Refresh
          </button>
          <button class="btn btn-outline" @click="checkProviderStatus">
            <i class="fa-solid fa-user-check"></i> Check Status
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <div class="spinner-large"></div>
        <h3>Loading Your Bookings</h3>
        <p>Fetching real data from API...</p>
        <div class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
          </div>
          <span>{{ loadingProgress }}%</span>
        </div>
      </div>
    </div>

    <!-- Success State - No Bookings -->
    <div v-else-if="!error && bookings.length === 0" class="success-empty-state">
      <div class="success-content">
        <div class="success-icon">
          <i class="fa-regular fa-calendar-check"></i>
        </div>
        <h3>No Bookings Yet</h3>
        <p>You don't have any bookings at the moment. When clients book your services, they'll appear here automatically.</p>
        <div class="success-actions">
          <button class="btn btn-primary" @click="promoteServices">
            <i class="fa-solid fa-share"></i> Promote Your Services
          </button>
          <button class="btn btn-outline" @click="viewServices">
            <i class="fa-solid fa-eye"></i> View Your Services
          </button>
        </div>
        <div class="success-tips">
          <h4>💡 Tips to Get Your First Booking:</h4>
          <div class="tips-grid">
            <div class="tip-card">
              <i class="fa-solid fa-link"></i>
              <div>
                <strong>Share Your Booking Link</strong>
                <p>Share your unique booking URL on social media and with your network</p>
              </div>
            </div>
            <div class="tip-card">
              <i class="fa-solid fa-star"></i>
              <div>
                <strong>Optimize Your Profile</strong>
                <p>Add photos, detailed descriptions, and competitive pricing to attract clients</p>
              </div>
            </div>
            <div class="tip-card">
              <i class="fa-solid fa-bullhorn"></i>
              <div>
                <strong>Promote Actively</strong>
                <p>Tell existing clients about your online booking system</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="fa-solid fa-exclamation-triangle"></i>
        </div>
        <h3>Unable to Load Bookings</h3>
        <p>{{ error }}</p>
        <div class="error-details">
          <p><strong>Status:</strong> {{ errorStatus }}</p>
          <p><strong>Provider PID:</strong> {{ currentProviderId }}</p>
          <p><strong>API Endpoint:</strong> {{ currentEndpoint }}</p>
        </div>
        <div class="error-actions">
          <button class="btn btn-primary" @click="loadBookings">
            <i class="fa-solid fa-rotate"></i> Try Again
          </button>
          <button class="btn btn-outline" @click="checkProviderStatus">
            <i class="fa-solid fa-user-check"></i> Check Provider Status
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content - When Bookings Exist -->
    <div v-else class="main-content">
      <!-- Statistics Overview -->
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon total">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalBookings }}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.pending }}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon confirmed">
            <i class="fa-solid fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.confirmed }}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon completed">
            <i class="fa-solid fa-flag-checkered"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.completed }}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon revenue">
            <i class="fa-solid fa-dollar-sign"></i>
          </div>
          <div class="stat-content">
            <h3>${{ stats.revenue }}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <!-- API Status -->
      <div class="api-status success">
        <i class="fa-solid fa-circle-check"></i>
        <span>Connected to Real API • {{ bookings.length }} bookings loaded • Provider: {{ currentProviderId }}</span>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="filters-row">
          <div class="search-box">
            <i class="fa-solid fa-search"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search by customer name, service, or booking ID..."
              class="search-input"
            />
          </div>
          <div class="filter-controls">
            <select v-model="statusFilter" class="filter-select">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select v-model="dateFilter" class="filter-select">
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
            <button class="btn btn-outline" @click="clearFilters">
              <i class="fa-solid fa-times"></i> Clear
            </button>
          </div>
        </div>
      </div>

      <!-- Bookings List -->
      <div class="bookings-container">
        <div class="section-header">
          <h2>Recent Bookings ({{ filteredBookings.length }})</h2>
          <div class="view-controls">
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <i class="fa-solid fa-list"></i> List
            </button>
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <i class="fa-solid fa-grid"></i> Grid
            </button>
          </div>
        </div>

        <!-- Bookings List View -->
        <div v-if="viewMode === 'list'" class="bookings-list">
          <div class="bookings-table">
            <div class="table-header">
              <div class="table-cell">Customer</div>
              <div class="table-cell">Service</div>
              <div class="table-cell">Date & Time</div>
              <div class="table-cell">Duration</div>
              <div class="table-cell">Status</div>
              <div class="table-cell">Amount</div>
              <div class="table-cell">Actions</div>
            </div>
            <div 
              v-for="booking in paginatedBookings" 
              :key="booking._id"
              class="table-row"
              :class="{
                'highlight-new': isNewBooking(booking),
                'urgent': isUrgentBooking(booking)
              }"
            >
              <!-- Customer Cell with Enhanced Details -->
              <div class="table-cell customer-cell">
                <div class="customer-avatar">
                  {{ getInitials(getCustomerName(booking)) }}
                </div>
                <div class="customer-info">
                  <strong>{{ getCustomerName(booking) }}</strong>
                  <span class="customer-contact">{{ getCustomerEmail(booking) }}</span>
                  <span v-if="getCustomerPhone(booking)" class="customer-contact">
                    <i class="fa-solid fa-phone"></i> {{ getCustomerPhone(booking) }}
                  </span>
                  <span v-if="getCustomerLocation(booking)" class="customer-location">
                    <i class="fa-solid fa-location-dot"></i> {{ getCustomerLocation(booking) }}
                  </span>
                </div>
              </div>

              <!-- Service Cell -->
              <div class="table-cell service-cell">
                <strong>{{ getServiceName(booking) }}</strong>
                <span class="service-category">{{ getCategoryName(booking) }}</span>
              </div>

              <div class="table-cell datetime-cell">
                <div class="date">{{ formatDate(booking.bookingDate || booking.date) }}</div>
                <div class="time">{{ booking.startTime }} - {{ booking.endTime }}</div>
              </div>
              <div class="table-cell duration-cell">
                {{ calculateDuration(booking.startTime, booking.endTime) || booking.duration || 60 }} mins
              </div>
              <div class="table-cell status-cell">
                <span class="status-badge" :class="booking.status">
                  {{ formatStatus(booking.status) }}
                </span>
              </div>
              <div class="table-cell amount-cell">
                <strong>${{ getBookingAmount(booking) }}</strong>
              </div>
              <div class="table-cell actions-cell">
                <div class="action-buttons">
                  <button 
                    v-if="booking.status === 'pending'"
                    class="btn-action confirm"
                    @click="confirmBooking(booking)"
                    title="Confirm Booking"
                  >
                    <i class="fa-solid fa-check"></i>
                  </button>
                  <button 
                    v-if="booking.status === 'confirmed'"
                    class="btn-action complete"
                    @click="completeBooking(booking)"
                    title="Mark Complete"
                  >
                    <i class="fa-solid fa-flag-checkered"></i>
                  </button>
                  <button 
                    class="btn-action view"
                    @click="viewBookingDetails(booking)"
                    title="View Details"
                  >
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings Grid View -->
        <div v-else class="bookings-grid">
          <div 
            v-for="booking in paginatedBookings" 
            :key="booking._id"
            class="booking-card"
            :class="{
              'new-booking': isNewBooking(booking),
              'urgent-booking': isUrgentBooking(booking)
            }"
          >
            <div class="card-header">
              <div class="customer-avatar large">
                {{ getInitials(getCustomerName(booking)) }}
              </div>
              <div class="customer-details">
                <h4>{{ getCustomerName(booking) }}</h4>
                <p class="customer-email">{{ getCustomerEmail(booking) }}</p>
                <p v-if="getCustomerPhone(booking)" class="customer-phone">
                  <i class="fa-solid fa-phone"></i> {{ getCustomerPhone(booking) }}
                </p>
                <p v-if="getCustomerLocation(booking)" class="customer-location">
                  <i class="fa-solid fa-location-dot"></i> {{ getCustomerLocation(booking) }}
                </p>
              </div>
              <div class="booking-status">
                <span class="status-badge" :class="booking.status">
                  {{ formatStatus(booking.status) }}
                </span>
              </div>
            </div>
            
            <div class="card-body">
              <div class="service-info">
                <h5>{{ getServiceName(booking) }}</h5>
                <p class="service-category">{{ getCategoryName(booking) }}</p>
              </div>
              
              <div class="booking-datetime">
                <div class="date-time">
                  <i class="fa-solid fa-calendar"></i>
                  <span>{{ formatDate(booking.bookingDate || booking.date) }}</span>
                </div>
                <div class="date-time">
                  <i class="fa-solid fa-clock"></i>
                  <span>{{ booking.startTime }} - {{ booking.endTime }}</span>
                </div>
                <div class="duration">
                  <i class="fa-solid fa-hourglass"></i>
                  <span>{{ calculateDuration(booking.startTime, booking.endTime) || booking.duration || 60 }} minutes</span>
                </div>
              </div>
              
              <div class="booking-meta">
                <div class="meta-item">
                  <span class="meta-label">Amount:</span>
                  <span class="meta-value">${{ getBookingAmount(booking) }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Booked:</span>
                  <span class="meta-value">{{ formatRelativeTime(booking.createdAt) }}</span>
                </div>
              </div>

              <!-- Customer Notes -->
              <div v-if="booking.notes" class="customer-notes">
                <i class="fa-solid fa-sticky-note"></i>
                <span>{{ booking.notes }}</span>
              </div>
            </div>
            
            <div class="card-footer">
              <button 
                v-if="booking.status === 'pending'"
                class="btn btn-sm btn-success"
                @click="confirmBooking(booking)"
              >
                <i class="fa-solid fa-check"></i> Confirm
              </button>
              <button 
                v-if="booking.status === 'confirmed'"
                class="btn btn-sm btn-primary"
                @click="completeBooking(booking)"
              >
                <i class="fa-solid fa-flag-checkered"></i> Complete
              </button>
              <button 
                class="btn btn-sm btn-outline"
                @click="viewBookingDetails(booking)"
              >
                <i class="fa-solid fa-eye"></i> View
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredBookings.length > itemsPerPage" class="pagination">
          <button 
            class="pagination-btn" 
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <i class="fa-solid fa-chevron-left"></i> Previous
          </button>
          
          <div class="page-numbers">
            <button
              v-for="page in totalPages"
              :key="page"
              class="page-btn"
              :class="{ active: currentPage === page }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="pagination-btn" 
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Next <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { ref, computed, onMounted } from "vue";
import http from "@/api/index.js";

export default {
  name: 'BookingsSection',
  
  setup() {
    // Reactive data
    const loading = ref(true);
    const loadingProgress = ref(0);
    const error = ref("");
    const errorStatus = ref("");
    const bookings = ref([]);
    const searchQuery = ref("");
    const statusFilter = ref("all");
    const dateFilter = ref("all");
    const viewMode = ref("list");
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const selectedBooking = ref(null);
    const currentProviderId = ref("");
    const currentEndpoint = ref("");

    // Statistics
    const stats = ref({
      totalBookings: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      revenue: 0
    });

    // Known provider PIDs - MANUAL MAPPING
    const knownProviderPids = {
      "691e1659e304653542a825d5": "PROV-1763579481598-1GBEN", // hayelom
      "692b3c78d399bc41c3712380": "PROV-1764441208540-C269P"  // tig-tg
    };

    // Get Provider ID - SIMPLE & RELIABLE
    const getProviderId = () => {
      try {
        const loggedProvider = localStorage.getItem("loggedProvider");
        
        if (!loggedProvider) {
          throw new Error("No logged provider found. Please login again.");
        }
        
        const providerData = JSON.parse(loggedProvider);
        console.log("🔍 Current provider:", providerData.fullname, "ID:", providerData._id);
        
        // Method 1: Check if PID exists in localStorage
        const existingPid = providerData.pid || providerData.providerProfile?.pid;
        if (existingPid) {
          console.log("✅ Found PID in localStorage:", existingPid);
          currentProviderId.value = existingPid;
          return existingPid;
        }
        
        // Method 2: Use manual mapping
        const mappedPid = knownProviderPids[providerData._id];
        if (mappedPid) {
          console.log("🎯 Using mapped PID:", mappedPid);
          
          // Update localStorage with PID for future use
          const updatedData = { ...providerData, pid: mappedPid };
          localStorage.setItem("loggedProvider", JSON.stringify(updatedData));
          
          currentProviderId.value = mappedPid;
          return mappedPid;
        }
        
        throw new Error(`No PID mapping found for provider: ${providerData._id}`);
        
      } catch (err) {
        console.error("❌ Error getting provider ID:", err);
        error.value = "Authentication error: " + err.message;
        return null;
      }
    };

    // SMART CUSTOMER DATA EXTRACTION: Handle admin bookings and real customer bookings
    const extractCustomerData = (booking) => {
      console.log("🎯 EXTRACTING CUSTOMER DATA FROM BOOKING:", booking._id);
      
      // Check if this is an admin-created booking (no customer data)
      const isAdminBooking = booking.createdBy === 'admin' || booking.adminId;
      
      if (isAdminBooking) {
        console.log("👨‍💼 ADMIN BOOKING DETECTED - No customer data available");
        return {
          customerId: null,
          fullname: 'Walk-in Customer',
          email: 'No email provided',
          phone: 'Contact for details',
          location: 'In-store booking',
          isAdminBooking: true
        };
      }
      
      // Check for customer object (standard customer booking)
      if (booking.customer && typeof booking.customer === 'object') {
        console.log("✅ Found customer object in booking");
        return {
          customerId: booking.customer._id || booking.customer.id,
          fullname: booking.customer.fullname || booking.customer.name || 'Customer',
          email: booking.customer.email || 'No email provided',
          phone: booking.customer.phone || 'Contact for details',
          location: booking.customer.location || booking.customer.address || '',
          isAdminBooking: false
        };
      }
      
      // Check for direct customer fields
      if (booking.customerName || booking.customerEmail) {
        console.log("✅ Found direct customer fields");
        return {
          customerId: booking.customerId || booking.userId,
          fullname: booking.customerName || 'Customer',
          email: booking.customerEmail || 'No email provided',
          phone: booking.customerPhone || 'Contact for details',
          location: booking.customerLocation || '',
          isAdminBooking: false
        };
      }
      
      // Check for user object (alternative naming)
      if (booking.user && typeof booking.user === 'object') {
        console.log("✅ Found user object");
        return {
          customerId: booking.user._id || booking.user.id,
          fullname: booking.user.fullname || booking.user.name || 'Customer',
          email: booking.user.email || 'No email provided',
          phone: booking.user.phone || 'Contact for details',
          location: booking.user.location || booking.user.address || '',
          isAdminBooking: false
        };
      }
      
      // If no customer data found at all
      console.log("❌ NO CUSTOMER DATA FOUND - Using default values");
      return {
        customerId: null,
        fullname: 'Walk-in Customer',
        email: 'No email provided',
        phone: 'Contact for details',
        location: 'In-store booking',
        isAdminBooking: true
      };
    };

    // ENHANCE BOOKING DISPLAY: Make admin bookings look better
    const enhanceBookingDisplay = (booking, customerData) => {
      const service = booking.service || {};
      
      const enhancedBooking = {
        _id: booking._id || booking.bookingId || booking.id,
        customerId: customerData.customerId,
        providerId: booking.providerId || booking.provider?._id,
        customerName: customerData.fullname,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        customerLocation: customerData.location,
        isAdminBooking: customerData.isAdminBooking,
        serviceName: service.title || service.name || booking.serviceName || 'Unknown Service',
        serviceCategory: service.categoryName || service.category || booking.serviceCategory || 'General',
        bookingDate: booking.bookingDate || booking.date || booking.appointmentDate,
        startTime: booking.startTime || booking.time,
        endTime: booking.endTime,
        duration: booking.duration,
        status: (booking.status || 'pending').toLowerCase(),
        amount: parseFloat(booking.totalPrice || booking.amount || booking.price || 0).toFixed(2),
        createdAt: booking.createdAt || booking.bookingTime,
        notes: booking.notes || booking.specialRequirements,
        originalData: booking
      };

      // Add admin booking badge to notes for display
      if (customerData.isAdminBooking) {
        enhancedBooking.notes = enhancedBooking.notes 
          ? `${enhancedBooking.notes} • Admin Booking`
          : 'Admin Booking';
      }

      return enhancedBooking;
    };

    // PROCESS BOOKINGS: Convert API response to our format
    const processBookings = (apiBookings) => {
      if (!apiBookings) {
        console.warn("⚠️ No data received from API");
        return [];
      }
      
      let bookingsArray = [];
      
      // Handle different response structures
      if (Array.isArray(apiBookings)) {
        bookingsArray = apiBookings;
      } else if (apiBookings.bookings && Array.isArray(apiBookings.bookings)) {
        bookingsArray = apiBookings.bookings;
      } else if (apiBookings.data && Array.isArray(apiBookings.data)) {
        bookingsArray = apiBookings.data;
      } else {
        console.warn("⚠️ Unexpected API response structure:", apiBookings);
        return [];
      }

      console.log(`📊 Processing ${bookingsArray.length} bookings...`);

      // Process each booking
      const processedBookings = bookingsArray.map(booking => {
        const customerData = extractCustomerData(booking);
        return enhanceBookingDisplay(booking, customerData);
      });

      // Count admin vs customer bookings
      const adminBookings = processedBookings.filter(b => b.isAdminBooking).length;
      const customerBookings = processedBookings.filter(b => !b.isAdminBooking).length;
      
      console.log(`📊 Booking Summary: ${adminBookings} admin bookings, ${customerBookings} customer bookings`);

      return processedBookings;
    };

    // LOAD BOOKINGS: Main function to fetch and process bookings
    const loadBookings = async () => {
      const providerId = getProviderId();
      
      if (!providerId) {
        loading.value = false;
        return;
      }

      loading.value = true;
      loadingProgress.value = 0;
      error.value = "";
      errorStatus.value = "";

      try {
        console.log("🚀 Loading bookings for provider:", providerId);

        // Progress simulation
        const progressInterval = setInterval(() => {
          if (loadingProgress.value < 90) {
            loadingProgress.value += 10;
          }
        }, 200);

        // API call
        const endpoint = `/bookings/provider/${providerId}`;
        currentEndpoint.value = endpoint;
        
        console.log("📡 Calling endpoint:", endpoint);
        
        const response = await http.get(endpoint);
        
        clearInterval(progressInterval);
        loadingProgress.value = 100;

        console.log("✅ API Response received:", response.data);
        
        // Process the data
        const processedBookings = processBookings(response.data);
        bookings.value = processedBookings;
        
        console.log(`✅ Processed ${processedBookings.length} bookings`);
        calculateStats();

      } catch (err) {
        console.error("❌ API Error:", err);
        
        // Handle 403 as "no bookings" case
        if (err.response?.status === 403) {
          const errorMessage = err.response?.data?.message || err.message || '';
          if (errorMessage.includes("Providers can only access their own bookings")) {
            console.log("✅ No bookings found for this provider");
            error.value = "";
            bookings.value = [];
            calculateStats();
            return;
          }
        }
        
        // Handle other errors
        handleApiError(err);
      } finally {
        loading.value = false;
        setTimeout(() => { loadingProgress.value = 0; }, 500);
      }
    };

    // ENHANCED CUSTOMER DATA GETTERS: Show better info for admin bookings
    const getCustomerName = (booking) => {
      if (booking.isAdminBooking) {
        return 'Walk-in Customer 🏪';
      }
      return booking.customerName || 'Customer';
    };

    const getCustomerEmail = (booking) => {
      if (booking.isAdminBooking) {
        return 'In-store booking';
      }
      return booking.customerEmail || 'No email provided';
    };

    const getCustomerPhone = (booking) => {
      if (booking.isAdminBooking) {
        return 'Contact for details';
      }
      return booking.customerPhone || '';
    };

    const getCustomerLocation = (booking) => {
      if (booking.isAdminBooking) {
        return 'Store location';
      }
      return booking.customerLocation || '';
    };

    const getServiceName = (booking) => {
      return booking.serviceName || 
             booking.originalData?.service?.name ||
             booking.originalData?.service?.title ||
             'Unknown Service';
    };

    const getCategoryName = (booking) => {
      return booking.serviceCategory || 
             booking.originalData?.service?.category?.name ||
             booking.originalData?.category?.name ||
             'General';
    };

    const getBookingAmount = (booking) => {
      return parseFloat(booking.amount || 
             booking.originalData?.totalPrice || 
             booking.originalData?.price || 0).toFixed(2);
    };

    const formatStatus = (status) => {
      const statusMap = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled'
      };
      return statusMap[status] || status;
    };

    // Handle API errors
    const handleApiError = (err) => {
      if (err.response) {
        const status = err.response.status;
        errorStatus.value = `${status} ${err.response.statusText}`;
        
        if (status === 403) {
          error.value = "Access denied. Please check your provider permissions.";
        } else if (status === 404) {
          error.value = "Bookings endpoint not found.";
        } else if (status === 401) {
          error.value = "Authentication required. Please login again.";
        } else if (status === 500) {
          error.value = "Server error. Please try again later.";
        } else {
          error.value = `Server error: ${status}`;
        }
      } else if (err.request) {
        errorStatus.value = "Network Error";
        error.value = "Cannot connect to the server.";
      } else {
        errorStatus.value = "Client Error";
        error.value = `Error: ${err.message}`;
      }
    };

    // Calculate duration
    const calculateDuration = (startTime, endTime) => {
      if (!startTime || !endTime) return null;
      try {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        return Math.round((end - start) / (1000 * 60));
      } catch (err) {
        return null;
      }
    };

    // Calculate statistics
    const calculateStats = () => {
      if (bookings.value.length === 0) {
        stats.value = { totalBookings: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, revenue: 0 };
        return;
      }

      const calculatedStats = {
        totalBookings: bookings.value.length,
        pending: bookings.value.filter(b => b.status === 'pending').length,
        confirmed: bookings.value.filter(b => b.status === 'confirmed').length,
        completed: bookings.value.filter(b => b.status === 'completed').length,
        cancelled: bookings.value.filter(b => b.status === 'cancelled').length,
        revenue: bookings.value
          .filter(b => b.status !== 'cancelled')
          .reduce((sum, booking) => sum + (parseFloat(booking.amount) || 0), 0)
          .toFixed(2)
      };

      stats.value = calculatedStats;
    };

    // Check provider status
    const checkProviderStatus = () => {
      const providerData = JSON.parse(localStorage.getItem("loggedProvider") || "{}");
      
      let statusMessage = `🔍 Provider Status Check:\n\n`;
      statusMessage += `👤 Name: ${providerData.fullname}\n`;
      statusMessage += `📧 Email: ${providerData.email}\n`;
      statusMessage += `🎯 Role: ${providerData.role}\n`;
      statusMessage += `🆔 MongoDB ID: ${providerData._id}\n`;
      statusMessage += `🎫 Provider PID: ${currentProviderId.value}\n`;
      statusMessage += `📍 Location: ${providerData.location || 'Not set'}\n`;
      statusMessage += `📊 Service Categories: ${providerData.serviceCategoryNames?.join(', ') || 'Not set'}\n\n`;
      statusMessage += `📈 Booking Statistics:\n`;
      statusMessage += `   Total Bookings: ${stats.value.totalBookings}\n`;
      statusMessage += `   Pending: ${stats.value.pending} | Confirmed: ${stats.value.confirmed}\n`;
      statusMessage += `   Completed: ${stats.value.completed} | Revenue: $${stats.value.revenue}\n\n`;
      
      // Add admin booking info
      const adminBookings = bookings.value.filter(b => b.isAdminBooking).length;
      const customerBookings = bookings.value.filter(b => !b.isAdminBooking).length;
      statusMessage += `📋 Booking Types:\n`;
      statusMessage += `   Admin/Store Bookings: ${adminBookings}\n`;
      statusMessage += `   Customer Bookings: ${customerBookings}\n\n`;
      
      if (bookings.value.length === 0) {
        statusMessage += `💡 No bookings yet. Share your services to get started!`;
      } else {
        statusMessage += `✅ Booking system is working perfectly!`;
      }
      
      alert(statusMessage);
    };

    // Promote services
    const promoteServices = () => {
      alert("🎯 Great idea! Share your booking link with potential clients to get more bookings.");
    };

    // View services
    const viewServices = () => {
      alert("Redirecting to your services page...");
    };

    // Computed properties
    const filteredBookings = computed(() => {
      let filtered = bookings.value;

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(booking => 
          getCustomerName(booking).toLowerCase().includes(query) ||
          getServiceName(booking).toLowerCase().includes(query) ||
          getCustomerEmail(booking).toLowerCase().includes(query) ||
          (booking._id && booking._id.toLowerCase().includes(query))
        );
      }

      // Status filter
      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(booking => booking.status === statusFilter.value);
      }

      // Date filter
      if (dateFilter.value !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(booking => {
          if (!booking.bookingDate) return false;
          
          const bookingDate = new Date(booking.bookingDate);
          bookingDate.setHours(0, 0, 0, 0);
          
          switch (dateFilter.value) {
            case 'today':
              return bookingDate.getTime() === today.getTime();
            case 'week':
              const weekStart = new Date(today);
              weekStart.setDate(today.getDate() - today.getDay());
              return bookingDate >= weekStart;
            case 'month':
              return bookingDate.getMonth() === today.getMonth() && 
                     bookingDate.getFullYear() === today.getFullYear();
            case 'upcoming':
              return bookingDate >= today;
            case 'past':
              return bookingDate < today;
            default:
              return true;
          }
        });
      }

      // Sort by date (most recent first)
      filtered.sort((a, b) => {
        if (!a.bookingDate || !b.bookingDate) return 0;
        return new Date(b.bookingDate) - new Date(a.bookingDate);
      });

      return filtered;
    });

    const paginatedBookings = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredBookings.value.slice(start, end);
    });

    const totalPages = computed(() => 
      Math.ceil(filteredBookings.value.length / itemsPerPage.value)
    );

    // Methods
    const refreshBookings = () => {
      loadBookings();
    };

    const clearFilters = () => {
      searchQuery.value = "";
      statusFilter.value = "all";
      dateFilter.value = "all";
      currentPage.value = 1;
    };

    const confirmBooking = async (booking) => {
      try {
        await http.patch(`/bookings/${booking._id}/status`, { status: 'confirmed' });
        booking.status = 'confirmed';
        calculateStats();
      } catch (err) {
        console.error('Error confirming booking:', err);
      }
    };

    const completeBooking = async (booking) => {
      try {
        await http.patch(`/bookings/${booking._id}/status`, { status: 'completed' });
        booking.status = 'completed';
        calculateStats();
      } catch (err) {
        console.error('Error completing booking:', err);
      }
    };

    const viewBookingDetails = (booking) => {
      selectedBooking.value = booking;
    };

    // Utility functions
    const getInitials = (name) => {
      if (!name) return '??';
      // For admin bookings, use store icon
      if (name.includes('🏪')) return '🏪';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'No date';
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      } catch (err) {
        return 'Invalid Date';
      }
    };

    const formatRelativeTime = (dateString) => {
      if (!dateString) return 'Unknown time';
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDate(dateString);
      } catch (err) {
        return 'Unknown time';
      }
    };

    const isNewBooking = (booking) => {
      if (!booking.createdAt) return false;
      try {
        const created = new Date(booking.createdAt);
        const now = new Date();
        const diffHours = (now - created) / (1000 * 60 * 60);
        return diffHours < 24;
      } catch (err) {
        return false;
      }
    };

    const isUrgentBooking = (booking) => {
      if (booking.status !== 'pending') return false;
      if (!booking.bookingDate) return false;
      try {
        const bookingDate = new Date(booking.bookingDate);
        const now = new Date();
        const diffHours = (bookingDate - now) / (1000 * 60 * 60);
        return diffHours < 24 && diffHours > 0;
      } catch (err) {
        return false;
      }
    };

    // Lifecycle
    onMounted(() => {
      loadBookings();
    });

    return {
      // Data
      loading,
      loadingProgress,
      error,
      errorStatus,
      bookings,
      searchQuery,
      statusFilter,
      dateFilter,
      viewMode,
      currentPage,
      itemsPerPage,
      selectedBooking,
      currentProviderId,
      currentEndpoint,
      stats,
      
      // Computed
      filteredBookings,
      paginatedBookings,
      totalPages,
      
      // Methods
      loadBookings,
      refreshBookings,
      clearFilters,
      confirmBooking,
      completeBooking,
      viewBookingDetails,
      checkProviderStatus,
      promoteServices,
      viewServices,
      
      // Utility functions
      getInitials,
      formatDate,
      formatRelativeTime,
      isNewBooking,
      isUrgentBooking,
      getCustomerName,
      getCustomerEmail,
      getCustomerPhone,
      getCustomerLocation,
      getServiceName,
      getCategoryName,
      getBookingAmount,
      formatStatus,
      calculateDuration
    };
  }
};
</script>





<style scoped>
/* Add these new styles for enhanced customer info */
.customer-location {
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.customer-notes {
  background: #f3f4f6;
  padding: 8px 12px;
  border-radius: 8px;
  margin-top: 12px;
  font-size: 0.85rem;
  color: #4b5563;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.customer-notes i {
  color: #6b7280;
  margin-top: 2px;
}

.customer-email {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 2px 0;
}

.customer-phone {
  color: #6b7280;
  font-size: 0.85rem;
  margin: 2px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Rest of your existing styles remain exactly the same */
.bookings-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  font-family: "Poppins", sans-serif;
  background: #f8fafc;
  min-height: 100vh;
}


/* Base Styles */
.bookings-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  font-family: "Poppins", sans-serif;
  background: #f8fafc;
  min-height: 100vh;
}

/* Header */
.header {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section .title {
  font-size: 2.25rem;
  color: #1e293b;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-section .subtitle {
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* Statistics Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.total { background: #dbeafe; color: #1e40af; }
.stat-icon.pending { background: #fef3c7; color: #d97706; }
.stat-icon.confirmed { background: #dcfce7; color: #16a34a; }
.stat-icon.completed { background: #f3e8ff; color: #9333ea; }
.stat-icon.revenue { background: #fce7f3; color: #db2777; }

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-content p {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

/* API Status */
.api-status {
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.api-status.success {
  background: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.filters-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  font-size: 0.9rem;
  min-width: 140px;
}

.btn {
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #64748b;
}

.btn-outline:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.8rem;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

/* Loading State */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.loading-content {
  text-align: center;
  padding: 48px;
}

.spinner-large {
  width: 64px;
  height: 64px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
}

.loading-content h3 {
  color: #1e293b;
  margin-bottom: 12px;
}

.loading-content p {
  color: #64748b;
  margin-bottom: 24px;
}

.loading-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 300px;
  margin: 0 auto;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Error State */
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.error-content {
  text-align: center;
  padding: 48px;
  max-width: 500px;
}

.error-icon {
  width: 80px;
  height: 80px;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: #dc2626;
  font-size: 2rem;
}

.error-content h3 {
  color: #1e293b;
  margin-bottom: 12px;
  font-size: 1.5rem;
}

.error-content p {
  color: #64748b;
  margin-bottom: 32px;
  line-height: 1.6;
}

.error-details {
  margin: 16px 0;
  padding: 12px;
  background: #fef2f2;
  border-radius: 8px;
  font-size: 0.8rem;
}

.error-details p {
  margin: 4px 0;
  color: #dc2626;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Success Empty State */
.success-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.success-content {
  text-align: center;
  padding: 48px;
  max-width: 600px;
}

.success-icon {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
  color: #16a34a;
  font-size: 3rem;
}

.success-content h3 {
  color: #16a34a;
  font-size: 1.8rem;
  margin-bottom: 16px;
}

.success-content p {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 32px;
  line-height: 1.6;
}

.success-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.success-tips h4 {
  color: #1e293b;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.tip-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  text-align: left;
}

.tip-card i {
  color: #3b82f6;
  font-size: 1.2rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.tip-card strong {
  color: #1e293b;
  display: block;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.tip-card p {
  color: #64748b;
  font-size: 0.8rem;
  margin: 0;
  line-height: 1.4;
}

/* Main Content Layout */
.main-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

/* Bookings Container */
.bookings-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

.view-controls {
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
}

.view-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #64748b;
  transition: all 0.2s ease;
}

.view-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Bookings Table */
.bookings-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1.2fr 0.8fr 1fr 0.8fr 1fr;
  background: #f8fafc;
  padding: 16px 20px;
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
  border-bottom: 1px solid #e2e8f0;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1.2fr 0.8fr 1fr 0.8fr 1fr;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
  position: relative;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row.highlight-new {
  background: #f0f9ff;
  border-left: 4px solid #0ea5e9;
}

.table-row.urgent {
  background: #fef3c7;
  border-left: 4px solid #d97706;
}

.table-cell {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

/* Customer Cell */
.customer-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.customer-avatar.large {
  width: 48px;
  height: 48px;
  font-size: 1rem;
}

.customer-info strong {
  color: #1e293b;
  display: block;
  margin-bottom: 2px;
}

.customer-contact {
  color: #64748b;
  font-size: 0.8rem;
}

.customer-phone {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
}

/* Service Cell */
.service-cell strong {
  color: #1e293b;
  display: block;
  margin-bottom: 2px;
}

.service-category {
  color: #64748b;
  font-size: 0.8rem;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 12px;
}

/* Date Time Cell */
.datetime-cell .date {
  color: #1e293b;
  font-weight: 500;
  margin-bottom: 2px;
}

.datetime-cell .time {
  color: #64748b;
  font-size: 0.9rem;
}

/* Status Badges */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.confirmed {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.completed {
  background: #f3e8ff;
  color: #9333ea;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #dc2626;
}

/* Action Buttons */
.actions-cell {
  position: relative;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
}

.btn-action.confirm {
  background: #dcfce7;
  color: #16a34a;
}

.btn-action.confirm:hover {
  background: #bbf7d0;
}

.btn-action.complete {
  background: #dbeafe;
  color: #1e40af;
}

.btn-action.complete:hover {
  background: #bfdbfe;
}

.btn-action.view {
  background: #f1f5f9;
  color: #64748b;
}

.btn-action.view:hover {
  background: #e2e8f0;
}

/* Bookings Grid */
.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.booking-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.booking-card.new-booking {
  border-left: 4px solid #0ea5e9;
  background: #f0f9ff;
}

.booking-card.urgent-booking {
  border-left: 4px solid #d97706;
  background: #fef3c7;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.customer-details h4 {
  color: #1e293b;
  margin-bottom: 4px;
  font-size: 1.1rem;
}

.customer-details p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

.booking-status {
  margin-left: auto;
}

.card-body {
  space-y: 12px;
}

.service-info h5 {
  color: #1e293b;
  margin-bottom: 4px;
  font-size: 1rem;
}

.booking-datetime {
  space-y: 8px;
}

.date-time, .duration {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.9rem;
}

.date-time i, .duration i {
  width: 16px;
  color: #94a3b8;
}

.booking-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 0.8rem;
  color: #64748b;
}

.meta-value {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 500;
}

.card-footer {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.pagination-btn {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #475569;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #475569;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.page-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .bookings-section {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filter-controls {
    justify-content: center;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-cell {
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .table-cell:last-child {
    border-bottom: none;
  }
  
  .table-cell::before {
    content: attr(data-label);
    font-weight: 600;
    color: #475569;
    font-size: 0.9rem;
  }
  
  .bookings-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .title-section .title {
    font-size: 1.8rem;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .header-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>