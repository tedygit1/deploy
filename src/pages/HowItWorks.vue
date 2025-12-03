<!-- src/pages/HowItWorks.vue -->
<template>
  <div class="how-it-works font-poppins">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">How Infinity-Booking Works</h1>
        <p class="hero-text">
          Streamlined process for service providers to join our platform and start growing their business with confidence.
        </p>
        <router-link to="/login" class="hero-cta">Start Your Journey</router-link>
      </div>
    </section>

    <!-- Steps Section -->
    <section class="steps-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Simple 5-Step Process</h2>
          <p class="section-subtitle">
            From registration to earning income - follow this clear path to success
          </p>
        </div>
        <div class="steps-grid">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step-card"
            :class="`step-${index}`"
          >
            <div class="step-header">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-icon">
                <img
                  :src="step.icon"
                  :alt="step.title"
                  loading="lazy"
                  @error="handleImageError"
                />
              </div>
            </div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Platform Benefits -->
    <section class="benefits-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why Choose Our Platform</h2>
          <p class="section-subtitle">
            Designed to help service providers succeed with powerful tools and support
          </p>
        </div>
        <div class="benefits-grid">
          <div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="benefit-card"
          >
            <div class="benefit-icon">
              <span class="icon-emoji">{{ benefit.icon }}</span>
            </div>
            <h3 class="benefit-title">{{ benefit.title }}</h3>
            <p class="benefit-desc">{{ benefit.description }}</p>
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
            Join hundreds of service professionals already using Infinity-Booking to manage their appointments and grow their client base.
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
            No setup fees • Free training • 24/7 support
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const steps = [
  {
    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    title: "Create Your Profile",
    desc: "Sign up with your details and complete your professional profile with services and pricing.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1040/1040230.png",
    title: "Get Verified",
    desc: "Our team reviews your application to ensure quality standards for all providers.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1250/1250713.png",
    title: "List Your Services",
    desc: "Add your services with descriptions, pricing, availability, and professional photos.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/3595/3595458.png",
    title: "Manage Bookings",
    desc: "Accept appointments, manage your schedule, and communicate with clients through our platform.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/2721/2721612.png",
    title: "Grow Your Business",
    desc: "Build your reputation with reviews and expand your client base with our marketing tools.",
  },
];

const benefits = [
  {
    icon: "📱",
    title: "Easy Management",
    description: "Simple dashboard to manage appointments, clients, and payments in one place.",
  },
  {
    icon: "🔒",
    title: "Verified Clients",
    description: "Connect with genuine customers through our trusted platform.",
  },
  {
    icon: "📈",
    title: "Business Growth",
    description: "Tools and analytics to help you understand and grow your business.",
  },
  {
    icon: "💬",
    title: "Dedicated Support",
    description: "24/7 customer support in Amharic and English for all your needs.",
  },
];

function handleImageError(e) {
  e.target.src = "https://cdn-icons-png.flaticon.com/512/2972/2972185.png";
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".step-card, .benefit-card").forEach((el) => {
    observer.observe(el);
  });
});
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.how-it-works {
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

.hero-cta {
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

.hero-cta:hover {
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

/* ===== STEPS SECTION ===== */
.steps-section {
  padding: 60px 0;
  background: #f8fafc;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.step-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  opacity: 0;
  transform: translateY(20px);
}

.step-card.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.step-card:hover {
  transform: translateY(-4px);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
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

.step-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
  flex-shrink: 0;
}

.step-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.step-desc {
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* ===== BENEFITS SECTION ===== */
.benefits-section {
  padding: 60px 0;
  background: white;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.benefit-card {
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s;
  opacity: 0;
  transform: translateY(20px);
}

.benefit-card.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.benefit-card:hover {
  transform: translateY(-4px);
}

.benefit-icon {
  margin-bottom: 16px;
}

.icon-emoji {
  font-size: 2rem;
  display: block;
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
  .steps-grid,
  .benefits-grid {
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
  
  .steps-section,
  .benefits-section,
  .final-cta {
    padding: 40px 0;
  }
  
  .steps-grid,
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .step-card,
  .benefit-card {
    padding: 20px;
  }
  
  .step-header {
    gap: 12px;
  }
  
  .step-icon {
    width: 40px;
    height: 40px;
  }
  
  .step-icon img {
    width: 20px;
    height: 20px;
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
  
  .step-card,
  .benefit-card {
    padding: 16px;
  }
  
  .step-header {
    flex-direction: column;
    text-align: center;
    gap: 8px;
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

/* Animation delays for staggered effect */
.step-card:nth-child(1) { transition-delay: 0.1s; }
.step-card:nth-child(2) { transition-delay: 0.2s; }
.step-card:nth-child(3) { transition-delay: 0.3s; }
.step-card:nth-child(4) { transition-delay: 0.4s; }
.step-card:nth-child(5) { transition-delay: 0.5s; }

.benefit-card:nth-child(1) { transition-delay: 0.1s; }
.benefit-card:nth-child(2) { transition-delay: 0.2s; }
.benefit-card:nth-child(3) { transition-delay: 0.3s; }
.benefit-card:nth-child(4) { transition-delay: 0.4s; }
</style>