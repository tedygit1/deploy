<!-- src/pages/Providers/TimeSlots.vue -->
<template>
  <div class="time-slots-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Loading time slots...</p>
    </div>
    <!-- Loading Bookings State -->
    <div v-if="loadingBookings" class="loading-state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Checking booked appointments...</p>
    </div>
    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      <i class="fa-solid fa-circle-exclamation"></i>
      <span>{{ errorMessage }}</span>
      <button class="close-error" @click="errorMessage = ''">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <!-- Success Message -->
    <div v-if="successMessage" class="success-message">
      <i class="fa-solid fa-circle-check"></i>
      <span>{{ successMessage }}</span>
      <button class="close-success" @click="successMessage = ''">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <!-- Service Status Alert -->
    <div v-if="serviceStatus === 'draft'" class="draft-alert">
      <i class="fa-solid fa-clock"></i>
      <div class="alert-content">
        <strong>Draft Service</strong>
        <p>Add time slots to activate and publish this service</p>
      </div>
    </div>

    <!-- Time Slots Management -->
    <div class="time-slots-content" v-if="!loading">
      <!-- 7-Day Schedule -->
      <div class="weekly-schedule-section">
        <div class="schedule-header">
          <h4>Next 7 Days Availability</h4>
          <div class="date-range">
            {{ currentDateRange }}
          </div>
        </div>
        <p class="section-description">
          Configure time slots for each day. Changes will be saved when you click "Update Time Slots".
        </p>
        <div class="days-grid">
          <div
            v-for="day in generatedDays"
            :key="day.date"
            class="day-card"
            :class="{ 
              'working-day': isWorkingAtDay(day.date), 
              'day-off': !isWorkingAtDay(day.date),
              'today': day.isToday 
            }"
          >
            <div class="day-header">
              <label class="day-toggle">
                <input
                  type="checkbox"
                  :checked="isWorkingAtDay(day.date)"
                  @change="toggleWorkingDay(day.date, $event.target.checked)"
                />
                <span class="day-label">{{ day.display }}</span>
              </label>
              <div class="day-labels">
                <span v-if="!isWorkingAtDay(day.date)" class="off-label">Day Off</span>
                <span v-if="day.isToday" class="today-label">Today</span>
              </div>
            </div>
            <!-- ONLY SHOW EDITABLE SLOTS IF WORKING DAY -->
            <div v-if="isWorkingAtDay(day.date)" class="time-slots-list">
              <div
                v-for="(timeSlot, slotIndex) in dailySchedules[day.date]"
                :key="slotIndex"
                class="time-slot-item"
                :class="{ 
                  'has-error': timeSlot.hasError,
                  'booked-slot': timeSlot.isBooked,
                  'available-slot': !timeSlot.isBooked && timeSlot.isAvailable,
                  'unavailable-slot': !timeSlot.isBooked && !timeSlot.isAvailable
                }"
              >
                <!-- COMPACT SINGLE LINE LAYOUT -->
                <div class="slot-compact-line">
                  <!-- TIME RANGE -->
                  <div class="time-range-compact">
                    <i class="fa-solid fa-clock slot-icon"></i>
                    <span v-if="timeSlot.isBooked" class="booked-time-text">
                      {{ formatTime12(timeSlot.startTime) }}–{{ formatTime12(timeSlot.endTime) }}
                    </span>
                    <span v-else class="edit-time-range">
                      <input
                        :value="formatTime(timeSlot.startTime)"
                        @input="updateTimeSlot(timeSlot, 'startTime', $event.target.value)"
                        type="time"
                        class="time-input"
                        @change="validateTimeSlot(timeSlot)"
                      />
                      <span class="time-separator">–</span>
                      <input
                        :value="formatTime(timeSlot.endTime)"
                        @input="updateTimeSlot(timeSlot, 'endTime', $event.target.value)"
                        type="time"
                        class="time-input"
                        @change="validateTimeSlot(timeSlot)"
                      />
                    </span>
                  </div>

                  <!-- STATUS INDICATOR -->
                  <div class="status-indicator-compact">
                    <!-- BOOKED -->
                    <div v-if="timeSlot.isBooked" class="booked-indicator">
                      <span class="status-dot booked-dot" title="BOOKED"></span>
                      <span v-if="getBookingForSlot(day.date, timeSlot.startTime, timeSlot.endTime)" 
                            class="customer-compact">
                        <i class="fa-solid fa-user"></i>
                      </span>
                    </div>
                    
                    <!-- AVAILABLE/UNAVAILABLE TOGGLE SWITCH -->
                    <div v-else class="toggle-container">
                      <label class="toggle-switch" :title="timeSlot.isAvailable ? 'Available - Click to make unavailable' : 'Unavailable - Click to make available'">
                        <input
                          type="checkbox"
                          v-model="timeSlot.isAvailable"
                        />
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <!-- ERROR & REMOVE -->
                  <div class="actions-compact">
                    <div v-if="timeSlot.hasError" class="error-indicator" :title="timeSlot.errorMessage">
                      <i class="fa-solid fa-exclamation-triangle"></i>
                    </div>
                    <button
                      class="remove-btn-compact"
                      @click="removeTimeSlot(day.date, slotIndex)"
                      :disabled="dailySchedules[day.date].length === 1 || timeSlot.isBooked"
                      :title="timeSlot.isBooked ? 'Cannot remove booked slot' : 'Remove time slot'"
                    >
                      <i class="fa-solid fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- ADD SLOT BUTTON -->
              <button 
                class="btn-add-slot-compact" 
                @click="addTimeSlot(day.date)"
                :disabled="loadingBookings"
              >
                <i class="fa-solid fa-plus"></i> Add Time Slot
              </button>
            </div>
            <!-- DAY OFF MESSAGE -->
            <div v-else class="day-off-message">
              <i class="fa-solid fa-moon"></i>
              <span>No time slots - Day off</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="handleCancel">
          <i class="fa-solid fa-arrow-left"></i> Cancel
        </button>
        <div class="primary-actions">
          <button
            class="btn btn-primary"
            @click="saveTimeSlots"
            :disabled="saving"
          >
            <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-save"></i>
            <span class="btn-text">{{ saving ? 'Saving...' : 'Update Time Slots' }}</span>
          </button>
          <button
            class="btn btn-warning"
            @click="resetToDefault"
            :disabled="saving"
          >
            <i class="fa-solid fa-undo"></i>
            <span class="btn-text">Reset Defaults</span>
          </button>
          <!-- Refresh Bookings Button -->
          <button
            class="btn btn-info"
            @click="fetchBookedSlots"
            :disabled="loadingBookings"
          >
            <i v-if="loadingBookings" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-rotate"></i>
            <span class="btn-text">{{ loadingBookings ? 'Refreshing...' : 'Refresh Bookings' }}</span>
          </button>
        </div>
      </div>

      <!-- Debug Info -->
      <div v-if="debugMode" class="debug-info">
        <h5>Debug Info:</h5>
        <p>Has Existing Slot: {{ hasExistingSlot }}</p>
        <p>Slot ID: {{ existingSlotId }}</p>
        <p>Total Days: {{ generatedDays.length }}</p>
        <p>First Day: {{ generatedDays[0]?.display }}</p>
        <p>Last Day: {{ generatedDays[6]?.display }}</p>
        <p>Booked Slots Count: {{ bookedSlots.length }}</p>
        <p>Loading Bookings: {{ loadingBookings }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/api/index.js';

export default {
  name: 'TimeSlots',
  props: {
    service: {
      type: Object,
      required: true
    },
    serviceId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      saving: false,
      errorMessage: '',
      successMessage: '',
      debugMode: true,
      loadingBookings: false,
      slotConfig: {
        slotLabel: '7-Day Rolling Schedule',
        isActive: true
      },
      generatedDays: [],
      dailySchedules: {},
      existingSlots: [],
      existingSlotId: null,
      bookedSlots: [],
      defaultTimeSlots: [
        { startTime: '09:00', endTime: '11:00', isAvailable: true, isBooked: false },
        { startTime: '11:00', endTime: '13:00', isAvailable: true, isBooked: false },
        { startTime: '14:00', endTime: '16:00', isAvailable: true, isBooked: false },
        { startTime: '16:00', endTime: '18:00', isAvailable: true, isBooked: false }
      ]
    };
  },
  computed: {
    currentDateRange() {
      if (this.generatedDays.length === 0) return '';
      const firstDay = this.generatedDays[0];
      const lastDay = this.generatedDays[this.generatedDays.length - 1];
      return `${firstDay.display} - ${lastDay.display}`;
    },
    hasExistingSlot() {
      return this.existingSlotId !== null;
    },
    serviceStatus() {
      if (!this.service) return 'draft';
      if (!this.service.slots || !Array.isArray(this.service.slots) || this.service.slots.length === 0) {
        return 'draft';
      }
      const hasRealSlots = this.service.slots.some(slot => {
        if (!slot) return false;
        if (slot.weeklySchedule && Array.isArray(slot.weeklySchedule)) {
          return slot.weeklySchedule.some(week => 
            week && week.timeSlots && Array.isArray(week.timeSlots) && week.timeSlots.length > 0
          );
        }
        return false;
      });
      return hasRealSlots ? 'active' : 'draft';
    }
  },
  async created() {
    await this.initializeTimeSlots();
    this.generate7DaySchedule();
    await this.fetchBookedSlots();
  },
  methods: {
    // ✅ FORMAT TIME TO HH:mm
    formatTime(timeStr) {
      if (!timeStr) return '09:00';
      const [h, m] = timeStr.split(':').map(Number);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    },
    // ✅ FORMAT FOR DISPLAY IN BOOKED SLOTS (12-HOUR)
    formatTime12(time24) {
      if (!time24) return '';
      const [h, m] = time24.split(':').map(Number);
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 || 12;
      return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
    },
    // ✅ UPDATE TIME SLOT
    updateTimeSlot(slot, field, newValue) {
      if (newValue && newValue.length === 5) { // HH:mm
        slot[field] = newValue;
      }
    },
    // Rest of your methods unchanged...
    async fetchBookedSlots() {
      this.loadingBookings = true;
      try {
        const response = await http.get(`/bookings/service/${this.serviceId}`);
        const rawBookings = response.data || [];
        this.bookedSlots = rawBookings
          .filter(booking => 
            booking && 
            booking.bookingDate && 
            booking.startTime && 
            booking.endTime &&
            booking.status !== 'cancelled'
          )
          .map(booking => {
            const dateObj = new Date(booking.bookingDate);
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const year = dateObj.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            const normalizeTime = (t) => t?.length > 5 ? t.substring(0, 5) : t;
            return {
              ...booking,
              date: formattedDate,
              startTime: this.formatTime(normalizeTime(booking.startTime)),
              endTime: this.formatTime(normalizeTime(booking.endTime))
            };
          });
        this.markBookedSlotsInDailySchedules();
      } catch (error) {
        console.error('❌ Failed to fetch booked slots:', error);
        this.setError('Failed to load booked appointments');
      } finally {
        this.loadingBookings = false;
      }
    },
    markBookedSlotsInDailySchedules() {
      this.generatedDays.forEach(day => {
        const dateKey = day.date;
        const backendDate = this.formatDateForBackend(dateKey);
        const bookingsForDay = this.bookedSlots.filter(b => b.date === backendDate);
        if (!this.dailySchedules[dateKey]) {
          this.dailySchedules[dateKey] = [];
        }
        bookingsForDay.forEach(booking => {
          const existingSlot = this.dailySchedules[dateKey].find(slot => 
            slot.startTime === booking.startTime && slot.endTime === booking.endTime
          );
          if (!existingSlot) {
            const newSlot = {
              startTime: booking.startTime,
              endTime: booking.endTime,
              isAvailable: false,
              isBooked: true,
              hasError: false,
              errorMessage: ''
            };
            this.dailySchedules[dateKey].push(newSlot);
          } else {
            existingSlot.isBooked = true;
            existingSlot.isAvailable = false;
          }
        });
      });
    },
    getBookingForSlot(date, startTime, endTime) {
      const backendDate = this.formatDateForBackend(date);
      return this.bookedSlots.find(booking => {
        return booking.date === backendDate &&
               booking.startTime === startTime &&
               booking.endTime === endTime;
      });
    },
    generate7DaySchedule() {
      this.generatedDays = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayOfWeek = this.getDayOfWeek(date);
        const displayDate = this.formatDateForDisplay(date);
        const dateString = this.formatDateForInput(date);
        this.generatedDays.push({
          date: dateString,
          dayKey: dayOfWeek.key,
          dayName: dayOfWeek.name,
          display: `${dayOfWeek.label}, ${displayDate}`,
          isToday: i === 0
        });
        if (!this.dailySchedules[dateString]) {
          this.dailySchedules[dateString] = [];
        }
      }
    },
    getDayOfWeek(date) {
      const days = [
        { key: 'sunday', name: 'sunday', label: 'Sunday' },
        { key: 'monday', name: 'monday', label: 'Monday' },
        { key: 'tuesday', name: 'tuesday', label: 'Tuesday' },
        { key: 'wednesday', name: 'wednesday', label: 'Wednesday' },
        { key: 'thursday', name: 'thursday', label: 'Thursday' },
        { key: 'friday', name: 'friday', label: 'Friday' },
        { key: 'saturday', name: 'saturday', label: 'Saturday' }
      ];
      return days[date.getDay()];
    },
    isWorkingAtDay(date) {
      return this.dailySchedules[date]?.length > 0;
    },
    addTimeSlot(date) {
      const slots = this.dailySchedules[date] || [];
      const lastSlot = slots.length > 0 ? slots[slots.length - 1] : null;
      let newStartTime = '09:00';
      let newEndTime = '11:00';
      if (lastSlot) {
        const [h, m] = lastSlot.endTime.split(':').map(Number);
        const newH = h + 1;
        newStartTime = `${newH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        newEndTime = `${(newH + 2).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      }
      const newSlot = { startTime: newStartTime, endTime: newEndTime, isAvailable: true, isBooked: false };
      this.dailySchedules[date] = [...slots, newSlot];
    },
    removeTimeSlot(date, slotIndex) {
      if (!this.dailySchedules[date] || slotIndex >= this.dailySchedules[date].length) return;
      this.dailySchedules[date].splice(slotIndex, 1);
    },
    toggleWorkingDay(date, isWorking) {
      if (isWorking) {
        if (!this.dailySchedules[date] || this.dailySchedules[date].length === 0) {
          this.dailySchedules[date] = JSON.parse(JSON.stringify(this.defaultTimeSlots));
        }
      } else {
        this.dailySchedules[date] = [];
      }
    },
    async initializeTimeSlots() {
      this.loading = true;
      try {
        const response = await http.get(`/services/${this.serviceId}/slots`);
        this.existingSlots = response.data || [];
        if (this.existingSlots.length > 0) {
          this.loadExistingSlotsIntoDays(this.existingSlots);
        } else {
          this.initializeEmptyDays();
        }
      } catch (error) {
        console.warn('Could not load existing slots:', error);
        this.initializeEmptyDays();
      } finally {
        this.loading = false;
      }
    },
    initializeEmptyDays() {
      this.dailySchedules = {};
    },
    loadExistingSlotsIntoDays(slots) {
      this.dailySchedules = {};
      slots.forEach(slot => {
        this.existingSlotId = slot.slotId;
        if (slot.weeklySchedule && Array.isArray(slot.weeklySchedule)) {
          slot.weeklySchedule.forEach(daySchedule => {
            if (daySchedule && daySchedule.date && Array.isArray(daySchedule.timeSlots)) {
              const dateString = this.parseBackendDate(daySchedule.date);
              if (this.isDateInNext7Days(dateString)) {
                this.dailySchedules[dateString] = daySchedule.timeSlots.map(timeSlot => ({
                  startTime: this.formatTime(timeSlot.startTime),
                  endTime: this.formatTime(timeSlot.endTime),
                  isAvailable: timeSlot.isAvailable !== false,
                  isBooked: false
                }));
              }
            }
          });
        }
      });
    },
    isDateInNext7Days(dateString) {
      const today = new Date();
      const targetDate = new Date(dateString);
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays < 7;
    },
    async saveTimeSlots() {
      if (!this.validateAllTimeSlots()) {
        this.setError('Please fix time slot errors before saving');
        return;
      }
      this.saving = true;
      this.errorMessage = '';
      try {
        const weeklySchedule = [];
        this.generatedDays.forEach(day => {
          const timeSlots = this.dailySchedules[day.date] || [];
          const isWorkingDay = timeSlots.length > 0;
          weeklySchedule.push({
            date: this.formatDateForBackend(day.date),
            day: day.dayKey,
            isWorkingDay: isWorkingDay,
            timeSlots: isWorkingDay ? timeSlots.map(slot => ({
              startTime: slot.startTime,
              endTime: slot.endTime,
              isAvailable: slot.isAvailable
            })) : []
          });
        });
        const slotData = {
          slotId: this.existingSlotId || `slot_${Date.now()}`,
          slotLabel: this.slotConfig.slotLabel,
          isActive: this.slotConfig.isActive,
          weeklySchedule: weeklySchedule
        };
        if (this.existingSlotId) {
          await http.put(`/services/${this.serviceId}/slots/${this.existingSlotId}`, slotData);
          this.setSuccess('Time slots updated successfully!');
        } else {
          const response = await http.post(`/services/${this.serviceId}/slots`, { slots: [slotData] });
          if (response.data?.length > 0) {
            this.existingSlotId = response.data[0].slotId;
          }
          this.setSuccess('Time slots created successfully!');
        }
        this.$emit('saved');
      } catch (error) {
        console.error('❌ Error saving schedule:', error);
        this.handleApiError(error, 'save time slots');
      } finally {
        this.saving = false;
      }
    },
    formatDateForInput(date) {
      if (typeof date === 'string') return date;
      return date.toISOString().split('T')[0];
    },
    formatDateForDisplay(date) {
      if (typeof date === 'string') date = new Date(date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },
    formatDateForBackend(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    parseBackendDate(dateString) {
      if (!dateString) return '';
      const parts = dateString.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      return '';
    },
    validateTimeSlot(timeSlot) {
      timeSlot.hasError = false;
      timeSlot.errorMessage = '';
      if (timeSlot.startTime && timeSlot.endTime) {
        if (timeSlot.startTime >= timeSlot.endTime) {
          timeSlot.hasError = true;
          timeSlot.errorMessage = 'End time must be after start time';
          return false;
        }
      }
      return true;
    },
    validateAllTimeSlots() {
      let isValid = true;
      this.generatedDays.forEach(day => {
        const timeSlots = this.dailySchedules[day.date];
        if (timeSlots) {
          timeSlots.forEach(slot => {
            if (!this.validateTimeSlot(slot)) isValid = false;
          });
        }
      });
      return isValid;
    },
    resetToDefault() {
      if (confirm('Are you sure you want to reset to default schedule? This will clear all your changes and set 4 default time slots for each working day.')) {
        this.initializeEmptyDays();
        this.generate7DaySchedule();
        const workingDays = ['monday', 'tuesday', 'wednesday', 'thursday'];
        this.generatedDays.forEach(day => {
          if (workingDays.includes(day.dayKey)) {
            this.dailySchedules[day.date] = JSON.parse(JSON.stringify(this.defaultTimeSlots));
          }
        });
        this.setSuccess('Reset to default schedule with 4 working days and 4 time slots each');
      }
    },
    handleApiError(error, operation) {
      console.error(`❌ Error during ${operation}:`, error);
      let errorMsg = `Failed to ${operation}`;
      if (error.response?.status === 400) {
        errorMsg = 'Invalid data format. Please check your time slots.';
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. Please try again.';
      } else if (error.response?.data?.message) {
        errorMsg = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(', ')
          : error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      this.setError(errorMsg);
    },
    handleCancel() {
      this.$emit('close');
    },
    setError(message) {
      this.errorMessage = message;
      setTimeout(() => { this.errorMessage = ''; }, 5000);
    },
    setSuccess(message) {
      this.successMessage = message;
      setTimeout(() => { this.successMessage = ''; }, 3000);
    }
  }
};
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.time-slots-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Inter", sans-serif;
  color: #1e293b;
}

/* ===== MESSAGES ===== */
.loading-state, .error-message, .success-message, .draft-alert {
  padding: 14px 16px;
  margin-bottom: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.loading-state { background: #f1f5f9; color: #64748b; }
.error-message { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
.success-message { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.draft-alert { background: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }
.close-error, .close-success {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  opacity: 0.7;
}
.close-error:hover, .close-success:hover { opacity: 1; }

/* ===== WEEKLY SCHEDULE ===== */
.weekly-schedule-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 24px;
}
.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}
.schedule-header h4 {
  font-size: 1.25rem;
  margin: 0;
  color: #0f172a;
}
.date-range {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}
.section-description {
  color: #64748b;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

/* ===== DAYS GRID ===== */
.days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 20px;
}
.day-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  background: #fff;
}
.day-card.working-day { border-color: #22c55e; background: #f0fdf4; }
.day-card.today { border-color: #3b82f6; background: #eff6ff; }
.day-card.day-off { opacity: 0.85; background: #f8fafc; }
.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 8px;
}
.day-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.day-label {
  font-weight: 600;
  font-size: 1.05rem;
}
.day-labels { display: flex; gap: 6px; }
.off-label {
  background: #f1f5f9;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}
.today-label {
  background: #3b82f6;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}
.day-off-message {
  text-align: center;
  color: #94a3b8;
  padding: 20px 0;
  font-style: italic;
}

/* ===== COMPACT TIME SLOT LAYOUT ===== */
.time-slots-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.time-slot-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
  transition: all 0.2s ease;
}
.time-slot-item.booked-slot {
  background: #fef2f2;
  border-color: #fecaca;
}
.time-slot-item.available-slot {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.time-slot-item.unavailable-slot {
  background: #f8fafc;
  border-color: #e2e8f0;
}
.time-slot-item.has-error {
  border-color: #f87171;
  background: #fff1f1;
}

/* COMPACT SINGLE LINE CONTAINER */
.slot-compact-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  flex-wrap: nowrap;
}

/* TIME RANGE COMPACT - ENSURE TIMES ARE ALWAYS VISIBLE */
.time-range-compact {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 160px;
}
.slot-icon {
  color: #64748b;
  font-size: 0.9rem;
  flex-shrink: 0;
}
.booked-slot .slot-icon {
  color: #dc2626;
}
.available-slot .slot-icon {
  color: #22c55e;
}
.unavailable-slot .slot-icon {
  color: #94a3b8;
}
.booked-time-text {
  font-weight: 600;
  color: #1e40af;
  font-size: 0.9rem;
  white-space: nowrap;
  min-width: 120px;
}
.edit-time-range {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
  min-width: 140px;
}
.time-input {
  width: 75px;
  min-width: 75px;
  padding: 6px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
  font-family: 'Inter', monospace;
  color: #1e40af;
  background: white;
  box-sizing: border-box;
}
.time-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
}
.time-separator {
  color: #64748b;
  font-size: 0.9rem;
  flex-shrink: 0;
  padding: 0 2px;
  white-space: nowrap;
}

/* STATUS INDICATOR COMPACT */
.status-indicator-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.booked-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}
.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}
.booked-dot {
  background: #dc2626;
}
.customer-compact {
  background: #fee2e2;
  color: #dc2626;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

/* SIMPLE TOGGLE SWITCH (NO TEXT - COLOR ONLY) */
.toggle-container {
  flex-shrink: 0;
}
.toggle-switch {
  display: inline-block;
  position: relative;
  width: 44px;
  height: 24px;
  cursor: pointer;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ef4444;
  transition: .3s;
  border-radius: 12px;
}
.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}
.toggle-switch input:checked + .toggle-slider {
  background-color: #22c55e;
}
.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

/* ACTIONS COMPACT */
.actions-compact {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.error-indicator {
  color: #dc2626;
  font-size: 0.85rem;
  cursor: help;
}
.remove-btn-compact {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  flex-shrink: 0;
  transition: all 0.2s ease;
  padding: 0;
}
.remove-btn-compact:hover:not(:disabled) {
  background: #fecaca;
  transform: scale(1.05);
}
.remove-btn-compact:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

/* ===== ADD SLOT BUTTON COMPACT ===== */
.btn-add-slot-compact {
  width: 100%;
  padding: 8px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  color: #475569;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 8px;
  transition: all 0.2s ease;
}
.btn-add-slot-compact:hover:not(:disabled) {
  background: #e2e8f0;
  border-color: #94a3b8;
}

/* ===== ACTION BUTTONS ===== */
.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
}
.primary-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-size: 0.95rem;
  min-height: 42px;
  transition: all 0.2s ease;
}
.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}
.btn-secondary:hover:not(:disabled) { background: #e2e8f0; }
.btn-primary {
  background: #22c55e;
  color: white;
}
.btn-primary:hover:not(:disabled) { background: #16a34a; }
.btn-warning {
  background: #f59e0b;
  color: white;
}
.btn-warning:hover:not(:disabled) { background: #d97706; }
.btn-info {
  background: #3b82f6;
  color: white;
}
.btn-info:hover:not(:disabled) { background: #2563eb; }
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== RESPONSIVE DESIGN - FIX MOBILE BREAKING ===== */

/* Desktop (≥768px) - Ensure everything fits */
@media (min-width: 768px) {
  .slot-compact-line {
    gap: 12px;
  }
  .time-range-compact {
    min-width: 170px;
  }
  .time-input {
    width: 80px;
    min-width: 80px;
  }
  .booked-time-text {
    min-width: 130px;
  }
}

/* Tablet (480px-768px) - Adjust for medium screens */
@media (max-width: 768px) and (min-width: 480px) {
  .days-grid {
    grid-template-columns: 1fr;
  }
  .slot-compact-line {
    gap: 8px;
  }
  .time-range-compact {
    min-width: 160px;
  }
  .time-input {
    width: 75px;
    min-width: 75px;
    padding: 5px 6px;
    font-size: 0.85rem;
  }
  .booked-time-text {
    font-size: 0.85rem;
    min-width: 120px;
  }
}

/* Mobile (<480px) - PREVENT BREAKING, KEEP TIMES VISIBLE */
@media (max-width: 480px) {
  .time-slots-container {
    padding: 12px;
  }
  
  .weekly-schedule-section {
    padding: 16px;
  }
  
  .days-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .day-card {
    padding: 14px;
  }
  
  /* CRITICAL: PREVENT BREAKING, KEEP SINGLE LINE */
  .slot-compact-line {
    gap: 6px;
    align-items: center;
    min-width: 100%;
  }
  
  /* ENSURE TIME INPUTS DON'T BREAK */
  .time-range-compact {
    min-width: 150px;
    gap: 4px;
  }
  
  .edit-time-range {
    min-width: 140px;
    gap: 2px;
  }
  
  .time-input {
    width: 68px;
    min-width: 68px;
    padding: 5px 4px;
    font-size: 0.85rem;
  }
  
  /* Ensure "12:00" is fully visible */
  .time-input::-webkit-datetime-edit-hour-field,
  .time-input::-webkit-datetime-edit-minute-field {
    padding: 0;
    margin: 0;
  }
  
  .time-input::-webkit-datetime-edit {
    padding: 0;
  }
  
  .booked-time-text {
    font-size: 0.85rem;
    min-width: 110px;
  }
  
  /* Smaller toggle without text */
  .toggle-switch {
    width: 40px;
    height: 22px;
  }
  
  .toggle-slider:before {
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
  }
  
  .toggle-switch input:checked + .toggle-slider:before {
    transform: translateX(18px);
  }
  
  .customer-compact {
    width: 22px;
    height: 22px;
    font-size: 0.75rem;
  }
  
  .actions-compact {
    gap: 4px;
  }
  
  .remove-btn-compact {
    width: 22px;
    height: 22px;
    font-size: 0.75rem;
  }
}

/* Extra Small Mobile (<360px) - STILL NO BREAKING */
@media (max-width: 360px) {
  /* FORCE SINGLE LINE - NO BREAKING */
  .slot-compact-line {
    gap: 4px;
  }
  
  .time-range-compact {
    min-width: 140px;
  }
  
  .time-input {
    width: 65px;
    min-width: 65px;
    padding: 4px 3px;
    font-size: 0.8rem;
  }
  
  .booked-time-text {
    font-size: 0.8rem;
    min-width: 105px;
  }
  
  .toggle-switch {
    width: 38px;
    height: 20px;
  }
  
  .toggle-slider:before {
    height: 14px;
    width: 14px;
  }
  
  .toggle-switch input:checked + .toggle-slider:before {
    transform: translateX(18px);
  }
}

/* ENSURE NO BREAKING - CRITICAL RULES */
.slot-compact-line {
  display: flex !important;
  flex-wrap: nowrap !important;
  white-space: nowrap !important;
  overflow: visible !important;
}

.time-range-compact,
.edit-time-range {
  flex-shrink: 0 !important;
  overflow: visible !important;
}

/* Prevent time inputs from being cut off */
.time-input {
  overflow: visible !important;
  text-overflow: clip !important;
}

/* For Firefox - ensure time input shows full value */
.time-input[type="time"] {
  -moz-appearance: textfield;
}

/* Hover effects */
.time-slot-item:hover {
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transform: translateY(-1px);
}

/* Tooltip for toggle to show availability state */
.toggle-switch[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 100;
  margin-bottom: 5px;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .slot-compact-line,
  .time-slot-item,
  .remove-btn-compact,
  .toggle-slider,
  .toggle-slider:before {
    transition: none;
  }
}
</style>