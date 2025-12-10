<!-- src/pages/Providers/HomeDashboard.vue -->
<template>
  <div class="home-dashboard">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="welcome-section">
          <h1 class="title">Welcome back, {{ provider?.fullname || 'Provider' }}! 👋</h1>
          <p class="subtitle">Your business overview at a glance</p>
          <div class="date-display">
            <i class="fa-solid fa-calendar"></i>
            {{ currentDate }}
          </div>
          <div class="provider-id">
            <i class="fa-solid fa-id-card"></i>
            Provider ID: {{ currentProviderPid || 'Loading...' }}
          </div>
        </div>
        <div class="header-actions">
          <!-- Notification Bell -->
          <div class="notification-container">
            <button class="notification-btn" @click="toggleNotifications" 
                    @blur="onNotificationBlur"
                    aria-label="Notifications">
              <i class="fa-solid fa-bell"></i>
              <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
            </button>
            
            <!-- Notifications Dropdown - Fixed positioning for mobile -->
            <transition name="fade-slide">
              <div v-if="showNotifications" class="notifications-dropdown" 
                   :class="{ 'mobile-dropdown': isMobile }"
                   @click.stop>
                <div class="notifications-header">
                  <h4>Notifications</h4>
                  <div class="notifications-actions">
                    <button v-if="unreadCount > 0" @click="markAllAsRead" class="btn-mark-all">
                      <i class="fa-solid fa-check-double"></i> Mark all read
                    </button>
                    <button @click="refreshNotifications" class="btn-refresh" :disabled="loadingNotifications">
                      <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loadingNotifications }"></i>
                    </button>
                  </div>
                </div>
                
                <!-- Notifications List -->
                <div class="notifications-list" ref="notificationsList" v-if="notifications.length > 0">
                  <div v-for="notification in notifications" 
                       :key="notification._id" 
                       class="notification-item"
                       :class="{ 'unread': !notification.read, 'clickable': notification.action }"
                       @click="handleNotificationClick(notification)">
                    <div class="notification-icon" :class="getNotificationIcon(notification.type)">
                      <i :class="getNotificationIconClass(notification.type)"></i>
                    </div>
                    <div class="notification-content">
                      <div class="notification-title">
                        {{ notification.title || getDefaultTitle(notification.type) }}
                      </div>
                      <div class="notification-message">
                        {{ notification.message }}
                      </div>
                      <div class="notification-meta">
                        <span class="notification-time">{{ formatNotificationTime(notification.createdAt) }}</span>
                        <span v-if="notification.type" class="notification-type">{{ notification.type }}</span>
                      </div>
                    </div>
                    <div class="notification-actions">
                      <button v-if="!notification.read" 
                              @click.stop="markAsRead(notification._id)"
                              class="btn-action mark-read"
                              aria-label="Mark as read">
                        <i class="fa-solid fa-circle"></i>
                      </button>
                      <button @click.stop="deleteNotification(notification._id)"
                              class="btn-action delete"
                              aria-label="Delete notification">
                        <i class="fa-solid fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Empty State -->
                <div v-else class="notifications-empty">
                  <i class="fa-solid fa-bell-slash"></i>
                  <p>No notifications yet</p>
                </div>
                
                <!-- View All Link -->
                <div class="notifications-footer">
                  <button @click="viewAllNotifications" class="btn-view-all">
                    View all notifications <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
                
                <!-- Mobile close button -->
                <button v-if="isMobile" @click="closeNotifications" class="btn-close-mobile">
                  <i class="fa-solid fa-times"></i> Close
                </button>
              </div>
            </transition>
            
            <!-- Mobile overlay -->
            <div v-if="showNotifications && isMobile" class="notifications-overlay" @click="closeNotifications"></div>
          </div>
          
          <!-- Refresh Button -->
          <button class="btn btn-primary" @click="refreshData" :disabled="loading">
            <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loading }"></i>
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !hasData" class="loading-container">
      <div class="loading-content">
        <div class="spinner"></div>
        <h3>Loading Dashboard</h3>
        <p>Getting your business summary...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="criticalError && !hasData" class="error-container">
      <div class="error-content">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <h3>Unable to Load Data</h3>
        <p>{{ criticalError }}</p>
        <button class="btn btn-primary" @click="loadDashboardData">
          Try Again
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="dashboard-content">
      <!-- Data Source Indicator -->
      <div class="data-source-indicator">
        <div class="source-badge" :class="{ 'real-data': isRealData, 'demo-data': !isRealData }">
          <i :class="isRealData ? 'fa-solid fa-database' : 'fa-solid fa-eye'"></i>
          {{ isRealData ? 'Live Data' : 'Demo Data' }}
        </div>
        <div class="last-updated">
          <i class="fa-solid fa-clock"></i>
          Updated: {{ lastUpdated }}
        </div>
      </div>

      <!-- Key Metrics Grid -->
      <div class="metrics-grid">
        <!-- Total Bookings -->
        <div class="metric-card primary" @click="navigateTo('/bookings')">
          <div class="metric-icon">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <div class="metric-content">
            <h3>{{ totalBookings }}</h3>
            <p class="metric-title">Total Bookings</p>
            <div class="metric-trend" v-if="bookingChange">
              <i :class="bookingChange >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
              <span>{{ Math.abs(bookingChange) }}%</span>
              <span class="metric-period">from last month</span>
            </div>
          </div>
          <div class="metric-action">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <!-- Total Services -->
        <div class="metric-card success" @click="navigateTo('/services')">
          <div class="metric-icon">
            <i class="fa-solid fa-briefcase"></i>
          </div>
          <div class="metric-content">
            <h3>{{ totalServices }}</h3>
            <p class="metric-title">Total Services</p>
            <div class="metric-subtext">
              <i class="fa-solid fa-check-circle"></i>
              {{ activeServices }} active
            </div>
          </div>
          <div class="metric-action">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="metric-card revenue" @click="navigateTo('/revenue')">
          <div class="metric-icon">
            <i class="fa-solid fa-money-bill-wave"></i>
          </div>
          <div class="metric-content">
            <h3>${{ formatCurrency(totalRevenue) }}</h3>
            <p class="metric-title">Total Revenue</p>
            <div class="metric-trend" v-if="revenueChange">
              <i :class="revenueChange >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
              <span>{{ Math.abs(revenueChange) }}%</span>
              <span class="metric-period">from last month</span>
            </div>
          </div>
          <div class="metric-action">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <!-- Today's Bookings -->
        <div class="metric-card info" @click="navigateTo('/bookings?filter=today')">
          <div class="metric-icon">
            <i class="fa-solid fa-calendar-day"></i>
          </div>
          <div class="metric-content">
            <h3>{{ todayBookings }}</h3>
            <p class="metric-title">Today's Bookings</p>
            <div class="metric-subtext">
              <i class="fa-solid fa-clock"></i>
              {{ upcomingBookings }} upcoming
            </div>
          </div>
          <div class="metric-action">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <!-- Completion Rate -->
        <div class="metric-card warning" @click="navigateTo('/analytics')">
          <div class="metric-icon">
            <i class="fa-solid fa-chart-line"></i>
          </div>
          <div class="metric-content">
            <h3>{{ completionRate }}%</h3>
            <p class="metric-title">Completion Rate</p>
            <div class="metric-subtext">
              {{ completedBookings }} completed bookings
            </div>
          </div>
          <div class="metric-action">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <!-- Customer Satisfaction -->
        <div class="metric-card purple" @click="navigateTo('/reviews')">
          <div class="metric-icon">
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="metric-content">
            <h3>{{ averageRating }}/5</h3>
            <p class="metric-title">Avg. Rating</p>
            <div class="rating-stars">
              <i v-for="n in 5" :key="n" 
                 class="fa-star" 
                 :class="n <= Math.floor(averageRating) ? 'fa-solid filled' : 'fa-regular'">
              </i>
            </div>
          </div>
          <div class="metric-action">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      </div>

      <!-- Quick Stats Grid -->
      <div class="quick-stats-grid">
        <div class="stats-card">
          <div class="stats-header">
            <h3><i class="fa-solid fa-users"></i> Customer Overview</h3>
          </div>
          <div class="stats-content">
            <div class="stat-row">
              <div class="stat-item">
                <div class="stat-value">{{ totalCustomers }}</div>
                <div class="stat-label">Total Customers</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ repeatCustomers }}</div>
                <div class="stat-label">Repeat Customers</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ newCustomers }}</div>
                <div class="stat-label">New (30 days)</div>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-header">
            <h3><i class="fa-solid fa-chart-pie"></i> Booking Status</h3>
          </div>
          <div class="stats-content">
            <div class="status-bars">
              <div class="status-bar completed" :style="{ width: completedPercentage + '%' }">
                <span class="status-label">Completed {{ completedBookings }}</span>
              </div>
              <div class="status-bar confirmed" :style="{ width: confirmedPercentage + '%' }">
                <span class="status-label">Confirmed {{ confirmedBookings }}</span>
              </div>
              <div class="status-bar pending" :style="{ width: pendingPercentage + '%' }">
                <span class="status-label">Pending {{ pendingBookings }}</span>
              </div>
              <div class="status-bar cancelled" :style="{ width: cancelledPercentage + '%' }">
                <span class="status-label">Cancelled {{ cancelledBookings }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coming Soon Features -->
      <div class="coming-soon-section">
        <h3><i class="fa-solid fa-rocket"></i> Coming Soon</h3>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa-solid fa-credit-card"></i>
            </div>
            <div class="feature-content">
              <h4>Payment Analytics</h4>
              <p>Track payments & revenue trends</p>
              <span class="feature-status">In Development</span>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa-solid fa-chart-pie"></i>
            </div>
            <div class="feature-content">
              <h4>Advanced Reports</h4>
              <p>Detailed performance insights</p>
              <span class="feature-status">Planned</span>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa-solid fa-message"></i>
            </div>
            <div class="feature-content">
              <h4>Review System</h4>
              <p>Collect customer feedback</p>
              <span class="feature-status">Planned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import http from "@/api/index.js";

export default {
  name: 'HomeDashboard',
  props: {
    provider: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    const router = useRouter();
    const route = useRoute();
    
    // Reactive data
    const loading = ref(false);
    const criticalError = ref("");
    const hasData = ref(false);
    const isRealData = ref(false);
    const currentProviderPid = ref("");
    
    // Notification state
    const showNotifications = ref(false);
    const notifications = ref([]);
    const loadingNotifications = ref(false);
    const notificationError = ref("");
    const isMobile = ref(window.innerWidth <= 768);
    const notificationsList = ref(null);
    
    // Data storage
    const bookings = ref([]);
    const services = ref([]);
    const bookingStats = ref({
      totalBookings: 0,
      completed: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      todayBookings: 0,
      upcomingBookings: 0,
      totalRevenue: 0,
      monthlyChange: 0,
      revenueChange: 0,
      averageRating: 0
    });
    
    // Debug info
    const lastServicesEndpoint = ref("");
    const lastBookingsEndpoint = ref("");

    // ========== NOTIFICATION FUNCTIONS ==========

    // Fetch notifications from API
    const fetchNotifications = async () => {
      if (!props.provider) return;
      
      loadingNotifications.value = true;
      notificationError.value = "";
      
      try {
        console.log("🔔 Fetching notifications...");
        
        // Get user ID from localStorage
        const loggedProvider = localStorage.getItem("loggedProvider");
        let userId = null;
        
        if (loggedProvider) {
          try {
            const providerData = JSON.parse(loggedProvider);
            userId = providerData._id; // MongoDB ObjectId
            console.log("📋 Found user ID:", userId);
          } catch (e) {
            console.warn("⚠️ Could not parse loggedProvider");
          }
        }
        
        // Use CORRECT endpoint only: /notifications with userId parameter
        if (userId) {
          try {
            const response = await http.get(`/notifications?userId=${userId}`, { timeout: 5000 });
            console.log("✅ Notifications response:", response.data);
            
            if (response.data && Array.isArray(response.data)) {
              notifications.value = response.data.map(notification => ({
                _id: notification._id,
                title: notification.title,
                message: notification.message,
                type: notification.type || 'info',
                read: notification.read || false,
                createdAt: notification.createdAt,
                action: notification.action,
                data: notification.data
              }));
              console.log(`✅ Loaded ${notifications.value.length} real notifications`);
            } else {
              notifications.value = generateDemoNotifications();
              console.log("📋 Using demo notifications (no data in response)");
            }
          } catch (error) {
            console.log("⚠️ Notifications endpoint failed:", error.message);
            notifications.value = generateDemoNotifications();
            notificationError.value = "Using demo notifications";
          }
        } else {
          console.warn("⚠️ No user ID found");
          notifications.value = generateDemoNotifications();
        }
        
      } catch (error) {
        console.error("❌ Failed to fetch notifications:", error);
        notificationError.value = "Using demo data";
        notifications.value = generateDemoNotifications();
      } finally {
        loadingNotifications.value = false;
      }
    };

    // Generate demo notifications for testing
    const generateDemoNotifications = () => {
      return [
        {
          _id: 'demo-1',
          title: 'New Booking Received',
          message: 'John Doe booked your "Professional Cleaning" service for tomorrow.',
          type: 'booking',
          read: false,
          createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
          action: '/bookings'
        },
        {
          _id: 'demo-2',
          title: 'Service Review',
          message: 'Jane Smith left a 5-star review for your "Car Wash" service.',
          type: 'review',
          read: false,
          createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
          action: '/reviews'
        },
        {
          _id: 'demo-3',
          title: 'Booking Reminder',
          message: 'You have a booking with Sarah Johnson in 1 hour.',
          type: 'reminder',
          read: true,
          createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
          action: '/bookings'
        },
        {
          _id: 'demo-4',
          title: 'System Update',
          message: 'New features have been added to your dashboard.',
          type: 'system',
          read: true,
          createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
          action: null
        }
      ];
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
      try {
        const notification = notifications.value.find(n => n._id === notificationId);
        if (!notification || notification.read) return;
        
        // Update locally first
        notification.read = true;
        
        // Only send to server if it's NOT a demo notification
        if (!notificationId.startsWith('demo-')) {
          try {
            await http.put(`/notifications/${notificationId}/read`, {}, { timeout: 3000 });
            console.log(`✅ Marked real notification as read: ${notificationId}`);
          } catch (error) {
            console.log(`⚠️ Failed to mark as read on server:`, error.message);
          }
        } else {
          console.log(`✅ Marked demo notification as read: ${notificationId}`);
        }
        
      } catch (error) {
        console.error("❌ Failed to mark notification as read:", error);
      }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
      try {
        const unreadNotifications = notifications.value.filter(n => !n.read);
        if (unreadNotifications.length === 0) return;
        
        // Update locally first
        notifications.value.forEach(n => n.read = true);
        
        // Get real notification IDs (non-demo)
        const realNotificationIds = unreadNotifications
          .filter(n => !n._id.startsWith('demo-'))
          .map(n => n._id);
        
        // Only send to server if we have real notifications
        if (realNotificationIds.length > 0) {
          try {
            await http.put(`/notifications/all/read`, {}, { timeout: 3000 });
            console.log(`✅ Marked ${realNotificationIds.length} real notifications as read`);
          } catch (error) {
            console.log(`⚠️ Failed to mark all read on server:`, error.message);
          }
        }
        
        console.log(`✅ Marked ${unreadNotifications.length} notifications as read`);
        
      } catch (error) {
        console.error("❌ Failed to mark all notifications as read:", error);
      }
    };

    // Delete notification
    const deleteNotification = async (notificationId) => {
      try {
        // Check if it's a demo notification
        const isDemoNotification = notificationId.startsWith('demo-');
        
        // Remove locally first
        notifications.value = notifications.value.filter(n => n._id !== notificationId);
        
        // Only try to delete from server if it's NOT a demo notification
        if (!isDemoNotification) {
          try {
            await http.delete(`/notifications/${notificationId}`, { timeout: 3000 });
            console.log(`✅ Deleted real notification: ${notificationId}`);
          } catch (error) {
            console.log(`⚠️ Failed to delete from server:`, error.message);
          }
        } else {
          console.log(`✅ Deleted demo notification: ${notificationId}`);
        }
        
      } catch (error) {
        console.error("❌ Failed to delete notification:", error);
        // Don't re-fetch for demo notifications
        if (!notificationId.startsWith('demo-')) {
          fetchNotifications();
        }
      }
    };

    // Handle notification click
    const handleNotificationClick = (notification) => {
      if (notification.action) {
        navigateTo(notification.action);
        closeNotifications();
        
        // Mark as read if unread
        if (!notification.read) {
          markAsRead(notification._id);
        }
      }
    };

    // Get notification icon
    const getNotificationIcon = (type) => {
      const iconMap = {
        booking: 'icon-booking',
        review: 'icon-review',
        reminder: 'icon-reminder',
        system: 'icon-system',
        payment: 'icon-payment',
        cancellation: 'icon-cancellation',
        message: 'icon-message'
      };
      return iconMap[type] || 'icon-info';
    };

    // Get notification icon class
    const getNotificationIconClass = (type) => {
      const iconClassMap = {
        booking: 'fa-solid fa-calendar-check',
        review: 'fa-solid fa-star',
        reminder: 'fa-solid fa-clock',
        system: 'fa-solid fa-info-circle',
        payment: 'fa-solid fa-credit-card',
        cancellation: 'fa-solid fa-times-circle',
        message: 'fa-solid fa-message'
      };
      return iconClassMap[type] || 'fa-solid fa-bell';
    };

    // Get default title based on type
    const getDefaultTitle = (type) => {
      const titleMap = {
        booking: 'New Booking',
        review: 'New Review',
        reminder: 'Reminder',
        system: 'System Update',
        payment: 'Payment Update',
        cancellation: 'Booking Cancelled',
        message: 'New Message'
      };
      return titleMap[type] || 'Notification';
    };

    // Format notification time
    const formatNotificationTime = (timestamp) => {
      if (!timestamp) return 'Just now';
      
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Toggle notifications dropdown
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      if (showNotifications.value && notifications.value.length === 0) {
        fetchNotifications();
      }
    };

    // Close notifications (for mobile)
    const closeNotifications = () => {
      showNotifications.value = false;
    };

    // Handle blur on notifications dropdown
    const onNotificationBlur = (event) => {
      // Don't close on mobile blur - let the close button handle it
      if (isMobile.value) return;
      
      setTimeout(() => {
        if (!event.relatedTarget || !event.relatedTarget.closest('.notification-container')) {
          showNotifications.value = false;
        }
      }, 100);
    };

    // View all notifications
    const viewAllNotifications = () => {
      console.log("View all notifications clicked");
      showNotifications.value = false;
      navigateTo('/notifications');
    };

    // Refresh notifications
    const refreshNotifications = () => {
      fetchNotifications();
    };

    // Handle window resize
    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768;
      // Close notifications on resize to mobile if open
      if (isMobile.value && showNotifications.value) {
        // Don't close, just ensure mobile styles are applied
      }
    };

    // Handle click outside notifications
    const handleClickOutside = (event) => {
      if (showNotifications.value && 
          !event.target.closest('.notification-container') &&
          !event.target.closest('.notifications-dropdown')) {
        closeNotifications();
      }
    };

    // Handle escape key
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showNotifications.value) {
        closeNotifications();
      }
    };

    // Computed: Count of unread notifications
    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.read).length;
    });

    // ========== END NOTIFICATION FUNCTIONS ==========

    // ========== Check if we should load data ==========
    const shouldLoadData = () => {
      console.log('🔍 Checking if should load data:');
      
      if (!props.provider || !props.provider.pid) {
        console.warn('⚠️ No provider data available');
        return false;
      }
      
      const token = localStorage.getItem("provider_token");
      if (!token) {
        console.warn('⚠️ No authentication token');
        return false;
      }
      
      const isProviderHome = route.path.includes('/provider/home') || 
                            route.name === 'ProviderHome';
      
      if (!isProviderHome) {
        console.warn('⚠️ Not on provider home route');
        return false;
      }
      
      console.log('✅ Conditions met - should load data');
      return true;
    };

    // Get Provider PID
    const getProviderPid = () => {
      try {
        const loggedProvider = localStorage.getItem("loggedProvider");
        if (!loggedProvider) throw new Error("No logged provider found");
        
        const providerData = JSON.parse(loggedProvider);
        const knownPids = {
          "691e1659e304653542a825d5": "PROV-1763579481598-1GBEN",
          "692b3c78d399bc41c3712380": "PROV-1764441208540-C269P"
        };
        
        const pid = providerData.pid || providerData.providerProfile?.pid || knownPids[providerData._id];
        if (!pid) throw new Error("No provider ID found");
        
        currentProviderPid.value = pid;
        return pid;
      } catch (err) {
        criticalError.value = "Authentication error: " + err.message;
        return null;
      }
    };

    // ========== API ENDPOINTS ==========
    
    const serviceEndpoints = [
      { url: (pid) => `/services?providerId=${pid}`, name: "services" }
    ];

    const bookingEndpoints = [
      { url: (pid) => `/bookings/provider/${pid}`, name: "bookings" }
    ];

    // Fetch data from endpoint
    const fetchData = async (endpoint, pid, dataType) => {
      try {
        const url = endpoint.url(pid);
        console.log(`📤 Fetching ${dataType} from: ${url}`);
        
        const response = await http.get(url, { timeout: 8000 });
        console.log(`✅ ${dataType} response received`);
        
        if (dataType === 'services') lastServicesEndpoint.value = endpoint.name;
        if (dataType === 'bookings') lastBookingsEndpoint.value = endpoint.name;
        
        return { 
          success: true, 
          data: response.data,
          endpoint: endpoint.name
        };
      } catch (error) {
        console.log(`⚠️ ${dataType} fetch failed:`, error.message);
        return { success: false, data: null };
      }
    };

    // Helper: Check if a date is today
    const isToday = (dateString) => {
      if (!dateString) return false;
      
      try {
        let dateObj;
        
        if (dateString instanceof Date) {
          dateObj = dateString;
        } else if (typeof dateString === 'string') {
          dateObj = new Date(dateString);
        } else if (typeof dateString === 'number') {
          dateObj = new Date(dateString);
        } else {
          return false;
        }
        
        if (isNaN(dateObj.getTime())) {
          return false;
        }
        
        const today = new Date();
        return dateObj.getDate() === today.getDate() &&
               dateObj.getMonth() === today.getMonth() &&
               dateObj.getFullYear() === today.getFullYear();
        
      } catch (error) {
        console.error("Error checking if date is today:", error);
        return false;
      }
    };

    // Helper: Check if a date is upcoming (future date)
    const isUpcoming = (dateString) => {
      if (!dateString) return false;
      
      try {
        let dateObj;
        
        if (dateString instanceof Date) {
          dateObj = dateString;
        } else if (typeof dateString === 'string') {
          dateObj = new Date(dateString);
        } else if (typeof dateString === 'number') {
          dateObj = new Date(dateString);
        } else {
          return false;
        }
        
        if (isNaN(dateObj.getTime())) {
          return false;
        }
        
        const now = new Date();
        return dateObj > now;
        
      } catch (error) {
        console.error("Error checking if date is upcoming:", error);
        return false;
      }
    };

    // Helper: Format date for display
    const formatDateForDisplay = (dateString) => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return dateString || 'Unknown date';
        }
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (e) {
        return dateString || 'Unknown date';
      }
    };

    // Process data
    const processServiceData = (service) => ({
      _id: service._id,
      name: service.name || service.title || 'Service',
      status: (service.status || 'active').toLowerCase(),
      price: parseFloat(service.price || service.cost || 0)
    });

    const processBookingData = (booking) => {
      let bookingDate = null;
      let dateFieldUsed = '';
      
      const possibleDateFields = [
        'bookingDate',
        'date', 
        'startDate',
        'appointmentDate',
        'createdAt',
        'updatedAt',
        'startTime',
        'time'
      ];
      
      for (const field of possibleDateFields) {
        if (booking[field]) {
          bookingDate = booking[field];
          dateFieldUsed = field;
          break;
        }
      }
      
      return {
        _id: booking._id,
        date: bookingDate,
        dateFieldUsed: dateFieldUsed,
        formattedDate: formatDateForDisplay(bookingDate),
        status: (booking.status || 'pending').toLowerCase(),
        amount: parseFloat(booking.amount || booking.price || 0),
        customerId: booking.customer?._id || booking.customerId,
        customerName: booking.customer?.fullname || booking.customer?.name || 'Unknown Customer',
        createdAt: booking.createdAt,
        rawData: booking
      };
    };

    // Calculate statistics
    const calculateStatistics = (bookingsArray) => {
      const stats = {
        totalBookings: bookingsArray.length,
        completed: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        todayBookings: 0,
        upcomingBookings: 0,
        totalRevenue: 0,
        monthlyChange: 0,
        revenueChange: 0,
        averageRating: 4.5
      };

      console.log("Calculating statistics for", bookingsArray.length, "bookings");
      
      const today = new Date();
      console.log("Today's date:", today.toLocaleDateString());
      
      bookingsArray.forEach((booking, index) => {
        const status = booking.status;
        
        if (status === 'completed') stats.completed++;
        else if (status === 'confirmed') stats.confirmed++;
        else if (status === 'pending') stats.pending++;
        else if (status === 'cancelled') stats.cancelled++;
        
        if (status === 'completed' || status === 'confirmed') {
          stats.totalRevenue += booking.amount || 0;
        }
        
        if (isToday(booking.date)) {
          stats.todayBookings++;
        }
        
        if (isUpcoming(booking.date) && (status === 'pending' || status === 'confirmed')) {
          stats.upcomingBookings++;
        }
      });

      console.log("Final stats:", {
        todayBookings: stats.todayBookings,
        upcomingBookings: stats.upcomingBookings,
        totalBookings: stats.totalBookings,
        totalRevenue: stats.totalRevenue
      });

      return stats;
    };

    // Load all data
    const loadDashboardData = async () => {
      if (!shouldLoadData()) {
        console.log('⏸️ Skipping dashboard data load');
        loading.value = false;
        return;
      }

      const providerPid = getProviderPid();
      if (!providerPid) {
        loading.value = false;
        return;
      }

      loading.value = true;
      criticalError.value = "";
      bookings.value = [];
      services.value = [];
      isRealData.value = false;

      try {
        console.log("🚀 Loading dashboard data...");
        console.log("Provider PID:", providerPid);
        
        // Set overall timeout for dashboard
        const overallTimeout = setTimeout(() => {
          console.log("⏰ Dashboard load taking too long");
          criticalError.value = "Loading data...";
        }, 10000);
        
        // Load Services
        const servicesResult = await fetchData(serviceEndpoints[0], providerPid, 'services');
        if (servicesResult.success && servicesResult.data) {
          const rawData = servicesResult.data;
          const servicesArray = Array.isArray(rawData) ? rawData : [];
          
          if (servicesArray.length > 0) {
            services.value = servicesArray.map(processServiceData);
            console.log(`✅ Services: ${services.value.length} loaded`);
            isRealData.value = true;
          }
        }

        // Load Bookings
        const bookingsResult = await fetchData(bookingEndpoints[0], providerPid, 'bookings');
        if (bookingsResult.success && bookingsResult.data) {
          const rawData = bookingsResult.data;
          let bookingsArray = [];
          
          if (Array.isArray(rawData)) {
            bookingsArray = rawData;
          }
          
          if (bookingsArray.length > 0) {
            bookings.value = bookingsArray.map(processBookingData);
            const calculatedStats = calculateStatistics(bookings.value);
            bookingStats.value = { ...bookingStats.value, ...calculatedStats };
            console.log(`✅ Bookings: ${bookings.value.length} loaded`);
            isRealData.value = true;
          }
        }

        clearTimeout(overallTimeout);
        hasData.value = true;
        
        console.log("=== DASHBOARD LOAD COMPLETE ===");
        console.log(`Real data loaded: ${isRealData.value}`);
        console.log(`Services: ${services.value.length}`);
        console.log(`Bookings: ${bookings.value.length}`);
        console.log("===============================");
        
      } catch (error) {
        console.error("❌ Dashboard load error:", error);
        criticalError.value = "Unable to load dashboard data";
      } finally {
        loading.value = false;
      }
    };

    // Computed properties
    const currentDate = computed(() => new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));

    const lastUpdated = computed(() => new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    }));

    const totalServices = computed(() => services.value.length);
    const activeServices = computed(() => services.value.filter(s => 
      ['active', 'available', 'published'].includes(s.status)).length);

    const totalBookings = computed(() => bookingStats.value.totalBookings);
    const completedBookings = computed(() => bookingStats.value.completed);
    const confirmedBookings = computed(() => bookingStats.value.confirmed);
    const pendingBookings = computed(() => bookingStats.value.pending);
    const cancelledBookings = computed(() => bookingStats.value.cancelled);
    const todayBookings = computed(() => bookingStats.value.todayBookings);
    const totalRevenue = computed(() => bookingStats.value.totalRevenue);
    const averageRating = computed(() => bookingStats.value.averageRating || 0);

    const upcomingBookings = computed(() => bookingStats.value.upcomingBookings || 0);

    const completionRate = computed(() => {
      if (totalBookings.value === 0) return 0;
      return Math.round((completedBookings.value / totalBookings.value) * 100);
    });

    const completedPercentage = computed(() => {
      if (totalBookings.value === 0) return 0;
      return (completedBookings.value / totalBookings.value) * 100;
    });

    const confirmedPercentage = computed(() => {
      if (totalBookings.value === 0) return 0;
      return (confirmedBookings.value / totalBookings.value) * 100;
    });

    const pendingPercentage = computed(() => {
      if (totalBookings.value === 0) return 0;
      return (pendingBookings.value / totalBookings.value) * 100;
    });

    const cancelledPercentage = computed(() => {
      if (totalBookings.value === 0) return 0;
      return (cancelledBookings.value / totalBookings.value) * 100;
    });

    const totalCustomers = computed(() => {
      const ids = new Set(bookings.value.map(b => b.customerId).filter(id => id));
      return ids.size;
    });

    const repeatCustomers = computed(() => {
      const counts = {};
      bookings.value.forEach(b => {
        if (b.customerId) counts[b.customerId] = (counts[b.customerId] || 0) + 1;
      });
      return Object.values(counts).filter(count => count > 1).length;
    });

    const newCustomers = computed(() => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newIds = new Set();
      bookings.value.forEach(b => {
        if (b.customerId && b.createdAt && new Date(b.createdAt) >= thirtyDaysAgo) {
          newIds.add(b.customerId);
        }
      });
      return newIds.size;
    });

    // Trends - will be 0 if no data
    const bookingChange = computed(() => 0);
    const revenueChange = computed(() => 0);

    // Methods
    const refreshData = () => loadDashboardData();
    const navigateTo = (path) => router.push(path);
    const formatCurrency = (amount) => {
      return parseFloat(amount).toFixed(2);
    };

    // Lifecycle
    onMounted(() => {
      console.log('🏠 HomeDashboard mounted');
      console.log('👤 Provider prop:', props.provider);
      console.log('📍 Current route:', route.path);
      console.log('🔑 Has token?', !!localStorage.getItem('provider_token'));
      
      // Add event listeners
      window.addEventListener('resize', handleResize);
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      
      setTimeout(() => {
        if (shouldLoadData()) {
          loadDashboardData();
          fetchNotifications();
        } else {
          console.log('ℹ️ Not loading data - waiting for authentication or wrong route');
          loading.value = false;
        }
      }, 100);
    });

    // Cleanup
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    });

    // Watch for provider prop changes
    watch(() => props.provider, (newProvider) => {
      if (newProvider && newProvider.pid && shouldLoadData()) {
        console.log('👤 Provider data received, loading dashboard...');
        loadDashboardData();
        fetchNotifications();
      }
    }, { immediate: true });

    return {
      // State
      loading,
      criticalError,
      hasData,
      isRealData,
      currentProviderPid,
      currentDate,
      lastUpdated,
      
      // Notification State
      showNotifications,
      notifications,
      loadingNotifications,
      notificationError,
      unreadCount,
      isMobile,
      notificationsList,
      
      // Data
      bookings,
      services,
      bookingStats,
      lastServicesEndpoint,
      lastBookingsEndpoint,
      
      // Computed Metrics
      totalServices,
      activeServices,
      totalBookings,
      completedBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      todayBookings,
      upcomingBookings,
      totalRevenue,
      averageRating,
      completionRate,
      completedPercentage,
      confirmedPercentage,
      pendingPercentage,
      cancelledPercentage,
      totalCustomers,
      repeatCustomers,
      newCustomers,
      bookingChange,
      revenueChange,
      
      // Methods
      loadDashboardData,
      refreshData,
      navigateTo,
      formatCurrency,
      
      // Notification Methods
      toggleNotifications,
      closeNotifications,
      onNotificationBlur,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      handleNotificationClick,
      refreshNotifications,
      viewAllNotifications,
      getNotificationIcon,
      getNotificationIconClass,
      getDefaultTitle,
      formatNotificationTime
    };
  }
};
</script>

<style scoped>
/* ===== MAIN DASHBOARD STYLES ===== */
.home-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  position: relative;
}

/* Header Section */
.dashboard-header {
  background: linear-gradient(135deg, #6a8685 0%, #6d8582 100%);
  color: white;
  padding: 32px;
  border-radius: 0 0 20px 20px;
  margin-bottom: 24px;
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section .title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #eceded, #f4f5fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-section .subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 12px;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.8;
  font-size: 0.9rem;
}

.provider-id {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.9rem;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  position: relative;
}

/* ===== NOTIFICATION SYSTEM ===== */
.notification-container {
  position: relative;
  display: inline-block;
}

/* Notification Button */
.notification-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 1.2rem;
  backdrop-filter: blur(10px);
  z-index: 100;
}

.notification-btn:hover {
  background: white;
  color: #5b6388;
  transform: translateY(-2px);
}

.notification-btn:active {
  transform: scale(0.95);
}

/* Notification Badge */
.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border: 2px solid #5b6388;
  animation: pulse 2s infinite;
  z-index: 101;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* ===== NOTIFICATIONS DROPDOWN ===== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Desktop Dropdown */
.notifications-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 380px;
  max-height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  z-index: 9999;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Mobile Dropdown */
.notifications-dropdown.mobile-dropdown {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  height: 80vh;
  max-height: 600px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 99999;
}

/* Mobile Overlay */
.notifications-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9998;
}

/* Mobile Close Button */
.btn-close-mobile {
  display: none;
}

.notifications-dropdown.mobile-dropdown .btn-close-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  background: #3b82f6;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
}

.btn-close-mobile:hover {
  background: #2563eb;
}

/* Notifications Header */
.notifications-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  flex-shrink: 0;
}

.notifications-header h4 {
  margin: 0;
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
}

.notifications-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-mark-all {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.btn-mark-all:hover {
  background: #2563eb;
}

.btn-refresh {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #64748b;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-refresh:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Notifications List */
.notifications-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  max-height: none;
}

.notifications-dropdown.mobile-dropdown .notifications-list {
  max-height: calc(80vh - 150px);
}

/* Notification Item */
.notification-item {
  padding: 14px 20px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
}

.notification-item.unread {
  background: #f0f9ff;
  border-left: 3px solid #3b82f6;
}

.notification-item.clickable:hover {
  background: #f8fafc;
}

.notification-item:active {
  background: #f1f5f9;
}

.notification-item:last-child {
  border-bottom: none;
}

/* Notification Icon */
.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.notification-item.unread .notification-icon {
  background: #dbeafe;
  color: #1d4ed8;
}

.notification-item:not(.unread) .notification-icon {
  background: #f1f5f9;
  color: #64748b;
}

/* Notification Content */
.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  font-size: 0.95rem;
  line-height: 1.3;
}

.notification-item.unread .notification-title {
  color: #1e40af;
}

.notification-message {
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 6px;
  word-wrap: break-word;
}

.notification-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.notification-time {
  color: #94a3b8;
}

.notification-type {
  background: #f1f5f9;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: capitalize;
  font-size: 0.7rem;
  font-weight: 500;
}

/* Notification Actions */
.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.notification-item:hover .notification-actions {
  opacity: 1;
}

.btn-action {
  background: transparent;
  border: 1px solid #e2e8f0;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.btn-action.mark-read {
  color: #3b82f6;
}

.btn-action.mark-read:hover {
  background: #dbeafe;
  border-color: #3b82f6;
}

.btn-action.delete {
  color: #ef4444;
}

.btn-action.delete:hover {
  background: #fee2e2;
  border-color: #ef4444;
}

/* Empty State */
.notifications-empty {
  padding: 40px 20px;
  text-align: center;
  color: #94a3b8;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.notifications-empty i {
  font-size: 2.5rem;
  margin-bottom: 12px;
  opacity: 0.5;
}

.notifications-empty p {
  margin: 0;
  font-size: 0.9rem;
}

/* Notifications Footer */
.notifications-footer {
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  background: #f8fafc;
  flex-shrink: 0;
}

.btn-view-all {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #3b82f6;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  justify-content: center;
}

.btn-view-all:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background: white;
  color: #5b6388;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Loading State */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
}

.loading-content {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-content h3 {
  color: #1e293b;
  margin-bottom: 8px;
}

.loading-content p {
  color: #64748b;
}

/* Error State */
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-content i {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 16px;
}

.error-content h3 {
  color: #1e293b;
  margin-bottom: 8px;
}

.error-content p {
  color: #64748b;
  margin-bottom: 20px;
}

/* Main Content */
.dashboard-content {
  padding: 0 24px 40px;
}

/* Data Source Indicator */
.data-source-indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 12px 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.source-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.source-badge.real-data {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.source-badge.demo-data {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.last-updated {
  font-size: 0.9rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.metric-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #e2e8f0;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.metric-card.primary::before { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
.metric-card.success::before { background: linear-gradient(90deg, #10b981, #059669); }
.metric-card.revenue::before { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
.metric-card.info::before { background: linear-gradient(90deg, #0ea5e9, #0284c7); }
.metric-card.warning::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
.metric-card.purple::before { background: linear-gradient(90deg, #a855f7, #9333ea); }

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
}

.metric-card.primary .metric-icon { background: #dbeafe; color: #1d4ed8; }
.metric-card.success .metric-icon { background: #d1fae5; color: #059669; }
.metric-card.revenue .metric-icon { background: #ede9fe; color: #7c3aed; }
.metric-card.info .metric-icon { background: #e0f2fe; color: #0284c7; }
.metric-card.warning .metric-icon { background: #fef3c7; color: #d97706; }
.metric-card.purple .metric-icon { background: #f3e8ff; color: #9333ea; }

.metric-content {
  flex: 1;
}

.metric-content h3 {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1;
}

.metric-title {
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 6px;
}

.metric-trend .fa-arrow-up { color: #10b981; }
.metric-trend .fa-arrow-down { color: #ef4444; }

.metric-period {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.metric-subtext {
  font-size: 0.85rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.rating-stars {
  display: flex;
  gap: 2px;
  margin-top: 6px;
}

.rating-stars .filled {
  color: #fbbf24;
}

.metric-action {
  color: #94a3b8;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.metric-card:hover .metric-action {
  color: #3b82f6;
  transform: translateX(4px);
}

/* Quick Stats Grid */
.quick-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stats-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.stats-header {
  margin-bottom: 20px;
}

.stats-header h3 {
  color: #1e293b;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

/* Status Bars */
.status-bars {
  display: flex;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  background: #f1f5f9;
}

.status-bar {
  height: 100%;
  position: relative;
  transition: width 1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-bar.completed { background: #10b981; }
.status-bar.confirmed { background: #3b82f6; }
.status-bar.pending { background: #f59e0b; }
.status-bar.cancelled { background: #6b7280; }

.status-label {
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  padding: 0 8px;
}

/* Coming Soon Section */
.coming-soon-section {
  background: #f8fafc;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e2e8f0;
}

.coming-soon-section h3 {
  color: #1e293b;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.feature-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #e0f2fe;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-content h4 {
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.feature-content p {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.feature-status {
  display: inline-block;
  padding: 4px 10px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== RESPONSIVE DESIGN ===== */

/* Tablet */
@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .dashboard-header {
    padding: 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .welcome-section .title {
    font-size: 1.5rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .stat-item {
    text-align: left;
  }
  
  .dashboard-content {
    padding: 0 16px 24px;
  }
  
  /* Mobile-specific notification styles */
  .notifications-dropdown:not(.mobile-dropdown) {
    right: -50px;
    width: 320px;
  }
  
  .notification-btn {
    width: 40px;
    height: 40px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .dashboard-header {
    padding: 16px;
  }
  
  .welcome-section .title {
    font-size: 1.25rem;
  }
  
  .metric-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .metric-icon {
    width: 50px;
    height: 50px;
  }
  
  .metric-content h3 {
    font-size: 1.8rem;
  }
  
  .status-label {
    font-size: 0.7rem;
  }
  
  /* Mobile notifications */
  .notifications-dropdown:not(.mobile-dropdown) {
    right: -80px;
    width: 280px;
  }
  
  .notification-item {
    padding: 12px 16px;
  }
  
  .notifications-header {
    padding: 12px 16px;
  }
  
  .notifications-footer {
    padding: 12px 16px;
  }
  
  .btn-mark-all {
    padding: 4px 8px;
    font-size: 0.7rem;
  }
  
  .notification-icon {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .notifications-dropdown:not(.mobile-dropdown) {
    width: 260px;
  }
  
  .notification-title {
    font-size: 0.85rem;
  }
  
  .notification-message {
    font-size: 0.8rem;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .notification-item .notification-actions {
    opacity: 1; /* Always show actions on touch devices */
  }
  
  .btn-action {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
  
  .notification-item {
    min-height: 60px; /* Better touch target */
  }
}
</style>