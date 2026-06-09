<script setup>
import { ref } from 'vue'
import { subscriptionStore } from '../../application/subscription.store.js'

const emit = defineEmits(['subscribed'])

const email     = ref('')
const isLoading = ref(false)
const isDone    = ref(false)
const errorMsg  = ref('')

const submit = async () => {
  if (!email.value.trim()) return
  isLoading.value = true
  errorMsg.value  = ''
  try {
    await subscriptionStore.subscribe(email.value.trim())
    isDone.value = true
    emit('subscribed', subscriptionStore.discountCode)
  } catch {
    errorMsg.value = 'Something went wrong. Try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="newsletter-form-wrap">

    <!-- Success state -->
    <div v-if="isDone" class="nl-success">
      <i class="pi pi-check-circle nl-check" />
      <div>
        <p class="nl-success-title">You're subscribed!</p>
        <p class="nl-success-sub">
          Your discount code: <strong>{{ subscriptionStore.discountCode?.code }}</strong>
          ({{ subscriptionStore.discountCode?.getFormattedDiscount() }})
        </p>
      </div>
    </div>

    <!-- Form state -->
    <form v-else class="nl-form" @submit.prevent="submit">
      <input
        v-model="email"
        type="email"
        class="nl-input"
        placeholder="Your email address"
        required
        :disabled="isLoading"
      />
      <button type="submit" class="nl-btn label-wide" :disabled="isLoading">
        <i v-if="isLoading" class="pi pi-spin pi-spinner" />
        <span v-else>Subscribe</span>
      </button>
    </form>

    <p v-if="errorMsg" class="nl-error">{{ errorMsg }}</p>

  </div>
</template>

<style scoped>
.newsletter-form-wrap {
  flex: 1;
  max-width: 460px;
}

.nl-form {
  display: flex;
  height: 44px;
}

.nl-input {
  flex: 1;
  padding: 0 1.1rem;
  border: 1px solid var(--skin-border);
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--skin-text);
  background: var(--skin-white);
  outline: none;
  transition: border-color 0.2s;
  height: 100%;
}

.nl-input:focus { border-color: var(--skin-grey-light); }
.nl-input::placeholder { color: var(--skin-grey-light); }

.nl-btn {
  height: 100%;
  padding: 0 1.4rem;
  background: var(--skin-accent);
  color: var(--skin-white);
  border: none;
  border-radius: 0 4px 4px 0;
  font-family: var(--font-body);
  font-size: 0.78rem;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 96px;
}

.nl-btn:hover:not(:disabled) { background: var(--skin-dark); }
.nl-btn:disabled { opacity: 0.65; cursor: not-allowed; }

.nl-success {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0;
}

.nl-check { font-size: 1.4rem; color: #18A262; }

.nl-success-title {
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--skin-text);
}

.nl-success-sub {
  font-size: 0.8rem;
  color: var(--skin-grey);
  margin-top: 2px;
}

.nl-error {
  font-size: 0.78rem;
  color: var(--skin-accent);
  margin-top: 0.4rem;
}

@media (max-width: 768px) {
  .newsletter-form-wrap { max-width: 100%; width: 100%; }

  .nl-form { height: auto; flex-direction: column; gap: 0.6rem; }

  .nl-input {
    border-right: 1px solid var(--skin-border);
    border-radius: 4px;
    height: 44px;
  }

  .nl-btn {
    border-radius: 4px;
    height: 44px;
    justify-content: center;
  }
}
</style>
