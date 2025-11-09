<script setup>
import mekelleCity from '../assets/Mekelle-City.jpg'

const testimonials = [
  {
    name: 'Sophia L.',
    role: 'Home Service Provider',
    feedback:
      'Infinity-Booking helped me reach hundreds of customers without any marketing hassle. The platform feels modern, easy, and powerful.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Michael B.',
    role: 'Salon Owner',
    feedback:
      'I love how simple it is to manage bookings and payments! My clients now book me directly — it has boosted my business visibility.',
    image: 'https://randomuser.me/api/portraits/men/64.jpg',
  },
  {
    name: 'Sara T.',
    role: 'Tutor & Educator',
    feedback:
      'The system made it so easy for me to offer online and in-person sessions. Infinity-Booking really connects us with learners everywhere!',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name: 'Daniel K.',
    role: 'Customer',
    feedback:
      'Booking home and beauty services has never been smoother. I appreciate the trust and quality providers I can find here.',
    image: 'https://randomuser.me/api/portraits/men/56.jpg',
  },
]
</script>

<template>
  <div class="home">

    <!-- Hero Section -->
    <section id="hero" class="hero" :style="{ backgroundImage: `url(${mekelleCity})` }">
      <div class="overlay"></div>
      <div class="content">
        <h1 class="animated-title">
          Welcome to <span class="highlight">Infinity-Booking</span>
        </h1>
        <p class="subtitle">
          The all-in-one platform built to empower <strong>service providers of every kind</strong>.  
          Launched with <strong>Home Services</strong>, <strong>Beauty & Salon</strong>, and <strong>Education/Tutoring</strong>,  
          Infinity-Booking is designed to <strong>grow infinitely</strong> — expanding into new industries as more providers join.  
          From small startups to established professionals, our platform helps you manage bookings, build trust,  
          and reach customers effortlessly <strong>Everywhere</strong>.
        </p>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-card">
          <h2>+150</h2>
          <p>Providers Onboarded</p>
        </div>
        <div class="stat-card">
          <h2>+500</h2>
          <p>Services Listed</p>
        </div>
        <div class="stat-card">
          <h2>+1,200</h2>
          <p>Bookings Completed</p>
        </div>
      </div>
    </section>

    <!-- Service Categories -->
    <section class="categories-section">
      <h2 class="section-title">Our Core Service Categories</h2>
      <p class="section-subtitle">
        Infinity-Booking starts with these essential sectors and continuously expands as new providers join the movement.
      </p>
      <div class="categories-grid">
        <div class="category-card">
          <img src="https://cdn-icons-png.flaticon.com/512/706/706164.png" alt="Home Services" />
          <h3>Home Services</h3>
          <p>From repairs to cleaning — find skilled home experts ready to serve your neighborhood.</p>
        </div>
        <div class="category-card">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Beauty Services" />
          <h3>Beauty & Salon</h3>
          <p>Book professional stylists, barbers, and beauty specialists who bring confidence to your doorstep.</p>
        </div>
        <div class="category-card">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png" alt="Tutoring" />
          <h3>Education & Tutoring</h3>
          <p>Connect with experienced tutors and educators to support lifelong learning and growth.</p>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section">
      <h2 class="section-title">Why Providers Choose Infinity-Booking</h2>
      <div class="benefits-grid">
        <div class="benefit-card">
          <img src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png" alt="Visibility" />
          <h3>Unlimited Growth</h3>
          <p>Infinity-Booking expands endlessly — the more providers join, the more opportunities open for all.</p>
        </div>
        <div class="benefit-card">
          <img src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png" alt="Management" />
          <h3>Smart Business Tools</h3>
          <p>Organize schedules, track customer requests, and handle bookings with a single smart dashboard.</p>
        </div>
        <div class="benefit-card">
          <img src="https://cdn-icons-png.flaticon.com/512/2681/2681155.png" alt="Payments" />
          <h3>Secure & Local Payments</h3>
          <p>Receive payments instantly via <strong>Telebirr</strong> and future integrations like <strong>PayPal</strong> and <strong>Card</strong> options.</p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <h2 class="section-title">What Our Service providers and customers  Say</h2>
      <p class="section-subtitle">
        Hear from providers and customers who have transformed their service experience with Infinity-Booking.
      </p>

      <div class="testimonial-slider">
        <div class="testimonial-card" v-for="(item, index) in testimonials" :key="index">
          <div class="quote">“</div>
          <p class="feedback">{{ item.feedback }}</p>
          <div class="user-info">
            <img :src="item.image" alt="user photo" />
            <div>
              <h4>{{ item.name }}</h4>
              <p>{{ item.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <h2>Ready to Be Part of the Infinite Network?</h2>
      <p>
        Sign up today and start growing your business with <strong>Infinity-Booking</strong> —  
        where every service finds its place, and every provider finds success.
      </p>
      <router-link to="/login" class="cta-btn">🚀 Sign Up / Login</router-link>
    </section>

  </div>
</template>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }

/* Hero Section */
.hero {
  height: 100vh;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
}
.overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.55);
}
.content { position: relative; z-index: 2; max-width: 850px; padding: 0 20px; }
.animated-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  animation: fadeIndown 1.5s ease-out;
}
.highlight { color: #ffcc00; text-shadow: 0px 2px 8px rgba(0,0,0,0.6); }
.subtitle {
  font-size: 1.25rem;
  line-height: 1.9;
  margin-bottom: 2rem;
  animation: fadeInUp 1.5s ease-out;
}

/* Stats Section */
.stats-section { background: #f9fafb; padding: 60px 20px; text-align: center; }
.stats-container { display: flex; justify-content: center; gap: 50px; flex-wrap: wrap; }
.stat-card h2 { font-size: 2.5rem; color: #0ea5e9; margin-bottom: 0.5rem; }
.stat-card p { font-size: 1.1rem; color: #555; }

/* Categories Section */
.categories-section { background: #ffffff; padding: 80px 20px; text-align: center; }
.section-title { font-size: 2.2rem; color: #333; margin-bottom: 1rem; font-weight: 700; }
.section-subtitle { color: #666; font-size: 1.1rem; margin-bottom: 3rem; }
.categories-grid { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; }
.category-card {
  background: #f8fafc; padding: 30px 20px; border-radius: 20px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1); width: 280px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.category-card:hover { transform: translateY(-10px); box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
.category-card img { width: 70px; margin-bottom: 15px; }

/* Benefits Section */
.benefits-section { padding: 80px 20px; text-align: center; background: #f9fafb; }
.benefits-grid { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; }
.benefit-card {
  background: #fff; padding: 30px 20px; border-radius: 20px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1); width: 280px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.benefit-card:hover { transform: translateY(-10px); box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
.benefit-card img { width: 60px; margin-bottom: 15px; }

/* Testimonials Section */
.testimonials-section {
  background: #ffffff;
  padding: 90px 20px;
  text-align: center;
  overflow: hidden;
  
}
.testimonial-slider {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 50px;
  animation: slideIn 1.5s ease;
  color: aquamarine;
}
.testimonial-card {
  background: #f8fafc;
  width: 300px;
  border-radius: 20px;
  padding: 30px 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  position: relative;
}
.testimonial-card:hover {
  transform: translateY(-50px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.15);
}
.quote {
  font-size: 3rem;
  color: #0ea5e9;
  position: absolute;
  top: 15px;
  left: 25px;
  opacity: 0.2;
}
.feedback {
  font-size: 1.05rem;
  color: #444;
  margin: 20px 0 30px;
  line-height: 1.7;
  font-style: italic;
}
.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}
.user-info img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0ea5e9;
}
.user-info h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}
.user-info p {
  color: #64748b;
  font-size: 0.95rem;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* CTA Section */
.cta-section {
  background: linear-gradient(to right, #0ea5e9, #0284c7);
  color: white;
  text-align: center;
  padding: 90px 20px;
}
.cta-section h2 { font-size: 2.3rem; margin-bottom: 1rem; font-weight: 700; }
.cta-section p { font-size: 1.2rem; margin-bottom: 2rem; line-height: 1.8; }
.cta-btn {
  background: #ffcc00;
  color: black;
  padding: 1rem 2rem;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  display: inline-block;
  transition: transform 0.3s, background 0.3s;
}
.cta-btn:hover { transform: scale(1.05); background: #ffd633; }

/* Animations */
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>
