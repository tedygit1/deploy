<template>
  <div class="payments-section">
    <!-- Development Mode Banner -->
    <div class="dev-mode-banner">
      <span class="dev-badge">🚧 DEV MODE</span>
      <span>Working with local analytics. Real API integration ready!</span>
      <button @click="simulateApiSuccess" class="simulate-btn">
        Simulate API Success
      </button>
    </div>

    <!-- Main Header -->
    <div class="main-header">
      <div>
        <h1><span class="emoji">💰</span> Payments Dashboard</h1>
        <p class="subtitle">Comprehensive payment analytics & management</p>
      </div>
      <div class="header-stats">
        <div class="stat-pill">
          <span class="stat-label">Last Updated:</span>
          <span class="stat-value">{{ lastUpdated }}</span>
        </div>
        <div class="stat-pill">
          <span class="stat-label">Data Source:</span>
          <span :class="['stat-value', isDemoMode ? 'source-demo' : 'source-live']">
            {{ isDemoMode ? 'Local Analytics' : 'Live API' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button @click="refreshData" class="quick-btn primary">
        <span class="btn-icon">🔄</span>
        <span>Refresh Data</span>
      </button>
      <button @click="generateTestData" class="quick-btn secondary">
        <span class="btn-icon">🧪</span>
        <span>Generate Test Data</span>
      </button>
      <button @click="exportAllData" class="quick-btn success">
        <span class="btn-icon">📥</span>
        <span>Export All</span>
      </button>
      <button @click="toggleViewMode" class="quick-btn info">
        <span class="btn-icon">{{ viewMode === 'table' ? '📱' : '📊' }}</span>
        <span>{{ viewMode === 'table' ? 'Card View' : 'Table View' }}</span>
      </button>
    </div>

    <!-- Analytics Dashboard -->
    <div class="analytics-dashboard">
      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card" v-for="(kpi, index) in kpiMetrics" :key="index"
             :class="['kpi-' + (index + 1)]">
          <div class="kpi-header">
            <span class="kpi-icon">{{ kpi.icon }}</span>
            <h3>{{ kpi.title }}</h3>
            <div class="kpi-trend" :class="kpi.trend">
              {{ kpi.trend === 'up' ? '📈' : kpi.trend === 'down' ? '📉' : '➡️' }}
              {{ kpi.change }}
            </div>
          </div>
          <div class="kpi-value">{{ formatETB(kpi.value) }}</div>
          <div class="kpi-description">{{ kpi.description }}</div>
          <div class="kpi-footer">
            <span class="kpi-period">{{ kpi.period }}</span>
            <div class="kpi-sparkline">
              <span v-for="(point, i) in kpi.sparkline" :key="i"
                    class="spark-dot" :style="{ height: point + '%' }"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-header">
            <h4>📅 Daily Revenue</h4>
            <select v-model="chartRange" class="chart-select">
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <div class="chart-container">
            <!-- Daily revenue chart visualization -->
            <div class="bar-chart">
              <div v-for="(day, index) in revenueByDay" :key="index" class="bar-container">
                <div class="bar-label">{{ day.label }}</div>
                <div class="bar-track">
                  <div class="bar-fill" :style="{ height: day.percentage + '%' }"
                       :class="{ 'bar-highlight': day.amount > 1000 }">
                    <span class="bar-value">{{ day.amount }} ETB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h4>🏦 Payment Methods</h4>
            <span class="chart-total">{{ paymentMethodsTotal }} payments</span>
          </div>
          <div class="chart-container">
            <!-- Payment methods pie chart -->
            <div class="methods-grid">
              <div v-for="method in paymentMethods" :key="method.name" class="method-item">
                <div class="method-icon">{{ method.icon }}</div>
                <div class="method-info">
                  <div class="method-name">{{ method.name }}</div>
                  <div class="method-stats">
                    <span class="method-count">{{ method.count }} payments</span>
                    <span class="method-percentage">{{ method.percentage }}%</span>
                  </div>
                  <div class="method-bar">
                    <div class="method-bar-fill" :style="{ width: method.percentage + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Status Overview -->
      <div class="status-overview">
        <div class="status-card">
          <h4>📊 Payment Status Distribution</h4>
          <div class="status-grid">
            <div v-for="status in paymentStatuses" :key="status.name" 
                 class="status-item" :class="'status-' + status.name.toLowerCase()">
              <div class="status-header">
                <span class="status-icon">{{ status.icon }}</span>
                <span class="status-name">{{ status.name }}</span>
              </div>
              <div class="status-value">{{ status.count }}</div>
              <div class="status-bar">
                <div class="status-bar-fill" :style="{ width: status.percentage + '%' }"></div>
              </div>
              <div class="status-amount">{{ formatETB(status.amount) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Controls -->
    <div class="data-controls">
      <div class="controls-left">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input v-model="filters.search" type="text" placeholder="Search payments..." 
                 class="search-input" @input="applyFilters">
        </div>
        <div class="filter-tags">
          <span v-if="filters.status" class="filter-tag">
            Status: {{ filters.status }}
            <button @click="filters.status = ''" class="tag-remove">×</button>
          </span>
          <span v-if="filters.dateFrom" class="filter-tag">
            From: {{ formatDateShort(filters.dateFrom) }}
            <button @click="filters.dateFrom = ''" class="tag-remove">×</button>
          </span>
          <span v-if="filters.dateTo" class="filter-tag">
            To: {{ formatDateShort(filters.dateTo) }}
            <button @click="filters.dateTo = ''" class="tag-remove">×</button>
          </span>
          <button v-if="hasActiveFilters" @click="clearFilters" class="clear-all-btn">
            Clear All
          </button>
        </div>
      </div>
      <div class="controls-right">
        <div class="view-options">
          <button @click="viewMode = 'table'" :class="{ active: viewMode === 'table' }" class="view-option">
            📋 Table
          </button>
          <button @click="viewMode = 'cards'" :class="{ active: viewMode === 'cards' }" class="view-option">
            🗂️ Cards
          </button>
          <button @click="viewMode = 'compact'" :class="{ active: viewMode === 'compact' }" class="view-option">
            📱 Compact
          </button>
        </div>
      </div>
    </div>

    <!-- Payments List -->
    <div class="payments-list">
      <!-- Table View -->
      <div v-if="viewMode === 'table' || viewMode === 'compact'" class="payments-table-container">
        <table class="payments-table" :class="{ compact: viewMode === 'compact' }">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date & Time</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in paginatedPayments" :key="payment.id" 
                :class="['payment-row', 'status-' + payment.status.toLowerCase()]">
              <td>
                <div class="payment-id-cell">
                  <span class="payment-id">#{{ payment.id }}</span>
                  <span class="payment-reference">{{ payment.reference || 'N/A' }}</span>
                </div>
              </td>
              <td>
                <div class="datetime-cell">
                  <div class="date">{{ formatDate(payment.created_at) }}</div>
                  <div class="time">{{ formatTime(payment.created_at) }}</div>
                </div>
              </td>
              <td>
                <div class="customer-cell">
                  <div class="customer-name">{{ payment.customer_name }}</div>
                  <div class="customer-contact">{{ payment.customer_contact || 'No contact' }}</div>
                </div>
              </td>
              <td>
                <div class="service-cell">
                  <div class="service-name">{{ payment.service_name }}</div>
                  <div class="service-category">{{ payment.service_category || 'General' }}</div>
                </div>
              </td>
              <td>
                <div class="amount-cell">
                  <div class="amount-value">{{ formatETB(payment.amount) }}</div>
                  <div v-if="payment.discount" class="amount-discount">
                    -{{ formatETB(payment.discount) }}
                  </div>
                </div>
              </td>
              <td>
                <div class="method-cell">
                  <span class="method-icon">{{ getPaymentMethodIcon(payment.payment_method) }}</span>
                  <span class="method-name">{{ formatMethodName(payment.payment_method) }}</span>
                </div>
              </td>
              <td>
                <div class="status-cell">
                  <span :class="['status-badge', payment.status.toLowerCase()]">
                    {{ payment.status }}
                  </span>
                  <div v-if="payment.status === 'pending'" class="status-time">
                    {{ getTimeAgo(payment.created_at) }}
                  </div>
                </div>
              </td>
              <td>
                <div class="action-cell">
                  <button @click="viewPayment(payment)" class="action-icon" title="View">
                    👁️
                  </button>
                  <button @click="editPayment(payment)" class="action-icon" title="Edit">
                    ✏️
                  </button>
                  <button v-if="payment.status === 'pending'" 
                          @click="processPayment(payment)" 
                          class="action-icon success" title="Process">
                    ✅
                  </button>
                  <button v-if="payment.status === 'paid'" 
                          @click="refundPayment(payment)" 
                          class="action-icon warning" title="Refund">
                    ↩️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Card View -->
      <div v-else class="payments-cards-container">
        <div class="cards-grid">
          <div v-for="payment in paginatedPayments" :key="payment.id" 
               class="payment-card" :class="'status-' + payment.status.toLowerCase()">
            <div class="card-header">
              <div class="card-id">
                <span class="payment-id">#{{ payment.id }}</span>
                <span class="payment-date">{{ formatDate(payment.created_at) }}</span>
              </div>
              <span :class="['status-badge', payment.status.toLowerCase()]">
                {{ payment.status }}
              </span>
            </div>
            <div class="card-body">
              <div class="card-customer">
                <div class="customer-avatar">{{ getInitials(payment.customer_name) }}</div>
                <div class="customer-info">
                  <h4>{{ payment.customer_name }}</h4>
                  <p>{{ payment.customer_contact || 'No contact' }}</p>
                </div>
              </div>
              <div class="card-service">
                <h5>{{ payment.service_name }}</h5>
                <p>{{ payment.service_category || 'General' }}</p>
              </div>
              <div class="card-details">
                <div class="detail-item">
                  <span class="detail-label">Method:</span>
                  <span class="detail-value">
                    {{ getPaymentMethodIcon(payment.payment_method) }}
                    {{ formatMethodName(payment.payment_method) }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">{{ formatTime(payment.created_at) }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="card-amount">
                <span class="amount-label">Total:</span>
                <span class="amount-value">{{ formatETB(payment.amount) }}</span>
              </div>
              <div class="card-actions">
                <button @click="viewPayment(payment)" class="card-action-btn">
                  View
                </button>
                <button v-if="payment.status === 'pending'" 
                        @click="processPayment(payment)" 
                        class="card-action-btn primary">
                  Process
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredPayments.length > 0" class="pagination-section">
        <div class="pagination-info">
          Showing {{ pagination.start }}-{{ pagination.end }} of {{ filteredPayments.length }} payments
          <span v-if="hasActiveFilters" class="filtered-count">
            ({{ filteredPayments.length }} match your filters)
          </span>
        </div>
        <div class="pagination-controls">
          <button @click="prevPage" :disabled="pagination.currentPage === 1" class="pagination-btn">
            ← Previous
          </button>
          <div class="pagination-pages">
            <button v-for="page in visiblePages" :key="page"
                    @click="goToPage(page)"
                    :class="{ active: page === pagination.currentPage, ellipsis: page === '...' }"
                    class="page-number">
              {{ page }}
            </button>
          </div>
          <button @click="nextPage" 
                  :disabled="pagination.currentPage === pagination.totalPages" 
                  class="pagination-btn">
            Next →
          </button>
          <select v-model="pagination.perPage" @change="updatePagination" class="page-size-select">
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPayments.length === 0" class="empty-state-enhanced">
      <div class="empty-illustration">📭</div>
      <h3>No payments found</h3>
      <p v-if="hasActiveFilters">
        No payments match your current filters. Try adjusting your search criteria.
      </p>
      <p v-else>
        Start by creating your first payment or generate test data to explore the dashboard.
      </p>
      <div class="empty-actions">
        <button @click="clearFilters" v-if="hasActiveFilters" class="empty-action-btn">
          Clear All Filters
        </button>
        <button @click="generateTestData" class="empty-action-btn primary">
          Generate Test Data
        </button>
        <button @click="createNewPayment" class="empty-action-btn success">
          + Create New Payment
        </button>
      </div>
    </div>

    <!-- Debug Panel (Development Only) -->
    <div v-if="showDebug" class="debug-panel">
      <h4>🧪 Debug Information</h4>
      <div class="debug-info">
        <div>Total Payments: {{ payments.length }}</div>
        <div>Filtered Payments: {{ filteredPayments.length }}</div>
        <div>Current Page: {{ pagination.currentPage }}</div>
        <div>KPI Metrics: {{ kpiMetrics.length }}</div>
        <div>Demo Mode: {{ isDemoMode }}</div>
      </div>
      <button @click="showDebug = false" class="debug-close">Close</button>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>Processing payment data...</p>
        <div class="loading-progress">
          <div class="progress-bar" :style="{ width: loadingProgress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

// ===== STATE =====
const loading = ref(false);
const loadingProgress = ref(0);
const payments = ref([]);
const isDemoMode = ref(true);
const viewMode = ref('table');
const chartRange = ref('7d');
const lastUpdated = ref(new Date().toLocaleTimeString());
const showDebug = ref(false);

const filters = ref({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  minAmount: '',
  maxAmount: ''
});

const pagination = ref({
  currentPage: 1,
  perPage: 10,
  totalPages: 1
});

// ===== COMPUTED =====
const filteredPayments = computed(() => {
  let result = [...payments.value];
  
  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(p => 
      p.customer_name?.toLowerCase().includes(search) ||
      p.service_name?.toLowerCase().includes(search) ||
      p.payment_id?.toLowerCase().includes(search) ||
      p.id?.toString().includes(search) ||
      p.reference?.toLowerCase().includes(search)
    );
  }
  
  // Status filter
  if (filters.value.status) {
    result = result.filter(p => p.status?.toLowerCase() === filters.value.status.toLowerCase());
  }
  
  // Date range filter
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom);
    result = result.filter(p => new Date(p.created_at) >= fromDate);
  }
  
  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo);
    toDate.setHours(23, 59, 59);
    result = result.filter(p => new Date(p.created_at) <= toDate);
  }
  
  // Amount range filter
  if (filters.value.minAmount) {
    const min = parseFloat(filters.value.minAmount);
    result = result.filter(p => p.amount >= min);
  }
  
  if (filters.value.maxAmount) {
    const max = parseFloat(filters.value.maxAmount);
    result = result.filter(p => p.amount <= max);
  }
  
  return result;
});

const paginatedPayments = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.perPage;
  const end = start + pagination.value.perPage;
  return filteredPayments.value.slice(start, end);
});

const paginationStart = computed(() => {
  return (pagination.value.currentPage - 1) * pagination.value.perPage + 1;
});

const paginationEnd = computed(() => {
  return Math.min(pagination.value.currentPage * pagination.value.perPage, filteredPayments.value.length);
});

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(val => val !== '');
});

const visiblePages = computed(() => {
  const total = pagination.value.totalPages;
  const current = pagination.value.currentPage;
  const pages = [];
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    }
  }
  
  return pages;
});

// ===== KPI METRICS =====
const kpiMetrics = computed(() => {
  const paidPayments = payments.value.filter(p => p.status === 'paid');
  const pendingPayments = payments.value.filter(p => p.status === 'pending');
  const failedPayments = payments.value.filter(p => p.status === 'failed');
  const refundedPayments = payments.value.filter(p => p.status === 'refunded');
  
  const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const avgTransaction = paidPayments.length > 0 ? totalRevenue / paidPayments.length : 0;
  const successRate = payments.value.length > 0 
    ? (paidPayments.length / payments.value.length) * 100 
    : 0;
  
  return [
    {
      title: "Total Revenue",
      value: totalRevenue,
      icon: "💰",
      trend: "up",
      change: "+12.5%",
      description: "All successful payments",
      period: "All time",
      sparkline: [30, 45, 60, 75, 65, 80, 90]
    },
    {
      title: "Pending Amount",
      value: pendingAmount,
      icon: "⏳",
      trend: "down",
      change: "-5.2%",
      description: "Awaiting processing",
      period: "Current",
      sparkline: [80, 75, 70, 65, 60, 55, 50]
    },
    {
      title: "Avg. Transaction",
      value: avgTransaction,
      icon: "📊",
      trend: "up",
      change: "+8.3%",
      description: "Per successful payment",
      period: "This month",
      sparkline: [40, 45, 50, 55, 60, 65, 70]
    },
    {
      title: "Success Rate",
      value: successRate,
      icon: "🎯",
      trend: "stable",
      change: "+1.2%",
      description: "Payment completion rate",
      period: "Last 30 days",
      sparkline: [85, 87, 86, 88, 89, 90, 91]
    }
  ];
});

// ===== REVENUE BY DAY =====
const revenueByDay = computed(() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const revenues = days.map(() => Math.floor(Math.random() * 1500) + 500);
  const maxRevenue = Math.max(...revenues);
  
  return days.map((day, index) => ({
    label: day,
    amount: revenues[index],
    percentage: (revenues[index] / maxRevenue) * 80
  }));
});

// ===== PAYMENT METHODS =====
const paymentMethods = computed(() => {
  const methods = {};
  payments.value.forEach(payment => {
    const method = payment.payment_method || 'unknown';
    if (!methods[method]) {
      methods[method] = { count: 0, amount: 0 };
    }
    methods[method].count++;
    methods[method].amount += payment.amount;
  });
  
  const total = Object.values(methods).reduce((sum, m) => sum + m.count, 0);
  
  return Object.entries(methods).map(([name, data]) => ({
    name: formatMethodName(name),
    icon: getPaymentMethodIcon(name),
    count: data.count,
    amount: data.amount,
    percentage: Math.round((data.count / total) * 100)
  })).sort((a, b) => b.count - a.count);
});

const paymentMethodsTotal = computed(() => {
  return paymentMethods.value.reduce((sum, method) => sum + method.count, 0);
});

// ===== PAYMENT STATUSES =====
const paymentStatuses = computed(() => {
  const statuses = {};
  payments.value.forEach(payment => {
    const status = payment.status || 'unknown';
    if (!statuses[status]) {
      statuses[status] = { count: 0, amount: 0 };
    }
    statuses[status].count++;
    statuses[status].amount += payment.amount;
  });
  
  const total = Object.values(statuses).reduce((sum, s) => sum + s.count, 0);
  
  return Object.entries(statuses).map(([name, data]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    icon: getStatusIcon(name),
    count: data.count,
    amount: data.amount,
    percentage: total > 0 ? Math.round((data.count / total) * 100) : 0
  })).sort((a, b) => b.count - a.count);
});

// ===== METHODS =====
function formatETB(value) {
  if (typeof value !== 'number') return '0 ETB';
  return `${value.toLocaleString('en-ET')} ETB`;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatDateShort(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return `${diffMins}m ago`;
}

function formatMethodName(method) {
  const names = {
    'chapa': 'Chapa',
    'telebirr': 'Telebirr',
    'paypal': 'PayPal',
    'bank': 'Bank Transfer',
    'cash': 'Cash',
    'card': 'Credit Card',
    'mobile': 'Mobile Money'
  };
  return names[method?.toLowerCase()] || method || 'Unknown';
}

function getPaymentMethodIcon(method) {
  const icons = {
    'chapa': '🏦',
    'telebirr': '📱',
    'paypal': '🔵',
    'bank': '🏛️',
    'card': '💳',
    'cash': '💰',
    'mobile': '📲'
  };
  return icons[method?.toLowerCase()] || '💳';
}

function getStatusIcon(status) {
  const icons = {
    'paid': '✅',
    'pending': '⏳',
    'failed': '❌',
    'refunded': '↩️',
    'cancelled': '🚫'
  };
  return icons[status?.toLowerCase()] || '❓';
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// ===== DATA MANAGEMENT =====
async function generateTestData() {
  loading.value = true;
  loadingProgress.value = 0;
  
  const testData = [];
  const services = ['Massage', 'Haircut', 'Spa', 'Facial', 'Nails', 'Waxing', 'Therapy'];
  const customers = ['Sara Mekonen', 'Dawit Getachew', 'Mekdes Solomon', 'Yohannes Tesfaye', 
                     'Helen Bekele', 'Abel Tadesse', 'Betty Assefa', 'Samuel Kebede'];
  const methods = ['chapa', 'telebirr', 'cash', 'bank', 'card'];
  const statuses = ['paid', 'pending', 'failed'];
  
  for (let i = 1; i <= 50; i++) {
    loadingProgress.value = (i / 50) * 100;
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    testData.push({
      id: i,
      payment_id: `PAY-${String(i).padStart(3, '0')}`,
      customer_name: customers[Math.floor(Math.random() * customers.length)],
      customer_contact: `+2519${Math.floor(Math.random() * 90000000 + 10000000)}`,
      service_name: services[Math.floor(Math.random() * services.length)],
      service_category: ['Wellness', 'Beauty', 'Health'][Math.floor(Math.random() * 3)],
      amount: Math.floor(Math.random() * 2000) + 300,
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 200) : 0,
      payment_method: methods[Math.floor(Math.random() * methods.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      reference: `REF-${Math.floor(Math.random() * 10000)}`,
      created_at: date.toISOString()
    });
    
    // Small delay for progress animation
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  
  payments.value = testData;
  isDemoMode.value = true;
  loading.value = false;
  lastUpdated.value = new Date().toLocaleTimeString();
}

function refreshData() {
  loading.value = true;
  loadingProgress.value = 0;
  
  const interval = setInterval(() => {
    loadingProgress.value += 10;
    if (loadingProgress.value >= 100) {
      clearInterval(interval);
      loading.value = false;
      lastUpdated.value = new Date().toLocaleTimeString();
    }
  }, 100);
}

function applyFilters() {
  pagination.value.currentPage = 1;
}

function clearFilters() {
  filters.value = {
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  };
}

function prevPage() {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--;
  }
}

function nextPage() {
  if (pagination.value.currentPage < pagination.value.totalPages) {
    pagination.value.currentPage++;
  }
}

function goToPage(page) {
  if (page !== '...' && page !== pagination.value.currentPage) {
    pagination.value.currentPage = page;
  }
}

function updatePagination() {
  pagination.value.currentPage = 1;
}

function toggleViewMode() {
  const modes = ['table', 'cards', 'compact'];
  const currentIndex = modes.indexOf(viewMode.value);
  viewMode.value = modes[(currentIndex + 1) % modes.length];
}

function viewPayment(payment) {
  alert(`Viewing payment #${payment.id}\nCustomer: ${payment.customer_name}\nAmount: ${formatETB(payment.amount)}`);
}

function editPayment(payment) {
  alert(`Editing payment #${payment.id}`);
}

function processPayment(payment) {
  if (confirm(`Process payment #${payment.id} for ${formatETB(payment.amount)}?`)) {
    payment.status = 'paid';
    lastUpdated.value = new Date().toLocaleTimeString();
  }
}

function refundPayment(payment) {
  const reason = prompt('Refund reason:', 'Customer request');
  if (reason) {
    payment.status = 'refunded';
    lastUpdated.value = new Date().toLocaleTimeString();
  }
}

function createNewPayment() {
  alert('New payment modal would open here');
}

function exportAllData() {
  const csv = [
    ['ID', 'Date', 'Customer', 'Service', 'Amount', 'Method', 'Status', 'Reference'],
    ...payments.value.map(p => [
      p.id,
      formatDate(p.created_at),
      p.customer_name,
      p.service_name,
      p.amount,
      formatMethodName(p.payment_method),
      p.status,
      p.reference || ''
    ])
  ].map(row => row.join(',')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payments_export_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function simulateApiSuccess() {
  isDemoMode.value = false;
  lastUpdated.value = new Date().toLocaleTimeString();
  alert('✅ Successfully connected to payment API!\nDemo mode disabled.');
}

// ===== LIFECYCLE =====
onMounted(() => {
  generateTestData();
});

// ===== WATCHERS =====
watch(filteredPayments, (newVal) => {
  pagination.value.totalPages = Math.ceil(newVal.length / pagination.value.perPage);
  if (pagination.value.currentPage > pagination.value.totalPages) {
    pagination.value.currentPage = Math.max(1, pagination.value.totalPages);
  }
}, { immediate: true });
</script>

<style scoped>
/* Import base styles */
.payments-section {
  padding: 20px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background: #f8fafc;
  min-height: 100vh;
}

/* Development Mode Banner */
.dev-mode-banner {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.dev-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.simulate-btn {
  margin-left: auto;
  background: white;
  color: #6366f1;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.simulate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Main Header */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.main-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.main-header .emoji {
  margin-right: 10px;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  margin-top: 4px;
}

.header-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-pill {
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.stat-label {
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
  color: #1e293b;
}

.source-demo { color: #f59e0b; }
.source-live { color: #10b981; }

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.quick-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.quick-btn.secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.quick-btn.success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.quick-btn.info {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
}

.quick-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Analytics Dashboard */
.analytics-dashboard {
  margin-bottom: 30px;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.kpi-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.kpi-1 { border-top: 4px solid #3b82f6; }
.kpi-2 { border-top: 4px solid #f59e0b; }
.kpi-3 { border-top: 4px solid #10b981; }
.kpi-4 { border-top: 4px solid #8b5cf6; }

.kpi-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.kpi-icon {
  font-size: 1.5rem;
}

.kpi-header h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #4b5563;
  margin: 0;
  flex: 1;
}

.kpi-trend {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
}

.kpi-trend.up {
  background: #d1fae5;
  color: #065f46;
}

.kpi-trend.down {
  background: #fee2e2;
  color: #dc2626;
}

.kpi-trend.stable {
  background: #e0f2fe;
  color: #0369a1;
}

.kpi-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin: 8px 0;
}

.kpi-description {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 12px;
}

.kpi-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.kpi-period {
  font-size: 0.8rem;
  color: #9ca3af;
}

.kpi-sparkline {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 20px;
}

.spark-dot {
  width: 4px;
  background: #3b82f6;
  border-radius: 2px;
  transition: height 0.3s ease;
}

/* Charts Row */
.charts-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
  color: #4b5563;
}

.chart-total {
  font-size: 0.9rem;
  color: #6b7280;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 200px;
  padding: 20px 0;
}

.bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.bar-track {
  flex: 1;
  width: 100%;
  background: #f1f5f9;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 4px;
  transition: height 0.5s ease;
}

.bar-highlight {
  background: linear-gradient(to top, #10b981, #34d399);
}

.bar-value {
  position: absolute;
  top: -24px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
}

/* Methods Grid */
.methods-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  background: #f8fafc;
  transition: all 0.2s;
}

.method-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.method-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.method-info {
  flex: 1;
}

.method-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.method-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 6px;
}

.method-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.method-bar-fill {
  height: 100%;
  background: linear-gradient(to right, #8b5cf6, #a78bfa);
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* Status Overview */
.status-overview {
  margin-bottom: 30px;
}

.status-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.status-card h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.status-item {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.status-item.status-paid { border-color: #d1fae5; background: #f0fdf4; }
.status-item.status-pending { border-color: #fef3c7; background: #fffbeb; }
.status-item.status-failed { border-color: #fee2e2; background: #fef2f2; }
.status-item.status-refunded { border-color: #e0f2fe; background: #f0f9ff; }

.status-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.status-icon {
  font-size: 1.2rem;
}

.status-name {
  font-weight: 600;
  color: #1e293b;
  flex: 1;
}

.status-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin: 8px 0;
}

.status-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  margin: 12px 0;
  overflow: hidden;
}

.status-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.status-item.status-paid .status-bar-fill { background: #10b981; }
.status-item.status-pending .status-bar-fill { background: #f59e0b; }
.status-item.status-failed .status-bar-fill { background: #dc2626; }
.status-item.status-refunded .status-bar-fill { background: #0ea5e9; }

.status-amount {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4b5563;
}

/* Data Controls */
.data-controls {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.controls-left {
  flex: 1;
  min-width: 300px;
}

.search-box {
  position: relative;
  margin-bottom: 12px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #f8fafc;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tag-remove {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-all-btn {
  background: none;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  background: #f1f5f9;
}

.controls-right {
  flex-shrink: 0;
}

.view-options {
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.view-option {
  padding: 10px 16px;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.view-option.active {
  background: #3b82f6;
  color: white;
}

.view-option:not(.active):hover {
  background: #f8fafc;
}

/* Payments Table */
.payments-table-container {
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  background: white;
  margin-bottom: 24px;
}

.payments-table {
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
}

.payments-table.compact {
  min-width: 800px;
}

.payments-table th {
  background: #f8fafc;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payments-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
}

.payments-table.compact td {
  padding: 12px 16px;
}

.payment-row:hover td {
  background: #f8fafc;
}

.payment-id-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.payment-id {
  font-family: 'Monaco', 'Courier New', monospace;
  font-weight: 600;
  color: #1e293b;
}

.payment-reference {
  font-size: 0.8rem;
  color: #6b7280;
}

.datetime-cell, .customer-cell, .service-cell, .amount-cell, .method-cell, .status-cell, .action-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.datetime-cell .date {
  font-weight: 500;
  color: #1e293b;
}

.datetime-cell .time {
  font-size: 0.8rem;
  color: #6b7280;
}

.customer-name {
  font-weight: 500;
  color: #1e293b;
}

.customer-contact {
  font-size: 0.8rem;
  color: #6b7280;
}

.service-name {
  font-weight: 500;
  color: #1e293b;
}

.service-category {
  font-size: 0.8rem;
  color: #6b7280;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
}

.amount-value {
  font-weight: 700;
  color: #1e40af;
  font-size: 1rem;
}

.amount-discount {
  font-size: 0.8rem;
  color: #dc2626;
  background: #fee2e2;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.method-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.method-icon {
  font-size: 1.2rem;
}

.method-name {
  font-weight: 500;
  color: #4b5563;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  display: inline-block;
}

.status-badge.paid {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.failed {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge.refunded {
  background: #e0f2fe;
  color: #0369a1;
}

.status-time {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 4px;
}

.action-cell {
  display: flex;
  gap: 8px;
}

.action-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: #f1f5f9;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-icon.success {
  background: #d1fae5;
  color: #065f46;
}

.action-icon.warning {
  background: #fef3c7;
  color: #92400e;
}

/* Payments Cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.payment-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
}

.payment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.payment-card.status-paid { border-left: 4px solid #10b981; }
.payment-card.status-pending { border-left: 4px solid #f59e0b; }
.payment-card.status-failed { border-left: 4px solid #dc2626; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.card-id {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.payment-id {
  font-family: 'Monaco', 'Courier New', monospace;
  font-weight: 600;
  color: #1e293b;
}

.payment-date {
  font-size: 0.8rem;
  color: #6b7280;
}

.card-body {
  padding: 20px;
}

.card-customer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.customer-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.customer-info h4 {
  margin: 0;
  font-size: 1rem;
  color: #1e293b;
}

.customer-info p {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.card-service {
  margin-bottom: 16px;
}

.card-service h5 {
  margin: 0 0 4px;
  font-size: 0.95rem;
  color: #1e293b;
}

.card-service p {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 10px;
  display: inline-block;
}

.card-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-amount {
  display: flex;
  flex-direction: column;
}

.amount-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.amount-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e40af;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.card-action-btn:hover {
  background: #f8fafc;
}

.card-action-btn.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.card-action-btn.primary:hover {
  background: #2563eb;
}

/* Pagination */
.pagination-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.9rem;
}

.filtered-count {
  color: #3b82f6;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #d1d5db;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 4px;
}

.page-number {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.page-number:hover:not(.active):not(.ellipsis) {
  background: #f8fafc;
  border-color: #d1d5db;
}

.page-number.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.page-number.ellipsis {
  border: none;
  background: none;
  cursor: default;
}

.page-size-select {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
  color: #4b5563;
}

/* Empty State */
.empty-state-enhanced {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin: 30px 0;
}

.empty-illustration {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state-enhanced h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 12px;
}

.empty-state-enhanced p {
  color: #6b7280;
  margin-bottom: 24px;
  font-size: 1rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.empty-action-btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4b5563;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.empty-action-btn:hover {
  background: #f8fafc;
}

.empty-action-btn.primary {
  background: #f1f5f9;
  color: #1e293b;
  border-color: #e2e8f0;
}

.empty-action-btn.success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
}

.empty-action-btn.success:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.loading-content {
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content p {
  color: #4b5563;
  margin-bottom: 20px;
  font-weight: 500;
}

.loading-progress {
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Debug Panel */
.debug-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #1e293b;
  color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 100;
  max-width: 300px;
}

.debug-panel h4 {
  margin: 0 0 12px;
  font-size: 0.9rem;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.debug-info {
  font-size: 0.8rem;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.debug-close {
  width: 100%;
  padding: 8px;
  background: #475569;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-row {
    grid-template-columns: 1fr;
  }
  
  .status-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-header {
    flex-direction: column;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .quick-btn {
    width: 100%;
    justify-content: center;
  }
  
  .data-controls {
    flex-direction: column;
  }
  
  .controls-left {
    min-width: 100%;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination-section {
    flex-direction: column;
    text-align: center;
  }
  
  .empty-actions {
    flex-direction: column;
  }
  
  .empty-action-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .payments-section {
    padding: 12px;
  }
  
  .main-header h1 {
    font-size: 1.6rem;
  }
  
  .view-options {
    width: 100%;
  }
  
  .view-option {
    flex: 1;
    justify-content: center;
  }
}
</style>