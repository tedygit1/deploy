<!-- src/pages/Providers/Dashboard.vue - FIXED VERSION -->
<template>
  <div class="dashboard-container">
    <!-- Mobile Header -->
    <header class="mobile-header">
      <button @click="toggleSidebar" class="hamburger-btn" aria-label="Menu">
        <i class="fa-solid fa-bars"></i>
      </button>
      <h1 class="mobile-title">Provider Hub</h1>
      <div class="header-actions">
        <div class="user-badge" v-if="provider">
          <i class="fa-solid fa-circle-user"></i>
          <span class="user-name">{{ provider.fullname || 'Provider' }}</span>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside
      class="dashboard-sidebar"
      :class="{ 'sidebar-open': sidebarOpen }"
    >
      <div class="sidebar-inner">
        <!-- Logo Section -->
        <div class="logo-section">
          <div class="logo-icon">💼</div>
          <div class="logo-text">
            <h2 class="sidebar-title">Provider Hub</h2>
            <p class="sidebar-subtitle">Business Dashboard</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <!-- Main Dashboard Section -->
          <div class="nav-section">
            <h3 class="nav-section-title">MAIN</h3>
            <ul class="sidebar-menu">
              <li
                v-for="(item, key) in mainMenuItems"
                :key="key"
                @click="goTo(key)"
                :class="{ active: isActiveRoute(key) }"
              >
                <div class="menu-item-content">
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </div>
                <div class="active-indicator"></div>
              </li>
            </ul>
          </div>

          <!-- Dashboard Sub-menu (shown when on dashboard) -->
          <div 
            class="nav-section dashboard-submenu" 
            v-if="showDashboardSubmenu"
          >
            <h3 class="nav-section-title">DASHBOARD SECTIONS</h3>
            <ul class="sidebar-menu submenu">
              <li
                v-for="(item, key) in dashboardSubmenuItems"
                :key="key"
                @click="goTo(key)"
                :class="{ active: isActiveRoute(key) }"
              >
                <div class="menu-item-content">
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </div>
                <div class="active-indicator"></div>
              </li>
            </ul>
          </div>

          <!-- Account Section -->
          <div class="nav-section">
            <h3 class="nav-section-title">ACCOUNT</h3>
            <ul class="sidebar-menu">
              <li
                v-for="(item, key) in accountMenuItems"
                :key="key"
                @click="goTo(key)"
                :class="{ active: isActiveRoute(key) }"
              >
                <div class="menu-item-content">
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </div>
                <div class="active-indicator"></div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="dashboard-main">
      <!-- Use router-view for proper routing -->
      <router-view 
        :provider="provider" 
        @profileUpdated="handleProfileUpdated"
        @logout="logout"
      />
      
      <!-- Fallback for when no route matches -->
      <div v-if="!$route.name" class="fallback-content">
        <div class="fallback-icon">🚀</div>
        <h2>Welcome to Your Dashboard</h2>
        <p>Select a section from the menu to get started managing your business.</p>
        <div class="fallback-stats">
          <div class="stat">
            <div class="stat-number">0</div>
            <div class="stat-label">Active Services</div>
          </div>
          <div class="stat">
            <div class="stat-number">0</div>
            <div class="stat-label">Pending Bookings</div>
          </div>
          <div class="stat">
            <div class="stat-number">0</div>
            <div class="stat-label">New Messages</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import http from "@/api/index.js";

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    const provider = ref(null);
    const sidebarOpen = ref(false);

    // Organized menu items by category
    const menuItems = {
      home: { label: "Dashboard", icon: "fa-solid fa-house", route: "ProviderHome", category: "main" },
      services: { label: "My Services", icon: "fa-solid fa-briefcase", route: "ProviderServices", category: "dashboard" },
      bookings: { label: "Bookings", icon: "fa-solid fa-calendar-check", route: "ProviderBookings", category: "dashboard" },
      earnings: { label: "Earnings", icon: "fa-solid fa-wallet", route: "ProviderEarnings", category: "dashboard" },
      analytics: { label: "Analytics", icon: "fa-solid fa-chart-line", route: "ProviderAnalytics", category: "dashboard" },
      messages: { label: "Messages", icon: "fa-solid fa-envelope", route: "ProviderMessages", category: "dashboard" },
      reviews: { label: "Reviews", icon: "fa-solid fa-star", route: "ProviderReviews", category: "dashboard" },
      profile: { label: "My Profile", icon: "fa-solid fa-user", route: "ProviderProfile", category: "account" },
      settings: { label: "Settings", icon: "fa-solid fa-gear", route: "ProviderSettings", category: "account" },
    };

    // Computed properties for categorized menu items
    const mainMenuItems = computed(() => 
      Object.entries(menuItems)
        .filter(([key, item]) => item.category === 'main')
        .reduce((obj, [key, item]) => ({ ...obj, [key]: item }), {})
    );

    const dashboardSubmenuItems = computed(() => 
      Object.entries(menuItems)
        .filter(([key, item]) => item.category === 'dashboard')
        .reduce((obj, [key, item]) => ({ ...obj, [key]: item }), {})
    );

    const accountMenuItems = computed(() => 
      Object.entries(menuItems)
        .filter(([key, item]) => item.category === 'account')
        .reduce((obj, [key, item]) => ({ ...obj, [key]: item }), {})
    );

    // Show dashboard submenu when on dashboard or dashboard-related pages
    const showDashboardSubmenu = computed(() => {
      return route.name === 'ProviderHome' || 
             Object.values(dashboardSubmenuItems.value).some(item => 
               route.name?.includes(item.route.replace('Provider', '')) || 
               route.name === item.route
             );
    });

    // Check if current route matches menu item
    const isActiveRoute = (menuKey) => {
      const menuRoute = menuItems[menuKey]?.route;
      if (!menuRoute) return false;
      
      if (menuRoute === "ProviderHome" && route.name === "ProviderHome") return true;
      
      return route.name?.includes(menuRoute.replace('Provider', '')) || 
             route.name === menuRoute;
    };

    // Navigation
    const goTo = (menuKey) => {
      const targetRoute = menuItems[menuKey]?.route;
      if (targetRoute) {
        router.push({ name: targetRoute });
      }
      sidebarOpen.value = false;
    };

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    const logout = async () => {
      localStorage.clear();
      await router.push({ name: "Login" });
    };

    // Fetch provider data - WITH AUTH CHECK
    const fetchProvider = async () => {
      const token = localStorage.getItem("provider_token");
      if (!token) {
        console.warn('⚠️ No token found, skipping provider fetch');
        return router.push({ name: "Login" });
      }

      try {
        const res = await http.get("/users/profile", {
          headers: { "Cache-Control": "no-cache" },
        });
        
        provider.value = res.data;
        if (res.data._id) {
          localStorage.setItem("provider_id", res.data._id);
        }
      } catch (err) {
        console.error("Profile load failed:", err);
        localStorage.clear();
        router.push({ name: "Login" });
      }
    };

    // Watch for route changes - only fetch on provider routes
    watch(() => route.name, (newRoute) => {
      console.log('📍 Route changed to:', newRoute);
      
      // Only fetch provider if we're on a provider route
      const isProviderRoute = newRoute?.includes('Provider') || 
                             route.path.includes('/provider');
      
      if (isProviderRoute && localStorage.getItem("provider_token")) {
        console.log('🔄 Fetching provider data for provider route');
        fetchProvider();
      }
    });

    // FIXED: Only fetch provider when actually on a provider route and logged in
    onMounted(() => {
      console.log('🔍 Dashboard.vue mounted');
      console.log('📱 Current route:', route.path);
      console.log('📱 Route name:', route.name);
      console.log('🔑 Has token?', !!localStorage.getItem("provider_token"));
      
      // ONLY fetch provider if:
      // 1. We're on a provider route AND
      // 2. User has a token
      
      const isProviderRoute = route.path.includes('/provider') || 
                             route.name?.includes('Provider');
      const hasToken = localStorage.getItem("provider_token");
      
      if (isProviderRoute && hasToken) {
        console.log('✅ Fetching provider data (on provider route with token)');
        fetchProvider();
      } else if (isProviderRoute && !hasToken) {
        console.warn('🚫 On provider route but no token, redirecting to login');
        router.push({ name: "Login" });
      } else {
        console.log('ℹ️ Not on provider route, skipping provider fetch');
        // Don't fetch provider data if we're not on a provider route
      }
    });

    const handleProfileUpdated = () => {
      // Only fetch provider if we have a token
      if (localStorage.getItem("provider_token")) {
        fetchProvider();
      }
    };

    return {
      provider,
      sidebarOpen,
      mainMenuItems,
      dashboardSubmenuItems,
      accountMenuItems,
      showDashboardSubmenu,
      isActiveRoute,
      goTo,
      toggleSidebar,
      logout,
      handleProfileUpdated
    };
  }
};
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', 'Poppins', sans-serif;
  overflow-x: hidden;
}

/* ===== MOBILE HEADER ===== */
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(30, 64, 175, 0.2);
}

.hamburger-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.mobile-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.user-badge i {
  font-size: 1rem;
}

.user-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== SIDEBAR ===== */
.dashboard-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 320px;
  height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid #e2e8f0;
  box-shadow: 8px 0 40px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 90;
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.dashboard-sidebar.sidebar-open {
  transform: translateX(0);
}

.sidebar-inner {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
}

/* Logo Section */
.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.logo-icon {
  font-size: 2.2rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  color: #1e293b;
  letter-spacing: -0.02em;
  padding-top: 5rem;
}

.sidebar-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
}

/* Dashboard Submenu */
.dashboard-submenu {
  margin-left: 1rem;
  border-left: 2px solid #e2e8f0;
  padding-left: 1rem;
}

.dashboard-submenu .nav-section-title {
  font-size: 0.7rem;
  color: #64748b;
}

.sidebar-menu.submenu {
  margin-left: 0.5rem;
}

.sidebar-menu.submenu .menu-item-content {
  padding: 0.5rem 1rem;
}

.sidebar-menu.submenu li span {
  font-size: 0.9rem;
  font-weight: 500;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar-menu li {
  position: relative;
  cursor: pointer;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.65rem 1.25rem;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.sidebar-menu li i {
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
  color: #64748b;
  transition: all 0.3s ease;
}

.sidebar-menu li span {
  font-weight: 600;
  color: #475569;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.sidebar-menu li:hover .menu-item-content {
  background: #f1f5f9;
  transform: translateX(4px);
}

.sidebar-menu li:hover i,
.sidebar-menu li:hover span {
  color: #3b82f6;
}

.sidebar-menu li.active .menu-item-content {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.sidebar-menu li.active i,
.sidebar-menu li.active span {
  color: white;
}

.active-indicator {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-menu li.active .active-indicator {
  opacity: 1;
}

/* Main Content */
.dashboard-main {
  flex: 1;
  padding: 2rem;
  padding-top: 90px;
  background: #f8fafc;
  min-height: calc(100vh - 90px);
}

/* Fallback Content */
.fallback-content {
  background: white;
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  text-align: center;
  margin: 2rem 0;
  border: 1px solid #f1f5f9;
}

.fallback-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.fallback-content h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.fallback-content p {
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto 2rem;
}

.fallback-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  max-width: 400px;
  margin: 0 auto;
}

.stat {
  background: #f8fafc;
  padding: 1.5rem 1rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .mobile-header {
    padding: 1rem;
  }
  
  .mobile-title {
    font-size: 1.2rem;
  }
  
  .user-badge {
    display: none;
  }
  
  .dashboard-main {
    padding: 1.5rem;
    padding-top: 80px;
  }
  
  .fallback-content {
    padding: 2rem;
  }
  
  .fallback-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .dashboard-main {
    padding: 1rem;
    padding-top: 80px;
  }
  
  .fallback-content {
    padding: 1.5rem;
  }
  
  .fallback-icon {
    font-size: 3rem;
  }
  
  .fallback-content h2 {
    font-size: 1.5rem;
  }
  
  .fallback-content p {
    font-size: 1rem;
  }
}
</style>