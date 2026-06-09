<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { checkoutStore } from '../../application/checkout.store.js'
import { authStore }     from '../../../identity/application/auth.store.js'
import OrderLineItem     from './order-line-item.vue'

const router = useRouter()

const orders   = computed(() => checkoutStore.orderHistory)
const isEmpty  = computed(() => orders.value.length === 0)
const isLoading = computed(() => checkoutStore.isLoading)

onMounted(() => {
  if (authStore.currentCustomer) {
    checkoutStore.fetchOrderHistory(authStore.currentCustomer.id)
  }
})

const onTrackOrder = (order) => {
  checkoutStore.currentOrder = order
  router.push('/order-confirmation')
}
</script>

<template>
  <div class="orders-page">

    <!-- Header strip -->
    <div class="orders-header">
      <div class="container orders-header-inner">
        <div class="breadcrumb label-wide">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <span class="breadcrumb-sep">/</span>
          <router-link to="/account" class="breadcrumb-link">My Account</router-link>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">My Orders</span>
        </div>
        <p v-if="!isEmpty" class="orders-count label-wider">
          {{ orders.length }} {{ orders.length === 1 ? 'order' : 'orders' }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="container orders-body">
      <div class="orders-table-wrap">
        <div v-for="n in 3" :key="n" class="skeleton-row">
          <pv-skeleton width="100%" height="60px" border-radius="0" />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="isEmpty" class="orders-empty">
      <i class="pi pi-shopping-bag empty-icon" />
      <h2 class="empty-title">No orders yet</h2>
      <p class="empty-subtitle">Your order history will appear here once you make a purchase.</p>
      <router-link to="/shop" class="btn-primary">Start Shopping</router-link>
    </div>

    <!-- Orders table -->
    <div v-else class="container orders-body">
      <div class="orders-table-wrap">

        <!-- Table header -->
        <div class="table-header">
          <span class="label-wider th-cell">Order</span>
          <span class="label-wider th-cell">Products</span>
          <span class="label-wider th-cell">Total</span>
          <span class="label-wider th-cell">Status</span>
          <span class="label-wider th-cell"></span>
        </div>

        <order-line-item
          v-for="order in orders"
          :key="order.id"
          :order="order"
          @track-order="onTrackOrder"
        />

      </div>
    </div>

  </div>
</template>

<style scoped>
.orders-page {
  min-height: 80vh;
  background: var(--skin-offwhite);
  padding-bottom: 5rem;
}

.orders-header {
  background: var(--skin-light);
  height: 100px;
  display: flex;
  align-items: center;
}

.orders-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.78rem;
}

.breadcrumb-link {
  color: var(--skin-grey);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover { color: var(--skin-accent); }
.breadcrumb-sep     { color: var(--skin-grey-light); }
.breadcrumb-current { color: var(--skin-text); font-weight: 500; }

.orders-count {
  font-size: 0.72rem;
  color: var(--skin-grey);
}

.orders-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 50vh;
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  font-size: 3.5rem;
  color: var(--skin-soft);
}

.empty-title {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--skin-text);
}

.empty-subtitle {
  color: var(--skin-grey);
  font-size: 0.9rem;
  max-width: 360px;
}

.orders-body {
  padding-top: 2rem;
}

.orders-table-wrap {
  background: var(--skin-white);
  border: 1px solid var(--skin-border);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1.8fr 2fr 0.8fr 1fr 0.8fr;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--skin-offwhite);
  border-bottom: 1px solid var(--skin-border);
}

.th-cell {
  font-size: 0.65rem;
  color: var(--skin-grey-light);
}

.skeleton-row { padding: 0.25rem 0; }

@media (max-width: 768px) {
  .table-header { display: none; }
}
</style>
