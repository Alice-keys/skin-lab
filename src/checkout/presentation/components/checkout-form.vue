<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { cartStore }     from '../../../cart/application/cart.store.js'
import { checkoutStore } from '../../application/checkout.store.js'
import { authStore }     from '../../../identity/application/auth.store.js'
import { Address }       from '../../domain/model/address.entity.js'

const router = useRouter()

const items      = computed(() => cartStore.cart.items)
const subtotal   = computed(() => cartStore.cart.getSubtotal())
const discount   = computed(() => cartStore.cart.discountAmount)
const tax        = computed(() => cartStore.cart.getTax())
const total      = computed(() => cartStore.cart.getTotal())
const hasDiscount = computed(() => cartStore.cart.discountCode !== null)
const discountCode = computed(() => cartStore.cart.discountCode)

const fmt = (n) => `$${n.toFixed(2)}`

const form = reactive({
  fullName: '',
  email:    '',
  phone:    '',
  street:   '',
  city:     '',
  state:    '',
  zipCode:  '',
  country:  'United States',
  paymentMethod: 'card'
})

const isPlacing = ref(false)
const formError  = ref('')

onMounted(() => {
  const c = authStore.currentCustomer
  if (c) {
    form.fullName = c.name   ?? ''
    form.email    = c.email  ?? ''
    form.phone    = c.phone  ?? ''
    if (c.address) {
      form.street  = c.address.street  ?? ''
      form.city    = c.address.city    ?? ''
      form.state   = c.address.state   ?? ''
      form.zipCode = c.address.zipCode ?? ''
      form.country = c.address.country ?? 'United States'
    }
  }
  if (items.value.length === 0) router.push('/cart')
})

const placeOrder = async () => {
  formError.value  = ''
  isPlacing.value  = true
  const address = new Address({
    street:  form.street,
    city:    form.city,
    state:   form.state,
    zipCode: form.zipCode,
    country: form.country
  })
  try {
    await checkoutStore.placeOrder(cartStore.cart, address)
    cartStore.clearCart()
    router.push('/order-confirmation')
  } catch {
    formError.value = 'Something went wrong. Please try again.'
  } finally {
    isPlacing.value = false
  }
}
</script>

<template>
  <div class="checkout-page">

    <!-- Header strip -->
    <div class="checkout-header">
      <div class="container checkout-header-inner">
        <div class="breadcrumb label-wide">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <span class="breadcrumb-sep">/</span>
          <router-link to="/cart" class="breadcrumb-link">Cart</router-link>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">Checkout</span>
        </div>
      </div>
    </div>

    <div class="container checkout-body">

      <!-- Left: Form -->
      <div class="checkout-form-col">

        <!-- Shipping address -->
        <section class="form-section">
          <h2 class="section-title">Shipping Address</h2>

          <form class="checkout-form" @submit.prevent="placeOrder">

            <div class="field-row">
              <div class="form-field">
                <label class="form-label label-wide">Full Name</label>
                <input v-model="form.fullName" type="text" class="form-input" placeholder="Sofia Navarro" required />
              </div>
              <div class="form-field">
                <label class="form-label label-wide">Email</label>
                <input v-model="form.email" type="email" class="form-input" placeholder="sofia@example.com" required />
              </div>
            </div>

            <div class="form-field">
              <label class="form-label label-wide">Phone</label>
              <input v-model="form.phone" type="tel" class="form-input" placeholder="+1 (555) 000-0000" />
            </div>

            <div class="form-field">
              <label class="form-label label-wide">Address</label>
              <input v-model="form.street" type="text" class="form-input" placeholder="123 Glow Ave" required />
            </div>

            <div class="field-row">
              <div class="form-field">
                <label class="form-label label-wide">City</label>
                <input v-model="form.city" type="text" class="form-input" placeholder="Los Angeles" required />
              </div>
              <div class="form-field">
                <label class="form-label label-wide">State</label>
                <input v-model="form.state" type="text" class="form-input" placeholder="CA" required />
              </div>
            </div>

            <div class="field-row">
              <div class="form-field">
                <label class="form-label label-wide">ZIP Code</label>
                <input v-model="form.zipCode" type="text" class="form-input" placeholder="90001" required />
              </div>
              <div class="form-field">
                <label class="form-label label-wide">Country</label>
                <input v-model="form.country" type="text" class="form-input" placeholder="United States" required />
              </div>
            </div>

            <!-- Payment method -->
            <h2 class="section-title" style="margin-top:2rem">Payment Method</h2>

            <div class="payment-options">
              <label class="payment-option" :class="{ 'payment-option--active': form.paymentMethod === 'card' }">
                <input v-model="form.paymentMethod" type="radio" value="card" class="visually-hidden" />
                <i class="pi pi-credit-card" />
                <span>Credit / Debit Card</span>
              </label>
              <label class="payment-option" :class="{ 'payment-option--active': form.paymentMethod === 'paypal' }">
                <input v-model="form.paymentMethod" type="radio" value="paypal" class="visually-hidden" />
                <i class="pi pi-paypal" />
                <span>PayPal</span>
              </label>
            </div>

            <div v-if="form.paymentMethod === 'card'" class="card-fields">
              <div class="form-field">
                <label class="form-label label-wide">Card Number</label>
                <input type="text" class="form-input" placeholder="•••• •••• •••• ••••" maxlength="19" />
              </div>
              <div class="field-row">
                <div class="form-field">
                  <label class="form-label label-wide">Expiry</label>
                  <input type="text" class="form-input" placeholder="MM / YY" maxlength="7" />
                </div>
                <div class="form-field">
                  <label class="form-label label-wide">CVV</label>
                  <input type="text" class="form-input" placeholder="•••" maxlength="4" />
                </div>
              </div>
            </div>

            <div v-if="form.paymentMethod === 'paypal'" class="paypal-note">
              <i class="pi pi-info-circle" />
              You will be redirected to PayPal to complete your payment.
            </div>

            <p v-if="formError" class="form-error">{{ formError }}</p>

            <button type="submit" class="place-order-btn label-wide" :disabled="isPlacing || checkoutStore.isLoading">
              <i v-if="isPlacing" class="pi pi-spin pi-spinner" />
              <i v-else class="pi pi-lock" />
              {{ isPlacing ? 'Placing Order…' : 'Place Order' }}
            </button>

          </form>
        </section>

      </div>

      <!-- Right: Order summary -->
      <aside class="checkout-summary-col">
        <div class="summary-panel glass-card">
          <h2 class="summary-title">Order Summary</h2>

          <div class="summary-items">
            <div v-for="item in items" :key="item.product.id" class="summary-item">
              <div class="item-thumb">
                <span class="thumb-letter">{{ item.product?.category?.name?.[0] ?? '·' }}</span>
              </div>
              <div class="item-details">
                <p class="item-name">{{ item.product.name }}</p>
                <p class="item-qty label-wider">× {{ item.quantity }}</p>
              </div>
              <p class="item-price">${{ item.getSubtotal().toFixed(2) }}</p>
            </div>
          </div>

          <div class="summary-divider" />

          <div class="summary-rows">
            <div class="summary-row">
              <span class="summary-label">Subtotal</span>
              <span>{{ fmt(subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Shipping</span>
              <span class="free-text">Free</span>
            </div>
            <div v-if="hasDiscount" class="summary-row">
              <span class="summary-label">
                Discount
                <span class="code-badge label-wider">{{ discountCode }}</span>
              </span>
              <span class="discount-text">−{{ fmt(discount) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Tax (8%)</span>
              <span>{{ fmt(tax) }}</span>
            </div>
          </div>

          <div class="summary-divider" />

          <div class="total-row">
            <span class="total-label">Total</span>
            <span class="total-value">{{ fmt(total) }}</span>
          </div>

          <div class="secure-row label-wider">
            <i class="pi pi-lock" />
            Secure SSL checkout
          </div>
        </div>
      </aside>

    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  min-height: 80vh;
  background: var(--skin-offwhite);
  padding-bottom: 5rem;
}

/* Header */
.checkout-header {
  background: var(--skin-light);
  height: 100px;
  display: flex;
  align-items: center;
}

.checkout-header-inner { display: flex; align-items: center; }

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

/* Body layout */
.checkout-body {
  display: grid;
  grid-template-columns: 60fr 40fr;
  gap: 2rem;
  padding-top: 2rem;
  align-items: start;
}

/* Form section */
.form-section {
  background: var(--skin-white);
  border: 1px solid var(--skin-border);
  border-radius: 12px;
  padding: 2rem;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--skin-text);
  margin-bottom: 1.5rem;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.72rem;
  color: var(--skin-grey);
}

.form-input {
  padding: 0.65rem 1rem;
  border: 1px solid var(--skin-border);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--skin-text);
  background: var(--skin-white);
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--skin-accent);
}

.form-input::placeholder { color: var(--skin-grey-light); }

/* Payment options */
.payment-options {
  display: flex;
  gap: 1rem;
}

.payment-option {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--skin-border);
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.88rem;
  color: var(--skin-grey);
}

.payment-option--active {
  border-color: var(--skin-accent);
  color: var(--skin-accent);
  background: var(--skin-light);
}

.payment-option .pi { font-size: 1.1rem; }

.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }

.card-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: var(--skin-offwhite);
  border-radius: 8px;
  border: 1px solid var(--skin-border);
}

.paypal-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--skin-offwhite);
  border-radius: 8px;
  border: 1px solid var(--skin-border);
  font-size: 0.85rem;
  color: var(--skin-grey);
}

.form-error {
  font-size: 0.82rem;
  color: var(--skin-accent);
}

.place-order-btn {
  width: 100%;
  padding: 0.9rem;
  background: var(--skin-accent);
  color: var(--skin-white);
  border: none;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.82rem;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.place-order-btn:hover:not(:disabled) { background: var(--skin-dark); }
.place-order-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* Summary panel */
.checkout-summary-col { position: sticky; top: 80px; }

.summary-panel {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-title {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--skin-text);
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-thumb {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  background: var(--skin-light);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-letter {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  color: rgba(197,53,80,0.25);
  line-height: 1;
}

.item-details { flex: 1; min-width: 0; }

.item-name {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--skin-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-qty { font-size: 0.7rem; color: var(--skin-grey-light); margin-top: 1px; }

.item-price {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--skin-text);
  flex-shrink: 0;
}

.summary-divider { height: 1px; background: var(--skin-border); }

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.88rem;
}

.summary-label {
  color: var(--skin-grey);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.free-text     { color: #18A262; font-weight: 600; }
.discount-text { color: #18A262; font-weight: 600; }

.code-badge {
  background: #E8F7F0;
  color: #18A262;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.58rem;
}

.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-label { font-weight: 600; color: var(--skin-text); }

.total-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--skin-dark);
}

.secure-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.65rem;
  color: var(--skin-grey-light);
}

/* Responsive */
@media (max-width: 860px) {
  .checkout-body {
    grid-template-columns: 1fr;
  }

  .checkout-summary-col {
    position: static;
    order: -1;
  }

  .field-row { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .payment-options { flex-direction: column; }
}
</style>
