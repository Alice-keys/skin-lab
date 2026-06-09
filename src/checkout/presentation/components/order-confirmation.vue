<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { checkoutStore } from '../../application/checkout.store.js'

const router = useRouter()

const order = computed(() => checkoutStore.currentOrder)

onMounted(() => {
  if (!order.value) router.push('/shop')
})

const isTracking = computed(() =>
  order.value?.status && order.value.status !== 'processing'
)
</script>

<template>
  <div class="confirmation-page">

    <div v-if="!order" class="loading-wrap">
      <pv-skeleton width="400px" height="400px" border-radius="16px" />
    </div>

    <div v-else class="confirmation-wrap">

      <!-- Check icon -->
      <div class="check-circle">
        <i class="pi pi-check check-icon" />
      </div>

      <p class="label-wider eyebrow">Order Confirmed</p>
      <h1 class="confirm-title">Thank you for your purchase!</h1>
      <p class="confirm-subtitle">
        We've received your order and we're getting it ready.
      </p>

      <!-- Order number -->
      <div class="order-number-box">
        <p class="label-wider on-label">Order Number</p>
        <p class="on-value">{{ order.orderNumber }}</p>
      </div>

      <!-- Delivery estimate -->
      <div v-if="order.estimatedDelivery" class="delivery-box">
        <i class="pi pi-truck delivery-icon" />
        <div>
          <p class="label-wider delivery-label">Estimated Delivery</p>
          <p class="delivery-date">{{ order.getFormattedDelivery() }}</p>
        </div>
      </div>

      <!-- Status -->
      <div class="status-row">
        <span class="status-pill label-wider" :class="`status-pill--${order.status}`">
          {{ order.getStatusLabel() }}
        </span>
        <span class="created-at label-wider">Placed on {{ order.getFormattedDate() }}</span>
      </div>

      <!-- Items summary -->
      <div class="items-summary">
        <h2 class="items-title">Items Ordered</h2>
        <div class="items-list">
          <div v-for="item in order.items" :key="item.productId" class="item-row">
            <div class="item-thumb-sm">
              <span class="thumb-letter-sm">{{ item.productName?.[0] ?? '·' }}</span>
            </div>
            <div class="item-info">
              <p class="item-name">{{ item.productName }}</p>
              <p class="label-wider item-qty">× {{ item.quantity }}</p>
            </div>
            <p class="item-subtotal">${{ item.getSubtotal().toFixed(2) }}</p>
          </div>
        </div>

        <div class="totals-block">
          <div class="total-line">
            <span class="tl-label">Subtotal</span>
            <span>${{ order.subtotal.toFixed(2) }}</span>
          </div>
          <div class="total-line">
            <span class="tl-label">Shipping</span>
            <span class="free-text">Free</span>
          </div>
          <div class="total-line">
            <span class="tl-label">Tax</span>
            <span>${{ order.tax.toFixed(2) }}</span>
          </div>
          <div class="total-divider" />
          <div class="total-line total-line--bold">
            <span>Total</span>
            <span>{{ order.getFormattedTotal() }}</span>
          </div>
        </div>
      </div>

      <!-- Shipping address -->
      <div v-if="order.shippingAddress" class="address-box">
        <p class="label-wider address-label">Shipping To</p>
        <p class="address-text">{{ order.shippingAddress.getFullAddress() }}</p>
      </div>

      <!-- CTAs -->
      <div class="confirm-actions">
        <router-link to="/shop" class="btn-outline">
          Continue Shopping
        </router-link>
        <router-link to="/orders" class="btn-accent">
          <i class="pi pi-list" /> My Orders
        </router-link>
      </div>

    </div>
  </div>
</template>

<style scoped>
.confirmation-page {
  min-height: 80vh;
  background: var(--skin-offwhite);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 4rem 1rem 5rem;
}

.loading-wrap { display: flex; align-items: center; justify-content: center; width: 100%; }

.confirmation-wrap {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  text-align: center;
}

/* Check circle */
.check-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--skin-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  font-size: 2rem;
  color: var(--skin-accent);
}

.eyebrow { font-size: 0.7rem; color: var(--skin-accent); }

.confirm-title {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 700;
  color: var(--skin-text);
}

.confirm-subtitle { color: var(--skin-grey); font-size: 0.9rem; }

/* Order number */
.order-number-box {
  background: var(--skin-white);
  border: 1px solid var(--skin-border);
  border-radius: 10px;
  padding: 1rem 2rem;
  width: 100%;
}

.on-label { font-size: 0.65rem; color: var(--skin-grey-light); }
.on-value  { font-size: 1.3rem; font-weight: 700; color: var(--skin-accent); margin-top: 0.25rem; }

/* Delivery */
.delivery-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--skin-white);
  border: 1px solid var(--skin-border);
  border-radius: 10px;
  padding: 1rem 1.5rem;
  width: 100%;
  text-align: left;
}

.delivery-icon { font-size: 1.4rem; color: var(--skin-accent); }
.delivery-label { font-size: 0.65rem; color: var(--skin-grey-light); }
.delivery-date  { font-weight: 600; color: var(--skin-text); margin-top: 2px; }

/* Status */
.status-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-pill {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
}

.status-pill--processing { background: var(--skin-light); color: var(--skin-accent); }
.status-pill--shipped    { background: #E8EEFF; color: #2B4BCC; }
.status-pill--delivered  { background: #E8F8F1; color: #18A262; }
.status-pill--pending    { background: var(--skin-light); color: var(--skin-accent); }
.status-pill--cancelled  { background: #F5F5F5; color: var(--skin-grey); }

.created-at { font-size: 0.72rem; color: var(--skin-grey-light); }

/* Items summary */
.items-summary {
  background: var(--skin-white);
  border: 1px solid var(--skin-border);
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  text-align: left;
}

.items-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-thumb-sm {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: var(--skin-light);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-letter-sm {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: rgba(197,53,80,0.25);
}

.item-info { flex: 1; min-width: 0; }
.item-name { font-size: 0.85rem; font-weight: 500; color: var(--skin-text); }
.item-qty  { font-size: 0.68rem; color: var(--skin-grey-light); margin-top: 1px; }
.item-subtotal { font-weight: 600; font-size: 0.88rem; color: var(--skin-text); flex-shrink: 0; }

.totals-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--skin-border);
}

.total-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  color: var(--skin-grey);
}

.tl-label { color: var(--skin-grey); }
.free-text { color: #18A262; font-weight: 600; }
.total-divider { height: 1px; background: var(--skin-border); }
.total-line--bold { font-weight: 700; color: var(--skin-text); font-size: 1rem; }

/* Address */
.address-box {
  background: var(--skin-white);
  border: 1px solid var(--skin-border);
  border-radius: 10px;
  padding: 1rem 1.5rem;
  width: 100%;
  text-align: left;
}

.address-label { font-size: 0.65rem; color: var(--skin-grey-light); }
.address-text  { font-size: 0.88rem; color: var(--skin-text); margin-top: 0.25rem; }

/* CTAs */
.confirm-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.btn-accent {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1.5rem;
  background: var(--skin-accent);
  color: var(--skin-white);
  border: none;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.82rem;
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition);
}

.btn-accent:hover { background: var(--skin-dark); }
</style>
