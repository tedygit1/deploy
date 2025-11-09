<template>
  <div class="help-center-page font-poppins">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Help Center - Providers</h1>
        <p>
          Everything you need to get started as a trusted provider on CS Platform. Learn how to create your account, complete your profile, manage bookings, and receive payments.
        </p>
      </div>
    </section>

    <!-- FAQs Section -->
    <section class="faqs-section">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div class="faqs-container">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="faq-item"
        >
          <h3 class="faq-question" @click="toggle(index)">
            {{ faq.question }}
            <span class="toggle-icon">{{ activeIndex === index ? "-" : "+" }}</span>
          </h3>
          <p v-if="activeIndex === index" class="faq-answer">{{ faq.answer }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

const activeIndex = ref(null);

const faqs = [
  {
    question: "How do I create my provider account?",
    answer: "Click the 'Register' button on the homepage, select 'Provider Account', and fill in your personal information such as name, email, phone number, and password. Make sure your email and phone number are valid for verification purposes."
  },
  {
    question: "How do I complete my provider profile?",
    answer: "After registration, log in to your dashboard and go to the 'Profile' section. Upload a clear profile photo, add your skills and services, provide a brief description about yourself, and add any certifications or portfolio files to build credibility."
  },
  {
    question: "How do I continue after setting up my profile?",
    answer: "Once your profile is complete, navigate to the 'Services' section to add the services you offer. Set your pricing, availability, and description for each service. Then, you can start receiving booking requests from clients immediately. Make sure to check the 'Earnings' and 'Messages' sections regularly to stay updated."
  },
  {
    question: "How can I manage bookings and client interactions?",
    answer: "All bookings from clients appear in your 'Bookings' section. Accept or reschedule bookings as needed. Use the 'Messages' section to communicate with clients professionally. Prompt responses improve your ratings and visibility on the platform."
  },
  {
    question: "How do I receive payments?",
    answer: "Payments are securely processed via integrated payment methods like Telebirr, PayPal, or other supported options. All earnings are displayed in your 'Earnings' section, and you can withdraw them according to platform rules."
  },
  {
    question: "What should I do if I face issues?",
    answer: "Use the 'Feedback' page to report technical issues, payment problems, or provide suggestions. Support will contact you via your registered email to resolve the issue quickly."
  },
];

function toggle(index) {
  activeIndex.value = activeIndex.value === index ? null : index;
}
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(to right, #3b82f6, #1e40af);
  text-align: center;
  padding: 120px 20px 80px;
  position: relative;
}
.hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1;
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}
.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #e0f7ff;
}
.hero-content p {
  font-size: 1.15rem;
  color: #f0f9ff;
  line-height: 1.7;
}

/* FAQs Section */
.faqs-section {
  padding: 80px 20px;
  max-width: 900px;
  margin: 0 auto;
}
.section-title {
  font-size: 2.2rem;
  margin-bottom: 2rem;
  color: #3b82f6;
  font-weight: 700;
  text-align: center;
}
.faqs-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.faq-item {
  background: #f9fafb;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.faq-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
}
.faq-question {
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  color: #1e40af;
}
.faq-answer {
  margin-top: 12px;
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
}
.toggle-icon {
  font-weight: bold;
  font-size: 1.2rem;
  color: #3b82f6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content h1 { font-size: 2rem; }
  .hero-content p { font-size: 1rem; }
  .faqs-section { padding: 60px 15px; }
}
</style>
