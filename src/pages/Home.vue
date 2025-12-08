<!-- src/pages/Home.vue -->
<template>
  <div class="home font-poppins">
    <!-- Enhanced Hero Section -->
    <section id="hero" class="hero">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">
              <span class="live-dot"></span>
              Live with Infinity-Booking • Grow Your Service Business
            </div>
            <h1 class="hero-title">
              Manage Your Service Business <span class="highlight">Smarter & Faster</span>
            </h1>
            <p class="hero-subtitle">
              All-in-one platform designed for Ethiopian service professionals to manage appointments, 
              accept payments, and connect with clients. Simple, powerful, and made for you.
            </p>

            <div class="hero-buttons">
              <button @click="goToRegister" class="btn-primary">
                <span class="btn-icon">🚀</span>
                Start Free Trial
              </button>
              <a href="#features" class="btn-secondary">
                <span class="btn-icon">📹</span>
                Watch Demo (3 min)
              </a>
            </div>

            <!-- Social Proof - Made more user-friendly -->
            <div class="social-proof">
              <div class="proof-stats">
                <div class="stat-item">
                  <strong>150+</strong>
                  <span>Service Providers</span>
                </div>
                <div class="stat-item">
                  <strong>1,200+</strong>
                  <span>Monthly Bookings</span>
                </div>
                <div class="stat-item">
                  <strong>98%</strong>
                  <span>Satisfaction Rate</span>
                </div>
              </div>
              <div class="provider-types">
                <span class="provider-tag">🏠 Home Services</span>
                <span class="provider-tag">💇 Beauty & Salon</span>
                <span class="provider-tag">🎓 Education</span>
                <span class="provider-tag">🏢 Business Services</span>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Feature Showcase - More informative -->
          <div class="feature-showcase">
            <div class="showcase-card">
              <div class="card-header">
                <h3>Your Business Dashboard</h3>
                <div class="card-badge">Live Preview</div>
              </div>
              <div class="card-content">
                <div class="dashboard-preview">
                  <div class="preview-header">
                    <div class="business-info">
                      <div class="business-name">Sample Beauty Salon</div>
                      <div class="business-status">📍 Addis Ababa • 🟢 Active</div>
                    </div>
                  </div>
                  
                  <!-- Enhanced metrics with clear explanations -->
                  <div class="growth-metrics">
                    <div class="metric-card">
                      <div class="metric-icon">💰</div>
                      <div class="metric-details">
                        <div class="metric-title">Monthly Earnings</div>
                        <div class="metric-value">ETB 45,250</div>
                        <div class="metric-desc">From 120+ appointments</div>
                      </div>
                    </div>
                    
                    <div class="metric-card">
                      <div class="metric-icon">👥</div>
                      <div class="metric-details">
                        <div class="metric-title">New Clients This Month</div>
                        <div class="metric-value">24</div>
                        <div class="metric-desc">+12% from last month</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Key features shown as benefits -->
                  <div class="business-benefits">
                    <h4>Key Benefits You Get:</h4>
                    <div class="benefit-item">
                      <span class="benefit-icon">🔔</span>
                      <div class="benefit-text">
                        <strong>Real-time Notifications</strong>
                        <small>Never miss a booking</small>
                      </div>
                    </div>
                    <div class="benefit-item">
                      <span class="benefit-icon">📊</span>
                      <div class="benefit-text">
                        <strong>Smart Reports</strong>
                        <small>See what's working</small>
                      </div>
                    </div>
                    <div class="benefit-item">
                      <span class="benefit-icon">💳</span>
                      <div class="benefit-text">
                        <strong>Easy Payments</strong>
                        <small>Accept all payment types</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid - More benefit-oriented -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Everything You Need to Grow</h2>
          <p class="section-subtitle">
            Powerful tools made simple for service businesses
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📅</div>
            <h3>Smart Booking System</h3>
            <p>Let clients book 24/7 from your website, social media, or directly in the app.</p>
            <ul class="feature-benefits">
              <li>Online booking anytime</li>
              <li>Automatic reminders</li>
              <li>Calendar sync</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>Easy Payments</h3>
            <p>Accept mobile money, bank transfers, and cash with automatic tracking.</p>
            <ul class="feature-benefits">
              <li>CBE Birr, Telebirr</li>
              <li>Payment tracking</li>
              <li>Automatic receipts</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Client Management</h3>
            <p>Keep all client info, history, and preferences in one organized place.</p>
            <ul class="feature-benefits">
              <li>Client profiles</li>
              <li>Service history</li>
              <li>Special notes</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Business Insights</h3>
            <p>See which services are most popular and when you're busiest.</p>
            <ul class="feature-benefits">
              <li>Best-selling services</li>
              <li>Busy hours report</li>
              <li>Revenue trends</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Marketing Tools</h3>
            <p>Simple ways to attract more clients and keep them coming back.</p>
            <ul class="feature-benefits">
              <li>Special offers</li>
              <li>Client referrals</li>
              <li>Reminder messages</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Business Protection</h3>
            <p>Professional features to protect your time and income.</p>
            <ul class="feature-benefits">
              <li>No-show protection</li>
              <li>Cancelation policies</li>
              <li>Service agreements</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section - New -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">How Infinity-Booking Works</h2>
          <p class="section-subtitle">
            Get started in 3 simple steps
          </p>
        </div>
        
        <div class="steps-container">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Create Your Profile</h3>
              <p>Add your services, prices, and availability. Takes 10 minutes.</p>
            </div>
          </div>
          
          <div class="step-arrow">→</div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Share Your Booking Link</h3>
              <p>Add it to your WhatsApp, Facebook, or website.</p>
            </div>
          </div>
          
          <div class="step-arrow">→</div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Start Accepting Bookings</h3>
              <p>Manage appointments and grow your business.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Simple, Transparent Pricing</h2>
          <p class="section-subtitle">
            No hidden fees. Cancel anytime.
          </p>
        </div>
        
        <div class="pricing-cards">
          <div class="pricing-card">
            <div class="plan-header">
              <h3>Starter</h3>
              <div class="price">Free</div>
              <p class="plan-desc">Perfect for trying it out</p>
            </div>
            <ul class="plan-features">
              <li>✅ Up to 20 bookings/month</li>
              <li>✅ Basic scheduling</li>
              <li>✅ Client management</li>
              <li>❌ Advanced reports</li>
              <li>❌ Payment processing</li>
            </ul>
            <button @click="goToRegister" class="plan-button">
              Start Free
            </button>
          </div>
          
          <div class="pricing-card featured">
            <div class="plan-badge">Most Popular</div>
            <div class="plan-header">
              <h3>Professional</h3>
              <div class="price">ETB 299<span>/month</span></div>
              <p class="plan-desc">For growing businesses</p>
            </div>
            <ul class="plan-features">
              <li>✅ Unlimited bookings</li>
              <li>✅ All scheduling features</li>
              <li>✅ Full client management</li>
              <li>✅ Business insights</li>
              <li>✅ Payment processing</li>
            </ul>
            <button @click="goToRegister" class="plan-button primary">
              Start 14-Day Trial
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Stories Section - Enhanced -->
    <section id="success-stories" class="success-stories">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Trusted by Ethiopian Business Owners</h2>
          <p class="section-subtitle">
            Real stories from real people
          </p>
        </div>

        <div class="stories-grid">
          <div class="story-card">
            <div class="story-content">
              <div class="quote-icon">"</div>
              <p>"Before Infinity-Booking, I spent hours on the phone scheduling appointments. Now clients book online, and I get instant notifications. It changed how I run my business."</p>
            </div>
            <div class="story-author">
              <div class="author-avatar">EB</div>
              <div class="author-info">
                <div class="author-name">Elena Berhanu</div>
                <div class="author-business">GreenClean Services</div>
                <div class="author-results">
                  <span>⏱️ Saves 15 hours/week</span>
                  <span>📈 40% more clients</span>
                </div>
              </div>
            </div>
          </div>

          <div class="story-card">
            <div class="story-content">
              <div class="quote-icon">"</div>
              <p>"My clients love how easy it is to book and pay. I love how organized everything is. The automatic reminders alone have saved me so much time."</p>
            </div>
            <div class="story-author">
              <div class="author-avatar">DM</div>
              <div class="author-info">
                <div class="author-name">Daniel Mekonnen</div>
                <div class="author-business">Excel Education Center</div>
                <div class="author-results">
                  <span>💰 Payments on time</span>
                  <span>⭐ 4.9/5 client rating</span>
                </div>
              </div>
            </div>
          </div>

          <div class="story-card">
            <div class="story-content">
              <div class="quote-icon">"</div>
              <p>"The reports helped me understand which services are most popular. I adjusted my schedule and increased my income by 60% in three months."</p>
            </div>
            <div class="story-author">
              <div class="author-avatar">ST</div>
              <div class="author-info">
                <div class="author-name">Sara Tesfaye</div>
                <div class="author-business">Glamour Beauty Salon</div>
                <div class="author-results">
                  <span>📊 Better scheduling</span>
                  <span>💸 Higher income</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Final CTA -->
    <section class="final-cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Grow Your Business?</h2>
          <p class="cta-text">Join hundreds of service professionals who are already saving time and earning more</p>
          
          <div class="cta-benefits">
            <div class="benefit-card">
              <span class="benefit-icon">🎯</span>
              <div>
                <strong>Made for Ethiopia</strong>
                <small>Local payment methods, Amharic support</small>
              </div>
            </div>
            <div class="benefit-card">
              <span class="benefit-icon">🆓</span>
              <div>
                <strong>Free Setup Help</strong>
                <small>We'll help you get started</small>
              </div>
            </div>
            <div class="benefit-card">
              <span class="benefit-icon">📱</span>
              <div>
                <strong>Works Everywhere</strong>
                <small>Phone, tablet, computer</small>
              </div>
            </div>
          </div>

          <div class="cta-actions">
            <button @click="goToRegister" class="cta-btn primary">
              Start Free Trial - No Credit Card Needed
            </button>
            <a href="/demo" class="cta-btn secondary">
              📞 Book a Demo Call
            </a>
          </div>

          <div class="cta-guarantee">
            <div class="guarantee-item">
              <span>✅</span>
              <span>30-day free trial</span>
            </div>
            <div class="guarantee-item">
              <span>✅</span>
              <span>Amharic & English support</span>
            </div>
            <div class="guarantee-item">
              <span>✅</span>
              <span>Setup in 10 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
    goToRegister() {
      this.$router.push('/register');
    }
  }
}
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.home {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
  background-color: #ffffff;
  color: #323543;
  line-height: 1.5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ===== HERO SECTION ===== */
.hero {
  background: linear-gradient(135deg, #555572 0%, #58525e 100%);
  color: white;
  padding: 140px 0 80px;
  margin-top: 60px; /* Account for fixed navbar height */
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,0 L100,0 L100,100 Z" fill="rgba(255,255,255,0.05)"/></svg>');
  background-size: cover;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 24px;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.highlight {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 1.1rem;
  opacity: 0.95;
  margin-bottom: 28px;
  line-height: 1.6;
  max-width: 500px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin: 28px 0;
}

.btn-primary,
.btn-secondary {
  padding: 14px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.btn-primary {
  background: white;
  color: #667eea;
  font-weight: 700;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  border-color: rgba(255,255,255,0.5);
}

/* Social Proof */
.social-proof {
  margin-top: 40px;
}

.proof-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item strong {
  font-size: 1.6rem;
  display: block;
  line-height: 1;
}

.stat-item span {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-top: 4px;
}

.provider-types {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.provider-tag {
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.provider-tag:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

/* Feature Showcase */
.feature-showcase {
  display: flex;
  justify-content: center;
}

.showcase-card {
  background: rgb(144, 142, 157);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(101, 103, 157, 0.12);
  color: #1a1a1a;
  width: 100%;
  max-width: 380px;
  transition: all 0.3s ease;
}

.showcase-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(58, 56, 69, 0.18);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #10254d;
}

.card-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  color: #1f1b21;
}

.card-badge {
  background: #03bb81;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.dashboard-preview {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.business-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1a1a1a;
}

.business-status {
  font-size: 0.85rem;
  color: #6b7280;
}

.growth-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.2s;
}

.metric-card:hover {
  background: #f0f9ff;
  transform: translateX(4px);
}

.metric-icon {
  font-size: 1.8rem;
  min-width: 48px;
  text-align: center;
}

.metric-details {
  flex: 1;
}

.metric-title {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 4px;
  font-weight: 500;
}

.metric-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.metric-desc {
  font-size: 0.8rem;
  color: #6b7280;
}

.business-benefits {
  background: #f0f9ff;
  padding: 20px;
  border-radius: 12px;
  margin-top: 16px;
}

.business-benefits h4 {
  font-size: 1rem;
  margin-bottom: 16px;
  color: #1a1a1a;
  font-weight: 600;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
}

.benefit-icon {
  font-size: 1.4rem;
  min-width: 24px;
  margin-top: 2px;
}

.benefit-text {
  display: flex;
  flex-direction: column;
}

.benefit-text strong {
  font-size: 0.95rem;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.benefit-text small {
  font-size: 0.8rem;
  color: #6b7280;
}

/* ===== SECTIONS ===== */
.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1a1a1a;
  position: relative;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 550px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Features Grid */
.features-section {
  padding: 96px 0;
  background: #f8fafc;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.feature-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e5e7eb;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: #c7d2fe;
}

.feature-icon {
  font-size: 2.2rem;
  margin-bottom: 20px;
  color: #667eea;
}

.feature-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1a1a1a;
  line-height: 1.3;
}

.feature-card p {
  color: #6b7280;
  margin-bottom: 20px;
  line-height: 1.6;
  flex: 1;
}

.feature-benefits {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-benefits li {
  padding: 6px 0;
  color: #4b5563;
  font-size: 0.95rem;
  position: relative;
  padding-left: 24px;
  display: flex;
  align-items: center;
}

.feature-benefits li:before {
  content: '';
  position: absolute;
  left: 0;
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
  opacity: 0.8;
}

/* How It Works */
.how-it-works {
  padding: 96px 0;
  background: white;
}

.steps-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 180px;
  flex: 1;
  min-width: 160px;
}

.step-number {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: 20px;
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
}

.step-content h3 {
  font-size: 1.2rem;
  margin-bottom: 12px;
  color: #1a1a1a;
  font-weight: 600;
}

.step-content p {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
}

.step-arrow {
  font-size: 1.8rem;
  color: #667eea;
  opacity: 0.7;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

/* Pricing */
.pricing-section {
  padding: 96px 0;
  background: #f8fafc;
}

.pricing-cards {
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
}

.pricing-card {
  background: white;
  border-radius: 16px;
  padding: 40px 32px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  max-width: 320px;
  position: relative;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.pricing-card.featured {
  border: 2px solid #667eea;
  transform: scale(1.05);
}

.pricing-card.featured:hover {
  transform: scale(1.05) translateY(-8px);
}

.plan-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #667eea;
  color: white;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.plan-header {
  text-align: center;
  margin-bottom: 28px;
}

.plan-header h3 {
  font-size: 1.6rem;
  margin-bottom: 12px;
  color: #1a1a1a;
  font-weight: 700;
}

.price {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 8px;
  line-height: 1;
}

.price span {
  font-size: 1.1rem;
  color: #6b7280;
  font-weight: 500;
}

.plan-desc {
  color: #6b7280;
  font-size: 0.95rem;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
}

.plan-features li {
  padding: 12px 0;
  color: #6b7280;
  font-size: 0.95rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 8px;
}

.plan-features li:last-child {
  border-bottom: none;
}

.plan-button {
  display: block;
  text-align: center;
  padding: 14px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e5e7eb;
  background: white;
  color: #4b5563;
  cursor: pointer;
  width: 100%;
  font-family: inherit;
}

.plan-button.primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.plan-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}

/* Success Stories */
.success-stories {
  padding: 96px 0;
  background: white;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-top: 48px;
}

.story-card {
  background: white;
  padding: 36px;
  border-radius: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.story-card:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s;
}

.story-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.story-card:hover:before {
  opacity: 1;
}

.story-content {
  position: relative;
  margin-bottom: 28px;
}

.quote-icon {
  font-size: 3.5rem;
  color: #667eea;
  opacity: 0.15;
  position: absolute;
  top: -12px;
  left: -12px;
  line-height: 1;
}

.story-content p {
  font-style: italic;
  color: #4b5563;
  line-height: 1.7;
  position: relative;
  z-index: 1;
  font-size: 1rem;
  font-weight: 500;
}

.story-author {
  display: flex;
  align-items: center;
  gap: 16px;
}

.author-avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 700;
  color: #1a1a1a;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.author-business {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.author-results {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.author-results span {
  font-size: 0.85rem;
  color: #059669;
  background: #d1fae5;
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 500;
}

/* Enhanced Final CTA */
.final-cta {
  background: linear-gradient(135deg, #7b7d82, #8bb4f5);
  color: white;
  padding: 100px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.final-cta:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,0 L100,100 L0,100 Z" fill="rgba(102,126,234,0.05)"/></svg>');
  background-size: cover;
}

.cta-content {
  position: relative;
  z-index: 2;
}

.cta-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.cta-text {
  font-size: 1.25rem;
  opacity: 0.95;
  margin-bottom: 40px;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.cta-benefits {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.benefit-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 24px;
  border-radius: 16px;
  min-width: 220px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.15);
}

.benefit-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.benefit-icon {
  font-size: 1.8rem;
  min-width: 32px;
}

.benefit-card strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 4px;
  font-weight: 600;
}

.benefit-card small {
  display: block;
  font-size: 0.85rem;
  opacity: 0.9;
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 40px 0;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 16px 36px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.cta-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
}

.cta-btn.primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
}

.cta-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}

.cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
  border-color: rgba(255,255,255,0.5);
}

.cta-guarantee {
  display: flex;
  justify-content: center;
  gap: 32px;
  font-size: 0.95rem;
  opacity: 0.9;
  margin-top: 28px;
  flex-wrap: wrap;
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.guarantee-item span {
  display: flex;
  align-items: center;
}

/* ===== MOBILE-FIRST RESPONSIVE DESIGN ===== */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .steps-container {
    flex-direction: column;
    gap: 50px;
  }
  
  .step-arrow {
    transform: rotate(90deg);
    margin: -20px 0;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .hero {
    margin-top: 70px; /* Adjust for mobile navbar height */
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 120px 0 70px;
    margin-top: 60px;
  }
  
  .hero-title {
    font-size: 2.2rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-header {
    margin-bottom: 48px;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .proof-stats, .provider-types {
    justify-content: center;
  }
  
  .features-grid,
  .pricing-cards,
  .stories-grid {
    grid-template-columns: 1fr;
  }
  
  .pricing-card.featured {
    transform: none;
  }
  
  .pricing-card.featured:hover {
    transform: translateY(-8px);
  }
  
  .cta-benefits {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .benefit-card {
    width: 100%;
    max-width: 320px;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 320px;
    text-align: center;
  }
  
  .cta-guarantee {
    flex-direction: column;
    gap: 15px;
  }
  
  .showcase-card {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }
  
  .hero-title {
    font-size: 1.9rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .story-author {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .author-info {
    text-align: center;
  }
  
  .author-results {
    justify-content: center;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .cta-text {
    font-size: 1.1rem;
  }
  
  .feature-card {
    padding: 24px;
  }
  
  .pricing-card {
    padding: 32px 24px;
  }
  
  .pricing-card.featured {
    margin-top: 20px;
  }
  
  .steps-container {
    gap: 40px;
  }
  
  .step {
    max-width: 100%;
  }
}
</style>