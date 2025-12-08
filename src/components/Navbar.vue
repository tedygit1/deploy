<!-- src/components/Navbar.vue -->
<template>
  <!-- Only show navbar if NOT on provider dashboard routes -->
  <nav v-if="!isProviderRoute" class="navbar">
    <div class="logo">
      <router-link to="/" class="logo-text">Infinity-Booking</router-link>
    </div>

    <!-- Desktop Links -->
    <ul class="nav-links">
      <li v-for="item in navItems" :key="item.to">
        <router-link
          :to="item.to"
          class="link"
          :class="{ active: $route.path === item.to }"
        >
          {{ item.label }}
        </router-link>
      </li>
      <li v-if="!isLoggedIn">
        <router-link to="/login" class="login-btn">Login / Register</router-link>
      </li>
      <li v-else>
        <button class="login-btn" @click="logout">Logout</button>
      </li>
    </ul>

    <!-- Mobile Hamburger -->
    <div class="hamburger" @click="toggleMobileMenu" aria-label="Toggle menu">
      <span :class="{ open: mobileMenuOpen }"></span>
      <span :class="{ open: mobileMenuOpen }"></span>
      <span :class="{ open: mobileMenuOpen }"></span>
    </div>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="mobileMenuOpen"
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="mobile-menu">
      <div class="mobile-menu-inner">
        <div class="mobile-logo">
          <router-link to="/" class="logo-text" @click="closeMobileMenu">
            Infinity-Booking
          </router-link>
        </div>
        <ul>
          <li v-for="item in navItems" :key="item.to">
            <router-link
              :to="item.to"
              @click="closeMobileMenu"
            >
              {{ item.label }}
            </router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/login" @click="closeMobileMenu">
              Login / Register
            </router-link>
          </li>
          <li v-else>
            <button @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { userStore } from "@/store/user";
import { toast } from "vue-sonner";

const router = useRouter();
const route = useRoute();
const mobileMenuOpen = ref(false);

const isLoggedIn = computed(() => !!userStore.user);

// Check if current route is a provider dashboard route
const isProviderRoute = computed(() => {
  return route.path.startsWith('/provider') || 
         route.path.includes('/dashboard') ||
         route.path === '/provider' ||
         route.path === '/dashboard';
});

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/contact", label: "Contact" },
];

const logout = () => {
  userStore.logout();
  toast.success("✅ Logged out successfully");
  router.push({ path: "/login" });
  closeMobileMenu();
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<style scoped>
/* All your existing styles remain the same */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  z-index: 1100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.logo-text {
  font-size: 1.7rem;
  font-weight: 800;
  color: white;
  text-decoration: none;
  background: linear-gradient(90deg, #ffcc00, #ffd54f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  align-items: center;
}

.link {
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.02rem;
  padding: 0.4rem 0;
  position: relative;
  transition: color 0.2s;
}

.link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #ffcc00;
  transition: width 0.3s ease;
}

.link:hover,
.link.active {
  color: #ffcc00;
}

.link.active::after,
.link:hover::after {
  width: 100%;
}

.login-btn {
  background: linear-gradient(90deg, #ffcc00, #ffd54f);
  color: #1e293b !important;
  padding: 0.55rem 1.3rem;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 10px rgba(255, 204, 0, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(255, 204, 0, 0.4);
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.hamburger:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hamburger span {
  width: 26px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger span.open:nth-child(2) {
  opacity: 0;
}

.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1050;
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 320px;
  height: 100vh;
  background: rgba(15, 23, 42, 0.97);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1060;
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.mobile-menu-inner {
  padding: 2rem 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-logo {
  margin-bottom: 2.5rem;
}

.mobile-logo .logo-text {
  font-size: 1.8rem;
}

.mobile-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  flex: 1;
}

.mobile-menu li a,
.mobile-menu li button {
  color: #e2e8f0;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.6rem 0;
  transition: color 0.2s;
  width: fit-content;
}

.mobile-menu li a:hover,
.mobile-menu li button:hover {
  color: #ffcc00;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .hamburger {
    display: flex;
  }
  .mobile-menu {
    transform: translateX(0);
  }
}
</style>