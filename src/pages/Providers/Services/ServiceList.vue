<template>
  <div class="service-list">
    <div 
      class="service-card"
      v-for="svc in services"
      :key="svc._id"
    >
      <h3>{{ svc.title }}</h3>
      <p>{{ svc.category }}</p>

      <button class="edit-btn" @click="$emit('edit', svc)">
        Edit
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServiceList",
  emits: ["edit"],
  data() {
    return {
      services: [
        {
          _id: "svc1",
          title: "Full Body Massage",
          category: "Beauty"
        }
      ]
    };
  }
};
</script>
