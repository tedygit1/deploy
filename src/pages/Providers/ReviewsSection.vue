<template>
  <div class="reviews-container">
    <h2>Customer Reviews</h2>
    
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Fetching reviews...</p>
    </div>
    
    <!-- Error -->
    <div v-else-if="error" class="error">
      <p>Error: {{ error }}</p>
      <button @click="fetchReviews" class="retry-btn">Try Again</button>
    </div>
    
    <!-- No Reviews -->
    <div v-else-if="reviews.length === 0" class="no-reviews">
      <p>No reviews yet for your services.</p>
    </div>
    
    <!-- Reviews List -->
    <div v-else class="reviews-list">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <!-- Service Info -->
        <div class="service-info" v-if="review.serviceName">
          <h3>{{ review.serviceName }}</h3>
        </div>
        
        <!-- Reviewer Info -->
        <div class="reviewer-info">
          <div class="avatar">
            <img :src="review.avatar || defaultAvatar" alt="User" @error="handleImageError" />
          </div>
          <div class="details">
            <p class="name">{{ review.userName || review.author || 'Anonymous' }}</p>
            <div class="rating">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
              <span class="rating-number">{{ review.rating?.toFixed(1) }}</span>
            </div>
            <p v-if="review.date" class="date">{{ formatDate(review.date) }}</p>
          </div>
        </div>
        
        <!-- Review Message -->
        <div class="review-content">
          <p>"{{ review.text || review.comment || review.content || review.review }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// State
const reviews = ref([]);
const loading = ref(true);
const error = ref(null);
const defaultAvatar = "/images/default-avatar.png";

// Fetch ALL reviews for the provider
const fetchReviews = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    console.log("Fetching reviews...");
    
    // Get provider ID from localStorage
    const provider = JSON.parse(localStorage.getItem("loggedProvider"));
    const providerId = provider?._id;
    
    if (!providerId) {
      throw new Error("Provider not found");
    }
    
    // Fetch reviews using provider endpoint
    const response = await fetch(`/api/infinity-booking/reviews/provider/${providerId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Reviews data:", data);
    
    // Extract reviews from response
    let reviewsData = [];
    
    if (Array.isArray(data)) {
      reviewsData = data;
    } else if (data && Array.isArray(data.reviews)) {
      reviewsData = data.reviews;
    } else if (data && Array.isArray(data.data)) {
      reviewsData = data.data;
    }
    
    // Transform data
    reviews.value = reviewsData.map(review => ({
      id: review.id || review._id || review.reviewId,
      serviceName: review.serviceName || review.service?.serviceName || 'Unknown Service',
      userName: review.userName || review.user?.name || review.author || 'Anonymous',
      rating: review.rating || 0,
      text: review.text || review.comment || review.content || review.review || '',
      date: review.date || review.createdAt || review.reviewDate,
      avatar: review.avatar || review.user?.avatar
    }));
    
  } catch (err) {
    console.error("Error fetching reviews:", err);
    error.value = err.message;
    
    // Sample data for testing
    reviews.value = [
      {
        id: 1,
        serviceName: "Massage Therapy",
        userName: "Marta G.",
        rating: 5,
        text: "Excellent service and communication!",
        date: "2024-01-15"
      },
      {
        id: 2,
        serviceName: "Spa Treatment",
        userName: "John D.",
        rating: 4,
        text: "Very professional and on time.",
        date: "2024-01-10"
      }
    ];
  } finally {
    loading.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
};

const handleImageError = (event) => {
  event.target.src = defaultAvatar;
};

// Fetch on mount
onMounted(() => {
  fetchReviews();
});
</script>

<style scoped>
.reviews-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  color: #0077ff;
  margin-bottom: 1.5rem;
}

/* Loading */
.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0077ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error */
.error {
  text-align: center;
  padding: 2rem;
  color: #ff4444;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* No Reviews */
.no-reviews {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

/* Reviews List */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

.service-info h3 {
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0077ff;
}

.details {
  flex: 1;
}

.name {
  font-weight: 600;
  color: #0077ff;
  margin: 0 0 0.3rem 0;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star {
  color: #ccc;
  font-size: 1rem;
}

.star.filled {
  color: #ffb400;
}

.rating-number {
  font-weight: 600;
  color: #666;
}

.date {
  color: #888;
  font-size: 0.9rem;
  margin: 0.3rem 0 0 0;
}

.review-content p {
  color: #333;
  font-style: italic;
  line-height: 1.5;
  margin: 0;
  padding-left: 0.5rem;
  border-left: 2px solid #0077ff;
}
</style>