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
              <option value="yesterday">Yesterday</option>
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

      <!-- Timeline Filter Section (Replaces timeline display) -->
      <div class="timeline-filter-section">
        <div class="timeline-filter-header">
          <h3><i class="fa-solid fa-timeline"></i> Filter by Time Period</h3>
          <p class="timeline-filter-subtitle">Select a time period to view bookings from that timeframe</p>
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
        
        <div v-if="selectedPeriodLabel" class="timeline-active-filter">
          <span class="active-filter-badge">
            <i class="fa-solid fa-filter"></i>
            Showing: {{ selectedPeriodLabel }}
            <button class="clear-period-btn" @click="clearTimelinePeriod">
              <i class="fa-solid fa-times"></i>
            </button>
          </span>
          <span class="filter-count">{{ timelineFilteredBookings.length }} bookings found</span>
        </div>
      </div>

      <!-- Bookings List -->
      <div class="bookings-container">
        <div class="section-header">
          <h2>
            <span v-if="selectedPeriodLabel">{{ selectedPeriodLabel }} </span>
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
              :id="'booking-' + booking._id"
              class="table-row"
              :class="{
                'highlight-new': isNewBooking(booking),
                'urgent': isUrgentBooking(booking)
              }"
            >
              <!-- Enhanced Customer Cell -->
              <div class="table-cell customer-cell">
                <div class="customer-avatar" :class="{ 'admin-avatar': booking.isAdminBooking }">
                  {{ getInitials(getCustomerName(booking)) }}
                </div>
                <div class="customer-info">
                  <div class="customer-main">
                    <strong>{{ getCustomerName(booking) }}</strong>
                    <span v-if="booking.isAdminBooking" class="admin-badge">
                      <i class="fa-solid fa-user-tie"></i> Admin
                    </span>
                  </div>
                  <div v-if="!booking.isAdminBooking" class="customer-details">
                    <span class="customer-email">{{ getCustomerEmail(booking) }}</span>
                    <span v-if="getCustomerPhone(booking)" class="customer-phone">
                      <i class="fa-solid fa-phone"></i> {{ getCustomerPhone(booking) }}
                    </span>
                  </div>
                  <div v-else class="customer-details admin-details">
                    <span class="store-badge">
                      <i class="fa-solid fa-store"></i> In-store booking
                    </span>
                  </div>
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
                    @click="viewBookingDetailsModal(booking)"
                    title="View Details"
                  >
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AMAZING Bookings Grid View -->
        <div v-else class="bookings-grid">
          <div 
            v-for="booking in paginatedBookings" 
            :key="booking._id"
            :id="'booking-' + booking._id"
            class="booking-card"
            :class="{
              'new-booking': isNewBooking(booking),
              'urgent-booking': isUrgentBooking(booking),
              'admin-booking': booking.isAdminBooking
            }"
          >
            <!-- Card Header -->
            <div class="card-header">
              <div class="customer-avatar large" :class="{ 'admin-avatar': booking.isAdminBooking }">
                {{ getInitials(getCustomerName(booking)) }}
              </div>
              <div class="customer-info">
                <div class="customer-main">
                  <h4>{{ getCustomerName(booking) }}</h4>
                  <div class="customer-badges">
                    <span v-if="booking.isAdminBooking" class="admin-badge">
                      <i class="fa-solid fa-user-tie"></i> Admin
                    </span>
                    <span class="status-badge" :class="booking.status">
                      {{ formatStatus(booking.status) }}
                    </span>
                  </div>
                </div>
                <div v-if="!booking.isAdminBooking" class="customer-contact">
                  <span class="contact-item">
                    <i class="fa-solid fa-envelope"></i>
                    {{ getCustomerEmail(booking) }}
                  </span>
                  <span v-if="getCustomerPhone(booking)" class="contact-item">
                    <i class="fa-solid fa-phone"></i>
                    {{ getCustomerPhone(booking) }}
                  </span>
                </div>
                <div v-else class="customer-contact admin-contact">
                  <span class="store-badge">
                    <i class="fa-solid fa-store"></i> In-store booking
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Service Details -->
            <div class="service-section">
              <div class="service-icon">
                <i class="fa-solid fa-scissors"></i>
              </div>
              <div class="service-details">
                <h5>{{ getServiceName(booking) }}</h5>
                <p class="service-category">{{ getCategoryName(booking) }}</p>
              </div>
            </div>
            
            <!-- Booking Details -->
            <div class="booking-details">
              <div class="detail-row">
                <div class="detail-item">
                  <i class="fa-solid fa-calendar"></i>
                  <div>
                    <span class="detail-label">Date</span>
                    <span class="detail-value">{{ formatDate(booking.bookingDate || booking.date) }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <i class="fa-solid fa-clock"></i>
                  <div>
                    <span class="detail-label">Time</span>
                    <span class="detail-value">{{ booking.startTime }} - {{ booking.endTime }}</span>
                  </div>
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <i class="fa-solid fa-hourglass"></i>
                  <div>
                    <span class="detail-label">Duration</span>
                    <span class="detail-value">{{ calculateDuration(booking.startTime, booking.endTime) || booking.duration || 60 }} mins</span>
                  </div>
                </div>
                <div class="detail-item">
                  <i class="fa-solid fa-dollar-sign"></i>
                  <div>
                    <span class="detail-label">Amount</span>
                    <span class="detail-value">${{ getBookingAmount(booking) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timestamp -->
            <div class="timestamp">
              <i class="fa-solid fa-clock"></i>
              Booked {{ formatRelativeTime(booking.createdAt) }}
            </div>
            
            <!-- Action Buttons -->
            <div class="card-actions">
              <button 
                v-if="booking.status === 'pending'"
                class="action-btn confirm-btn"
                @click="confirmBooking(booking)"
              >
                <i class="fa-solid fa-check"></i> Confirm
              </button>
              <button 
                v-if="booking.status === 'confirmed'"
                class="action-btn complete-btn"
                @click="completeBooking(booking)"
              >
                <i class="fa-solid fa-flag-checkered"></i> Complete
              </button>
              <button 
                class="action-btn view-btn"
                @click="viewBookingDetailsModal(booking)"
              >
                <i class="fa-solid fa-eye"></i> View Details
              </button>
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
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="selectedBooking" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-circle-info"></i>
            Booking Details
          </h3>
          <button class="modal-close" @click="closeModal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- Booking Overview -->
          <div class="booking-overview">
            <div class="overview-avatar" :class="{ 'admin-avatar': selectedBooking.isAdminBooking }">
              {{ getInitials(getCustomerName(selectedBooking)) }}
            </div>
            <div class="overview-info">
              <h4>{{ getCustomerName(selectedBooking) }}</h4>
              <div class="overview-badges">
                <span class="status-badge" :class="selectedBooking.status">
                  {{ formatStatus(selectedBooking.status) }}
                </span>
                <span v-if="selectedBooking.isAdminBooking" class="admin-badge">
                  <i class="fa-solid fa-user-tie"></i> Admin Booking
                </span>
              </div>
              <div class="overview-meta">
                <span>Booked {{ formatRelativeTime(selectedBooking.createdAt) }}</span>
                <span>•</span>
                <span>Booking ID: {{ selectedBooking._id?.substring(0, 8) }}...</span>
              </div>
            </div>
            <div class="overview-amount">
              <span class="amount-label">Total Amount</span>
              <span class="amount-value">${{ getBookingAmount(selectedBooking) }}</span>
            </div>
          </div>

          <!-- Service Details -->
          <div class="details-section">
            <h5><i class="fa-solid fa-scissors"></i> Service Details</h5>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Service</span>
                <span class="detail-value">{{ getServiceName(selectedBooking) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Category</span>
                <span class="detail-value">{{ getCategoryName(selectedBooking) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date</span>
                <span class="detail-value">{{ formatDate(selectedBooking.bookingDate || selectedBooking.date) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Time</span>
                <span class="detail-value">{{ selectedBooking.startTime }} - {{ selectedBooking.endTime }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Duration</span>
                <span class="detail-value">{{ calculateDuration(selectedBooking.startTime, selectedBooking.endTime) || selectedBooking.duration || 60 }} minutes</span>
              </div>
            </div>
          </div>

          <!-- Booker Details (Enhanced) -->
          <div class="details-section">
            <h5><i class="fa-solid fa-user-circle"></i> Booker Details</h5>
            <div class="details-grid">
              <!-- Admin Booker Details -->
              <template v-if="selectedBooking.isAdminBooking">
                <div class="detail-item">
                  <span class="detail-label">Booker Type</span>
                  <span class="detail-value admin-value">
                    <i class="fa-solid fa-user-tie"></i> Admin User
                  </span>
                </div>
                <div v-if="selectedBooking.originalData?.adminName" class="detail-item">
                  <span class="detail-label">Admin Name</span>
                  <span class="detail-value">{{ selectedBooking.originalData.adminName }}</span>
                </div>
                <div v-if="selectedBooking.originalData?.adminEmail" class="detail-item">
                  <span class="detail-label">Admin Email</span>
                  <span class="detail-value">{{ selectedBooking.originalData.adminEmail }}</span>
                </div>
                <div v-if="selectedBooking.originalData?.adminPhone" class="detail-item">
                  <span class="detail-label">Admin Phone</span>
                  <span class="detail-value">{{ selectedBooking.originalData.adminPhone }}</span>
                </div>
                <div v-if="selectedBooking.originalData?.adminId" class="detail-item">
                  <span class="detail-label">Admin ID</span>
                  <span class="detail-value code">{{ selectedBooking.originalData.adminId }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Booking Method</span>
                  <span class="detail-value">In-store / Admin Panel</span>
                </div>
              </template>
              
              <!-- Customer Booker Details -->
              <template v-else>
                <div class="detail-item">
                  <span class="detail-label">Customer Name</span>
                  <span class="detail-value">{{ getCustomerName(selectedBooking) }}</span>
                </div>
                <div v-if="getCustomerEmail(selectedBooking)" class="detail-item">
                  <span class="detail-label">Email</span>
                  <span class="detail-value">{{ getCustomerEmail(selectedBooking) }}</span>
                </div>
                <div v-if="getCustomerPhone(selectedBooking)" class="detail-item">
                  <span class="detail-label">Phone</span>
                  <span class="detail-value">{{ getCustomerPhone(selectedBooking) }}</span>
                </div>
                <div v-if="selectedBooking.customerLocation" class="detail-item">
                  <span class="detail-label">Location</span>
                  <span class="detail-value">{{ selectedBooking.customerLocation }}</span>
                </div>
                <div v-if="selectedBooking.originalData?.customer?._id" class="detail-item">
                  <span class="detail-label">Customer ID</span>
                  <span class="detail-value code">{{ selectedBooking.originalData.customer._id }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Booking Method</span>
                  <span class="detail-value">Online Booking</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Payment Details -->
          <div v-if="selectedBooking.originalData?.paymentStatus" class="details-section">
            <h5><i class="fa-solid fa-credit-card"></i> Payment Details</h5>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Payment Status</span>
                <span class="detail-value payment-status" :class="selectedBooking.originalData.paymentStatus">
                  {{ formatPaymentStatus(selectedBooking.originalData.paymentStatus) }}
                </span>
              </div>
              <div v-if="selectedBooking.originalData?.paymentMethod" class="detail-item">
                <span class="detail-label">Payment Method</span>
                <span class="detail-value">{{ selectedBooking.originalData.paymentMethod }}</span>
              </div>
              <div v-if="selectedBooking.originalData?.paymentAmount" class="detail-item">
                <span class="detail-label">Amount Paid</span>
                <span class="detail-value">${{ parseFloat(selectedBooking.originalData.paymentAmount).toFixed(2) }}</span>
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
      <p><strong>Environment:</strong> {{ isDeployed ? 'Deployed (Vercel)' : 'Local' }}</p>
      <p><strong>Data Source:</strong> {{ usingSampleData ? 'Sample Data' : 'Real API' }}</p>
    </div>
    
    <div v-if="errorStatus.includes('CORS')" class="cors-help">
      <h4><i class="fa-solid fa-shield"></i> CORS Issue Detected</h4>
      <p>The backend server is blocking cross-origin requests from Vercel.</p>
      <p>Showing sample data for demonstration. Real bookings will load when CORS is fixed.</p>
    </div>
    
    <div class="error-actions">
      <button class="btn btn-primary" @click="loadBookings">
        <i class="fa-solid fa-rotate"></i> Try Again
      </button>
      <button class="btn btn-outline" @click="testConnection">
        <i class="fa-solid fa-plug"></i> Test Connection
      </button>
      <button class="btn btn-outline" @click="checkProviderStatus">
        <i class="fa-solid fa-user-check"></i> Check Status
      </button>
    </div>
  </div>
</div>
          <!-- Additional Information -->
          <div class="details-section" v-if="selectedBooking.notes || selectedBooking.originalData?.specialRequirements">
            <h5><i class="fa-solid fa-note-sticky"></i> Additional Information</h5>
            <div class="notes-content">
              {{ selectedBooking.notes || selectedBooking.originalData?.specialRequirements || 'No additional notes' }}
            </div>
          </div>

          <!-- Original Data (Debug/Admin View) -->
          <div v-if="showOriginalData" class="details-section debug-section">
            <h5 @click="showOriginalData = !showOriginalData" style="cursor: pointer;">
              <i class="fa-solid fa-code"></i>
              Original API Data (Click to toggle)
            </h5>
            <pre v-if="showOriginalData">{{ JSON.stringify(selectedBooking.originalData, null, 2) }}</pre>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal">
            <i class="fa-solid fa-times"></i> Close
          </button>
          <button 
            v-if="selectedBooking.status === 'pending'"
            class="btn btn-primary"
            @click="confirmBooking(selectedBooking); closeModal();"
          >
            <i class="fa-solid fa-check"></i> Confirm Booking
          </button>
          <button 
            v-if="selectedBooking.status === 'confirmed'"
            class="btn btn-success"
            @click="completeBooking(selectedBooking); closeModal();"
          >
            <i class="fa-solid fa-flag-checkered"></i> Mark as Complete
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
    const selectedPeriod = ref("all");
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const selectedBooking = ref(null);
    const currentProviderId = ref("");
    const currentEndpoint = ref("");
    const showOriginalData = ref(false);
    const showDebug = ref(false);
    const usingSampleData = ref(false);
    const isDeployed = ref(window.location.hostname.includes('vercel.app'));

    // Timeline periods
    const timelinePeriods = ref([
      { id: "today", label: "Today", icon: "fa-solid fa-calendar-day" },
      { id: "yesterday", label: "Yesterday", icon: "fa-solid fa-calendar-minus" },
      { id: "week", label: "This Week", icon: "fa-solid fa-calendar-week" },
      { id: "month", label: "This Month", icon: "fa-solid fa-calendar" },
      { id: "custom", label: "Custom Range", icon: "fa-solid fa-sliders" }
    ]);

    // Statistics
    const stats = ref({
      totalBookings: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      revenue: 0
    });

    // Known provider PIDs
    const knownProviderPids = {
      "691e1659e304653542a825d5": "PROV-1763579481598-1GBEN",
      "692b3c78d399bc41c3712380": "PROV-1764441208540-C269P"
    };

    // ==================== COMPUTED PROPERTIES ====================

    const selectedPeriodLabel = computed(() => {
      if (selectedPeriod.value === "all") return "";
      const period = timelinePeriods.value.find(p => p.id === selectedPeriod.value);
      return period ? period.label : "";
    });

    const timelineFilteredBookings = computed(() => {
      if (selectedPeriod.value === "all" || !selectedPeriod.value) {
        return bookings.value;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return bookings.value.filter(booking => {
        if (!booking.bookingDate) return false;
        
        const bookingDate = new Date(booking.bookingDate);
        bookingDate.setHours(0, 0, 0, 0);

        switch (selectedPeriod.value) {
          case "today":
            return bookingDate.getTime() === today.getTime();
          case "yesterday":
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return bookingDate.getTime() === yesterday.getTime();
          case "week":
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            return bookingDate >= weekStart;
          case "month":
            return bookingDate.getMonth() === today.getMonth() && 
                   bookingDate.getFullYear() === today.getFullYear();
          case "custom":
            return true;
          default:
            return true;
        }
      });
    });

    const filteredBookings = computed(() => {
      let filtered = timelineFilteredBookings.value;

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
            case 'yesterday':
              const yesterday = new Date(today);
              yesterday.setDate(yesterday.getDate() - 1);
              return bookingDate.getTime() === yesterday.getTime();
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

      return filtered;
    });

    const displayBookings = computed(() => filteredBookings.value);

    const paginatedBookings = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return displayBookings.value.slice(start, end);
    });

    const totalPages = computed(() => 
      Math.ceil(displayBookings.value.length / itemsPerPage.value)
    );

    // ==================== TIMELINE FILTER FUNCTIONS ====================

    const selectTimelinePeriod = (periodId) => {
      selectedPeriod.value = periodId;
      currentPage.value = 1;
    };

    const clearTimelinePeriod = () => {
      selectedPeriod.value = "all";
      currentPage.value = 1;
    };

    // ==================== CORS-FRIENDLY LOADING ====================

    const getProviderId = () => {
      try {
        const loggedProvider = localStorage.getItem("loggedProvider");
        
        if (!loggedProvider) {
          throw new Error("No logged provider found. Please login again.");
        }
        
        const providerData = JSON.parse(loggedProvider);
        
        // Check if PID exists in localStorage
        const existingPid = providerData.pid || providerData.providerProfile?.pid;
        if (existingPid) {
          currentProviderId.value = existingPid;
          return existingPid;
        }
        
        // Use manual mapping
        const mappedPid = knownProviderPids[providerData._id];
        if (mappedPid) {
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

    // ==================== DATA PROCESSING ====================

    const extractCustomerData = (booking) => {
      const isAdminBooking = booking.createdBy === 'admin' || booking.adminId;
      
      if (isAdminBooking) {
        return {
          customerId: null,
          fullname: 'Admin',
          email: booking.adminEmail || '',
          phone: booking.adminPhone || '',
          location: booking.adminLocation || '',
          isAdminBooking: true,
          originalAdminData: {
            adminName: booking.adminName || booking.createdByName || 'Admin User',
            adminEmail: booking.adminEmail || '',
            adminPhone: booking.adminPhone || '',
            adminId: booking.adminId || booking.createdBy || 'admin'
          }
        };
      }
      
      if (booking.customer && typeof booking.customer === 'object') {
        return {
          customerId: booking.customer._id || booking.customer.id,
          fullname: booking.customer.fullname || booking.customer.name || 'Customer',
          email: booking.customer.email || '',
          phone: booking.customer.phone || '',
          location: booking.customer.location || booking.customer.address || '',
          isAdminBooking: false,
          originalCustomer: booking.customer
        };
      }
      
      if (booking.customerName || booking.customerEmail) {
        return {
          customerId: booking.customerId || booking.userId,
          fullname: booking.customerName || 'Customer',
          email: booking.customerEmail || '',
          phone: booking.customerPhone || '',
          location: booking.customerLocation || '',
          isAdminBooking: false
        };
      }
      
      if (booking.user && typeof booking.user === 'object') {
        return {
          customerId: booking.user._id || booking.user.id,
          fullname: booking.user.fullname || booking.user.name || 'Customer',
          email: booking.user.email || '',
          phone: booking.user.phone || '',
          location: booking.user.location || booking.user.address || '',
          isAdminBooking: false,
          originalCustomer: booking.user
        };
      }
      
      return {
        customerId: null,
        fullname: 'Admin',
        email: '',
        phone: '',
        location: '',
        isAdminBooking: true,
        originalAdminData: {
          adminName: 'Admin User',
          adminEmail: '',
          adminPhone: '',
          adminId: booking.adminId || booking.createdBy || 'admin'
        }
      };
    };

    const enhanceBookingDisplay = (booking, customerData) => {
      const service = booking.service || {};
      
      return {
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
    };

    const processBookings = (apiBookings) => {
      if (!apiBookings) {
        console.warn("⚠️ No data received from API");
        return [];
      }
      
      let bookingsArray = [];
      
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

      const processedBookings = bookingsArray.map(booking => {
        const customerData = extractCustomerData(booking);
        return enhanceBookingDisplay(booking, customerData);
      });

      processedBookings.sort((a, b) => {
        const dateA = new Date(a.bookingDate || a.createdAt);
        const dateB = new Date(b.bookingDate || b.createdAt);
        return dateB - dateA;
      });

      return processedBookings;
    };

    // ==================== CORS-FRIENDLY API CALL ====================

    const makeCorsSafeRequest = async (url, options = {}) => {
      // For deployed environment, use minimal headers to avoid CORS preflight
      if (isDeployed.value) {
        const safeOptions = {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // DO NOT include Pragma, Cache-Control, or other headers that trigger preflight
          }
        };
        return await http.get(url, safeOptions);
      }
      
      // For local development, use normal headers
      return await http.get(url, options);
    };

    // ==================== LOAD BOOKINGS (FIXED FOR DEPLOYMENT) ====================

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
      usingSampleData.value = false;

      let progressInterval;

      try {
        console.log("🚀 Loading bookings for provider:", providerId);
        console.log("🌐 Environment:", isDeployed.value ? "Deployed (Vercel)" : "Local");

        // Progress simulation
        progressInterval = setInterval(() => {
          if (loadingProgress.value < 90) {
            loadingProgress.value += 10;
          }
        }, 200);

        // Try to load from cache first
        try {
          const cachedBookings = localStorage.getItem(`cachedBookings_${providerId}`);
          if (cachedBookings) {
            const cachedData = JSON.parse(cachedBookings);
            if (Date.now() - cachedData.timestamp < 300000) { // 5 minutes
              console.log("🔄 Using cached bookings data");
              bookings.value = cachedData.bookings;
              calculateStats();
              loading.value = false;
              clearInterval(progressInterval);
              loadingProgress.value = 100;
              setTimeout(() => { loadingProgress.value = 0; }, 500);
              return;
            }
          }
        } catch (cacheErr) {
          console.log("❌ Cache load error:", cacheErr);
        }

        // API call with CORS-safe configuration
        const endpoint = `/bookings/provider/${providerId}`;
        currentEndpoint.value = endpoint;
        
        console.log("📡 Calling endpoint:", endpoint);
        
        // Use CORS-safe request
        const response = await makeCorsSafeRequest(endpoint, {
          timeout: 10000
        });
        
        clearInterval(progressInterval);
        loadingProgress.value = 100;

        console.log("✅ API Response received:", response.data);
        
        const processedBookings = processBookings(response.data);
        bookings.value = processedBookings;
        
        // Cache successful response
        try {
          localStorage.setItem(`cachedBookings_${providerId}`, JSON.stringify({
            bookings: processedBookings,
            timestamp: Date.now(),
            isSample: false
          }));
        } catch (cacheErr) {
          console.log("❌ Cache save error:", cacheErr);
        }
        
        console.log(`✅ Processed ${processedBookings.length} bookings`);
        calculateStats();

      } catch (err) {
        console.error("❌ Load Error:", err);
        
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        
        // Specific CORS error handling
        if (err.message?.includes('CORS') || err.code === 'CORS_ERROR') {
          errorStatus.value = "CORS Error";
          error.value = "Server is blocking cross-origin requests. ";
          
          // Try alternative fetch method for deployed environment
          if (isDeployed.value) {
            error.value += "Trying alternative method...";
            await tryAlternativeFetch(providerId);
            return;
          }
        }
        
        // Handle other errors
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          errorStatus.value = "Timeout Error";
          error.value = "The server is taking too long to respond.";
        } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
          errorStatus.value = "Network Error";
          error.value = "Cannot connect to server. Please check your connection.";
        } else if (err.response?.status === 403) {
          const errorMessage = err.response?.data?.message || err.message || '';
          if (errorMessage.includes("Providers can only access their own bookings")) {
            console.log("✅ No bookings found for this provider");
            error.value = "";
            bookings.value = [];
            calculateStats();
            return;
          }
          error.value = "Access denied. Please check your permissions.";
          errorStatus.value = "403 Forbidden";
        } else if (err.response?.status === 404) {
          error.value = "Bookings endpoint not found.";
          errorStatus.value = "404 Not Found";
        } else {
          error.value = err.message || "Unknown error occurred";
          errorStatus.value = "API Error";
        }
        
        // Fall back to sample data
        await loadSampleBookings(providerId);
        
      } finally {
        loading.value = false;
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        setTimeout(() => { loadingProgress.value = 0; }, 500);
      }
    };

    // ==================== ALTERNATIVE FETCH FOR CORS ISSUES ====================

    const tryAlternativeFetch = async (providerId) => {
      console.log("🔄 Trying alternative fetch (direct fetch API)...");
      
      try {
        // Use fetch API directly with minimal headers
        const response = await fetch(
          `https://infinity-booking-backend1-1.onrender.com/infinity-booking/bookings/provider/${providerId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            mode: 'cors'
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Alternative fetch succeeded");
          
          const processedBookings = processBookings(data);
          bookings.value = processedBookings;
          calculateStats();
          
          // Cache the data
          localStorage.setItem(`cachedBookings_${providerId}`, JSON.stringify({
            bookings: processedBookings,
            timestamp: Date.now(),
            isSample: false
          }));
          
          error.value = "";
          errorStatus.value = "";
          return true;
        } else {
          throw new Error(`Fetch failed with status: ${response.status}`);
        }
      } catch (fetchErr) {
        console.error("❌ Alternative fetch failed:", fetchErr);
        await loadSampleBookings(providerId);
        return false;
      }
    };

    // ==================== SAMPLE DATA ====================

    const loadSampleBookings = async (providerId) => {
      console.log("📋 Loading sample bookings");
      
      usingSampleData.value = true;
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const sampleBookings = [
        {
          _id: "sample_1_" + Date.now(),
          customer: {
            _id: "cust_1",
            fullname: "John Smith",
            email: "john@example.com",
            phone: "+1234567890",
            location: "New York"
          },
          service: {
            name: "Haircut & Styling",
            category: { name: "Hair Services" },
            price: 45
          },
          bookingDate: today.toISOString().split('T')[0],
          startTime: "14:00",
          endTime: "15:00",
          status: "confirmed",
          totalPrice: 45,
          createdAt: yesterday.toISOString(),
          notes: "Regular customer"
        },
        {
          _id: "sample_2_" + Date.now(),
          createdBy: "admin",
          adminName: "Store Manager",
          adminEmail: "manager@store.com",
          adminPhone: "+1234567891",
          service: {
            name: "Beard Trim",
            category: { name: "Grooming" },
            price: 25
          },
          bookingDate: today.toISOString().split('T')[0],
          startTime: "16:00",
          endTime: "16:30",
          status: "pending",
          totalPrice: 25,
          createdAt: today.toISOString(),
          notes: "Walk-in customer"
        }
      ];

      const processedBookings = processBookings(sampleBookings);
      bookings.value = processedBookings;
      
      try {
        localStorage.setItem(`cachedBookings_${providerId}`, JSON.stringify({
          bookings: processedBookings,
          timestamp: Date.now(),
          isSample: true
        }));
      } catch (cacheErr) {
        console.log("❌ Cache save error:", cacheErr);
      }
      
      console.log(`✅ Loaded ${processedBookings.length} sample bookings`);
      calculateStats();
      
      if (isDeployed.value) {
        error.value = "Using sample data (CORS issue with backend). Real bookings will load when CORS is fixed.";
      } else {
        error.value = "Using sample data (server issue).";
      }
      errorStatus.value = "Sample Data";
    };

    // ==================== CORE FUNCTIONS ====================

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

    const calculateStats = () => {
      if (bookings.value.length === 0) {
        stats.value = { totalBookings: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, revenue: 0 };
        return;
      }

      stats.value = {
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
    };

    const checkProviderStatus = () => {
      const providerData = JSON.parse(localStorage.getItem("loggedProvider") || "{}");
      
      let statusMessage = `🔍 Provider Status Check:\n\n`;
      statusMessage += `👤 Name: ${providerData.fullname}\n`;
      statusMessage += `📧 Email: ${providerData.email}\n`;
      statusMessage += `🎫 Provider PID: ${currentProviderId.value}\n`;
      statusMessage += `🌐 Environment: ${isDeployed.value ? 'Deployed (Vercel)' : 'Local'}\n`;
      statusMessage += `📊 Data Source: ${usingSampleData.value ? 'Sample Data' : 'Real API'}\n\n`;
      statusMessage += `📈 Booking Statistics:\n`;
      statusMessage += `   Total Bookings: ${stats.value.totalBookings}\n`;
      statusMessage += `   Pending: ${stats.value.pending} | Confirmed: ${stats.value.confirmed}\n`;
      statusMessage += `   Completed: ${stats.value.completed} | Revenue: $${stats.value.revenue}\n`;
      
      if (error.value) {
        statusMessage += `\n⚠️ Error: ${error.value}`;
      }
      
      alert(statusMessage);
    };

    // ==================== ACTION METHODS ====================

    const refreshBookings = () => {
      loadBookings();
    };

    const clearFilters = () => {
      searchQuery.value = "";
      statusFilter.value = "all";
      dateFilter.value = "all";
      clearTimelinePeriod();
    };

    const confirmBooking = async (booking) => {
      try {
        await http.patch(`/bookings/${booking._id}/status`, { status: 'confirmed' });
        booking.status = 'confirmed';
        calculateStats();
      } catch (err) {
        console.error('Error confirming booking:', err);
        alert("Failed to confirm booking. Please try again.");
      }
    };

    const completeBooking = async (booking) => {
      try {
        await http.patch(`/bookings/${booking._id}/status`, { status: 'completed' });
        booking.status = 'completed';
        calculateStats();
      } catch (err) {
        console.error('Error completing booking:', err);
        alert("Failed to complete booking. Please try again.");
      }
    };

    const viewBookingDetailsModal = (booking) => {
      selectedBooking.value = booking;
      showOriginalData.value = false;
    };

    const closeModal = () => {
      selectedBooking.value = null;
    };

    const promoteServices = () => {
      alert("🎯 Share your booking link to get more bookings!");
    };

    const viewServices = () => {
      alert("Redirecting to services page...");
    };

    const testConnection = async () => {
      const providerId = getProviderId();
      if (!providerId) return;
      
      try {
        const testUrl = `https://infinity-booking-backend1-1.onrender.com/infinity-booking/bookings/provider/${providerId}`;
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          alert(`✅ Connection test successful!\n\nServer is reachable but CORS might be blocking the request.\n\nStatus: ${response.status}\nURL: ${testUrl}`);
        } else {
          alert(`❌ Connection test failed:\n\nStatus: ${response.status}\nURL: ${testUrl}`);
        }
      } catch (err) {
        alert(`❌ Connection test failed:\n\nError: ${err.message}\n\nThe server might be down.`);
      }
    };

    // ==================== UTILITY GETTERS ====================

    const getCustomerName = (booking) => {
      if (booking.isAdminBooking) {
        return booking.originalData?.adminName || 'Admin';
      }
      return booking.customerName || 'Customer';
    };

    const getCustomerEmail = (booking) => {
      if (booking.isAdminBooking) {
        return booking.originalData?.adminEmail || '';
      }
      return booking.customerEmail || '';
    };

    const getCustomerPhone = (booking) => {
      if (booking.isAdminBooking) {
        return booking.originalData?.adminPhone || '';
      }
      return booking.customerPhone || '';
    };

    const getServiceName = (booking) => {
      return booking.serviceName || 
             booking.originalData?.service?.name ||
             'Unknown Service';
    };

    const getCategoryName = (booking) => {
      return booking.serviceCategory || 
             booking.originalData?.service?.category?.name ||
             'General';
    };

    const getBookingAmount = (booking) => {
      return parseFloat(booking.amount || 0).toFixed(2);
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

    const getInitials = (name) => {
      if (!name) return '??';
      if (name === 'Admin' || name.includes('Admin')) return 'AD';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'No date';
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
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

    // ==================== LIFECYCLE ====================

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
      selectedPeriod,
      timelinePeriods,
      currentPage,
      itemsPerPage,
      selectedBooking,
      currentProviderId,
      currentEndpoint,
      stats,
      showOriginalData,
      showDebug,
      usingSampleData,
      isDeployed,
      
      // Computed
      selectedPeriodLabel,
      displayBookings,
      paginatedBookings,
      totalPages,
      
      // Methods
      loadBookings,
      refreshBookings,
      clearFilters,
      confirmBooking,
      completeBooking,
      viewBookingDetailsModal,
      checkProviderStatus,
      promoteServices,
      viewServices,
      selectTimelinePeriod,
      clearTimelinePeriod,
      closeModal,
      testConnection,
      
      // Utility functions
      getInitials,
      formatDate,
      formatRelativeTime,
      isNewBooking,
      isUrgentBooking,
      getCustomerName,
      getCustomerEmail,
      getCustomerPhone,
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

/* TIMELINE FILTER SECTION (New) */
.timeline-filter-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.timeline-filter-header {
  margin-bottom: 20px;
}

.timeline-filter-header h3 {
  color: #1e293b;
  font-size: 1.3rem;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.timeline-filter-header h3 i {
  color: #3b82f6;
}

.timeline-filter-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.timeline-filter-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.timeline-filter-btn {
  padding: 12px 20px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #475569;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.timeline-filter-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.timeline-filter-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.timeline-filter-btn.active i {
  color: white;
}

.timeline-active-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f0f9ff;
  border-radius: 12px;
  border: 1px solid #bae6fd;
}

.active-filter-badge {
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0369a1;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(3, 105, 161, 0.1);
}

.active-filter-badge i {
  color: #0ea5e9;
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
  transition: all 0.2s ease;
}

.clear-period-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.filter-count {
  color: #0369a1;
  font-size: 0.9rem;
  font-weight: 600;
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
  flex-shrink: 0;
}

.customer-avatar.admin-avatar {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.customer-main strong {
  color: #1e293b;
  font-size: 0.95rem;
}

.customer-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-email, .customer-phone {
  color: #6b7280;
  font-size: 0.8rem;
}

.customer-email {
  display: flex;
  align-items: center;
  gap: 4px;
}

.customer-phone {
  display: flex;
  align-items: center;
  gap: 4px;
}

.admin-details {
  padding-top: 2px;
}

.store-badge {
  background: #f3f4f6;
  color: #4b5563;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

/* Service Cell */
.service-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-cell strong {
  color: #1e293b;
  font-size: 0.95rem;
}

.service-category {
  background: #f3f4f6;
  color: #6b7280;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  width: fit-content;
}

/* Date Time Cell */
.datetime-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.datetime-cell .date {
  color: #1e293b;
  font-weight: 500;
  font-size: 0.9rem;
}

.datetime-cell .time {
  color: #64748b;
  font-size: 0.85rem;
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

/* AMAZING BOOKINGS GRID */
.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.booking-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.booking-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.booking-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.booking-card:hover::before {
  opacity: 1;
}

.booking-card.new-booking {
  border-left: 4px solid #0ea5e9;
  background: linear-gradient(to right, #f0f9ff, white);
}

.booking-card.urgent-booking {
  border-left: 4px solid #d97706;
  background: linear-gradient(to right, #fef3c7, white);
}

.booking-card.admin-booking {
  border-left: 4px solid #6b7280;
  background: linear-gradient(to right, #f9fafb, white);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.customer-avatar.large {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.customer-avatar.large.admin-avatar {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.2);
}

.customer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.customer-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.customer-main h4 {
  color: #1e293b;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.customer-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.customer-contact {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-item {
  color: #6b7280;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-item i {
  width: 16px;
  color: #9ca3af;
}

.admin-contact {
  padding-top: 4px;
}

/* Service Section */
.service-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 20px;
}

.service-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
}

.service-details h5 {
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.service-details .service-category {
  background: white;
  color: #6b7280;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
}

/* Booking Details */
.booking-details {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 12px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-item i {
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.detail-item div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 600;
}

/* Timestamp */
.timestamp {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
  font-size: 0.8rem;
  margin-bottom: 20px;
}

.timestamp i {
  font-size: 0.75rem;
}

/* Action Buttons */
.card-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.confirm-btn {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.confirm-btn:hover {
  background: linear-gradient(135deg, #059669, #10b981);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.complete-btn {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
}

.complete-btn:hover {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.view-btn {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.view-btn:hover {
  background: #e5e7eb;
  color: #374151;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

/* MODAL STYLES */
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
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  color: #1e293b;
  font-size: 1.3rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header i {
  color: #3b82f6;
}

.modal-close {
  background: #f3f4f6;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.booking-overview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 24px;
}

.overview-avatar {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.overview-avatar.admin-avatar {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.overview-info {
  flex: 1;
}

.overview-info h4 {
  color: #1e293b;
  font-size: 1.3rem;
  margin: 0 0 8px 0;
}

.overview-badges {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.overview-meta {
  display: flex;
  gap: 8px;
  color: #6b7280;
  font-size: 0.85rem;
}

.overview-amount {
  text-align: right;
}

.amount-label {
  display: block;
  color: #6b7280;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.amount-value {
  display: block;
  color: #059669;
  font-size: 1.5rem;
  font-weight: 700;
}

.details-section {
  margin-bottom: 24px;
}

.details-section h5 {
  color: #1e293b;
  font-size: 1.1rem;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.details-section h5 i {
  color: #3b82f6;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 500;
}

.detail-value {
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 500;
}

.admin-value {
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
}

.code {
  font-family: monospace;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.payment-status {
  font-weight: 600;
}

.payment-status.paid {
  color: #16a34a;
}

.payment-status.pending {
  color: #d97706;
}

.payment-status.failed {
  color: #dc2626;
}

.notes-content {
  background: #fefce8;
  border: 1px solid #fef3c7;
  border-radius: 8px;
  padding: 16px;
  color: #92400e;
  font-size: 0.9rem;
  line-height: 1.5;
}

.debug-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.debug-section h5 {
  background: #f3f4f6;
  padding: 12px 16px;
  margin: 0;
  cursor: pointer;
}

.debug-section pre {
  margin: 0;
  padding: 16px;
  background: #1f2937;
  color: #e5e7eb;
  font-size: 0.8rem;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
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
  
  .timeline-filter-buttons {
    justify-content: center;
  }
  
  .timeline-active-filter {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
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
  
  .detail-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .modal-content {
    max-width: 100%;
    margin: 0;
  }
  
  .booking-overview {
    flex-direction: column;
    text-align: center;
  }
  
  .overview-amount {
    text-align: center;
    width: 100%;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-footer .btn {
    width: 100%;
    justify-content: center;
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
  
  .customer-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .customer-badges {
    width: 100%;
    justify-content: flex-start;
  }
  
  .view-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>