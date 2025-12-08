<!-- src/App.vue - FINAL FIXED -->
<template>
  <div id="app" class="font-poppins">
    <Navbar />
    <router-view />
    <Toaster 
      position="top-right" 
      rich-colors 
      :duration="4000"
      :expand="true"
      :visible-toasts="5"
    />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: "App",
  components: {
    Navbar
  },
  mounted() {
    // Ensure mobile viewport is respected
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      document.head.appendChild(meta);
    }
  }
};
</script>

<style>
/* Global Reset & Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  line-height: 1.6;
  overflow-x: hidden;
}

/* Prevent iOS Safari zoom on input focus */
input, textarea, select, button {
  font-size: 16px;
}

/* Font Preload */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* Focus visible for accessibility */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 6px;
}

/* Scrollbar (for desktop) */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>