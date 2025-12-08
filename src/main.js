// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Notifications
import VueSonner from 'vue-sonner'

// ✅ RESTORED: This is REQUIRED because Navbar.vue uses Font Awesome icons
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)
app.use(router)
app.use(VueSonner)
app.mount('#app')