<!-- src/components/Navbar.vue -->
<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled, 'mobile-menu-open': mobileMenuOpen }">
    <!-- Floating Elements for Visual Effects -->
    <div class="floating-elements">
      <div class="floating-dot dot-1"></div>
      <div class="floating-dot dot-2"></div>
      <div class="floating-dot dot-3"></div>
    </div>

    <div class="nav-container">
      <!-- Animated Logo -->
      <div class="logo" @mouseenter="animateLogo">
        <router-link to="/" class="logo-link" @click="closeMobileMenu">
          <div class="logo-container">
            <div class="logo-icon">
              <div class="infinity-symbol">
                <div class="loop loop-1"></div>
                <div class="loop loop-2"></div>
                <div class="center-dot"></div>
              </div>
            </div>
            <div class="logo-text-container">
              <span class="logo-text">Infinity</span>
              <span class="logo-subtext">Booking</span>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <div class="desktop-nav" v-if="!isMobile">
        <!-- Navigation Links with Hover Effects -->
        <div class="nav-links">
          <router-link
            v-for="(item, index) in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-link"
            :class="{ 
              active: $route.path === item.to,
              'hover-active': hoveredLink === index
            }"
            @mouseenter="hoveredLink = index"
            @mouseleave="hoveredLink = null"
          >
            <span class="nav-link-text">{{ item.label }}</span>
            <span class="nav-link-underline"></span>
            <span class="nav-link-glow"></span>
          </router-link>
        </div>

        <!-- Call to Action Button -->
        <div class="cta-container" v-if="!isLoggedIn">
          <router-link to="/login" class="nav-btn login-btn">
            <span class="btn-icon">
              <i class="fas fa-sign-in-alt"></i>
            </span>
            <span class="btn-text">Login</span>
          </router-link>
          <router-link to="/register" class="nav-btn primary-btn">
            <span class="btn-icon">
              <i class="fas fa-rocket"></i>
            </span>
            <span class="btn-text">Get Started Free</span>
            <span class="btn-sparkle">
              <i class="fas fa-sparkle"></i>
            </span>
          </router-link>
        </div>

        <!-- User Menu (Logged In) -->
        <div v-else class="user-section">
          <!-- Quick Actions -->
          <div class="quick-actions">
            <button class="action-btn" @click="showNotifications" title="Notifications">
              <i class="fas fa-bell"></i>
              <span class="badge" v-if="unreadNotifications > 0">{{ unreadNotifications }}</span>
            </button>
            <button class="action-btn" @click="showMessages" title="Messages">
              <i class="fas fa-envelope"></i>
            </button>
          </div>

          <!-- Enhanced User Menu -->
          <div class="user-menu-wrapper">
            <button 
              class="user-profile-btn" 
              @click="toggleUserMenu"
              :class="{ 'menu-open': userMenuOpen }"
            >
              <div class="avatar-container">
                <div class="avatar-ring">
                  <div class="avatar-glow"></div>
                  <div class="user-avatar">
                    {{ userInitials }}
                  </div>
                </div>
                <div class="user-info">
                  <span class="user-name">{{ userStore.user?.name || 'User' }}</span>
                  <span class="user-status">Online</span>
                </div>
              </div>
              <div class="menu-arrow">
                <i class="fas fa-chevron-down"></i>
              </div>
            </button>

            <!-- Enhanced User Dropdown -->
            <transition name="slide-fade">
              <div v-if="userMenuOpen" class="user-dropdown-menu" @click.stop>
                <!-- User Profile Header -->
                <div class="dropdown-header">
                  <div class="dropdown-avatar">
                    {{ userInitials }}
                  </div>
                  <div class="dropdown-user-info">
                    <h4>{{ userStore.user?.name || 'User' }}</h4>
                    <p>{{ userStore.user?.email }}</p>
                  </div>
                </div>

                <!-- Dashboard Quick Link -->
                <router-link to="/dashboard" class="dashboard-quick-link" @click="closeUserMenu">
                  <div class="quick-link-icon">
                    <i class="fas fa-tachometer-alt"></i>
                  </div>
                  <div class="quick-link-content">
                    <span>Go to Dashboard</span>
                    <small>Manage your bookings</small>
                  </div>
                  <div class="quick-link-arrow">
                    <i class="fas fa-arrow-right"></i>
                  </div>
                </router-link>

                <!-- Menu Items -->
                <div class="dropdown-items">
                  <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">
                    <i class="fas fa-user"></i>
                    <span>My Profile</span>
                  </router-link>
                  <router-link to="/bookings" class="dropdown-item" @click="closeUserMenu">
                    <i class="fas fa-calendar-check"></i>
                    <span>My Bookings</span>
                  </router-link>
                  <router-link to="/settings" class="dropdown-item" @click="closeUserMenu">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                  </router-link>
                  <router-link to="/help" class="dropdown-item" @click="closeUserMenu">
                    <i class="fas fa-question-circle"></i>
                    <span>Help & Support</span>
                  </router-link>
                </div>

                <!-- Divider -->
                <div class="dropdown-divider"></div>

                <!-- Actions -->
                <div class="dropdown-actions">
                  <button class="dropdown-action-btn dark-mode-btn" @click="toggleDarkMode">
                    <i class="fas fa-moon"></i>
                    <span>Dark Mode</span>
                    <div class="toggle-switch" :class="{ 'active': darkMode }">
                      <div class="toggle-circle"></div>
                    </div>
                  </button>
                  <button class="dropdown-action-btn" @click="logout">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Button (Hamburger) -->
      <button 
        class="mobile-menu-toggle"
        :class="{ 'active': mobileMenuOpen }"
        @click="toggleMobileMenu"
        aria-label="Toggle menu"
      >
        <div class="hamburger">
          <span class="line line-1"></span>
          <span class="line line-2"></span>
          <span class="line line-3"></span>
        </div>
      </button>

      <!-- Mobile Navigation Overlay -->
      <transition name="fade">
        <div 
          v-if="mobileMenuOpen" 
          class="mobile-nav-overlay" 
          @click="closeMobileMenu"
        ></div>
      </transition>

      <!-- Mobile Navigation Menu -->
      <transition name="slide">
        <div v-if="mobileMenuOpen" class="mobile-nav-menu">
          <!-- Mobile Header -->
          <div class="mobile-nav-header">
            <div class="mobile-logo">
              <router-link to="/" @click="closeMobileMenu">
                <div class="infinity-symbol mobile">
                  <div class="loop loop-1"></div>
                  <div class="loop loop-2"></div>
                </div>
                <span>Infinity Booking</span>
              </router-link>
            </div>
            <button class="mobile-close-btn" @click="closeMobileMenu">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Mobile User Info (Logged In) -->
          <div v-if="isLoggedIn" class="mobile-user-profile">
            <div class="mobile-avatar">
              {{ userInitials }}
            </div>
            <div class="mobile-user-details">
              <h4>{{ userStore.user?.name || 'User' }}</h4>
              <p>{{ userStore.user?.email }}</p>
            </div>
            <div class="mobile-user-status">
              <span class="status-indicator"></span>
              Online
            </div>
          </div>

          <!-- Mobile Navigation Links -->
          <div class="mobile-nav-links">
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="mobile-nav-link"
              :class="{ active: $route.path === item.to }"
              @click="closeMobileMenu"
            >
              <div class="mobile-link-icon">
                <i :class="getMobileIcon(item.label)"></i>
              </div>
              <span class="mobile-link-text">{{ item.label }}</span>
              <div class="mobile-link-arrow">
                <i class="fas fa-chevron-right"></i>
              </div>
            </router-link>
          </div>

          <!-- Mobile Actions -->
          <div class="mobile-actions">
            <div v-if="!isLoggedIn" class="mobile-auth-buttons">
              <router-link to="/login" class="mobile-auth-btn login" @click="closeMobileMenu">
                <i class="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </router-link>
              <router-link to="/register" class="mobile-auth-btn register" @click="closeMobileMenu">
                <i class="fas fa-rocket"></i>
                <span>Get Started</span>
              </router-link>
            </div>
            <div v-else class="mobile-user-actions">
              <router-link to="/dashboard" class="mobile-action-btn" @click="closeMobileMenu">
                <i class="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </router-link>
              <router-link to="/profile" class="mobile-action-btn" @click="closeMobileMenu">
                <i class="fas fa-user"></i>
                <span>Profile</span>
              </router-link>
              <button class="mobile-action-btn dark-mode" @click="toggleDarkMode">
                <i class="fas fa-moon"></i>
                <span>Dark Mode</span>
                <div class="mobile-toggle" :class="{ 'active': darkMode }">
                  <div class="mobile-toggle-circle"></div>
                </div>
              </button>
              <button class="mobile-action-btn logout" @click="logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>

          <!-- Mobile Footer -->
          <div class="mobile-nav-footer">
            <div class="mobile-theme-toggle">
              <button class="theme-btn light" :class="{ 'active': !darkMode }" @click="setLightMode">
                <i class="fas fa-sun"></i>
              </button>
              <button class="theme-btn dark" :class="{ 'active': darkMode }" @click="setDarkMode">
                <i class="fas fa-moon"></i>
              </button>
            </div>
            <div class="mobile-copyright">
              © {{ currentYear }} Infinity Booking
            </div>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "@/store/user";
import { toast } from "vue-sonner";

const router = useRouter();
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
const isScrolled = ref(false);
const hoveredLink = ref(null);
const darkMode = ref(false);
const unreadNotifications = ref(3); // Mock data

// Detect mobile screen
const isMobile = computed(() => window.innerWidth <= 1024);

const isLoggedIn = computed(() => !!userStore.user);

const userInitials = computed(() => {
  const name = userStore.user?.name || '';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const currentYear = computed(() => new Date().getFullYear());

const navItems = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/solutions", label: "Solutions" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

// Icon mapping for mobile
const getMobileIcon = (label) => {
  const icons = {
    'Home': 'fas fa-home',
    'Features': 'fas fa-star',
    'Solutions': 'fas fa-lightbulb',
    'Pricing': 'fas fa-tag',
    'Contact': 'fas fa-envelope',
    'About': 'fas fa-info-circle',
    'How It Works': 'fas fa-cogs'
  };
  return icons[label] || 'fas fa-link';
};

// Scroll detection
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

// Menu toggle functions
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (mobileMenuOpen.value) {
    userMenuOpen.value = false;
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const closeUserMenu = () => {
  userMenuOpen.value = false;
};

const logout = () => {
  userStore.logout();
  toast.success("Logged out successfully");
  router.push("/");
  closeMobileMenu();
  closeUserMenu();
};

// Dark mode functions
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  if (darkMode.value) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
};

const setDarkMode = () => {
  darkMode.value = true;
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
};

const setLightMode = () => {
  darkMode.value = false;
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('theme', 'light');
};

// Notification functions
const showNotifications = () => {
  toast.info("Notifications feature coming soon!");
};

const showMessages = () => {
  toast.info("Messages feature coming soon!");
};

// Logo animation
const animateLogo = () => {
  const loops = document.querySelectorAll('.loop');
  loops.forEach(loop => {
    loop.style.animation = 'pulse 0.6s ease';
    setTimeout(() => {
      loop.style.animation = '';
    }, 600);
  });
};

// Close menus on outside click and escape key
const handleClickOutside = (event) => {
  if (!event.target.closest('.user-menu-wrapper') && !event.target.closest('.mobile-menu-toggle')) {
    userMenuOpen.value = false;
  }
};

const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    closeMobileMenu();
    closeUserMenu();
  }
};

// Load saved theme
const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  darkMode.value = savedTheme === 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);
  window.addEventListener('scroll', handleScroll);
  loadTheme();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);
  window.removeEventListener('scroll', handleScroll);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* ===== BASE STYLES & VARIABLES ===== */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-gradient-hover: linear-gradient(135deg, #5a6fd8 0%, #6a4290 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(255, 255, 255, 0.2);
  --text-primary: #1a1a1a;
  --text-secondary: #4b5563;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 8px 30px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.15);
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

[data-theme="dark"] {
  --glass-bg: rgba(30, 30, 30, 0.85);
  --glass-border: rgba(255, 255, 255, 0.1);
  --text-primary: #ffffff;
  --text-secondary: #a0aec0;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 8px 30px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--glass-border);
  z-index: 1000;
  transition: var(--transition-smooth);
  padding: 0;
  height: 80px;
}

.navbar.scrolled {
  height: 70px;
  box-shadow: var(--shadow-md);
  background: var(--glass-bg);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

/* ===== FLOATING ELEMENTS ===== */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: -1;
}

.floating-dot {
  position: absolute;
  border-radius: 50%;
  background: var(--primary-gradient);
  opacity: 0.1;
  animation: float 20s infinite linear;
}

.dot-1 {
  width: 80px;
  height: 80px;
  top: -40px;
  left: 10%;
  animation-delay: 0s;
}

.dot-2 {
  width: 60px;
  height: 60px;
  top: -30px;
  right: 20%;
  animation-delay: -5s;
}

.dot-3 {
  width: 40px;
  height: 40px;
  bottom: -20px;
  left: 40%;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
  }
  50% {
    transform: translateY(0) rotate(180deg);
  }
  75% {
    transform: translateY(20px) rotate(270deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* ===== ANIMATED LOGO ===== */
.logo {
  cursor: pointer;
  z-index: 2;
}

.logo-link {
  text-decoration: none;
  display: block;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  position: relative;
  width: 48px;
  height: 48px;
}

.infinity-symbol {
  position: relative;
  width: 100%;
  height: 100%;
}

.loop {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid;
  border-color: #667eea transparent transparent #667eea;
  border-radius: 50%;
  animation: spin 4s linear infinite;
}

.loop-1 {
  top: 0;
  left: 0;
  animation-delay: 0s;
}

.loop-2 {
  bottom: 0;
  right: 0;
  border-color: transparent #764ba2 #764ba2 transparent;
  animation-delay: -2s;
}

.center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: var(--primary-gradient);
  border-radius: 50%;
  z-index: 1;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.logo-text-container {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.logo-subtext {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

/* ===== DESKTOP NAVIGATION ===== */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 48px;
  flex: 1;
  justify-content: flex-end;
}

.nav-links {
  display: flex;
  gap: 32px;
  margin-right: auto;
}

.nav-link {
  position: relative;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 8px 0;
  overflow: hidden;
  transition: var(--transition-smooth);
}

.nav-link-text {
  position: relative;
  z-index: 1;
}

.nav-link-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-gradient);
  transition: width 0.3s ease;
  border-radius: 1px;
}

.nav-link-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  transition: width 0.3s ease, height 0.3s ease;
  z-index: 0;
}

.nav-link:hover .nav-link-underline,
.nav-link.active .nav-link-underline {
  width: 100%;
}

.nav-link:hover .nav-link-glow,
.nav-link.hover-active .nav-link-glow {
  width: 120px;
  height: 120px;
}

.nav-link:hover,
.nav-link.active {
  color: var(--text-primary);
}

/* ===== CALL TO ACTION BUTTONS ===== */
.cta-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: var(--transition-bounce);
  position: relative;
  overflow: hidden;
}

.nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.login-btn {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-primary);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.login-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.primary-btn {
  background: var(--primary-gradient);
  color: white;
  border: none;
}

.primary-btn:hover {
  background: var(--primary-gradient-hover);
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-md);
}

.btn-sparkle {
  margin-left: 4px;
  animation: sparkle 2s infinite;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* ===== USER SECTION ===== */
.user-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-smooth);
  position: relative;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  animation: pulse 1.5s infinite;
}

/* ===== ENHANCED USER MENU ===== */
.user-menu-wrapper {
  position: relative;
}

.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  padding: 8px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: var(--transition-smooth);
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.user-profile-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.user-profile-btn.menu-open {
  background: rgba(0, 0, 0, 0.12);
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-ring {
  position: relative;
}

.avatar-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: var(--primary-gradient);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.user-profile-btn:hover .avatar-glow {
  opacity: 0.3;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: var(--primary-gradient);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-status {
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 500;
}

.menu-arrow {
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.user-profile-btn.menu-open .menu-arrow {
  transform: rotate(180deg);
}

/* ===== USER DROPDOWN MENU ===== */
.user-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  width: 320px;
  padding: 0;
  z-index: 1001;
  overflow: hidden;
}

.dropdown-header {
  padding: 24px;
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.dropdown-avatar {
  width: 56px;
  height: 56px;
  background: var(--primary-gradient);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
}

.dropdown-user-info h4 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.dropdown-user-info p {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.dashboard-quick-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  text-decoration: none;
  background: rgba(102, 126, 234, 0.08);
  margin: 16px;
  border-radius: 12px;
  transition: var(--transition-smooth);
}

.dashboard-quick-link:hover {
  background: rgba(102, 126, 234, 0.12);
  transform: translateX(4px);
}

.quick-link-icon {
  width: 40px;
  height: 40px;
  background: var(--primary-gradient);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.quick-link-content {
  flex: 1;
}

.quick-link-content span {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.quick-link-content small {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.quick-link-arrow {
  color: var(--text-secondary);
}

.dropdown-items {
  padding: 16px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  transition: var(--transition-smooth);
}

.dropdown-item:hover {
  background: rgba(0, 0, 0, 0.04);
  padding-left: 28px;
}

.dropdown-item i {
  width: 20px;
  color: var(--text-secondary);
}

.dropdown-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 8px 0;
}

.dropdown-actions {
  padding: 16px 24px;
}

.dropdown-action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 0;
  background: none;
  border: none;
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.dropdown-action-btn:hover {
  color: #667eea;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin-left: auto;
  position: relative;
  transition: var(--transition-smooth);
}

.toggle-switch.active {
  background: #667eea;
}

.toggle-circle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.toggle-switch.active .toggle-circle {
  transform: translateX(20px);
}

/* ===== MOBILE MENU TOGGLE ===== */
.mobile-menu-toggle {
  display: none;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 12px;
  transition: var(--transition-smooth);
  position: relative;
  z-index: 1002;
}

.mobile-menu-toggle:hover {
  background: rgba(0, 0, 0, 0.08);
  transform: rotate(90deg);
}

.mobile-menu-toggle.active {
  background: rgba(0, 0, 0, 0.12);
  transform: rotate(180deg);
}

.hamburger {
  position: relative;
  width: 100%;
  height: 100%;
}

.line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  border-radius: 1px;
  transition: var(--transition-smooth);
}

.line-1 {
  top: 25%;
}

.line-2 {
  top: 50%;
  transform: translateY(-50%);
}

.line-3 {
  bottom: 25%;
}

.mobile-menu-toggle.active .line-1 {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-toggle.active .line-2 {
  opacity: 0;
}

.mobile-menu-toggle.active .line-3 {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* ===== MOBILE NAVIGATION OVERLAY ===== */
.mobile-nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
}

/* ===== MOBILE NAVIGATION MENU ===== */
.mobile-nav-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 380px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
}

.mobile-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.mobile-logo a {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.2rem;
}

.infinity-symbol.mobile {
  width: 36px;
  height: 36px;
  position: relative;
}

.infinity-symbol.mobile .loop {
  width: 16px;
  height: 16px;
}

.mobile-close-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.mobile-close-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  transform: rotate(90deg);
}

.mobile-user-profile {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-avatar {
  width: 56px;
  height: 56px;
  background: var(--primary-gradient);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
}

.mobile-user-details h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.mobile-user-details p {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.mobile-user-status {
  margin-left: auto;
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.mobile-nav-links {
  flex: 1;
  margin-bottom: 24px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  border-radius: 12px;
  margin-bottom: 8px;
  transition: var(--transition-smooth);
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  background: rgba(0, 0, 0, 0.04);
  transform: translateX(8px);
}

.mobile-link-icon {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.mobile-nav-link.active .mobile-link-icon {
  background: var(--primary-gradient);
  color: white;
}

.mobile-link-text {
  flex: 1;
}

.mobile-link-arrow {
  color: var(--text-secondary);
}

.mobile-actions {
  padding: 24px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.mobile-auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: var(--transition-smooth);
}

.mobile-auth-btn.login {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-primary);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.mobile-auth-btn.login:hover {
  background: rgba(0, 0, 0, 0.08);
}

.mobile-auth-btn.register {
  background: var(--primary-gradient);
  color: white;
}

.mobile-auth-btn.register:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.mobile-user-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-action-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: none;
  border: none;
  color: var(--text-primary);
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.mobile-action-btn:hover {
  background: rgba(0, 0, 0, 0.04);
}

.mobile-action-btn.logout {
  color: #ef4444;
}

.mobile-action-btn.logout:hover {
  background: rgba(239, 68, 68, 0.04);
}

.mobile-toggle {
  margin-left: auto;
  width: 44px;
  height: 24px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  position: relative;
  transition: var(--transition-smooth);
}

.mobile-toggle.active {
  background: #667eea;
}

.mobile-toggle-circle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.mobile-toggle.active .mobile-toggle-circle {
  transform: translateX(20px);
}

.mobile-nav-footer {
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
}

.mobile-theme-toggle {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.theme-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.theme-btn.active {
  background: var(--primary-gradient);
  color: white;
  border-color: transparent;
}

.mobile-copyright {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* ===== TRANSITIONS ===== */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1024px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .navbar {
    padding: 0 16px;
  }
  
  .nav-container {
    padding: 0 16px;
  }
}

@media (max-width: 768px) {
  .navbar {
    height: 72px;
  }
  
  .navbar.scrolled {
    height: 64px;
  }
  
  .logo-text {
    font-size: 1.3rem;
  }
  
  .logo-subtext {
    font-size: 0.7rem;
  }
  
  .mobile-nav-menu {
    max-width: 100%;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .logo-icon {
    width: 40px;
    height: 40px;
  }
  
  .logo-text {
    font-size: 1.1rem;
  }
  
  .mobile-nav-header {
    margin-bottom: 24px;
  }
  
  .mobile-user-profile {
    flex-direction: column;
    text-align: center;
    padding: 16px;
  }
  
  .mobile-user-status {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>