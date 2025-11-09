<template>
  <div class="page-container font-poppins">
    <h1 class="page-title">Provider Feedback</h1>
    <p>Your suggestions and reports help us improve the platform for providers like you.</p>

    <form @submit.prevent="submitFeedback" class="feedback-form">
      <label>
        Name:
        <input type="text" v-model="feedback.name" required />
      </label>
      <label>
        Email:
        <input type="email" v-model="feedback.email" required />
      </label>
      <label>
        Category:
        <select v-model="feedback.category" required>
          <option value="">Select</option>
          <option>Technical Issue</option>
          <option>Payment Problem</option>
          <option>Improvement Suggestion</option>
        </select>
      </label>
      <label>
        Message:
        <textarea v-model="feedback.message" rows="5" required></textarea>
      </label>
      <button type="submit">Submit Feedback</button>
    </form>

    <p v-if="submitted" class="thank-you">Thank you! Your feedback has been submitted.</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const feedback = reactive({
  name: '',
  email: '',
  category: '',
  message: '',
})
const submitted = ref(false)

function submitFeedback() {
  console.log('Feedback submitted:', feedback)
  submitted.value = true
  feedback.name = ''
  feedback.email = ''
  feedback.category = ''
  feedback.message = ''
}
</script>

<style scoped>
.page-container { padding: 60px 20px; max-width: 600px; margin: 0 auto; }
.page-title { font-size: 2rem; color: #3b82f6; margin-bottom: 20px; text-align: center; }
p { color: #333; line-height: 1.6; margin-bottom: 20px; text-align: center; }
.feedback-form { display: flex; flex-direction: column; gap: 15px; }
.feedback-form label { display: flex; flex-direction: column; color: #1e40af; font-weight: 500; }
.feedback-form input, .feedback-form select, .feedback-form textarea {
  padding: 10px; border-radius: 8px; border: 1px solid #ccc; font-size: 1rem;
}
.feedback-form button {
  background: #3b82f6; color: white; padding: 12px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;
  transition: transform 0.3s, background 0.3s;
}
.feedback-form button:hover { transform: scale(1.03); background: #2563eb; }
.thank-you { color: green; font-weight: 600; margin-top: 15px; text-align: center; }
</style>
