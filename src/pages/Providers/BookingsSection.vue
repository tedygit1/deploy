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
            <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loading }"></i>
            {{ loading ? 'Refreshing...' : 'Refresh' }}
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

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="fa-solid fa-exclamation-triangle"></i>
        </div>
        <h3>Unable to Load Bookings</h3>
        <p>{{ error }}</p>
        <div class="error-actions">
          <button class="btn btn-primary" @click="loadBookings">
            <i class="fa-solid fa-rotate"></i> Try Again
          </button>
          <button class="btn btn-outline" @click="showDebugInfo">
            <i class="fa-solid fa-bug"></i> Debug Info
          </button>
        </div>
        <div v-if="showDebug" class="debug-info">
          <h4>Debug Information:</h4>
          <p><strong>Provider ID Found:</strong> {{ debugProviderId || 'None' }}</p>
          <p><strong>Token Exists:</strong> {{ debugHasToken }}</p>
          <p><strong>API Endpoint:</strong> {{ debugApiEndpoint }}</p>
          <p><strong>LocalStorage Keys:</strong> {{ debugLocalStorageKeys }}</p>
          <button class="btn btn-sm" @click="copyDebugInfo">Copy Debug Info</button>
        </div>
      </div>
    </div>

    <!-- Success State - No Bookings -->
    <div v-else-if="bookings.length === 0" class="success-empty-state">
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
          <button class="btn btn-outline" @click="loadBookings">
            <i class="fa-solid fa-rotate"></i> Check Again
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
          <div class="stat-icon today">
            <i class="fa-solid fa-sun"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.today }}</h3>
            <p>Today</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon upcoming">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.upcoming }}</h3>
            <p>Upcoming</p>
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
            <i class="fa-solid fa-money-bill"></i>
          </div>
          <div class="stat-content">
            <h3>ETB {{ stats.revenue }}</h3>
            <p>Revenue</p>
          </div>
        </div>
      </div>

      <!-- API Status -->
      <div class="api-status success" v-if="bookings.length > 0">
        <i class="fa-solid fa-circle-check"></i>
        <span>Connected • {{ bookings.length }} bookings loaded • Last updated: {{ lastUpdatedTime }}</span>
      </div>

      <!-- Search and Filters -->
      <div class="filters-section">
        <div class="filters-row">
          <div class="search-box">
            <i class="fa-solid fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search bookings by customer name, service, or email..."
              class="search-input"
            />
          </div>
          <select v-model="statusFilter" class="filter-select">
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button class="btn btn-outline" @click="clearFilters">
            <i class="fa-solid fa-filter-circle-xmark"></i> Clear Filters
          </button>
        </div>
      </div>

      <!-- Timeline Filter Section -->
      <div class="timeline-filter-section">
        <div class="timeline-filter-header">
          <h3><i class="fa-solid fa-filter"></i> Filter by Service Date</h3>
          <p class="timeline-filter-subtitle">Select time period based on when the service will happen</p>
        </div>
        
        <div class="timeline-filter-buttons">
          <button 
            v-for="period in timelinePeriods" 
            :key="period.id"
            class="timeline-filter-btn"
            :class="{ 'active': selectedPeriod === period.id }"
            @click="selectTimelinePeriod(period.id)"
          >
            <i :class="period.icon"></i>
            {{ period.label }}
          </button>
        </div>
        
        <!-- Active Filter Display -->
        <div v-if="selectedPeriod !== 'all'" class="timeline-active-filter">
          <div class="active-filter-row">
            <span class="active-filter-badge">
              <i class="fa-solid fa-filter"></i>
              Showing: {{ getActiveFilterLabel() }}
              <button class="clear-period-btn" @click="clearTimelinePeriod">
                <i class="fa-solid fa-times"></i>
              </button>
            </span>
            <span class="filter-count">{{ timelineFilteredBookings.length }} bookings</span>
          </div>
        </div>
      </div>

      <!-- Bookings List -->
      <div class="bookings-container">
        <div class="section-header">
          <h2>
            <span v-if="selectedPeriod !== 'all'">{{ getActiveFilterLabel() }} </span>
            Bookings ({{ displayBookings.length }})
          </h2>
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
            <button class="btn btn-sm btn-outline" @click="exportBookings">
              <i class="fa-solid fa-download"></i> Export
            </button>
          </div>
        </div>

        <!-- AMAZING PROFESSIONAL BOOKING CARDS -->
        <div v-if="viewMode === 'grid'" class="professional-cards-grid">
          <div 
            v-for="booking in paginatedBookings" 
            :key="booking._id"
            class="professional-card"
            :class="{
              'today-card': isTodayBooking(booking),
              'admin-card': booking.isAdminBooking,
              'completed-card': booking.status === 'completed',
              'past-card': isPastBooking(booking)
            }"
          >
            <!-- Card Header with Customer Info -->
            <div class="card-header-section">
              <div class="customer-avatar-section">
                <div class="avatar-circle">
                  {{ getCleanInitials(booking.customerName) }}
                </div>
                <div class="customer-type-indicator" :class="{ 'admin': booking.isAdminBooking }">
                  {{ booking.isAdminBooking ? 'Admin' : 'Client' }}
                </div>
              </div>
              
              <div class="customer-info-section">
                <h4 class="customer-name">{{ formatCustomerName(booking.customerName) }}</h4>
                <p class="customer-meta">
                  <span v-if="booking.customerEmail">
                    <i class="fa-solid fa-envelope"></i> {{ booking.customerEmail }}
                  </span>
                  <span v-if="booking.customerPhone">
                    <i class="fa-solid fa-phone"></i> {{ booking.customerPhone }}
                  </span>
                  <span v-if="booking.customerName.includes('CID:')" class="customer-id-badge">
                    ID: {{ booking.customerName.split('CID:')[1] }}
                  </span>
                </p>
              </div>
              
              <div class="booking-status-section">
                <!-- Don't show status for past bookings -->
                <div v-if="!isPastBooking(booking)" class="status-badge" :class="booking.status">
                  {{ formatStatus(booking.status) }}
                </div>
                <div v-else class="past-badge">
                  Past Booking
                </div>
                <div class="booking-id">
                  #{{ booking._id.substring(0, 6) }}
                </div>
              </div>
            </div>
            
            <!-- Service Details -->
            <div class="service-details-section">
              <div class="service-icon-circle">
                <i class="fa-solid fa-scissors"></i>
              </div>
              <div class="service-info">
                <h5 class="service-name">{{ formatServiceName(booking.serviceName) }}</h5>
                <div class="service-meta">
                  <span class="service-category">{{ booking.serviceCategory }}</span>
                  <span v-if="booking.serviceSubcategory" class="service-subcategory">{{ booking.serviceSubcategory }}</span>
                  <span class="service-duration">{{ calculateDuration(booking.startTime, booking.endTime) }} min</span>
                </div>
              </div>
              <div class="service-amount">
                <span class="amount-label">Price</span>
                <span class="amount-value">ETB {{ booking.actualPrice || booking.servicePrice || booking.amount }}</span>
              </div>
            </div>
            
            <!-- Date & Time Section -->
            <div class="datetime-section">
              <div class="date-time-card">
                <div class="date-section">
                  <div class="date-icon">
                    <i class="fa-solid fa-calendar-days"></i>
                  </div>
                  <div class="date-content">
                    <div class="date-label">Service Date</div>
                    <div class="date-value">{{ formatCleanDate(booking.bookingDate) }}</div>
                  </div>
                </div>
                
                <div class="time-section">
                  <div class="time-icon">
                    <i class="fa-solid fa-clock"></i>
                  </div>
                  <div class="time-content">
                    <div class="time-label">Time Slot</div>
                    <div class="time-value">{{ formatTimeSlot(booking.startTime, booking.endTime) }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Additional Info -->
            <div class="additional-info-section">
              <div class="info-item">
                <i class="fa-solid fa-calendar-plus"></i>
                <span>Booked {{ formatRelativeTime(booking.createdAt) }}</span>
              </div>
              <div class="info-item">
                <i class="fa-solid fa-user-clock"></i>
                <span>{{ getTimeUntilBooking(booking.bookingDate) }}</span>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="action-buttons-section">
              <button 
                v-if="!isPastBooking(booking) && booking.status === 'confirmed'"
                class="action-btn mark-complete-btn"
                @click="completeBooking(booking)"
              >
                <i class="fa-solid fa-check-circle"></i>
                Mark Complete
              </button>
              <button 
                class="action-btn view-details-btn"
                @click="viewBookingDetailsModal(booking)"
              >
                <i class="fa-solid fa-eye"></i>
                View Details
              </button>
              <button 
                class="action-btn contact-btn"
                v-if="!booking.isAdminBooking && booking.customerEmail"
                @click="contactCustomer(booking)"
              >
                <i class="fa-solid fa-message"></i>
                Contact
              </button>
            </div>
          </div>
        </div>

        <!-- Bookings List View -->
        <div v-else class="bookings-list">
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
            >
              <div class="table-cell customer-cell">
                <div class="customer-avatar">
                  {{ getCleanInitials(booking.customerName) }}
                </div>
                <div class="customer-info">
                  <div class="customer-main">
                    <strong>{{ formatCustomerName(booking.customerName) }}</strong>
                    <span v-if="booking.isAdminBooking" class="type-badge admin">
                      Admin
                    </span>
                    <span v-else class="type-badge client">
                      Client
                    </span>
                  </div>
                  <div class="customer-details">
                    <span class="customer-email">{{ booking.customerEmail }}</span>
                    <span v-if="booking.customerName.includes('CID:')" class="customer-id">
                      ID: {{ booking.customerName.split('CID:')[1] }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="table-cell service-cell">
                <strong>{{ formatServiceName(booking.serviceName) }}</strong>
                <div class="service-meta-row">
                  <span class="service-category">{{ booking.serviceCategory }}</span>
                  <span v-if="booking.serviceSubcategory" class="service-subcategory">{{ booking.serviceSubcategory }}</span>
                  <span class="service-price">ETB {{ booking.actualPrice || booking.servicePrice || booking.amount }}</span>
                </div>
              </div>

              <div class="table-cell datetime-cell">
                <div class="datetime-container">
                  <div class="date-section">
                    <i class="fa-solid fa-calendar"></i>
                    <span class="date">{{ formatCleanDate(booking.bookingDate) }}</span>
                  </div>
                  <div class="time-section">
                    <i class="fa-solid fa-clock"></i>
                    <span class="time">{{ formatTimeSlot(booking.startTime, booking.endTime) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="table-cell duration-cell">
                <div class="duration-container">
                  <i class="fa-solid fa-hourglass-half"></i>
                  <span>{{ calculateDuration(booking.startTime, booking.endTime) }} mins</span>
                </div>
              </div>
              
              <div class="table-cell status-cell">
                <!-- Don't show status for past bookings -->
                <span v-if="!isPastBooking(booking)" class="status-badge" :class="booking.status">
                  {{ formatStatus(booking.status) }}
                </span>
                <span v-else class="past-badge">
                  Past Booking
                </span>
              </div>
              
              <div class="table-cell amount-cell">
                <div class="amount-container">
                  <i class="fa-solid fa-money-bill"></i>
                  <strong>ETB {{ booking.actualPrice || booking.servicePrice || booking.amount }}</strong>
                </div>
              </div>
              
              <div class="table-cell actions-cell">
                <div class="action-buttons">
                  <button 
                    v-if="!isPastBooking(booking) && booking.status === 'confirmed'"
                    class="btn-action complete"
                    @click="completeBooking(booking)"
                    title="Mark Complete"
                  >
                    <i class="fa-solid fa-check-circle"></i>
                  </button>
                  <button 
                    class="btn-action view"
                    @click="viewBookingDetailsModal(booking)"
                    title="View Details"
                  >
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button 
                    class="btn-action contact"
                    v-if="!booking.isAdminBooking && booking.customerEmail"
                    @click="contactCustomer(booking)"
                    title="Contact Customer"
                  >
                    <i class="fa-solid fa-message"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="displayBookings.length > itemsPerPage" class="pagination">
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

        <!-- No Results Message -->
        <div v-if="displayBookings.length === 0 && bookings.length > 0" class="no-results">
          <i class="fa-solid fa-search"></i>
          <h4>No bookings match your filters</h4>
          <p>Try changing your search query or filters</p>
          <button class="btn btn-outline" @click="clearFilters">
            <i class="fa-solid fa-filter-circle-xmark"></i> Clear All Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="selectedBooking" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Booking Details</h3>
          <button class="modal-close" @click="closeModal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="selectedBooking" class="booking-details">
            <!-- Customer Information Section -->
            <div class="customer-section">
              <h4>
                <i class="fa-solid fa-user"></i>
                Customer Information
                <span v-if="loadingCustomerDetails" class="loading-indicator">
                  <i class="fa-solid fa-spinner fa-spin"></i> Loading...
                </span>
              </h4>
              <div v-if="customerDetails">
                <p><strong>Name:</strong> {{ customerDetails.fullname || customerDetails.name || selectedBooking.customerName }}</p>
                <p v-if="customerDetails.email"><strong>Email:</strong> {{ customerDetails.email }}</p>
                <p v-if="customerDetails.phone"><strong>Phone:</strong> {{ customerDetails.phone }}</p>
                <p v-if="customerDetails.address"><strong>Address:</strong> {{ customerDetails.address }}</p>
                <p v-if="customerDetails.cid"><strong>Customer ID:</strong> {{ customerDetails.cid }}</p>
              </div>
              <div v-else-if="loadingCustomerDetails">
                <p><i class="fa-solid fa-spinner fa-spin"></i> Loading customer details...</p>
              </div>
              <div v-else>
                <p><strong>Name:</strong> {{ selectedBooking.customerName }}</p>
                <p v-if="selectedBooking.customerEmail"><strong>Email:</strong> {{ selectedBooking.customerEmail }}</p>
                <p v-if="selectedBooking.customerPhone"><strong>Phone:</strong> {{ selectedBooking.customerPhone }}</p>
                <p v-if="selectedBooking.customerId"><strong>Customer ID:</strong> {{ selectedBooking.customerId }}</p>
                <p v-if="selectedBooking.customerName.includes('CID:')">
                  <strong>Customer Reference:</strong> {{ selectedBooking.customerName }}
                </p>
              </div>
            </div>
            
            <h4>Service Details</h4>
            <p><strong>Service:</strong> {{ selectedBooking.serviceName }}</p>
            <p v-if="selectedBooking.serviceCategory"><strong>Category:</strong> {{ selectedBooking.serviceCategory }}</p>
            <p v-if="selectedBooking.serviceSubcategory"><strong>Subcategory:</strong> {{ selectedBooking.serviceSubcategory }}</p>
            <p><strong>Amount:</strong> ETB {{ selectedBooking.actualPrice || selectedBooking.servicePrice || selectedBooking.amount }}</p>
            <p v-if="selectedBooking.serviceId"><strong>Service ID:</strong> {{ selectedBooking.serviceId }}</p>
            
            <h4>Timing</h4>
            <p><strong>Date:</strong> {{ formatCleanDate(selectedBooking.bookingDate) }}</p>
            <p><strong>Time:</strong> {{ formatTimeSlot(selectedBooking.startTime, selectedBooking.endTime) }}</p>
            <p><strong>Duration:</strong> {{ calculateDuration(selectedBooking.startTime, selectedBooking.endTime) }} minutes</p>
            
            <h4>Status</h4>
            <!-- Don't show status for past bookings -->
            <p v-if="!isPastBooking(selectedBooking)"><strong>Current Status:</strong> {{ formatStatus(selectedBooking.status) }}</p>
            <p><strong>Booked:</strong> {{ formatRelativeTime(selectedBooking.createdAt) }}</p>
            
            <div class="modal-actions">
              <button class="btn btn-primary" @click="closeModal">
                <i class="fa-solid fa-check"></i> Close
              </button>
            </div>
          </div>
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
    const bookings = ref([]);
    const searchQuery = ref("");
    const statusFilter = ref("all");
    const viewMode = ref("grid");
    const selectedPeriod = ref("today");
    const currentPage = ref(1);
    const itemsPerPage = ref(12);
    const selectedBooking = ref(null);
    const showDebug = ref(false);
    const lastUpdatedTime = ref("");
    
    // Service details cache
    const serviceDetailsCache = ref({});
    const servicesMap = ref({}); // Map of service ID to service details
    
    // Customer details state
    const customerDetails = ref(null);
    const loadingCustomerDetails = ref(false);
    const customerDetailsError = ref("");
    
    // Debug info
    const debugProviderId = ref("");
    const debugHasToken = ref(false);
    const debugApiEndpoint = ref("");
    const debugLocalStorageKeys = ref("");
    
    // Timeline periods
    const timelinePeriods = ref([
      { id: "all", label: "All Bookings", icon: "fa-solid fa-calendar" },
      { id: "past", label: "Past Bookings", icon: "fa-solid fa-calendar-minus" },
      { id: "today", label: "Today's Bookings", icon: "fa-solid fa-calendar-day" },
      { id: "tomorrow", label: "Tomorrow", icon: "fa-solid fa-calendar-plus" },
      { id: "next5days", label: "Next 5 Days", icon: "fa-solid fa-calendar-week" }
    ]);

    // Statistics
    const stats = ref({
      totalBookings: 0,
      today: 0,
      upcoming: 0,
      completed: 0,
      revenue: 0
    });

    // ==================== NEW: TIME FORMAT CONVERSION ====================
    const convertTo12HourFormat = (time24) => {
      if (!time24) return '';
      
      try {
        // Handle times like "09:00", "09:00:00", "9:00"
        let [hours, minutes] = time24.split(':');
        hours = parseInt(hours, 10);
        minutes = minutes ? parseInt(minutes, 10) : 0;
        
        if (isNaN(hours) || isNaN(minutes)) return time24;
        
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
        
        return `${hours12}:${minutesStr} ${ampm}`;
      } catch (err) {
        console.error("Error converting time:", err, time24);
        return time24;
      }
    };

    const formatTimeSlot = (startTime, endTime) => {
      if (!startTime || !endTime) return 'No time';
      const formattedStart = convertTo12HourFormat(startTime);
      const formattedEnd = convertTo12HourFormat(endTime);
      return `${formattedStart} - ${formattedEnd}`;
    };

    // ==================== DATE HELPER FUNCTIONS ====================
    const getTodayStart = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    };

    const getTomorrowStart = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow;
    };

    const getNextDayStart = (daysAhead) => {
      const date = new Date();
      date.setDate(date.getDate() + daysAhead);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const isPastBooking = (booking) => {
      if (!booking || !booking.bookingDate) return false;
      try {
        const bookingDate = new Date(booking.bookingDate);
        const todayStart = getTodayStart();
        return bookingDate < todayStart;
      } catch (err) {
        console.error("Error checking past booking:", err);
        return false;
      }
    };

    const isTodayBooking = (booking) => {
      if (!booking || !booking.bookingDate) return false;
      try {
        const bookingDate = new Date(booking.bookingDate);
        const todayStart = getTodayStart();
        const tomorrowStart = getTomorrowStart();
        return bookingDate >= todayStart && bookingDate < tomorrowStart;
      } catch (err) {
        console.error("Error checking today booking:", err);
        return false;
      }
    };

    const isTomorrowBooking = (booking) => {
      if (!booking || !booking.bookingDate) return false;
      try {
        const bookingDate = new Date(booking.bookingDate);
        const tomorrowStart = getTomorrowStart();
        const dayAfterTomorrow = getNextDayStart(2);
        return bookingDate >= tomorrowStart && bookingDate < dayAfterTomorrow;
      } catch (err) {
        console.error("Error checking tomorrow booking:", err);
        return false;
      }
    };

    const isNext5DaysBooking = (booking) => {
      if (!booking || !booking.bookingDate) return false;
      try {
        const bookingDate = new Date(booking.bookingDate);
        const todayStart = getTodayStart();
        const fiveDaysFromNow = getNextDayStart(5);
        return bookingDate >= todayStart && bookingDate < fiveDaysFromNow;
      } catch (err) {
        console.error("Error checking next 5 days booking:", err);
        return false;
      }
    };

    // ==================== FETCH ALL SERVICES FOR PROVIDER ====================
    const fetchAllServices = async (providerId) => {
      if (!providerId) {
        console.warn("❌ No provider ID for fetching services");
        return;
      }
      
      console.log("🛠️ Fetching all services for provider:", providerId);
      
      try {
        // Try different endpoints for bulk service data
        const serviceEndpoints = [
          `/services?provider=${providerId}`,
          `/services/provider/${providerId}`,
          `/provider/services/${providerId}`,
          `/api/services?providerId=${providerId}`
        ];
        
        let servicesData = null;
        
        for (const endpoint of serviceEndpoints) {
          try {
            console.log(`📡 Trying services endpoint: ${endpoint}`);
            const response = await http.get(endpoint);
            console.log("🛠️ Services API Response:", response.data);
            
            if (response.data) {
              servicesData = response.data;
              console.log(`✅ Found services from endpoint: ${endpoint}`);
              break;
            }
          } catch (endpointError) {
            console.log(`❌ Services endpoint ${endpoint} failed:`, endpointError.message);
          }
        }
        
        if (servicesData) {
          // Extract services array
          let servicesArray = [];
          if (Array.isArray(servicesData)) {
            servicesArray = servicesData;
          } else if (servicesData.services && Array.isArray(servicesData.services)) {
            servicesArray = servicesData.services;
          } else if (servicesData.data && Array.isArray(servicesData.data)) {
            servicesArray = servicesData.data;
          }
          
          console.log(`📊 Extracted ${servicesArray.length} services`);
          
          // Process each service
          servicesMap.value = {};
          servicesArray.forEach(service => {
            try {
              const serviceId = service._id || service.id || service.serviceId;
              if (serviceId) {
                // FIXED: Extract service data with proper field mapping
                const serviceDetails = extractServiceDetails(service);
                servicesMap.value[serviceId] = serviceDetails;
                serviceDetailsCache.value[serviceId] = serviceDetails;
                
                console.log(`✅ Cached service ${serviceId}:`, {
                  name: serviceDetails.name,
                  category: serviceDetails.category,
                  price: serviceDetails.price,
                  subcategory: serviceDetails.subcategory
                });
              }
            } catch (err) {
              console.error(`❌ Error processing service:`, err, service);
            }
          });
          
          console.log(`✅ Loaded ${Object.keys(servicesMap.value).length} services into cache`);
          
        } else {
          console.warn("⚠️ No bulk services data found - will fetch individually");
        }
        
      } catch (err) {
        console.error("❌ Error in fetchAllServices:", err);
      }
    };

    // ==================== EXTRACT SERVICE DETAILS ====================
    const extractServiceDetails = (serviceData) => {
      console.log("🔍 Raw service data for extraction:", serviceData);
      
      // Try to extract from different possible field structures
      const serviceId = serviceData._id || serviceData.id || serviceData.serviceId;
      
      // Extract name from multiple possible fields
      let serviceName = serviceData.title || serviceData.name || serviceData.serviceName || 'Service';
      
      // Extract category - check multiple possible locations
      let serviceCategory = 'General';
      if (serviceData.categoryName) {
        serviceCategory = serviceData.categoryName;
      } else if (serviceData.category) {
        serviceCategory = serviceData.category;
      } else if (serviceData.serviceCategory) {
        serviceCategory = serviceData.serviceCategory;
      } else if (serviceData.categoryId && typeof serviceData.categoryId === 'object') {
        serviceCategory = serviceData.categoryId.name || 'General';
      }
      
      // Extract subcategory
      let serviceSubcategory = '';
      if (serviceData.subcategoryIds && Array.isArray(serviceData.subcategoryIds)) {
        serviceSubcategory = serviceData.subcategoryIds.join(', ');
      } else if (serviceData.subcategory) {
        serviceSubcategory = serviceData.subcategory;
      } else if (serviceData.serviceSubcategory) {
        serviceSubcategory = serviceData.serviceSubcategory;
      }
      
      // Extract price - check multiple possible fields
      let servicePrice = 0;
      if (serviceData.bookingPrice !== undefined) {
        servicePrice = parseFloat(serviceData.bookingPrice);
      } else if (serviceData.totalPrice !== undefined) {
        servicePrice = parseFloat(serviceData.totalPrice);
      } else if (serviceData.price !== undefined) {
        servicePrice = parseFloat(serviceData.price);
      } else if (serviceData.amount !== undefined) {
        servicePrice = parseFloat(serviceData.amount);
      } else if (serviceData.servicePrice !== undefined) {
        servicePrice = parseFloat(serviceData.servicePrice);
      }
      
      console.log(`📊 Extracted service details for ${serviceId}:`, {
        name: serviceName,
        category: serviceCategory,
        subcategory: serviceSubcategory,
        price: servicePrice
      });
      
      return {
        id: serviceId,
        name: serviceName,
        category: serviceCategory,
        subcategory: serviceSubcategory,
        price: servicePrice,
        description: serviceData.description || '',
        serviceType: serviceData.serviceType || 'fixed',
        providerId: serviceData.providerId || serviceData.provider?._id || '',
        status: serviceData.status || 'published',
        rawData: serviceData // Keep raw data for debugging
      };
    };

    // ==================== GET SERVICE DETAILS ====================
    const getServiceDetails = (serviceId) => {
      if (!serviceId) {
        return null;
      }
      
      // Check cache first
      if (serviceDetailsCache.value[serviceId]) {
        console.log(`✅ Using cached service details for: ${serviceId}`);
        return serviceDetailsCache.value[serviceId];
      }
      
      // Check services map
      if (servicesMap.value[serviceId]) {
        serviceDetailsCache.value[serviceId] = servicesMap.value[serviceId];
        return servicesMap.value[serviceId];
      }
      
      return null;
    };

    // ==================== FETCH SERVICE DETAILS FROM API ====================
    const fetchServiceDetailsFromApi = async (serviceId) => {
      if (!serviceId) {
        return null;
      }
      
      console.log("🔍 Fetching service details from API for:", serviceId);
      
      try {
        // Try endpoints that work based on logs
        const serviceEndpoints = [
          `/services/${serviceId}`,  // This works
          `/service/${serviceId}`,
          `/api/services/${serviceId}`
        ];
        
        let serviceData = null;
        
        for (const endpoint of serviceEndpoints) {
          try {
            console.log(`📡 Trying service endpoint: ${endpoint}`);
            const response = await http.get(endpoint);
            console.log("🛠️ Service API Response data:", response.data);
            
            if (response.data) {
              serviceData = response.data;
              console.log("✅ Found service data from endpoint:", endpoint);
              break;
            }
          } catch (endpointError) {
            console.log(`❌ Service endpoint ${endpoint} failed:`, endpointError.message);
          }
        }
        
        if (serviceData) {
          // Extract service details using our helper function
          const processedService = extractServiceDetails(serviceData);
          console.log("🛠️ Extracted service details:", processedService);
          
          // Cache the result
          serviceDetailsCache.value[serviceId] = processedService;
          servicesMap.value[serviceId] = processedService;
          
          return processedService;
        } else {
          console.warn("⚠️ No service data found from any endpoint for:", serviceId);
          return null;
        }
        
      } catch (err) {
        console.error("❌ Error fetching service details:", err);
        return null;
      }
    };

    // ==================== GET PROVIDER ID ====================
    const getProviderId = () => {
      console.log("🔍 Getting provider ID for bookings...");
      
      // Check multiple possible locations for provider ID
      const possibleSources = [
        () => {
          const providerId = localStorage.getItem('providerId');
          console.log("🔍 Checking localStorage.providerId:", providerId);
          return providerId;
        },
        
        () => {
          const loggedProvider = localStorage.getItem('loggedProvider');
          if (loggedProvider) {
            try {
              const parsed = JSON.parse(loggedProvider);
              console.log("🔍 Checking loggedProvider:", parsed);
              return parsed.pid || parsed.providerId || parsed._id || parsed.id;
            } catch (e) {
              console.warn("❌ Failed to parse loggedProvider:", e);
            }
          }
          return null;
        },
        
        () => {
          const providerProfile = localStorage.getItem('providerProfile');
          if (providerProfile) {
            try {
              const parsed = JSON.parse(providerProfile);
              console.log("🔍 Checking providerProfile:", parsed);
              return parsed.pid || parsed._id || parsed.id;
            } catch (e) {
              console.warn("❌ Failed to parse providerProfile:", e);
            }
          }
          return null;
        },
        
        () => {
          const token = localStorage.getItem("provider_token") || localStorage.getItem("token");
          if (token) {
            console.log("✅ Token exists");
            debugHasToken.value = true;
            return null;
          }
          return null;
        }
      ];
      
      // Try each source in order
      for (const source of possibleSources) {
        const providerId = source();
        if (providerId) {
          console.log("✅ Found provider ID:", providerId);
          debugProviderId.value = providerId;
          return providerId;
        }
      }
      
      console.warn("❌ No provider ID found locally");
      return null;
    };

    // ==================== LOAD BOOKINGS FUNCTION ====================
    const loadBookings = async () => {
      console.log("🚀 Starting bookings load...");
      
      loading.value = true;
      loadingProgress.value = 0;
      error.value = "";
      debugProviderId.value = "";
      debugHasToken.value = false;
      debugApiEndpoint.value = "";
      serviceDetailsCache.value = {};
      
      try {
        // Get provider ID
        let providerId = getProviderId();
        debugProviderId.value = providerId || "Not found";
        
        if (!providerId) {
          console.log("🔄 No provider ID found locally, trying to fetch from API...");
          try {
            const userResponse = await http.get('/users/profile');
            const userData = userResponse.data;
            console.log("👤 User profile data:", userData);
            
            providerId = userData.providerId || userData.pid || userData._id || userData.id;
            
            if (providerId) {
              console.log("✅ Got provider ID from API:", providerId);
              debugProviderId.value = providerId;
              localStorage.setItem('providerId', providerId);
            } else {
              throw new Error("No provider ID in user profile");
            }
          } catch (apiErr) {
            console.error("❌ Failed to fetch user profile:", apiErr);
            error.value = "Unable to authenticate. Please login again.";
            loading.value = false;
            return;
          }
        }
        
        loadingProgress.value = 30;
        
        // Try to fetch all services in background
        console.log("🔄 Starting services fetch in background...");
        fetchAllServices(providerId).then(() => {
          console.log("✅ Background services fetch completed");
        }).catch(err => {
          console.log("⚠️ Background services fetch failed:", err);
        });
        
        loadingProgress.value = 50;
        
        // Fetch bookings
        const bookingEndpoints = [
          `/bookings/provider/${providerId}`,
          `/bookings?providerId=${providerId}`,
          `/api/bookings/provider/${providerId}`
        ];
        
        let bookingsData = null;
        
        for (const endpoint of bookingEndpoints) {
          try {
            console.log(`📡 Trying bookings endpoint: ${endpoint}`);
            debugApiEndpoint.value = endpoint;
            const response = await http.get(endpoint);
            console.log("📦 Bookings API Response:", response.data);
            
            if (response.data && (Array.isArray(response.data) || response.data.bookings || response.data.data)) {
              bookingsData = response.data;
              console.log("✅ Bookings data found from endpoint:", endpoint);
              break;
            }
          } catch (endpointError) {
            console.log(`❌ Bookings endpoint ${endpoint} failed:`, endpointError.message);
          }
        }
        
        loadingProgress.value = 70;
        
        if (!bookingsData) {
          throw new Error("No bookings data found from any endpoint");
        }
        
        // Process the bookings data
        bookings.value = await processBookings(bookingsData);
        calculateStats();
        
        loadingProgress.value = 100;
        lastUpdatedTime.value = new Date().toLocaleTimeString();
        
        console.log(`✅ Loaded ${bookings.value.length} bookings`);
        
      } catch (err) {
        console.error("❌ Load Error:", err);
        error.value = err.response?.data?.message || err.message || "Failed to load bookings";
        
        debugLocalStorageKeys.value = Array.from({length: localStorage.length}, (_, i) => 
          localStorage.key(i)
        ).join(", ");
        
        bookings.value = [];
        calculateStats();
      } finally {
        loading.value = false;
        setTimeout(() => { loadingProgress.value = 0; }, 500);
      }
    };

    // ==================== PROCESS BOOKINGS ====================
    const processBookings = async (apiBookings) => {
      if (!apiBookings) return [];
      
      let bookingsArray = [];
      
      // Handle different response structures
      if (Array.isArray(apiBookings)) {
        bookingsArray = apiBookings;
      } else if (apiBookings.bookings && Array.isArray(apiBookings.bookings)) {
        bookingsArray = apiBookings.bookings;
      } else if (apiBookings.data && Array.isArray(apiBookings.data)) {
        bookingsArray = apiBookings.data;
      } else {
        console.warn("❌ Unexpected API response structure:", apiBookings);
        return [];
      }

      const processedBookings = [];
      
      // Process bookings in batches
      const batchSize = 5;
      for (let i = 0; i < bookingsArray.length; i += batchSize) {
        const batch = bookingsArray.slice(i, i + batchSize);
        const batchPromises = batch.map(booking => processSingleBooking(booking));
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach(result => {
          if (result.status === 'fulfilled' && result.value) {
            processedBookings.push(result.value);
          }
        });
      }

      console.log(`✅ Processed ${processedBookings.length} bookings`);
      
      // Log sample booking with service details
      if (processedBookings.length > 0) {
        console.log("📊 Sample booking with service details:", {
          serviceId: processedBookings[0].serviceId,
          serviceName: processedBookings[0].serviceName,
          serviceCategory: processedBookings[0].serviceCategory,
          servicePrice: processedBookings[0].servicePrice,
          actualPrice: processedBookings[0].actualPrice,
          rawServiceData: processedBookings[0].rawServiceData
        });
      }

      // Sort by booking date (newest first)
      processedBookings.sort((a, b) => {
        const dateA = a.bookingDate ? new Date(a.bookingDate) : new Date();
        const dateB = b.bookingDate ? new Date(b.bookingDate) : new Date();
        return dateB - dateA;
      });

      return processedBookings;
    };

    // ==================== PROCESS SINGLE BOOKING ====================
    const processSingleBooking = async (booking) => {
      try {
        const originalBooking = booking;
        const isAdminBooking = booking.createdBy === 'admin' || booking.adminId || booking.isAdminBooking;
        
        // Extract customer information
        const customer = booking.customer || {};
        
        // Get customer ID (CID)
        const customerId = customer.cid || 
                          customer._id || 
                          booking.customerId || 
                          booking.customerId?._id ||
                          booking.customerId?.cid;
        
        // ==================== FIX 1: ADMIN/CUSTOMER DISPLAY LOGIC ====================
        // Get customer name
        let customerName = '';
        if (isAdminBooking) {
            const admin = booking.adminDetails || {};
            // For admin bookings, use the admin's name without prepending "Admin"
            customerName = admin.fullname || admin.name || admin.username || '';
            
            // If no admin name found, use a generic name but DON'T prepend "Admin"
            if (!customerName) {
                customerName = 'Booking';
            }
        } else {
            if (customer.fullname) {
                customerName = customer.fullname;
            } else if (customer.name) {
                customerName = customer.name;
            } else if (customer.firstName || customer.lastName) {
                customerName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
            } else if (booking.customerName) {
                customerName = booking.customerName;
            } else if (customerId) {
                customerName = `Customer CID:${customerId.substring(0, 8)}`;
            } else {
                customerName = 'Customer';
            }
        }
        
        // Clean up name
        customerName = customerName
          .replace(/Admin confirmed/gi, '')
          .replace(/aqssss+/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Get customer email
        let customerEmail = '';
        if (isAdminBooking) {
          const admin = booking.adminDetails || {};
          customerEmail = admin.email || booking.adminEmail || '';
        } else {
          customerEmail = customer.email || booking.customerEmail || '';
        }
        
        // Get customer phone
        let customerPhone = '';
        if (isAdminBooking) {
          const admin = booking.adminDetails || {};
          customerPhone = admin.phone || admin.phonenumber || booking.adminPhone || '';
        } else {
          customerPhone = customer.phone || customer.phonenumber || booking.customerPhone || '';
        }
        
        // Get service information
        const service = booking.service || {};
        const serviceId = service._id || booking.serviceId || booking.service?._id || service.serviceId;
        
        let serviceName = 'Service';
        let serviceCategory = 'General';
        let serviceSubcategory = '';
        let servicePrice = 0;
        let actualPrice = 0;
        let rawServiceData = null;
        
        // Get service details if we have serviceId
        if (serviceId) {
          // Check cache first
          let serviceDetails = getServiceDetails(serviceId);
          
          // If not in cache, try to fetch from API
          if (!serviceDetails) {
            console.log(`🔍 Service ${serviceId} not in cache, fetching from API...`);
            serviceDetails = await fetchServiceDetailsFromApi(serviceId);
          }
          
          if (serviceDetails) {
            serviceName = serviceDetails.name;
            serviceCategory = serviceDetails.category;
            serviceSubcategory = serviceDetails.subcategory;
            servicePrice = serviceDetails.price;
            actualPrice = serviceDetails.price;
            rawServiceData = serviceDetails.rawData;
            
            console.log(`✅ Service details for ${serviceId}:`, {
              name: serviceName,
              category: serviceCategory,
              subcategory: serviceSubcategory,
              price: servicePrice
            });
          } else {
            console.log(`⚠️ No service details found for ${serviceId}, using booking data`);
          }
        }
        
        // Fallback to booking data
        if (serviceName === 'Service') {
          if (service.title) {
            serviceName = service.title;
          } else if (service.name) {
            serviceName = service.name;
          } else if (booking.serviceName) {
            serviceName = booking.serviceName;
          }
        }
        
        // Clean up service name
        serviceName = serviceName
          .replace(/aqssss+/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Get booking date
        let bookingDate = '';
        if (booking.bookingDate) {
          bookingDate = booking.bookingDate;
        } else if (booking.date) {
          bookingDate = booking.date;
        } else if (booking.appointmentDate) {
          bookingDate = booking.appointmentDate;
        }
        
        // Get times
        let startTime = booking.startTime || booking.time || booking.start || '09:00';
        let endTime = booking.endTime || booking.end || '11:00';
        
        // Get amount
        let amount = 0;
        if (booking.totalPrice !== undefined) {
          amount = parseFloat(booking.totalPrice);
        } else if (booking.amount !== undefined) {
          amount = parseFloat(booking.amount);
        } else if (booking.price !== undefined) {
          amount = parseFloat(booking.price);
        }
        
        // Use booking amount if service price is 0
        if (actualPrice === 0 && amount > 0) {
          actualPrice = amount;
        }
        
        // Get status
        let status = 'pending';
        if (booking.status) {
          status = booking.status.toLowerCase();
        }
        
        // Get created date
        let createdAt = new Date().toISOString();
        if (booking.createdAt) {
          createdAt = booking.createdAt;
        } else if (booking.createdDate) {
          createdAt = booking.createdDate;
        }

        return {
          _id: booking._id || booking.bookingId || booking.id || `booking-${Date.now()}-${Math.random()}`,
          customerId: customerId,
          customerName: customerName,
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          isAdminBooking: isAdminBooking,
          serviceId: serviceId,
          serviceName: serviceName,
          serviceCategory: serviceCategory,
          serviceSubcategory: serviceSubcategory,
          servicePrice: servicePrice ? servicePrice.toFixed(2) : amount.toFixed(2),
          actualPrice: actualPrice ? actualPrice.toFixed(2) : amount.toFixed(2),
          bookingDate: bookingDate,
          startTime: startTime,
          endTime: endTime,
          status: status,
          amount: amount.toFixed(2),
          createdAt: createdAt,
          originalData: originalBooking,
          rawServiceData: rawServiceData,
          customerDetails: isAdminBooking ? booking.adminDetails : customer
        };
        
      } catch (err) {
        console.error("❌ Error processing booking:", err, booking);
        return null;
      }
    };

    // ==================== FETCH CUSTOMER DETAILS ====================
    const fetchCustomerDetails = async (booking) => {
      if (!booking) {
        console.warn("❌ No booking provided");
        return;
      }
      
      console.log("👤 Fetching customer details for booking:", booking._id);
      console.log("📊 Booking data for customer lookup:", {
        customerId: booking.customerId,
        customerName: booking.customerName,
        originalData: booking.originalData
      });
      
      loadingCustomerDetails.value = true;
      customerDetailsError.value = "";
      customerDetails.value = null;
      
      try {
        // First, check if we already have customer details in the booking
        if (booking.customerDetails) {
          console.log("✅ Using customer details from booking:", booking.customerDetails);
          customerDetails.value = booking.customerDetails;
          return;
        }
        
        // Get customer ID from multiple possible locations
        const customerId = booking.customerId || 
                          booking.originalData?.customerId ||
                          booking.originalData?.customer?._id ||
                          booking.originalData?.customer?.cid ||
                          booking.originalData?.customerId?._id ||
                          booking.originalData?.customerId?.cid;
        
        console.log("🔍 Customer ID extracted:", customerId);
        
        if (!customerId) {
          console.warn("⚠️ No customer ID found in booking");
          customerDetailsError.value = "Customer details not available";
          return;
        }
        
        // Try multiple endpoints for customer details
        const customerEndpoints = [
          `/customers/${customerId}`,
          `/users/${customerId}`,
          `/users/profile/${customerId}`,
          `/api/customers/${customerId}`
        ];
        
        let customerData = null;
        
        for (const endpoint of customerEndpoints) {
          try {
            console.log(`📡 Trying customer endpoint: ${endpoint}`);
            const response = await http.get(endpoint);
            console.log("👤 Customer API Response:", response.data);
            
            if (response.data) {
              customerData = response.data;
              console.log("✅ Found customer data from endpoint:", endpoint);
              break;
            }
          } catch (endpointError) {
            console.log(`Customer endpoint ${endpoint} failed:`, endpointError.message);
          }
        }
        
        if (customerData) {
          // Process customer data
          customerDetails.value = {
            id: customerData._id || customerData.id,
            cid: customerData.cid || customerData._id,
            fullname: customerData.fullname || customerData.name || customerData.username || '',
            email: customerData.email || '',
            phone: customerData.phone || customerData.phoneNumber || customerData.phonenumber || '',
            address: customerData.address || customerData.location || '',
            profilePicture: customerData.profilePicture || customerData.avatar || ''
          };
          
          console.log("✅ Processed customer details:", customerDetails.value);
        } else {
          console.warn("⚠️ No customer data found from any endpoint");
          customerDetailsError.value = "Customer details not available";
        }
        
      } catch (err) {
        console.error("❌ Error fetching customer details:", err);
        customerDetailsError.value = err.message || "Failed to load customer details";
      } finally {
        loadingCustomerDetails.value = false;
      }
    };

    // ==================== FILTERING ====================
    const timelineFilteredBookings = computed(() => {
      if (selectedPeriod.value === "all") {
        return bookings.value;
      }

      return bookings.value.filter(booking => {
        switch (selectedPeriod.value) {
          case "past":
            return isPastBooking(booking);
          case "today":
            return isTodayBooking(booking);
          case "tomorrow":
            return isTomorrowBooking(booking);
          case "next5days":
            return isNext5DaysBooking(booking);
          default:
            return true;
        }
      });
    });

    const filteredBookings = computed(() => {
      let filtered = timelineFilteredBookings.value;

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(booking => 
          booking.customerName.toLowerCase().includes(query) ||
          booking.serviceName.toLowerCase().includes(query) ||
          booking.customerEmail.toLowerCase().includes(query) ||
          booking.serviceCategory.toLowerCase().includes(query)
        );
      }

      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(booking => booking.status === statusFilter.value);
      }

      return filtered;
    });

    const displayBookings = computed(() => filteredBookings.value);
    const paginatedBookings = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return displayBookings.value.slice(start, end);
    });
    const totalPages = computed(() => Math.ceil(displayBookings.value.length / itemsPerPage.value));

    // ==================== FORMATTING FUNCTIONS ====================
    const formatCustomerName = (name) => {
      if (!name) return 'Customer';
      
      if (name.includes('CID:')) {
        return name;
      }
      
      return name
        .replace(/Admin confirmed/gi, '')
        .replace(/aqssss+/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    const formatServiceName = (name) => {
      if (!name) return 'Service';
      return name
        .replace(/aqssss+/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const formatCleanDate = (dateString) => {
      if (!dateString) return 'No date';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } catch (err) {
        return 'Invalid date';
      }
    };

    const getCleanInitials = (name) => {
      const cleanName = formatCustomerName(name);
      if (!cleanName) return 'C';
      
      if (cleanName.includes('CID:')) {
        return 'C';
      }
      
      const words = cleanName.split(' ');
      if (words.length === 1 && words[0] === 'Customer') {
        return 'C';
      }
      
      return words.map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const formatStatus = (status) => {
      const statusMap = {
        confirmed: 'Confirmed',
        completed: 'Completed',
        pending: 'Pending',
        cancelled: 'Cancelled'
      };
      return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getTimeUntilBooking = (bookingDate) => {
      if (!bookingDate) return '';
      try {
        const now = new Date();
        const booking = new Date(bookingDate);
        const diffMs = booking - now;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Past booking';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 7) return `${diffDays} days`;
        return 'Later';
      } catch (err) {
        return '';
      }
    };

    const formatRelativeTime = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatCleanDate(dateString);
      } catch (err) {
        return '';
      }
    };

    // ==================== CORE FUNCTIONS ====================
    const calculateDuration = (startTime, endTime) => {
      if (!startTime || !endTime) return 0;
      try {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        return Math.round((end - start) / (1000 * 60));
      } catch (err) {
        return 0;
      }
    };

    const calculateStats = () => {
      if (bookings.value.length === 0) {
        stats.value = { totalBookings: 0, today: 0, upcoming: 0, completed: 0, revenue: 0 };
        return;
      }

      stats.value = {
        totalBookings: bookings.value.length,
        today: bookings.value.filter(b => isTodayBooking(b)).length,
        upcoming: bookings.value.filter(b => !isPastBooking(b) && b.status !== 'cancelled').length,
        completed: bookings.value.filter(b => b.status === 'completed').length,
        revenue: bookings.value
          .filter(b => b.status !== 'cancelled')
          .reduce((sum, booking) => sum + (parseFloat(booking.actualPrice || booking.servicePrice || booking.amount) || 0), 0)
          .toFixed(2)
      };
    };

    // ==================== ACTION FUNCTIONS ====================
    const selectTimelinePeriod = (periodId) => {
      selectedPeriod.value = periodId;
      currentPage.value = 1;
    };

    const clearTimelinePeriod = () => {
      selectedPeriod.value = "all";
      currentPage.value = 1;
    };

    const clearFilters = () => {
      searchQuery.value = "";
      statusFilter.value = "all";
      clearTimelinePeriod();
      currentPage.value = 1;
    };

    const completeBooking = async (booking) => {
      try {
        await http.patch(`/bookings/${booking._id}/status`, { status: 'completed' });
        booking.status = 'completed';
        calculateStats();
        alert("✅ Booking marked as completed!");
      } catch (err) {
        console.error('Error completing booking:', err);
        alert("Failed to complete booking. Please try again.");
      }
    };

    const viewBookingDetailsModal = async (booking) => {
      selectedBooking.value = booking;
      customerDetails.value = null;
      loadingCustomerDetails.value = false;
      customerDetailsError.value = "";
      
      await fetchCustomerDetails(booking);
    };

    const closeModal = () => {
      selectedBooking.value = null;
      customerDetails.value = null;
      loadingCustomerDetails.value = false;
      customerDetailsError.value = "";
    };

    const contactCustomer = (booking) => {
      if (booking.customerEmail) {
        window.location.href = `mailto:${booking.customerEmail}`;
      } else {
        alert("No email address available for this customer.");
      }
    };

    const promoteServices = () => {
      alert("🎯 Share your booking link to get more bookings!");
    };

    const getActiveFilterLabel = () => {
      if (selectedPeriod.value === "all") return "All Bookings";
      const period = timelinePeriods.value.find(p => p.id === selectedPeriod.value);
      return period ? period.label : "";
    };

    const showDebugInfo = () => {
      showDebug.value = !showDebug.value;
      debugLocalStorageKeys.value = Array.from({length: localStorage.length}, (_, i) => 
        localStorage.key(i)
      ).join(", ");
    };

    const copyDebugInfo = () => {
      const debugText = `Provider ID: ${debugProviderId.value}\nToken Exists: ${debugHasToken.value}\nEndpoint: ${debugApiEndpoint.value}\nLocalStorage Keys: ${debugLocalStorageKeys.value}`;
      navigator.clipboard.writeText(debugText);
      alert("Debug info copied to clipboard!");
    };

    const exportBookings = () => {
      if (bookings.value.length === 0) {
        alert("No bookings to export.");
        return;
      }
      
      const csvContent = [
        ['Customer Name', 'Email', 'Service', 'Category', 'Subcategory', 'Date', 'Time', 'Status', 'Amount'].join(','),
        ...bookings.value.map(b => [
          `"${b.customerName}"`,
          `"${b.customerEmail || ''}"`,
          `"${b.serviceName}"`,
          `"${b.serviceCategory || ''}"`,
          `"${b.serviceSubcategory || ''}"`,
          `"${formatCleanDate(b.bookingDate)}"`,
          `"${formatTimeSlot(b.startTime, b.endTime)}"`,
          `"${isPastBooking(b) ? 'Past Booking' : formatStatus(b.status)}"`,
          `"ETB ${b.actualPrice || b.servicePrice || b.amount}"`
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    // ==================== LIFECYCLE ====================
    onMounted(() => {
      console.log("📅 BookingsSection mounted");
      loadBookings();
    });

    return {
      // State
      loading,
      loadingProgress,
      error,
      bookings,
      searchQuery,
      statusFilter,
      viewMode,
      selectedPeriod,
      timelinePeriods,
      currentPage,
      itemsPerPage,
      selectedBooking,
      showDebug,
      lastUpdatedTime,
      
      // Customer details state
      customerDetails,
      loadingCustomerDetails,
      customerDetailsError,
      
      // Debug
      debugProviderId,
      debugHasToken,
      debugApiEndpoint,
      debugLocalStorageKeys,
      
      // Stats
      stats,
      
      // Computed
      displayBookings,
      paginatedBookings,
      totalPages,
      timelineFilteredBookings,
      
      // Methods
      loadBookings,
      clearFilters,
      completeBooking,
      viewBookingDetailsModal,
      closeModal,
      contactCustomer,
      selectTimelinePeriod,
      clearTimelinePeriod,
      promoteServices,
      getActiveFilterLabel,
      showDebugInfo,
      copyDebugInfo,
      exportBookings,
      
      // Formatting
      getCleanInitials,
      formatCleanDate,
      formatCustomerName,
      formatServiceName,
      formatStatus,
      calculateDuration,
      formatTimeSlot,
      convertTo12HourFormat, // Added new function
      getTimeUntilBooking,
      formatRelativeTime,
      isTodayBooking,
      isPastBooking,
      isTomorrowBooking,
      isNext5DaysBooking
    };
  }
};
</script>

<style scoped>
/* Add these new styles to your existing CSS */

/* Customer ID Badge */
.customer-id-badge {
  background: #f3f4f6;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 8px;
  border: 1px solid #e5e7eb;
}

.customer-id {
  background: #f3f4f6;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 8px;
  border: 1px solid #e5e7eb;
  display: inline-block;
}

/* Service Meta Row */
.service-meta-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.service-subcategory {
  background: #e0f2fe;
  color: #0369a1;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid #bae6fd;
}


.bookings-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', 'Segoe UI', -apple-system, sans-serif;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

/* Header */
.header {
  background: white;
  border-radius: 16px;
  padding: 24px 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.title-section .title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.title-section .subtitle {
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #64748b;
  font-weight: 600;
}

.btn-outline:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.85rem;
}

/* Loading State */
.loading-container {
  min-height: 400px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
  max-width: 500px;
}

.spinner-large {
  width: 60px;
  height: 60px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-progress {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  width: 300px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1e40af);
  transition: width 0.3s ease;
}

/* Error State */
.error-container {
  min-height: 400px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-content {
  text-align: center;
  max-width: 600px;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.error-icon {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 20px;
}

.error-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.debug-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 10px;
  text-align: left;
  font-size: 0.9rem;
}

.debug-info h4 {
  margin-top: 0;
  color: #1e293b;
}

.debug-info p {
  margin: 5px 0;
  color: #64748b;
}

/* Success Empty State */
.success-empty-state {
  min-height: 400px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-content {
  text-align: center;
  max-width: 500px;
}

.success-icon {
  font-size: 4rem;
  color: #10b981;
  margin-bottom: 20px;
}

.success-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

/* Statistics */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-icon.total { background: linear-gradient(135deg, #dbeafe, #93c5fd); color: #1e40af; }
.stat-icon.today { background: linear-gradient(135deg, #fef3c7, #fcd34d); color: #d97706; }
.stat-icon.upcoming { background: linear-gradient(135deg, #dcfce7, #86efac); color: #16a34a; }
.stat-icon.completed { background: linear-gradient(135deg, #f3e8ff, #d8b4fe); color: #9333ea; }
.stat-icon.revenue { background: linear-gradient(135deg, #fce7f3, #f9a8d4); color: #db2777; }

.stat-content h3 {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-content p {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* API Status */
.api-status {
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 0.95rem;
}

.api-status.success {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #16a34a;
  border: 1px solid #86efac;
}

/* Filters */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
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
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 14px 20px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-select {
  padding: 14px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  font-size: 0.95rem;
  font-weight: 500;
  min-width: 150px;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

/* Timeline Filter */
.timeline-filter-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.timeline-filter-header {
  margin-bottom: 20px;
}

.timeline-filter-header h3 {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.timeline-filter-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.timeline-filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.timeline-filter-btn {
  padding: 10px 20px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.timeline-filter-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.timeline-filter-btn.active {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.timeline-active-filter {
  padding: 16px;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-radius: 12px;
  border: 1px solid #bae6fd;
}

.active-filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.active-filter-badge {
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0369a1;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(3, 105, 161, 0.1);
}

.clear-period-btn {
  background: #f1f5f9;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  font-size: 0.8rem;
  padding: 0;
  transition: all 0.3s ease;
}

.clear-period-btn:hover {
  background: #e2e8f0;
  color: #ef4444;
}

.filter-count {
  color: #0369a1;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 6px 12px;
  background: white;
  border-radius: 10px;
  border: 1px solid #bae6fd;
}

/* Bookings Container */
.bookings-container {
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-header h2 {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.view-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.view-btn {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.view-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.view-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* PROFESSIONAL BOOKING CARDS */
.professional-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.professional-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.professional-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: #3b82f6;
}

.professional-card.today-card {
  border-left: 4px solid #10b981;
}

.professional-card.admin-card {
  border-left: 4px solid #8b5cf6;
}

.professional-card.completed-card {
  border-left: 4px solid #6b7280;
}

.professional-card.past-card {
  border-left: 4px solid #94a3b8;
  opacity: 0.9;
}

/* Card Header */
.card-header-section {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
}

.customer-avatar-section {
  position: relative;
}

.avatar-circle {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.customer-type-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.customer-type-indicator.admin {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.customer-type-indicator.client {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.customer-info-section {
  flex: 1;
}

.customer-name {
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.customer-meta {
  color: #6b7280;
  font-size: 0.85rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-meta i {
  width: 16px;
  margin-right: 6px;
  color: #9ca3af;
}

.booking-status-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}

.status-badge.confirmed {
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
  color: #1e40af;
}

.status-badge.completed {
  background: linear-gradient(135deg, #f3f4f6, #d1d5db);
  color: #374151;
}

.status-badge.pending {
  background: linear-gradient(135deg, #fef3c7, #fcd34d);
  color: #92400e;
}

.status-badge.cancelled {
  background: linear-gradient(135deg, #fee2e2, #fca5a5);
  color: #dc2626;
}

/* NEW: Past Booking Badge */
.past-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #64748b;
  border: 1px solid #cbd5e1;
}

.booking-id {
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Service Details */
.service-details-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 14px;
  border: 1px solid #f3f4f6;
}

.service-icon-circle {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.service-info {
  flex: 1;
}

.service-name {
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.service-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.service-category {
  background: white;
  color: #6b7280;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #e5e7eb;
}

.service-duration {
  color: #d97706;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.service-amount {
  text-align: right;
}

.amount-label {
  display: block;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.amount-value {
  display: block;
  color: #059669;
  font-size: 1.5rem;
  font-weight: 800;
}

/* Date & Time Section */
.datetime-section {
  margin-bottom: 20px;
}

.date-time-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
}

.date-section, .time-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-icon, .time-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.date-content, .time-content {
  flex: 1;
}

.date-label, .time-label {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.date-value, .time-value {
  color: #1f2937;
  font-size: 1rem;
  font-weight: 700;
}

/* Additional Info */
.additional-info-section {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #f3f4f6;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 500;
}

.info-item i {
  color: #9ca3af;
}

/* Action Buttons */
.action-buttons-section {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.mark-complete-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.mark-complete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.view-details-btn {
  background: #f3f4f6;
  color: #374151;
}

.view-details-btn:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.contact-btn {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Bookings List View */
.bookings-list {
  margin-bottom: 30px;
}

.bookings-table {
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  background: white;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1.2fr 0.8fr 1fr 0.8fr 1fr;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 16px 20px;
  font-weight: 700;
  color: #475569;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1.2fr 0.8fr 1fr 0.8fr 1fr;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.table-cell {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.customer-cell {
  align-items: center;
}

.customer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  margin-right: 12px;
  flex-shrink: 0;
}

.customer-info {
  flex: 1;
}

.customer-main {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.type-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.type-badge.admin {
  background: #ede9fe;
  color: #7c3aed;
}

.type-badge.client {
  background: #d1fae5;
  color: #059669;
}

.customer-email {
  color: #6b7280;
  font-size: 0.85rem;
}

.service-cell {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.service-cell strong {
  margin-bottom: 4px;
}

.service-category {
  background: #f3f4f6;
  color: #6b7280;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  display: inline-block;
}

.service-price {
  color: #059669;
  font-size: 0.85rem;
  font-weight: 600;
}

.datetime-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-section, .time-section {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 0.9rem;
}

.date-section i, .time-section i {
  width: 16px;
  color: #9ca3af;
}

.duration-container, .amount-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.duration-container i, .amount-container i {
  color: #9ca3af;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-action.complete {
  background: #d1fae5;
  color: #059669;
}

.btn-action.complete:hover {
  background: #a7f3d0;
  transform: translateY(-2px);
}

.btn-action.view {
  background: #e0f2fe;
  color: #0284c7;
}

.btn-action.view:hover {
  background: #bae6fd;
  transform: translateY(-2px);
}

.btn-action.contact {
  background: #f3e8ff;
  color: #7c3aed;
}

.btn-action.contact:hover {
  background: #ddd6fe;
  transform: translateY(-2px);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.pagination-btn {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
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
  width: 36px;
  height: 36px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover {
  border-color: #cbd5e1;
}

.page-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.no-results i {
  font-size: 3rem;
  color: #9ca3af;
  margin-bottom: 16px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* Add this to your existing CSS */
.loading-indicator {
  font-size: 0.8rem;
  color: #64748b;
  margin-left: 10px;
  font-weight: normal;
}

.customer-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
}

.customer-section h4 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #f3f4f6;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 24px;
}

.booking-details h4 {
  color: #1e293b;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
}

.booking-details p {
  color: #4b5563;
  margin: 8px 0;
}

.booking-details strong {
  color: #1f2937;
  font-weight: 600;
}

.modal-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.professional-card {
  animation: fadeIn 0.5s ease forwards;
}

/* Responsive */
@media (max-width: 1200px) {
  .professional-cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
}

@media (max-width: 768px) {
  .professional-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .date-time-card {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .action-buttons-section {
    flex-direction: column;
  }
  
  .table-header, .table-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .table-cell {
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .table-cell:last-child {
    border-bottom: none;
  }
}

@media (max-width: 480px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .filters-row {
    flex-direction: column;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .card-header-section {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .booking-status-section {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}
</style>