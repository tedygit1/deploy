<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- ===== Brand Info ===== -->
      <div class="footer-section brand">
        <h2 class="logo">Infinity-Booking</h2>
        <p class="desc">
          Connecting customers and trusted service providers worldwide —
          discover professionals for every need, anywhere.
        </p>
        <div class="social-icons">
  <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
  <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
  <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
  <a href="https://www.linkedin.com/in/tedros-welu-126b77378" 
     target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
    <i class="fab fa-linkedin-in"></i>
  </a>
</div>
</div>

      <!-- ===== Quick Links ===== -->
      <div class="footer-section links">
        <h3>Quick Links</h3>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/providers">Providers</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>
      </div>

      <!-- ===== Support ===== -->
      <div class="footer-section support">
        <h3>Support</h3>
        <ul>
          <li><router-link to="/help-center">Help Center</router-link></li>
          <li><router-link to="/privacy-policy">Privacy Policy</router-link></li>
          <li><router-link to="/terms-of-service">Terms of Service</router-link></li>
          <li><router-link to="/feedback">Feedback</router-link></li>
        </ul>
      </div>

      <!-- ===== Contact Info ===== -->
      <div class="footer-section contact">
        <h3>Contact Us</h3>
        <p><i class="fas fa-envelope"></i> info@csplatform.com</p>
        <p><i class="fas fa-phone"></i> +251964883260</p>
        <p><i class="fas fa-globe"></i> Available Worldwide</p>
      </div>
    </div>

    <hr class="divider" />

    <!-- ===== Bottom Copyright ===== -->
    <div class="footer-bottom">
      <p>© {{ currentYear }} <strong>Infinity-Booking</strong>. All rights reserved.</p>
      <button class="scroll-top" @click="scrollToTop" title="Back to top">
        <i class="fas fa-arrow-up"></i>
      </button>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>

<style scoped>
.footer {
  background: #111;
  color: #f1f1f1;
  padding: 3rem 2rem 1rem;
  font-family: "Poppins", sans-serif;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  text-align: left;
}

.logo {
  font-size: 1.8rem;
  color: #ffcc00;
  font-weight: bold;
  margin-bottom: 10px;
}

.desc {
  font-size: 0.95rem;
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 15px;
}

/* === Social Icons === */
.social-icons a {
  color: #f1f1f1;
  margin-right: 10px;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}
.social-icons a:hover {
  color: #ffcc00;
}

/* === Section Headers === */
.footer-section h3 {
  color: #ffcc00;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

/* === Links === */
.footer-section ul {
  list-style: none;
  padding: 0;
}
.footer-section li {
  margin-bottom: 8px;
}
.footer-section a,
.footer-section router-link {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s ease;
}
.footer-section a:hover,
.footer-section router-link:hover {
  color: #ffcc00;
}

/* === Contact Info === */
.contact p {
  color: #ccc;
  font-size: 0.95rem;
  margin: 6px 0;
}
.contact i {
  color: #ffcc00;
  margin-right: 8px;
}

/* === Divider === */
.divider {
  border: 0;
  border-top: 1px solid #333;
  margin: 2rem 0 1rem;
}

/* === Bottom Section === */
.footer-bottom {
  text-align: center;
  font-size: 0.9rem;
  color: #bbb;
  position: relative;
}

.footer-bottom strong {
  color: #ffcc00;
}

/* === Scroll Top Button === */
.scroll-top {
  position: absolute;
  right: 1.5rem;
  bottom: 0.5rem;
  background: #ffcc00;
  border: none;
  border-radius: 50%;
  padding: 8px 10px;
  cursor: pointer;
  color: #111;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}
.scroll-top:hover {
  background: #ffd633;
  transform: translateY(-3px);
}

/* === Responsive === */
@media (max-width: 768px) {
  .footer-content {
    text-align: center;
  }
  .scroll-top {
    right: 50%;
    transform: translateX(50%);
  }
}
</style>
