<script setup>
import { ref } from 'vue'
import { subscriptionStore } from '../../application/subscription.store.js'

const emit = defineEmits(['subscribed', 'dismissed'])

const email       = ref('')
const isLoading   = ref(false)
const isSuccess   = ref(false)
const errorMsg    = ref('')

const submit = async () => {
  if (!email.value.trim()) return
  isLoading.value = true
  errorMsg.value  = ''
  try {
    await subscriptionStore.subscribe(email.value.trim())
    isSuccess.value = true
    emit('subscribed', subscriptionStore.discountCode)
  } catch {
    errorMsg.value = 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const dismiss = () => {
  subscriptionStore.markAsSubscribed()
  emit('dismissed')
}
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click.self="dismiss">
      <div class="pop-up-card glass-card">

        <!-- Accent stripe -->
        <div class="accent-stripe" />

        <!-- Close button -->
        <button class="close-btn" aria-label="Close" @click="dismiss">
          <i class="pi pi-times" />
        </button>

        <!-- Success state -->
        <div v-if="isSuccess" class="success-content">
          <div class="success-circle">
            <i class="pi pi-check success-icon" />
          </div>
          <h2 class="success-title">You're in! 🎉</h2>
          <p class="success-subtitle">
            Here's your exclusive welcome discount code:
          </p>
          <div class="code-display">
            <span class="code-text">{{ subscriptionStore.discountCode?.code }}</span>
            <span class="code-badge label-wider">{{ subscriptionStore.discountCode?.getFormattedDiscount() }}</span>
          </div>
          <p class="code-hint">Use this code at checkout to save on your first order.</p>
          <button class="primary-btn label-wide" @click="dismiss">
            Start Shopping
          </button>
        </div>

        <!-- Form state -->
        <div v-else class="form-content">
          <span class="deco-icon">🌸</span>
          <h2 class="pop-title">Welcome to Skin Lab!</h2>
          <p class="pop-subtitle">
            Subscribe and get <strong>15% off</strong> your first order.<br />
            Exclusive offers, new arrivals and skincare tips — straight to your inbox.
          </p>

          <form class="pop-form" @submit.prevent="submit">
            <input
              v-model="email"
              type="email"
              class="pop-input"
              placeholder="Enter your email address"
              required
              :disabled="isLoading"
            />
            <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
            <button type="submit" class="primary-btn label-wide" :disabled="isLoading">
              <i v-if="isLoading" class="pi pi-spin pi-spinner" />
              {{ isLoading ? 'Subscribing…' : 'Get 15% Off Now' }}
            </button>
          </form>

          <button class="no-thanks" @click="dismiss">
            No thanks, I'll pay full price
          </button>

          <p class="privacy-text label-wider">
            <i class="pi pi-lock" />
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.60);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fade-in 0.25s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.pop-up-card {
  width: 520px;
  max-width: 90vw;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  padding: 0;
  animation: slide-up 0.3s ease;
}

@keyframes slide-up {
  from { transform: translateY(-20px); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}

.accent-stripe {
  height: 8px;
  background: var(--skin-accent);
  border-radius: 20px 20px 0 0;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: var(--skin-grey);
  cursor: pointer;
  font-size: 0.9rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition);
  z-index: 1;
}

.close-btn:hover {
  color: var(--skin-accent);
  background: var(--skin-light);
}

/* Form content */
.form-content,
.success-content {
  padding: 2.25rem 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.deco-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.pop-title {
  font-family: var(--font-heading);
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--skin-text);
  line-height: 1.2;
}

.pop-subtitle {
  font-size: 0.88rem;
  color: var(--skin-grey);
  line-height: 1.7;
  max-width: 380px;
}

.pop-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pop-input {
  width: 100%;
  height: 48px;
  padding: 0 1.1rem;
  border: 1px solid var(--skin-border);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--skin-text);
  background: var(--skin-offwhite);
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.pop-input:focus {
  outline: none;
  border-color: var(--skin-accent);
  background: var(--skin-white);
}

.pop-input::placeholder { color: var(--skin-grey-light); }

.primary-btn {
  width: 100%;
  height: 48px;
  background: var(--skin-accent);
  color: var(--skin-white);
  border: none;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.82rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.primary-btn:hover:not(:disabled) { background: var(--skin-dark); }
.primary-btn:disabled { opacity: 0.65; cursor: not-allowed; }

.error-msg {
  font-size: 0.8rem;
  color: var(--skin-accent);
  text-align: left;
}

.no-thanks {
  background: none;
  border: none;
  color: var(--skin-grey);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.82rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}

.no-thanks:hover { color: var(--skin-accent); }

.privacy-text {
  font-size: 0.65rem;
  color: var(--skin-grey-light);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

/* Success */
.success-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--skin-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon { font-size: 1.6rem; color: var(--skin-accent); }

.success-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--skin-text);
}

.success-subtitle {
  font-size: 0.88rem;
  color: var(--skin-grey);
}

.code-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--skin-offwhite);
  border: 1px dashed var(--skin-accent);
  border-radius: 8px;
  padding: 0.85rem 1.5rem;
  width: 100%;
  justify-content: center;
}

.code-text {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--skin-accent);
}

.code-badge {
  background: var(--skin-accent);
  color: var(--skin-white);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.65rem;
}

.code-hint {
  font-size: 0.8rem;
  color: var(--skin-grey);
}
</style>
