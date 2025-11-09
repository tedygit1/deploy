<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <!-- Header -->
      <div class="modal-header">
        <h2>Book This Service</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <!-- Service Summary -->
      <div class="summary">
        <h3>{{ service.title }}</h3>
        <p class="category">{{ service.category }}</p>

        <div class="slot-box">
          <strong>Selected Slot:</strong>
          <div>{{ slot.date }}</div>
          <div>{{ slot.startTime }} - {{ slot.endTime }}</div>
        </div>

        <div class="price-box">
          <div><strong>Total Price:</strong> {{ service.price }} {{ service.priceUnit }}</div>
          <div class="deposit">
            <strong>Booking Fee (10%):</strong>
            {{ deposit }} {{ service.priceUnit }}
          </div>
        </div>
      </div>

      <!-- Customer form -->
      <div class="form-section">
        <h3>Your Information</h3>

        <div class="form-group">
          <label>Full Name</label>
          <input v-model="form.name" type="text" placeholder="Enter your name" />
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input v-model="form.phone" type="text" placeholder="09..." />
        </div>

        <div class="form-group">
          <label>Additional Notes</label>
          <textarea v-model="form.note" placeholder="Optional"></textarea>
        </div>
      </div>

      <!-- Payment -->
      <div class="payment-section">
        <h3>Payment Method</h3>

        <div class="payment-options">
          <label class="pay-option">
            <input type="radio" value="telebirr" v-model="form.paymentMethod" />
            Telebirr
          </label>

          <label class="pay-option">
            <input type="radio" value="cbebirr" v-model="form.paymentMethod" />
            CBE Birr
          </label>

          <label class="pay-option">
            <input type="radio" value="cash" v-model="form.paymentMethod" />
            Cash on arrival
          </label>
        </div>
      </div>

      <!-- Submit -->
      <div class="submit-section">
        <button class="confirm-btn" @click="submitBooking">
          Confirm Booking
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    service: { type: Object, required: true },
    slot: { type: Object, required: true },
  },

  data() {
    return {
      form: {
        name: "",
        phone: "",
        note: "",
        paymentMethod: "",
      },
    };
  },

  computed: {
    deposit() {
      return Math.ceil(Number(this.service.price) * 0.1);
    },
  },

  methods: {
    submitBooking() {
      if (!this.form.name || !this.form.phone || !this.form.paymentMethod) {
        alert("Please fill all required fields.");
        return;
      }

      this.$emit("confirmBooking", {
        customer: this.form,
        service: this.service,
        slot: this.slot,
        deposit: this.deposit,
      });
    },
  },
};
</script>

<style scoped>
/* Background */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* Box */
.modal {
  width: 430px;
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
  animation: pop 0.2s ease-out;
}

@keyframes pop {
  from { transform: scale(0.9); opacity: 0 }
  to { transform: scale(1); opacity: 1 }
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h2 {
  font-size: 1.3rem;
  color: #0f172a;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #374151;
}

/* Summary block */
.summary {
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  margin: 12px 0;
}
.summary h3 {
  margin-bottom: 2px;
}

.category {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 10px;
}

.slot-box {
  background: #f1f5f9;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.price-box {
  margin-top: 12px;
  font-size: 0.95rem;
}
.deposit {
  margin-top: 6px;
  color: #22c55e;
}

/* Form */
.form-section h3,
.payment-section h3 {
  margin-bottom: 8px;
  margin-top: 16px;
}

.form-group {
  margin-bottom: 12px;
}
.form-group label {
  font-size: 0.9rem;
  color: #374151;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  margin-top: 5px;
}

/* Payment */
.payment-options {
  background: #f8fafc;
  padding: 10px;
  border-radius: 6px;
}
.pay-option {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  gap: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

/* Submit */
.submit-section {
  margin-top: 16px;
  text-align: right;
}

.confirm-btn {
  background: #22c55e;
  color: white;
  padding: 9px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
}
.confirm-btn:hover {
  background: #16a34a;
}
</style>
