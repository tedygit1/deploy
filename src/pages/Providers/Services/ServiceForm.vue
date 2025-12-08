<!-- src/pages/Providers/ServiceForm.vue -->
<template>
  <!-- Scrollable container added here -->
  <div class="service-form-scroll-wrapper">
    <div class="service-form-container">
      <div class="service-form">
        <div class="form-header">
          <h2 class="form-title">{{ isEdit ? "Edit Service" : "Add New Service" }}</h2>
          <p class="form-subtitle">Fill in the basic details - you'll add time slots later</p>
        </div>

        <!-- CATEGORY -->
        <div class="form-row">
          <label>Category <span class="required">*</span></label>
          <select 
            v-model="local.categoryId" 
            @change="onCategoryChange"
            :class="{ 'error': !local.categoryId && showError }"
            @click="loadCategoriesIfNeeded"
          >
            <option disabled value="">Choose a category</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">
              {{ cat.name }}
            </option>
          </select>
          <div v-if="!local.categoryId && showError" class="error-message">
            Please select a service category
          </div>
        </div>

        <!-- SUBCATEGORY - MULTIPLE SELECTION -->
        <div v-if="local.categoryId && subcategories.length" class="form-row">
          <label>Subcategories</label>
          <div class="multi-select-container">
            <div 
              class="multi-select-display"
              @click="toggleSubcategoryDropdown"
              :class="{ 'error': showError && !hasValidSubcategories }"
            >
              <span v-if="selectedSubcategories.length === 0" class="placeholder">
                Choose subcategories
              </span>
              <span v-else class="selected-items">
                {{ selectedSubcategories.length }} subcategory{{ selectedSubcategories.length !== 1 ? 's' : '' }} selected
              </span>
              <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
            </div>
            
            <div v-if="showSubcategoryDropdown" class="multi-select-dropdown">
              <div class="dropdown-search" v-if="subcategories.length > 5">
                <input 
                  type="text" 
                  v-model="subcategorySearch" 
                  placeholder="Search subcategories..."
                  @click.stop
                />
              </div>
              <div class="dropdown-options">
                <label 
                  v-for="sub in filteredSubcategories" 
                  :key="sub._id" 
                  class="checkbox-option"
                >
                  <input 
                    type="checkbox" 
                    :value="sub._id" 
                    v-model="local.subcategoryIds"
                    @change="onSubcategoryChange"
                  />
                  <span class="checkmark"></span>
                  <span class="option-text">{{ sub.name }}</span>
                </label>
              </div>
              <div v-if="filteredSubcategories.length === 0" class="no-options">
                No subcategories found
              </div>
            </div>
          </div>
          <div v-if="showError && !hasValidSubcategories" class="error-message">
            Please select valid subcategories for this category
          </div>
          
          <!-- Selected subcategories display -->
          <div v-if="selectedSubcategories.length > 0" class="selected-tags">
            <div 
              v-for="sub in selectedSubcategories" 
              :key="sub._id" 
              class="tag"
            >
              {{ sub.name }}
              <button @click="removeSubcategory(sub._id)" class="remove-tag">×</button>
            </div>
          </div>
        </div>

        <!-- SERVICE NAME -->
        <div class="form-row">
          <label>Service Name <span class="required">*</span></label>
          <input 
            type="text" 
            v-model="local.title" 
            placeholder="e.g. Men's Haircut, Legal Consultation"
            :class="{ 'error': !local.title.trim() && showError }"
            ref="titleInput"
          />
          <div v-if="!local.title.trim() && showError" class="error-message">
            A clear service name is required
          </div>
        </div>

        <!-- BANNER -->
        <div class="form-row">
          <label>Banner Image <span class="required">*</span></label>
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
              <button class="remove-image-btn" @click.stop="removeImage" aria-label="Remove image">✕</button>
            </div>
            <div v-else class="upload-placeholder">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <p>Upload banner (JPG/PNG)</p>
              <p class="upload-hint">Recommended: 800×400 px</p>
            </div>
          </div>
          <div v-if="!local.bannerFile && showError" class="error-message">
            Banner image is required
          </div>
        </div>

        <!-- DESCRIPTION -->
        <div class="form-row">
          <label>Description <span class="required">*</span></label>
          <textarea 
            v-model="local.description" 
            rows="4" 
            placeholder="Describe what's included, duration, tools used, etc."
            :class="{ 'error': !local.description.trim() && showError }"
          ></textarea>
          <div v-if="!local.description.trim() && showError" class="error-message">
            A detailed description helps attract clients
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
              <label>Booking Deposit (10%)</label>
              <input 
                type="number" 
                v-model.number="local.bookingPrice" 
                disabled 
                readonly
              />
            </div>
          </div>
          <div v-if="local.totalPrice <= 0 && showError" class="error-message">
            Please set a valid price above 0 ETB
          </div>
        </div>

        <!-- PAYMENT METHOD -->
        <div class="form-row">
          <label>Preferred Payment Method</label>
          <select v-model="local.paymentMethod">
            <option value="">Not specified</option>
            <option v-for="pm in paymentMethods" :key="pm" :value="pm">
              {{ pm }}
            </option>
          </select>
        </div>

        <!-- STATUS - ALWAYS DRAFT FOR NEW SERVICES -->
        <div class="form-row" v-if="isEdit">
          <label>Listing Status</label>
          <div class="status-options" role="radiogroup" aria-label="Service status">
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
          </div>
        </div>

        <!-- INFO MESSAGE FOR NEW SERVICES -->
        <div v-if="!isEdit" class="info-message">
          <i class="fa-solid fa-info-circle"></i>
          <p><strong>Next step:</strong> After saving, you'll add time slots to make your service available for booking.</p>
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
              <i class="fa-solid fa-check"></i> {{ isEdit ? "Update Service" : "Save as Draft" }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/api/index.js";

export default {
  props: { 
    service: { type: Object, default: null },
    // Optional: pass categories from parent to avoid API call
    initialCategories: { 
      type: Array, 
      default: () => [] 
    }
  },

  data() {
    return {
      local: {
        _id: null,
        categoryId: "",
        subcategoryIds: [],
        title: "",
        bannerFile: null,
        description: "",
        totalPrice: 0,
        bookingPrice: 0,
        priceUnit: "ETB",
        status: "draft",
        paymentMethod: "",
        slots: []
      },
      previewImage: null,
      categories: [],
      subcategories: [],
      paymentMethods: ["Telebirr", "CBE Birr", "Cash"],
      showError: false,
      isSaving: false,
      showSubcategoryDropdown: false,
      subcategorySearch: "",
      categoriesLoaded: false,  // New flag to track if categories are loaded
      shouldLoadCategories: false  // New flag to control when to load
    };
  },

  computed: {
    isEdit() {
      return !!(this.service && this.service._id);
    },
    
    selectedSubcategories() {
      return this.subcategories.filter(sub => 
        this.local.subcategoryIds.includes(sub._id)
      );
    },
    
    filteredSubcategories() {
      if (!this.subcategorySearch) return this.subcategories;
      return this.subcategories.filter(sub =>
        sub.name.toLowerCase().includes(this.subcategorySearch.toLowerCase())
      );
    },
    
    hasValidSubcategories() {
      if (this.local.subcategoryIds.length === 0) return true;
      return this.local.subcategoryIds.every(id =>
        this.subcategories.some(sub => sub._id === id)
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
            subcategoryIds: Array.isArray(val.subcategoryIds) ? [...val.subcategoryIds] : [],
            title: val.title || "",
            description: val.description || "",
            totalPrice: val.totalPrice || 0,
            bookingPrice: val.bookingPrice || 0,
            priceUnit: "ETB",
            status: val.status || "draft",
            paymentMethod: val.paymentMethod || "",
            slots: Array.isArray(val.slots) ? [...val.slots] : [],
            bannerFile: null
          };
          if (val.banner) {
            this.previewImage = val.banner;
          } else {
            this.previewImage = null;
          }
          if (val.categoryId) {
            this.fetchSubcategories(val.categoryId);
          }
          this.updateBookingPrice();
        }
      }
    },
    
    // Use initialCategories from parent if provided
    initialCategories: {
      immediate: true,
      handler(cats) {
        if (cats && cats.length > 0 && !this.categoriesLoaded) {
          this.categories = [...cats];
          this.categoriesLoaded = true;
        }
      }
    }
  },

  mounted() {
    console.log('🔍 ServiceForm mounted - checking if we need categories...');
    
    // Only load categories if we're in a provider context
    const isProviderRoute = window.location.pathname.includes('/provider');
    const hasToken = localStorage.getItem("provider_token") || localStorage.getItem("token");
    
    if (isProviderRoute && hasToken) {
      this.shouldLoadCategories = true;
      console.log('✅ ServiceForm: Provider route detected, will load categories when needed');
    } else {
      console.log('⚠️ ServiceForm: Not in provider route or no token, skipping category load');
    }
    
    this.$nextTick(() => {
      if (this.$refs.titleInput) {
        this.$refs.titleInput.focus();
      }
    });
    
    document.addEventListener('click', this.closeDropdowns);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdowns);
  },

  methods: {
    updateBookingPrice() {
      this.local.bookingPrice = Math.round(this.local.totalPrice * 0.1);
    },

    async loadCategoriesIfNeeded() {
      // Don't load if already loaded or not needed
      if (this.categoriesLoaded || this.categories.length > 0) {
        return;
      }
      
      // Only load if we're supposed to (provider context)
      if (!this.shouldLoadCategories) {
        console.log('⚠️ Skipping category load - not in provider context');
        return;
      }
      
      // Check if user is authenticated
      const token = localStorage.getItem("provider_token") || localStorage.getItem("token");
      if (!token) {
        console.log('⚠️ Skipping category load - no auth token');
        return;
      }
      
      await this.fetchData();
    },

    async fetchData() {
      try {
        console.log('📤 Loading categories for ServiceForm...');
        const res = await http.get("/categories");
        this.categories = res.data;
        this.categoriesLoaded = true;
        console.log('✅ Categories loaded:', this.categories.length);
      } catch (err) {
        console.error("Failed to load categories:", err);
        // Don't show alert on home page
        if (window.location.pathname.includes('/provider')) {
          alert("❌ Failed to load categories. Please try again.");
        }
      }
    },

    async fetchSubcategories(categoryId) {
      this.subcategories = [];
      this.local.subcategoryIds = [];
      if (!categoryId) return;
      
      // Don't fetch subcategories if not in provider context
      const isProviderRoute = window.location.pathname.includes('/provider');
      const hasToken = localStorage.getItem("provider_token") || localStorage.getItem("token");
      
      if (!isProviderRoute || !hasToken) {
        console.log('⚠️ Skipping subcategory fetch - not in provider context');
        return;
      }
      
      try {
        const res = await http.get(`/categories/${categoryId}/subcategories`);
        this.subcategories = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.warn("Subcategories not available for:", categoryId);
      }
    },

    onCategoryChange(e) {
      this.local.categoryId = e.target.value;
      this.fetchSubcategories(this.local.categoryId);
      this.closeDropdowns();
    },

    onSubcategoryChange() {
      this.local.subcategoryIds = [...this.local.subcategoryIds];
    },

    toggleSubcategoryDropdown() {
      this.showSubcategoryDropdown = !this.showSubcategoryDropdown;
      if (this.showSubcategoryDropdown) {
        this.subcategorySearch = "";
      }
    },

    closeDropdowns() {
      this.showSubcategoryDropdown = false;
    },

    removeSubcategory(subcategoryId) {
      this.local.subcategoryIds = this.local.subcategoryIds.filter(
        id => id !== subcategoryId
      );
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
        reader.onload = (ev) => {
          this.previewImage = ev.target.result;
        };
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
      if (!this.hasValidSubcategories) return false;
      if (!this.local.bannerFile) return false;
      return true;
    },

    async saveService() {
      if (!this.validateForm()) {
        alert("❌ Please fill in all required fields correctly.");
        return;
      }

      this.isSaving = true;

      try {
        let providerId = null;
        try {
          const loggedProvider = JSON.parse(localStorage.getItem("loggedProvider") || "{}");
          providerId = loggedProvider.pid;
        } catch (e) {
          console.warn("Malformed loggedProvider");
        }
        if (!providerId) {
          providerId = localStorage.getItem("provider_id");
        }
        if (!providerId) {
          throw new Error("Provider not authenticated.");
        }

        const selectedCategory = this.categories.find(cat => cat._id === this.local.categoryId);
        if (!selectedCategory) {
          throw new Error("Please select a valid category");
        }

        const selectedSubcategoryNames = this.selectedSubcategories.map(sub => sub.name);

        const formData = new FormData();
        formData.append('title', this.local.title.trim());
        formData.append('description', this.local.description.trim());
        formData.append('totalPrice', String(this.local.totalPrice));
        formData.append('bookingPrice', String(this.local.bookingPrice));
        formData.append('category', selectedCategory.name);
        formData.append('categoryId', this.local.categoryId);
        formData.append('status', "draft");
        formData.append('providerId', providerId);
        formData.append('paymentMethod', this.local.paymentMethod || "Telebirr");
        formData.append('priceUnit', "ETB");
        formData.append('serviceType', "fixed");

        selectedSubcategoryNames.forEach(name => {
          formData.append('subcategories[]', name);
        });

        if (this.local.bannerFile) {
          formData.append('banner', this.local.bannerFile);
        }

        let response;
        const url = this.isEdit ? `/services/${this.local._id}` : "/services";
        
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };

        if (this.isEdit) {
          response = await http.put(url, formData, config);
        } else {
          response = await http.post(url, formData, config);
        }

        const savedService = response.data;
        
        console.log('✅ Service saved successfully!');
        console.log('🔍 Full backend response:', savedService);
        
        // 🔥 CRITICAL FIX: Handle the banner correctly
        if (savedService.banner) {
          console.log('📸 Backend returned banner:', savedService.banner);
          console.log('📸 Banner type:', typeof savedService.banner);
          
          // Fix 1: If banner is an object, extract the URL
          if (typeof savedService.banner === 'object') {
            console.log('🔍 Banner is object, extracting URL...');
            console.log('🔍 Banner object keys:', Object.keys(savedService.banner));
            
            // Try all possible URL properties from Cloudinary
            const possibleUrl = savedService.banner.secure_url || 
                               savedService.banner.url || 
                               savedService.banner.public_id ||
                               savedService.banner.path;
            
            if (possibleUrl) {
              savedService.banner = possibleUrl;
              console.log('✅ Extracted banner URL:', savedService.banner);
            } else {
              console.warn('⚠️ Could not extract URL from banner object');
              savedService.banner = null;
            }
          }
          
          // Fix 2: If banner is the string "[object Object]", clear it
          if (savedService.banner === '[object Object]' || savedService.banner === '[object Object]') {
            console.warn('⚠️ Banner is "[object Object]" string');
            savedService.banner = null;
          }
          
          // Fix 3: Ensure banner is a valid URL string
          if (savedService.banner && typeof savedService.banner === 'string') {
            if (!savedService.banner.startsWith('http') && !savedService.banner.startsWith('data:')) {
              console.warn('⚠️ Banner string is not a valid URL:', savedService.banner);
              savedService.banner = null;
            }
          }
        } else {
          console.warn('⚠️ No banner in backend response');
        }
        
        // Final fallback: Use preview image if no valid banner
        if (!savedService.banner || savedService.banner === '[object Object]') {
          console.log('✅ Using preview image as banner');
          savedService.banner = this.previewImage;
        }
        
        console.log('🎯 Final banner after processing:', savedService.banner);

        this.$emit("save", savedService);

      } catch (err) {
        console.error("❌ Save error:", err);
        if (err.response) {
          console.error("❌ Response error:", err.response.data);
          const errorMsg = err.response.data?.message || 
                          err.response.data?.error || 
                          err.message || 
                          "Failed to save service";
          alert(`❌ ${errorMsg}`);
        } else {
          alert(`❌ ${err.message || "Failed to save service"}`);
        }
      } finally {
        this.isSaving = false;
      }
    }
  }
};
</script>

<style scoped>
/* ===== SCROLLABLE WRAPPER (NEW) ===== */
.service-form-scroll-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  margin: 20px auto;
  font-family: "Poppins", sans-serif;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.service-form-container {
  width: 100%;
  max-width: 720px;
}

.service-form {
  padding: 36px;
  border-radius: 24px;
  background: white;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.4s ease-out;
  position: relative;
  z-index: 10;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.form-subtitle {
  color: #64748b;
  font-size: 1.05rem;
  line-height: 1.5;
}

.form-row {
  margin-bottom: 26px;
}

label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #ef4444;
  font-size: 1.1em;
}

input, select, textarea {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  font-size: 1.02rem;
  background: #f8fafc;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #22c55e;
  background: white;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
}

.error {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
}

.error-message {
  color: #ef4444;
  font-size: 0.92rem;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.file-upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 18px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f0fdf4;
  position: relative;
}

.file-upload-area:hover {
  border-color: #22c55e;
  background: #ecfdf5;
  transform: translateY(-2px);
}

.upload-placeholder i {
  font-size: 2.8rem;
  color: #22c55e;
  margin-bottom: 14px;
}

.upload-placeholder p {
  margin: 6px 0;
  color: #374151;
  font-size: 1.02rem;
}

.upload-hint {
  font-size: 0.85rem;
  color: #94a3b8;
}

.image-preview-container {
  position: relative;
  display: inline-block;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.banner-preview {
  max-width: 100%;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.remove-image-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.price-section {
  display: flex;
  flex-direction: column;
}

.price-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.price-input label {
  margin-bottom: 8px;
}

.status-options {
  display: flex;
  gap: 18px;
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
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.25s ease;
  min-width: 90px;
  text-align: center;
}

.status-label.published {
  background: #dcfce7;
  color: #166534;
}

.status-label.draft {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-option input:checked + .status-label.published {
  background: #16a34a;
  color: white;
}

.status-option input:checked + .status-label.draft {
  background: #3b82f6;
  color: white;
}

.info-message {
  background: #dbeafe;
  border: 1px solid #93c5fd;
  border-radius: 12px;
  padding: 16px;
  margin: 20px 0;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-message i {
  color: #1d4ed8;
  font-size: 1.2rem;
  margin-top: 2px;
}

.info-message p {
  color: #1e40af;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 1.05rem;
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  border: none;
  letter-spacing: 0.4px;
  min-height: 52px;
  min-width: 140px;
  justify-content: center;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.cancel-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.save-btn {
  background: linear-gradient(120deg, #22c55e, #16a34a);
  color: white;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
}

.save-btn:hover:not(:disabled) {
  background: linear-gradient(120deg, #16a34a, #15803d);
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(34, 197, 94, 0.4);
}

.save-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
  transform: none;
}

.multi-select-container {
  position: relative;
  width: 100%;
}

.multi-select-display {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  font-size: 1.02rem;
  background: #f8fafc;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.multi-select-display:hover {
  border-color: #cbd5e1;
}

.multi-select-display:focus {
  outline: none;
  border-color: #22c55e;
  background: white;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
}

.placeholder {
  color: #94a3b8;
}

.selected-items {
  color: #334155;
  font-weight: 500;
}

.dropdown-arrow {
  color: #64748b;
  transition: transform 0.3s ease;
}

.multi-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  margin-top: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow: hidden;
}

.dropdown-search {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.dropdown-search input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
}

.dropdown-options {
  max-height: 200px;
  overflow-y: auto;
}

.checkbox-option {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f8fafc;
}

.checkbox-option:hover {
  background: #f8fafc;
}

.checkbox-option input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-option input:checked + .checkmark {
  background: #22c55e;
  border-color: #22c55e;
}

.checkbox-option input:checked + .checkmark::after {
  content: "✓";
  position: absolute;
  color: white;
  font-size: 12px;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.option-text {
  color: #334155;
  font-size: 0.95rem;
}

.no-options {
  padding: 20px;
  text-align: center;
  color: #94a3b8;
  font-style: italic;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #dcfce7;
  color: #166534;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.remove-tag {
  background: none;
  border: none;
  color: #166534;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.remove-tag:hover {
  background: #bbf7d0;
}

@media (max-width: 768px) {
  .service-form {
    padding: 28px;
    margin: 16px;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .price-inputs {
    grid-template-columns: 1fr;
  }

  .status-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  input, select, textarea {
    padding: 16px;
    font-size: 1.05rem;
  }
}

@media (max-width: 480px) {
  .service-form {
    padding: 24px;
    margin: 12px;
  }

  .form-title {
    font-size: 1.6rem;
  }

  .form-subtitle {
    font-size: 1rem;
  }

  input, select, textarea {
    padding: 18px;
  }
}
</style>