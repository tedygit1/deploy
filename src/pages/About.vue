<!-- src/pages/About.vue -->
<template>
  <div class="about-page font-poppins">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">About Infinity-Booking</h1>
        <p class="hero-text">
          Connecting service professionals with customers through a reliable, efficient platform designed for growth.
        </p>
        <router-link to="/register" class="hero-cta">Join Our Platform</router-link>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="mission-section">
      <div class="container">
        <div class="mission-grid">
          <div class="mission-card">
            <div class="mission-icon">🎯</div>
            <h3 class="mission-title">Our Mission</h3>
            <p class="mission-text">
              To empower service professionals with tools that simplify booking management, 
              while providing customers with reliable access to quality services.
            </p>
          </div>
          <div class="mission-card">
            <div class="mission-icon">🚀</div>
            <h3 class="mission-title">Our Vision</h3>
            <p class="mission-text">
              Create Ethiopia's leading platform where service businesses thrive through 
              technology, trust, and seamless customer connections.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Values</h2>
          <p class="section-subtitle">
            The principles that guide everything we do
          </p>
        </div>
        <div class="values-grid">
          <div
            v-for="(value, index) in values"
            :key="index"
            class="value-card"
          >
            <div class="value-icon">{{ value.icon }}</div>
            <h3 class="value-title">{{ value.title }}</h3>
            <p class="value-desc">{{ value.description }}</p>
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
            Built specifically for Ethiopian service professionals
          </p>
        </div>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">🌍</div>
            <h3 class="benefit-title">Local Focus</h3>
            <p class="benefit-desc">Designed for Ethiopian market needs and payment systems</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">💼</div>
            <h3 class="benefit-title">Professional Tools</h3>
            <p class="benefit-desc">Complete business management dashboard and analytics</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🛡️</div>
            <h3 class="benefit-title">Trust & Safety</h3>
            <p class="benefit-desc">Verified providers and secure payment processing</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">📈</div>
            <h3 class="benefit-title">Growth Focused</h3>
            <p class="benefit-desc">Tools and features designed to help your business grow</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Grow with Us?</h2>
          <p class="cta-text">
            Join hundreds of service professionals already using Infinity-Booking to manage their business
          </p>
          <div class="cta-actions">
            <router-link to="/register" class="cta-btn primary">
              Start Free Trial
            </router-link>
            <router-link to="/contact" class="cta-btn secondary">
              Learn More
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const values = [
  {
    icon: "🤝",
    title: "Community First",
    description: "Building a supportive network where service professionals and customers grow together."
  },
  {
    icon: "🔒",
    title: "Trust & Safety",
    description: "Verified profiles and secure systems ensure reliable service experiences for everyone."
  },
  {
    icon: "💡",
    title: "Innovation",
    description: "Continuously improving our platform to meet the evolving needs of service businesses."
  },
  {
    icon: "🌱",
    title: "Growth Focused",
    description: "Providing tools and insights that help service professionals scale their businesses."
  }
];

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.value-card, .benefit-card').forEach(el => {
    observer.observe(el);
  });
});
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.about-page {
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

/* ===== MISSION SECTION ===== */
.mission-section {
  padding: 60px 0;
  background: #f8fafc;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.mission-card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.mission-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.mission-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.mission-text {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* ===== VALUES SECTION ===== */
.values-section {
  padding: 60px 0;
  background: white;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.value-card {
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s;
  opacity: 0;
  transform: translateY(20px);
}

.value-card.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.value-card:hover {
  transform: translateY(-4px);
}

.value-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.value-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.value-desc {
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
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

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1024px) {
  .values-grid,
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
  
  .mission-section,
  .values-section,
  .benefits-section,
  .final-cta {
    padding: 40px 0;
  }
  
  .mission-grid,
  .values-grid,
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .mission-card {
    padding: 24px;
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
  
  .mission-card,
  .value-card,
  .benefit-card {
    padding: 20px;
  }
  
  .mission-icon {
    font-size: 2.5rem;
  }
  
  .cta-title {
    font-size: 1.5rem;
  }
  
  .cta-text {
    font-size: 0.9rem;
  }
}

/* Animation delays for staggered effect */
.value-card:nth-child(1) { transition-delay: 0.1s; }
.value-card:nth-child(2) { transition-delay: 0.2s; }
.value-card:nth-child(3) { transition-delay: 0.3s; }
.value-card:nth-child(4) { transition-delay: 0.4s; }

.benefit-card:nth-child(1) { transition-delay: 0.1s; }
.benefit-card:nth-child(2) { transition-delay: 0.2s; }
.benefit-card:nth-child(3) { transition-delay: 0.3s; }
.benefit-card:nth-child(4) { transition-delay: 0.4s; }
</style>