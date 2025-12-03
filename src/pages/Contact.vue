<!-- src/pages/Contact.vue -->
<template>
  <div class="contact-page font-poppins">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Partner with Infinity-Booking</h1>
        <p class="hero-text">
          Grow your service business, reach more customers, and manage bookings efficiently.
        </p>
        <router-link to="/register" class="cta-btn">Start Your Journey</router-link>
      </div>
    </section>

    <!-- Partnership Benefits -->
    <section class="benefits-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why Partner With Us?</h2>
          <p class="section-subtitle">
            Join Ethiopia's fastest-growing platform for service professionals
          </p>
        </div>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">👥</div>
            <h3 class="benefit-title">Expand Your Reach</h3>
            <p class="benefit-desc">Connect with thousands of potential customers in your area</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">💼</div>
            <h3 class="benefit-title">Business Tools</h3>
            <p class="benefit-desc">Professional dashboard to manage bookings and payments</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🛡️</div>
            <h3 class="benefit-title">Secure Platform</h3>
            <p class="benefit-desc">Verified customers and secure payment processing</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">📈</div>
            <h3 class="benefit-title">Growth Support</h3>
            <p class="benefit-desc">Marketing tools and analytics to grow your business</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How to Join -->
    <section class="process-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">How to Become a Provider</h2>
          <p class="section-subtitle">
            Simple steps to start your journey with Infinity-Booking
          </p>
        </div>
        <div class="process-steps">
          <div class="process-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3 class="step-title">Create Account</h3>
              <p class="step-desc">Sign up with your email or phone number</p>
            </div>
          </div>
          <div class="process-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3 class="step-title">Complete Profile</h3>
              <p class="step-desc">Add your services, pricing, and availability</p>
            </div>
          </div>
          <div class="process-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3 class="step-title">Get Verified</h3>
              <p class="step-desc">Our team reviews your application</p>
            </div>
          </div>
          <div class="process-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3 class="step-title">Start Booking</h3>
              <p class="step-desc">Begin receiving appointments from customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Information -->
    <section class="contact-info-section">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-card">
            <div class="contact-icon">📧</div>
            <h3 class="contact-title">Email Support</h3>
            <p class="contact-detail">support@infinitybooking.com</p>
            <p class="contact-note">Typically replies within 2 hours</p>
          </div>
          <div class="contact-card">
            <div class="contact-icon">📞</div>
            <h3 class="contact-title">Phone Support</h3>
            <p class="contact-detail">+251 900 000 000</p>
            <p class="contact-note">Mon-Fri, 9AM-6PM EAT</p>
          </div>
          <div class="contact-card">
            <div class="contact-icon">💬</div>
            <h3 class="contact-title">Live Chat</h3>
            <p class="contact-detail">Available 24/7</p>
            <p class="contact-note">In-app messaging support</p>
          </div>
          <div class="contact-card">
            <div class="contact-icon">📍</div>
            <h3 class="contact-title">Office Location</h3>
            <p class="contact-detail">Addis Ababa, Ethiopia</p>
            <p class="contact-note">Visit by appointment</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-subtitle">
            Quick answers to common questions about partnering with us
          </p>
        </div>
        <div class="faq-grid">
          <div class="faq-item">
            <h3 class="faq-question">Who can become a service provider?</h3>
            <p class="faq-answer">Any professional offering services in home services, beauty, education, or other service categories. You must be 18+ with valid identification.</p>
          </div>
          <div class="faq-item">
            <h3 class="faq-question">Is there a cost to join?</h3>
            <p class="faq-answer">Registration is completely free. You only pay when you receive bookings through our platform.</p>
          </div>
          <div class="faq-item">
            <h3 class="faq-question">How long does approval take?</h3>
            <p class="faq-answer">Our team typically reviews applications within 24-48 hours after document submission.</p>
          </div>
          <div class="faq-item">
            <h3 class="faq-question">Can I update my services?</h3>
            <p class="faq-answer">Yes, you can update your services, pricing, and availability anytime through your dashboard.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Grow Your Business?</h2>
          <p class="cta-text">
            Join hundreds of Ethiopian service professionals already scaling their businesses with Infinity-Booking
          </p>
          <div class="cta-actions">
            <router-link to="/register" class="cta-btn primary">
              Start Free Trial
            </router-link>
            <router-link to="/login" class="cta-btn secondary">
              Existing Provider
            </router-link>
          </div>
          <div class="cta-note">
            <span class="note-icon">✅</span>
            No setup fees • Free training • Dedicated support
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ===== BASE STYLES ===== */
.contact-page {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
  background-color: #ffffff;
  color: #1a1a1a;
  line-height: 1.5;
  font-size: 14px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ===== HERO SECTION ===== */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0 60px;
  text-align: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.hero-text {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 24px;
  line-height: 1.6;
}

.cta-btn {
  display: inline-block;
  background: white;
  color: #667eea;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* ===== SECTION HEADER ===== */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.section-subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ===== BENEFITS SECTION ===== */
.benefits-section {
  padding: 60px 0;
  background: #f8fafc;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.benefit-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.benefit-card:hover {
  transform: translateY(-4px);
}

.benefit-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.benefit-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.benefit-desc {
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* ===== PROCESS SECTION ===== */
.process-section {
  padding: 60px 0;
  background: white;
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.process-step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  transition: background-color 0.2s;
}

.process-step:hover {
  background: #f1f5f9;
}

.step-number {
  background: #667eea;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1a1a1a;
}

.step-desc {
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* ===== CONTACT INFO SECTION ===== */
.contact-info-section {
  padding: 60px 0;
  background: #f8fafc;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.contact-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.contact-card:hover {
  transform: translateY(-4px);
}

.contact-icon {
  font-size: 2rem;
  margin-bottom: 16px;
}

.contact-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.contact-detail {
  font-size: 0.9rem;
  color: #667eea;
  font-weight: 500;
  margin-bottom: 4px;
}

.contact-note {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

/* ===== FAQ SECTION ===== */
.faq-section {
  padding: 60px 0;
  background: white;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  transition: background-color 0.2s;
}

.faq-item:hover {
  background: #f1f5f9;
}

.faq-question {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.faq-answer {
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* ===== FINAL CTA ===== */
.final-cta {
  background: linear-gradient(135deg, #1a1a1a, #374151);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.cta-content {
  max-width: 500px;
  margin: 0 auto;
}

.cta-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.cta-text {
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 24px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: inline-block;
}

.cta-btn.primary {
  background: #667eea;
  color: white;
}

.cta-btn.primary:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.cta-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.cta-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.8rem;
  opacity: 0.8;
}

.note-icon {
  font-size: 1rem;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1024px) {
  .benefits-grid,
  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 80px 0 40px;
  }
  
  .hero-title {
    font-size: 1.75rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .benefits-section,
  .process-section,
  .contact-info-section,
  .faq-section,
  .final-cta {
    padding: 40px 0;
  }
  
  .benefits-grid,
  .contact-grid,
  .faq-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .process-steps {
    gap: 12px;
  }
  
  .process-step {
    padding: 16px;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 280px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }
  
  .hero-title {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .benefit-card,
  .contact-card,
  .faq-item {
    padding: 20px;
  }
  
  .process-step {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .step-number {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
  
  .cta-title {
    font-size: 1.5rem;
  }
  
  .cta-text {
    font-size: 0.9rem;
  }
}
</style>