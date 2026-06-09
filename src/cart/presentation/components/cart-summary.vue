<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { cartStore } from '../../application/cart.store.js'

const router = useRouter()

const subtotal = computed(() => cartStore.cart.getSubtotal())
const discount = computed(() => cartStore.cart.discountAmount)
const tax       = computed(() => cartStore.cart.getTax())
const total     = computed(() => cartStore.cart.getTotal())
const hasDiscount = computed(() => cartStore.cart.discountCode !== null)
const discountCode = computed(() => cartStore.cart.discountCode)

const fmt = (n) => `$${n.toFixed(2)}`

const goToCheckout = () => router.push('/checkout')
</script>

<template>
  <aside class="cart-summary glass-card">

    <h2 class="summary-title">Order Summary</h2>

    <div class="summary-rows">

      <div class="summary-row">
        <span class="summary-label">Subtotal</span>
        <span class="summary-value">{{ fmt(subtotal) }}</span>
      </div>

      <div class="summary-row">
        <span class="summary-label">Shipping</span>
        <span class="summary-value summary-free">Free</span>
      </div>

      <div v-if="hasDiscount" class="summary-row">
        <span class="summary-label">
          Discount
          <span class="discount-code-badge label-wider">{{ discountCode }}</span>
        </span>
        <span class="summary-value summary-discount">−{{ fmt(discount) }}</span>
      </div>

      <div class="summary-row">
        <span class="summary-label">Tax (8%)</span>
        <span class="summary-value">{{ fmt(tax) }}</span>
      </div>

    </div>

    <div class="summary-divider" />

    <div class="summary-total-row">
      <span class="total-label">Total</span>
      <span class="total-value">{{ fmt(total) }}</span>
    </div>

    <button class="checkout-btn label-wide" @click="goToCheckout">
      Proceed to Checkout
    </button>

    <!-- Payment methods -->
    <div class="payment-methods">
      <i class="pi pi-credit-card payment-icon" />
      <span class="payment-text">Visa · Mastercard · PayPal · Amex</span>
    </div>

    <div class="secure-text label-wider">
      <i class="pi pi-lock" />
      Secure checkout
    </div>

  </aside>
</template>

<style scoped>
.cart-summary {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--skin-text);
  margin-bottom: 0.25rem;
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
}

.summary-label {
  color: var(--skin-grey);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-value {
  font-weight: 500;
  color: var(--skin-text);
}

.summary-free   { color: #18A262; font-weight: 600; }
.summary-discount { color: #18A262; font-weight: 600; }

.discount-code-badge {
  background: #E8F7F0;
  color: #18A262;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 0.6rem;
}

.summary-divider {
  height: 1px;
  background: var(--skin-border);
  margin: 0.25rem 0;
}

.summary-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-label {
  font-weight: 600;
  color: var(--skin-text);
}

.total-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--skin-dark);
}

.checkout-btn {
  width: 100%;
  padding: 0.85rem;
  background: var(--skin-accent);
  color: var(--skin-white);
  border: none;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.82rem;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 0.25rem;
}

.checkout-btn:hover {
  background: var(--skin-dark);
}

.payment-methods {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding-top: 0.25rem;
}

.payment-icon {
  font-size: 1.2rem;
  color: var(--skin-grey-light);
}

.payment-text {
  font-size: 0.75rem;
  color: var(--skin-grey-light);
}

.secure-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.65rem;
  color: var(--skin-grey-light);
}
</style>
