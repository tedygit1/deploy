import { reactive } from "vue";

export const userStore = reactive({
  user: null,        // logged-in user info
  users: [],         // all registered providers

  // Register a new provider
  register(payload) {
    const exists = this.users.find(u => u.email === payload.email);
    if (exists) return false; // email already taken
    this.users.push(payload);
    return true;
  },

  // Login: only allows registered providers
  login(email, password) {
    const found = this.users.find(u => u.email === email && u.password === password);
    if (found) {
      this.user = found;
      localStorage.setItem("token", JSON.stringify(found)); // optional persistence
      return true;
    }
    return false;
  },

  // Logout
  logout() {
    this.user = null;
    localStorage.removeItem("token");
  },

  // Initialize from localStorage
  init() {
    const token = localStorage.getItem("token");
    if (token) this.user = JSON.parse(token);
  },
});
