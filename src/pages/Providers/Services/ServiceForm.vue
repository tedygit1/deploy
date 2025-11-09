<template>
  <div class="service-form-container">
    <div class="service-form">
      <div class="form-header">
        <h2 class="form-title">{{ isEdit ? "Edit Service" : "Add New Service" }}</h2>
        <p class="form-subtitle">Fill in all required fields to list your service</p>
      </div>

      <!-- CATEGORY -->
      <div class="form-row">
        <label>Category <span class="required">*</span></label>
        <select 
          v-model="local.categoryId" 
          @change="onCategoryChange"
          :class="{ 'error': !local.categoryId && showError }"
        >
          <option disabled value="">Select category</option>
          <option v-for="cat in categories" :key="cat._id" :value="cat._id" :data-name="cat.name">
            {{ cat.name }}
          </option>
        </select>
        <div v-if="!local.categoryId && showError" class="error-message">
          Please select a category
        </div>
      </div>

      <!-- SUBCATEGORY -->
      <div v-if="local.categoryId && subcategories.length" class="form-row">
        <label>Subcategory</label>
        <select v-model="local.subcategoryId">
          <option disabled value="">Select subcategory</option>
          <option v-for="sub in subcategories" :key="sub._id" :value="sub._id">
            {{ sub.name }}
          </option>
        </select>
      </div>

      <!-- SERVICE NAME -->
      <div class="form-row">
        <label>Service Name <span class="required">*</span></label>
        <input 
          type="text" 
          v-model="local.title" 
          placeholder="Unique Service Name"
          :class="{ 'error': !local.title.trim() && showError }"
          ref="titleInput"
        />
        <div v-if="!local.title.trim() && showError" class="error-message">
          Service name is required
        </div>
      </div>

      <!-- BANNER -->
      <div class="form-row">
        <label>Banner Image (optional)</label>
        <div class="file-upload-area" @click="$refs.fileInput.click()">
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*"
            @change="onFileChange" 
            hidden 
          />
          <div v-if="previewImage" class="image-preview-container">
            <img :src="previewImage" class="banner-preview" />
            <button class="remove-image-btn" @click.stop="removeImage">✕</button>
          </div>
          <div v-else class="upload-placeholder">
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <p>Click to upload banner (JPG/PNG)</p>
            <p class="upload-hint">Recommended: 800x400px</p>
          </div>
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="form-row">
        <label>Description <span class="required">*</span></label>
        <textarea 
          v-model="local.description" 
          rows="4" 
          placeholder="Write a clear description of your service"
          :class="{ 'error': !local.description.trim() && showError }"
        ></textarea>
        <div v-if="!local.description.trim() && showError" class="error-message">
          Description is required
        </div>
      </div>

      <!-- PRICE SECTION -->
      <div class="form-row price-section">
        <div class="price-inputs">
          <div class="price-input">
            <label>Total Price (ETB) <span class="required">*</span></label>
            <input 
              type="number" 
              v-model.number="local.totalPrice" 
              @input="updateBookingPrice"
              min="0" 
              placeholder="0"
              :class="{ 'error': local.totalPrice <= 0 && showError }"
            />
          </div>
          <div class="price-input">
            <label>Booking Price (10%)</label>
            <input 
              type="number" 
              v-model.number="local.bookingPrice" 
              disabled 
            />
          </div>
        </div>
        <div v-if="local.totalPrice <= 0 && showError" class="error-message">
          Total price must be greater than 0
        </div>
      </div>

      <!-- PAYMENT METHOD -->
      <div class="form-row">
        <label>Payment Method (optional)</label>
        <select v-model="local.paymentMethod">
          <option value="">Skip for now</option>
          <option v-for="pm in paymentMethods" :key="pm" :value="pm">
            {{ pm }}
          </option>
        </select>
      </div>

      <!-- STATUS -->
      <div class="form-row">
        <label>Status</label>
        <div class="status-options">
          <label class="status-option">
            <input 
              type="radio" 
              value="published" 
              v-model="local.status" 
            />
            <span class="status-label published">Published</span>
          </label>
          <label class="status-option">
            <input 
              type="radio" 
              value="draft" 
              v-model="local.status" 
            />
            <span class="status-label draft">Draft</span>
          </label>
          <label class="status-option">
            <input 
              type="radio" 
              value="pending" 
              v-model="local.status" 
            />
            <span class="status-label pending">Pending</span>
          </label>
        </div>
      </div>

      <!-- TIME SLOTS -->
      <div class="form-row">
        <label>Working Time Slots <span class="required">*</span></label>
        <div v-for="(slot, idx) in local.slots" :key="idx" class="slot-row">
          <div class="slot-inputs">
            <input 
              type="date" 
              v-model="slot.date" 
              :min="today"
              :class="{ 'error': !slot.date && showError }"
            />
            <input 
              type="time" 
              v-model="slot.startTime" 
              :class="{ 'error': !slot.startTime && showError }"
            />
            <input 
              type="time" 
              v-model="slot.endTime" 
              :class="{ 'error': !slot.endTime && showError }"
            />
          </div>
          <button class="btn remove-slot-btn" @click="removeSlot(idx)">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <button class="btn add-slot-btn" @click="addSlot">
          <i class="fa-solid fa-plus"></i> Add Time Slot
        </button>
        <div v-if="local.slots.length === 0 && showError" class="error-message">
          At least one time slot is required
        </div>
        <div v-else-if="hasIncompleteSlot && showError" class="error-message">
          Please complete all time slot fields
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="form-actions">
        <button class="btn cancel-btn" @click="$emit('close')">
          <i class="fa-solid fa-xmark"></i> Cancel
        </button>
        <button 
          class="btn save-btn" 
          @click="saveService"
          :disabled="isSaving"
        >
          <span v-if="isSaving">
            <i class="fa-solid fa-spinner fa-spin"></i> Saving...
          </span>
          <span v-else>
            <i class="fa-solid fa-floppy-disk"></i> {{ isEdit ? "Update Service" : "Add Service" }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/api/index.js";

export default {
  props: { service: { type: Object, default: null } },

  data() {
    return {
      local: {
        _id: null,
        categoryId: "",
        categoryName: "",
        subcategoryId: "",
        title: "",
        bannerFile: null,
        description: "",
        totalPrice: 0,
        bookingPrice: 0,
        priceUnit: "ETB",
        status: "published",
        paymentMethod: "",
        slots: [],
        // ❌ REMOVE provider from here
      },
      previewImage: null,
      categories: [],
      subcategories: [],
      paymentMethods: ["Telebirr", "CBE Birr", "Cash"],
      showError: false,
      isSaving: false,
    };
  },

  computed: {
    isEdit() {
      return !!(this.service && this.service._id);
    },
    today() {
      return new Date().toISOString().split('T')[0];
    },
    hasIncompleteSlot() {
      return this.local.slots.some(slot => 
        !slot.date || !slot.startTime || !slot.endTime
      );
    }
  },

  watch: {
    service: {
      immediate: true,
      handler(val) {
        if (val) {
          this.local = {
            _id: val._id,
            categoryId: val.categoryId || "",
            categoryName: val.categoryName || "",
            subcategoryId: val.subcategoryId || "",
            title: val.title || "",
            description: val.description || "",
            totalPrice: val.totalPrice || 0,
            bookingPrice: val.bookingPrice || 0,
            priceUnit: "ETB",
            status: val.status || "published",
            paymentMethod: val.paymentMethod || "",
            slots: Array.isArray(val.slots) ? [...val.slots] : [],
            // ❌ Don't restore provider from service
            bannerFile: null
          };
          this.previewImage = val.banner || "";
          if (val.categoryId) {
            this.fetchSubcategories(val.categoryId);
          }
          this.updateBookingPrice();
        }
      }
    }
  },

  async mounted() {
    await this.fetchData();
    this.$nextTick(() => {
      if (this.$refs.titleInput) {
        this.$refs.titleInput.focus();
      }
    });
  },

  methods: {
    updateBookingPrice() {
      this.local.bookingPrice = Math.round(this.local.totalPrice * 0.1);
    },

    async fetchData() {
      try {
        const res = await http.get("/categories");
        this.categories = res.data;
      } catch (err) {
        console.error("Failed to load categories:", err);
        alert("❌ Failed to load categories. Please try again.");
      }
    },

    async fetchSubcategories(categoryId) {
      this.subcategories = [];
      if (!categoryId) return;
      try {
        const res = await http.get(`/categories/${categoryId}/subcategories`);
        this.subcategories = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.warn("Subcategories not available for:", categoryId);
      }
    },

    onCategoryChange(e) {
      this.local.subcategoryId = "";
      const selectedOption = e.target.options[e.target.selectedIndex];
      this.local.categoryId = selectedOption.value;
      this.local.categoryName = selectedOption.dataset.name || "";
      this.fetchSubcategories(this.local.categoryId);
    },

    addSlot() {
      this.local.slots.push({ date: "", startTime: "", endTime: "" });
    },

    removeSlot(idx) {
      this.local.slots.splice(idx, 1);
    },

    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.match('image.*')) {
          alert("❌ Please select an image file (JPG/PNG).");
          return;
        }
        this.local.bannerFile = file;
        const reader = new FileReader();
        reader.onload = (ev) => (this.previewImage = ev.target.result);
        reader.readAsDataURL(file);
      }
    },

    removeImage() {
      this.previewImage = null;
      this.local.bannerFile = null;
      this.$refs.fileInput.value = '';
    },

    validateForm() {
      this.showError = true;
      if (!this.local.title?.trim()) return false;
      if (!this.local.categoryId) return false;
      if (!this.local.description?.trim()) return false;
      if (this.local.totalPrice <= 0) return false;
      if (this.local.slots.length === 0) return false;
      if (this.hasIncompleteSlot) return false;
      return true;
    },

    async saveService() {
      if (!this.validateForm()) {
        alert("❌ Please fill in all required fields correctly.");
        return;
      }

      this.isSaving = true;
      try {
        // ✅ GET provider_id FRESH — this is the fix
        const providerId = localStorage.getItem("provider_id");
        if (!providerId || providerId === "null") {
          throw new Error("You are not logged in. Please log in again.");
        }

        const payload = {
          title: this.local.title.trim(),
          description: this.local.description.trim(),
          totalPrice: this.local.totalPrice,
          bookingPrice: this.local.bookingPrice,
          priceUnit: "ETB",
          status: this.local.status,
          provider: providerId, // ✅ Always fresh
          category: this.local.categoryName,
        };

        if (this.local.subcategoryId) {
          payload.subcategoryId = this.local.subcategoryId;
        }
        if (this.local.paymentMethod) {
          payload.paymentMethod = this.local.paymentMethod;
        }

        const validSlots = this.local.slots.filter(slot => 
          slot.date && slot.startTime && slot.endTime
        );
        if (validSlots.length === 0) {
          throw new Error("At least one complete time slot is required.");
        }
        payload.slots = validSlots;

        const config = {};
        if (this.local.bannerFile) {
          const fd = new FormData();
          Object.entries(payload).forEach(([key, value]) => {
            if (key === 'slots') {
              fd.append('slots', JSON.stringify(value));
            } else {
              fd.append(key, value);
            }
          });
          fd.append('banner', this.local.bannerFile);
          payload = fd;
          config.headers = {};
        }

        const response = this.isEdit
          ? await http.put(`/services/${this.local._id}`, payload, config)
          : await http.post("/services", payload, config);

        this.$emit("save", response.data);
        alert(`✅ ${this.isEdit ? "Service updated!" : "Service created!"}`);

      } catch (err) {
        const errorMsg = err.response?.data?.message || 
                         err.response?.data?.error || 
                         err.message || 
                         "Failed to save service";
        console.error("Save error details:", errorMsg, err.response?.data);
        alert(`❌ ${errorMsg}`);
      } finally {
        this.isSaving = false;
      }
    }
  }
};
</script>

<style scoped>
/* Keep all your existing styles — no changes needed */
.service-form-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.service-form {
  width: 100%;
  max-width: 700px;
  padding: 32px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  font-family: "Inter", sans-serif;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-header {
  text-align: center;
  margin-bottom: 28px;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.form-subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

.form-row {
  margin-bottom: 22px;
}

label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
}

input, select, textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 0.95rem;
  background: #fafafa;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #22c55e;
  background: white;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.error {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* File Upload */
.file-upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;
}

.file-upload-area:hover {
  border-color: #22c55e;
  background: #f0fdf4;
}

.upload-placeholder i {
  font-size: 2.5rem;
  color: #22c55e;
  margin-bottom: 12px;
}

.upload-placeholder p {
  margin: 4px 0;
  color: #475569;
}

.upload-hint {
  font-size: 0.8rem;
  color: #94a3b8;
}

.image-preview-container {
  position: relative;
  display: inline-block;
}

.banner-preview {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.remove-image-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Price Section */
.price-section {
  display: flex;
  flex-direction: column;
}

.price-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.price-input label {
  margin-bottom: 6px;
}

/* Status Options */
.status-options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.status-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.status-option input {
  display: none;
}

.status-label {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}

.status-label.published {
  background: #dcfce7;
  color: #166534;
}

.status-label.draft {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-label.pending {
  background: #ffedd5;
  color: #c2410c;
}

.status-option input:checked + .status-label.published {
  background: #22c55e;
  color: white;
}

.status-option input:checked + .status-label.draft {
  background: #3b82f6;
  color: white;
}

.status-option input:checked + .status-label.pending {
  background: #f97316;
  color: white;
}

/* Slots */
.slot-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 14px;
}

.slot-inputs {
  display: flex;
  gap: 10px;
  flex: 1;
}

.slot-inputs input {
  flex: 1;
}

.remove-slot-btn {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-slot-btn:hover {
  background: #fecaca;
  transform: scale(1.05);
}

.add-slot-btn {
  background: #dbeafe;
  color: #1d4ed8;
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.add-slot-btn:hover {
  background: #bfdbfe;
  transform: translateY(-2px);
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  border: none;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.save-btn {
  background: #22c55e;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 600px) {
  .service-form {
    padding: 24px;
  }
  
  .price-inputs {
    grid-template-columns: 1fr;
  }
  
  .slot-inputs {
    flex-direction: column;
  }
  
  .status-options {
    flex-direction: column;
    gap: 10px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>