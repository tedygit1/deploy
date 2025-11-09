<template>
  <div style="padding: 2rem; max-width: 450px; margin: auto;">
    <h2>Minimal Backend Test</h2>

    <!-- Registration -->
    <h3>Test Register</h3>
    <input v-model="fullname" placeholder="Full Name" />
    <input v-model="email" placeholder="Email" />
    <input v-model="phonenumber" placeholder="Phone Number" />
    <input v-model="location" placeholder="Location" />
    <input v-model="FIN" placeholder="FIN" />
    <input v-model="workExperience" placeholder="Work Experience" />
    <input v-model="serviceCategories" placeholder="Service Categories (comma separated)" />
    <input v-model="password" placeholder="Password" type="password" />
    <input v-model="confirmPassword" placeholder="Confirm Password" type="password" />
    <input type="file" @change="handleFile" />

    <button @click="testRegister">Register</button>
    <div v-if="regLoading">Registering...</div>
    <div v-if="regSuccess" style="color:green;">✅ Registration successful!</div>
    <div v-if="regError" style="color:red;">❌ {{ regError }}</div>

    <hr />

    <!-- Login -->
    <h3>Test Login</h3>
    <input v-model="loginEmail" placeholder="Email" />
    <input v-model="loginPassword" placeholder="Password" type="password" />
    <button @click="testLogin">Login</button>
    <div v-if="loginLoading">Logging in...</div>
    <div v-if="loginSuccess" style="color:green;">✅ Login successful!</div>
    <div v-if="loginError" style="color:red;">❌ {{ loginError }}</div>

    <hr />

    <!-- Protected route -->
    <h3>Test Protected Route</h3>
    <button @click="testProfile">Check Profile</button>
    <pre v-if="profileData" style="background:#f4f4f4; padding:1rem;">{{ profileData }}</pre>
    <div v-if="profileError" style="color:red;">❌ {{ profileError }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AuthTest",
  data() {
    return {
      // Backend base URL
      BASE_URL: "https://infinity-booking-backend1.onrender.com/infinity-booking",

      // Registration fields
      fullname: "",
      email: "",
      phonenumber: "",
      location: "",
      FIN: "",
      workExperience: "",
      serviceCategories: "",
      password: "",
      confirmPassword: "",
      certificateFile: null,

      regLoading: false,
      regSuccess: false,
      regError: null,

      // Login fields
      loginEmail: "",
      loginPassword: "",
      loginLoading: false,
      loginSuccess: false,
      loginError: null,

      // Profile
      profileData: null,
      profileError: null,
    };
  },
  methods: {
    handleFile(event) {
      this.certificateFile = event.target.files[0];
    },

    // ✅ Test provider registration
    async testRegister() {
      this.regLoading = true;
      this.regSuccess = false;
      this.regError = null;

      try {
        const formData = new FormData();
        formData.append("fullname", this.fullname);
        formData.append("email", this.email);
        formData.append("phonenumber", this.phonenumber);
        formData.append("location", this.location);
        formData.append("FIN", this.FIN);
        formData.append("workExperience", this.workExperience);
        formData.append("password", this.password);
        formData.append("confirmPassword", this.confirmPassword);

        // Service categories as JSON array
        if (this.serviceCategories) {
          formData.append(
            "serviceCategories",
            JSON.stringify(this.serviceCategories.split(",").map((cat) => cat.trim()))
          );
        }

        // Optional file upload
        if (this.certificateFile) formData.append("certificate", this.certificateFile);

        const res = await axios.post(`${this.BASE_URL}/auth/register/provider`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ Registration response:", res.data);
        this.regSuccess = true;
      } catch (err) {
        console.error("❌ Registration error:", err.response?.data || err.message);
        this.regError = err.response?.data?.message || JSON.stringify(err.response?.data || err.message);
      } finally {
        this.regLoading = false;
      }
    },

    // ✅ Test login
    async testLogin() {
      this.loginLoading = true;
      this.loginSuccess = false;
      this.loginError = null;

      try {
        const res = await axios.post(`${this.BASE_URL}/auth/login`, {
          email: this.loginEmail,
          password: this.loginPassword,
        });

        console.log("✅ Login response:", res.data);
        this.loginSuccess = true;

        if (res.data.token) {
          localStorage.setItem("provider_token", res.data.token);
        }
      } catch (err) {
        console.error("❌ Login error:", err.response?.data || err.message);
        this.loginError = err.response?.data?.message || JSON.stringify(err.response?.data || err.message);
      } finally {
        this.loginLoading = false;
      }
    },

    // ✅ Test protected user profile
    async testProfile() {
      this.profileData = null;
      this.profileError = null;

      try {
        const token = localStorage.getItem("provider_token");
        const res = await axios.get(`${this.BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Profile Data:", res.data);
        this.profileData = JSON.stringify(res.data, null, 2);
      } catch (err) {
        console.error("❌ Profile fetch error:", err.response?.data || err.message);
        this.profileError = err.response?.data?.message || JSON.stringify(err.response?.data || err.message);
      }
    },
  },
};
</script>
