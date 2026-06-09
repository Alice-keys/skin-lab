<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { cartStore } from '../../application/cart.store.js'
import CartLineItem from './cart-line-item.vue'
import CartSummary  from './cart-summary.vue'

const router = useRouter()

const items       = computed(() => cartStore.cart.items)
const itemCount   = computed(() => cartStore.getItemCount())
const isEmpty     = computed(() => items.value.length === 0)

const discountInput  = ref('')
const discountError  = ref('')
const discountSuccess = ref(false)

const onQuantityChanged = (productId, qty) => cartStore.updateQuantity(productId, qty)
const onItemRemoved     = (productId) => cartStore.removeFromCart(productId)

const applyDiscount = () => {
  discountError.value   = ''
  discountSuccess.value = false
  const ok = cartStore.applyDiscountCode(discountInput.value.trim())
  if (ok) {
    discountSuccess.value = true
  } else {
    discountError.value = 'Invalid discount code. Try WELCOME10, SKINLAB15, or SAVE20.'
  }
}

const continueShopping = () => router.push('/shop')
</script>

<template>
  <div class="cart-page">

    <!-- Header strip -->
    <div class="cart-header">
      <div class="container cart-header-inner">
        <div class="breadcrumb label-wide">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">Shopping Cart</span>
        </div>
        <p v-if="!isEmpty" class="cart-count label-wider">
          {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
        </p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="isEmpty" class="cart-empty">
      <i class="pi pi-shopping-bag empty-icon" />
      <h2 class="empty-title">Your cart is empty</h2>
      <p class="empty-subtitle">Add some products to get started.</p>
      <button class="btn-primary" @click="continueShopping">
        Start Shopping
      </button>
    </div>

    <!-- Cart content -->
    <div v-else class="container cart-body">

      <!-- Left column: items + discount + continue -->
      <div class="cart-items-col">

        <div class="items-list">
          <cart-line-item
            v-for="(item, idx) in items"
            :key="item.product.id"
            :item="item"
            :index="idx"
            @quantity-changed="onQuantityChanged"
            @item-removed="onItemRemoved"
          />
        </div>

        <!-- Discount code -->
        <div class="discount-section">
          <p class="discount-label label-wide">Discount Code</p>
          <div class="discount-row">
            <input
              v-model="discountInput"
              class="discount-input"
              type="text"
              placeholder="Enter code (e.g. WELCOME10)"
              @keyup.enter="applyDiscount"
            />
            <button class="btn-outline-accent discount-apply" @click="applyDiscount">
              Apply
            </button>
          </div>
          <p v-if="discountError" class="discount-msg discount-msg--error">
            {{ discountError }}
          </p>
          <p v-if="discountSuccess" class="discount-msg discount-msg--success">
            <i class="pi pi-check-circle" /> Code applied successfully!
          </p>
        </div>

        <!-- Continue shopping -->
        <div class="continue-row">
          <button class="btn-outline" @click="continueShopping">
            <i class="pi pi-arrow-left" /> Continue Shopping
          </button>
        </div>

      </div>

      <!-- Right column: summary -->
      <div class="cart-summary-col">
        <cart-summary />
      </div>

    </div>
  </div>
</template>

<style scoped>
.cart-page {
  min-height: 80vh;
  background: var(--skin-offwhite);
  padding-bottom: 5rem;
}

/* Header strip */
.cart-header {
  background: var(--skin-light);
  height: 100px;
  display: flex;
  align-items: center;
}

.cart-header-inner {
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

.cart-count {
  font-size: 0.72rem;
  color: var(--skin-grey);
}

/* Empty state */
.cart-empty {
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
}

/* Body layout */
.cart-body {
  display: grid;
  grid-template-columns: 60fr 40fr;
  gap: 2rem;
  padding-top: 2rem;
  align-items: start;
}

.cart-items-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.items-list {
  background: var(--skin-white);
  border: 1px solid var(--skin-border);
  border-radius: 12px;
  overflow: hidden;
}

/* Discount */
.discount-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.discount-label { color: var(--skin-grey-light); }

.discount-row {
  display: flex;
  gap: 0.75rem;
}

.discount-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid var(--skin-border);
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--skin-text);
  background: var(--skin-white);
  transition: border-color 0.2s;
}

.discount-input:focus {
  outline: none;
  border-color: var(--skin-accent);
}

.discount-apply {
  white-space: nowrap;
  padding: 0.6rem 1.25rem;
}

.discount-msg {
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.discount-msg--error   { color: var(--skin-accent); }
.discount-msg--success { color: #18A262; }

/* Continue */
.continue-row {
  display: flex;
}

/* Summary column */
.cart-summary-col {
  position: sticky;
  top: 80px;
}

/* Responsive */
@media (max-width: 860px) {
  .cart-body {
    grid-template-columns: 1fr;
  }

  .cart-summary-col {
    position: static;
    order: 2;
  }

  .cart-items-col {
    order: 1;
  }
}
</style>
