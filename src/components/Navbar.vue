<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/" class="logo-text">Infinity-Booking</router-link>
    </div>

    <ul class="nav-links">
      <li>
        <router-link to="/" class="link" :class="{ active: $route.name === 'Home' }">Home</router-link>
      </li>
      <li>
        <router-link to="/providers" class="link" :class="{ active: $route.name === 'Providers' }">Providers</router-link>
      </li>
      <li>
        <router-link to="/about" class="link" :class="{ active: $route.name === 'About' }">About</router-link>
      </li>
      <li>
        <router-link to="/how-it-works" class="link" :class="{ active: $route.name === 'HowItWorks' }">How It Works</router-link>
      </li>
      <li>
        <router-link to="/contact" class="link" :class="{ active: $route.name === 'Contact' }">Contact</router-link>
      </li>

      <!-- Auth Button -->
      <li v-if="!isLoggedIn">
        <router-link
          to="/login"
          class="login-btn"
          :class="{ active: $route.name === 'Login' }"
        >
          Login / Register
        </router-link>
      </li>
      <li v-else>
        <button class="login-btn" @click="logout">Logout</button>
      </li>
    </ul>

    <!-- Mobile Hamburger -->
    <div class="hamburger" @click="toggleMobileMenu">
      <span :class="{ open: mobileMenuOpen }"></span>
      <span :class="{ open: mobileMenuOpen }"></span>
      <span :class="{ open: mobileMenuOpen }"></span>
    </div>

    <!-- Mobile menu -->
    <ul v-if="mobileMenuOpen" class="mobile-menu">
      <li>
        <router-link to="/" @click="closeMobileMenu">Home</router-link>
      </li>
      <li>
        <router-link to="/providers" @click="closeMobileMenu">Providers</router-link>
      </li>
      <li>
        <router-link to="/about" @click="closeMobileMenu">About</router-link>
      </li>
      <li>
        <router-link to="/how-it-works" @click="closeMobileMenu">How It Works</router-link>
      </li>
      <li>
        <router-link to="/contact" @click="closeMobileMenu">Contact</router-link>
      </li>
      <li v-if="!isLoggedIn">
        <router-link to="/login" @click="closeMobileMenu">Login / Register</router-link>
      </li>
      <li v-else>
        <button @click="logout">Logout</button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "@/store/user";
import { toast } from "vue-sonner";

export default {
  name: "Navbar",
  setup() {
    const router = useRouter();
    const mobileMenuOpen = ref(false);

    // reactive login state
    const isLoggedIn = computed(() => !!userStore.user);

    const logout = () => {
      userStore.logout();
      toast.success("✅ Logged out successfully");
      router.push({ path: "/login" });
    };

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false;
    };

    return {
      logout,
      isLoggedIn,
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
    };
  },
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.logo-text:hover {
  color: #ffcc00;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  font-size: 1rem;
  color: white;
}

.link {
  color: #ffffff;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: #ffcc00;
}

.active {
  color: #ffcc00;
  font-weight: 600;
}

.login-btn {
  background: #ffcc00;
  color: black !important;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.2s;
  border: none;
  cursor: pointer;
}

.login-btn:hover {
  background: #ffd633;
  transform: scale(1.05);
}

/* Mobile Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.hamburger span {
  width: 25px;
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

/* Mobile menu */
.mobile-menu {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.95);
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  padding: 1rem;
  gap: 1rem;
  z-index: 999;
}

.mobile-menu li {
  list-style: none;
}

.mobile-menu a,
.mobile-menu button {
  color: white;
  text-decoration: none;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-menu a:hover,
.mobile-menu button:hover {
  color: #ffcc00;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .hamburger {
    display: flex;
  }
}
</style>
