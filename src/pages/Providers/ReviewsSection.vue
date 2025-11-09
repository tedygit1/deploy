<template>
  <div class="reviews-section">
    <h2>Customer Reviews</h2>
    
    <div v-if="reviews.length" class="reviews-list">
      <div v-for="(review, index) in reviews" :key="index" class="review-card">
        <div class="review-header">
          <div class="review-avatar">
            <img :src="review.avatar || defaultAvatar" alt="Avatar" />
          </div>
          <div class="review-info">
            <p class="review-author">{{ review.author }}</p>
            <div class="review-rating">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
            </div>
          </div>
        </div>
        <p class="review-text">"{{ review.text }}"</p>
      </div>
    </div>
    
    <p v-else>No reviews yet.</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const defaultAvatar = "/images/default-avatar.png";

const reviews = ref([
  { text: "Excellent service and communication!", author: "Marta G.", rating: 5, avatar: "" },
  { text: "Very professional and on time. Highly recommend!", author: "Tesfay H.", rating: 4, avatar: "" },
  { text: "Satisfied with the work quality and attitude.", author: "Samrawit K.", rating: 5, avatar: "" },
]);
</script>

<style scoped>
.reviews-section {
  padding: 2rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
  max-width: 850px;
  margin: 2rem auto;
  font-family: "Poppins", sans-serif;
}

h2 {
  color: #0077ff;
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  background: #f8faff;
  padding: 1rem 1.2rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s, box-shadow 0.2s;
}
.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.review-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0077ff;
}

.review-info {
  display: flex;
  flex-direction: column;
}

.review-author {
  font-weight: 600;
  color: #0077ff;
  font-size: 1rem;
}

.review-rating {
  color: #ffb400;
  font-size: 0.9rem;
}

.star {
  margin-right: 2px;
  color: #ccc;
}

.star.filled {
  color: #ffb400;
}

.review-text {
  font-style: italic;
  color: #333;
  margin-top: 0.3rem;
}
</style>
