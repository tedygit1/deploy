<template>
  <div class="service-card">
    <!-- Banner -->
    <div class="banner" v-if="service.banner">
      <img :src="service.banner" alt="Service Banner" />
    </div>

    <div class="content">
      <div class="header">
        <div class="title-cat">
          <span class="category">{{ service.category }}</span>
          <h2 class="title">{{ service.title }}</h2>
        </div>

        <div class="actions" v-if="editable">
          <button class="edit-btn" @click="$emit('edit', service)">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="delete-btn" @click="$emit('delete', service._id)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>

      <p class="description">{{ service.description }}</p>

      <div class="details">
        <div class="id"><strong>ID:</strong> {{ service._id }}</div>
        <div class="price"><strong>Price:</strong> {{ service.price }} {{ service.priceUnit || "ETB" }}</div>
        <div class="status">
          <strong>Status:</strong>
          <span :class="service.status.toLowerCase()">{{ service.status }}</span>
        </div>

        <!-- Slots -->
        <div v-if="service.slots && service.slots.length" class="slots-section">
          <strong>Working Slots:</strong>
          <div
            v-for="(slot, idx) in service.slots"
            :key="idx"
            class="slot-row"
          >
            <div class="slot-info">
              {{ slot.date }} | {{ slot.startTime }} - {{ slot.endTime }}
              <span class="slot-status">• {{ slot.booked || 0 }}/{{ slot.capacity || 1 }}</span>
            </div>
            <button
              class="book-btn"
              :disabled="isSlotFull(slot)"
              @click="$emit('book', { service, slot })"
            >
              {{ isSlotFull(slot) ? "Full" : "Book Now" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    service: { type: Object, required: true },
    editable: { type: Boolean, default: false },
  },
  methods: {
    isSlotFull(slot) {
      const cap = Number(slot.capacity || 1);
      const booked = Number(slot.booked || 0);
      return booked >= cap;
    },
  },
};
</script>

<style scoped>
.service-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  margin-bottom: 20px;
}
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

.banner img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-bottom: 1px solid #e5e7eb;
}

.content {
  padding: 16px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-cat .category {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 600;
}
.title-cat .title {
  margin: 2px 0 6px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
}

.actions button {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 6px;
  font-size: 1.1rem;
  color: #0f172a;
  transition: color 0.2s;
}
.actions button:hover {
  color: #22c55e;
}

.description {
  font-size: 0.95rem;
  color: #374151;
  margin-bottom: 12px;
}

.details {
  font-size: 0.9rem;
  color: #4b5563;
}
.details div {
  margin-bottom: 6px;
}
.price {
  font-weight: 600;
}
.status span {
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.8rem;
  text-transform: capitalize;
}
.status .active {
  background-color: #d1fae5;
  color: #065f46;
}
.status .inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Slots */
.slots-section {
  margin-top: 10px;
}
.slot-row {
  margin: 8px 0;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.slot-info {
  font-size: 0.9rem;
  color: #374151;
}
.slot-status {
  font-size: 0.8rem;
  color: #6b7280;
  margin-left: 6px;
}
.book-btn {
  padding: 6px 14px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background 0.2s;
}
.book-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
.book-btn:hover:not(:disabled) {
  background: #16a34a;
}
</style>
