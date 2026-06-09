<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../../application/auth.store.js'

const router = useRouter()

const name            = ref('')
const email           = ref('')
const password        = ref('')
const confirmPassword = ref('')
const showPwd         = ref(false)
const showConfirm     = ref(false)

const passwordMismatch = computed(
  () => confirmPassword.value.length > 0 && password.value !== confirmPassword.value
)

const passwordTooShort = computed(
  () => password.value.length > 0 && password.value.length < 8
)

const canSubmit = computed(
  () => name.value && email.value && password.value.length >= 8 && !passwordMismatch.value
)

const handleSubmit = async () => {
  if (!canSubmit.value) return
  authStore.error = null
  try {
    await authStore.register({ name: name.value, email: email.value, password: password.value })
    router.push('/')
  } catch { /* error shown via authStore.error */ }
}
</script>

<template>
  <div class="auth-page">

    <!-- Left decorative panel -->
    <div class="auth-left">
      <div class="auth-left-inner">
        <span class="auth-brand">SKIN LAB</span>
        <p class="auth-brand-tagline label-wide">Science-Backed Skincare</p>
        <p class="auth-brand-copy">
          Join thousands of customers who've upgraded their skincare routine with science-backed formulas.
        </p>
      </div>
      <div class="auth-circle auth-circle--lg" />
      <div class="auth-circle auth-circle--sm" />
      <div class="auth-circle auth-circle--xs" />
    </div>

    <!-- Right form panel -->
    <div class="auth-right">
      <div class="glass-card auth-card">

        <h1 class="auth-title">Create account</h1>
        <p class="auth-subtitle">Start your skincare journey today</p>

        <!-- Error -->
        <div v-if="authStore.error" class="auth-error label-wide">
          {{ authStore.error }}
        </div>

        <form class="auth-form" @submit.prevent="handleSubmit">

          <!-- Name -->
          <div class="form-field">
            <label class="form-label label-wide">Full Name</label>
            <div class="input-wrap">
              <i class="pi pi-user input-icon" />
              <input
                v-model="name"
                type="text"
                class="auth-input"
                placeholder="Sofia Navarro"
                required
                autocomplete="name"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="form-field">
            <label class="form-label label-wide">Email</label>
            <div class="input-wrap">
              <i class="pi pi-envelope input-icon" />
              <input
                v-model="email"
                type="email"
                class="auth-input"
                placeholder="you@example.com"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="form-field">
            <label class="form-label label-wide">Password</label>
            <div class="input-wrap">
              <i class="pi pi-lock input-icon" />
              <input
                v-model="password"
                :type="showPwd ? 'text' : 'password'"
                class="auth-input auth-input--padded-right"
                placeholder="At least 8 characters"
                required
                autocomplete="new-password"
              />
              <button type="button" class="pwd-toggle" @click="showPwd = !showPwd">
                <i :class="showPwd ? 'pi pi-eye-slash' : 'pi pi-eye'" />
              </button>
            </div>
            <p v-if="passwordTooShort" class="field-error label-wider">
              Password must be at least 8 characters
            </p>
          </div>

          <!-- Confirm password -->
          <div class="form-field">
            <label class="form-label label-wide">Confirm Password</label>
            <div class="input-wrap">
              <i class="pi pi-lock input-icon" />
              <input
                v-model="confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                class="auth-input auth-input--padded-right"
                :class="{ 'auth-input--error': passwordMismatch }"
                placeholder="Repeat your password"
                autocomplete="new-password"
              />
              <button type="button" class="pwd-toggle" @click="showConfirm = !showConfirm">
                <i :class="showConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'" />
              </button>
            </div>
            <p v-if="passwordMismatch" class="field-error label-wider">
              Passwords do not match
            </p>
          </div>

          <button
            type="submit"
            class="btn-auth-primary"
            :disabled="!canSubmit || authStore.isLoading"
          >
            <i v-if="authStore.isLoading" class="pi pi-spin pi-spinner" />
            <span v-else>Create Account</span>
          </button>
        </form>

        <div class="auth-divider">
          <span class="divider-line" />
          <span class="divider-text label-wider">or continue with</span>
          <span class="divider-line" />
        </div>

        <button class="btn-google label-wide">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p class="auth-switch">
          Already have an account?
          <router-link to="/login" class="auth-switch-link">Sign in</router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Shared with login-form — duplicated intentionally for component independence */
.auth-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: calc(100vh - 100px);
}

.auth-left {
  background: var(--skin-accent);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 4rem;
}

.auth-left-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 380px;
}

.auth-brand {
  font-family: var(--font-heading);
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--skin-white);
  text-transform: uppercase;
}

.auth-brand-tagline { color: rgba(255,255,255,0.7); letter-spacing: var(--letter-spacing-wider); }
.auth-brand-copy    { color: rgba(255,255,255,0.85); font-size: 0.95rem; line-height: 1.75; font-weight: 300; }

.auth-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
}
.auth-circle--lg { width: 400px; height: 400px; bottom: -120px; right: -120px; }
.auth-circle--sm { width: 240px; height: 240px; top: -60px; right: 40px; background: rgba(255,255,255,0.04); }
.auth-circle--xs { width: 120px; height: 120px; bottom: 80px; left: 40px; background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.2); }

.auth-right {
  background: linear-gradient(155deg, var(--skin-offwhite) 0%, #FFF0F1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--skin-text);
  margin: 0;
  line-height: 1.1;
}

.auth-subtitle { font-size: 0.875rem; color: var(--skin-grey); margin-top: -0.75rem; }

.auth-error {
  background: var(--skin-light);
  color: var(--skin-accent);
  border: 1px solid var(--skin-soft);
  border-radius: 8px;
  padding: 0.65rem 1rem;
  font-size: 0.75rem;
}

.auth-form { display: flex; flex-direction: column; gap: 1rem; }
.form-field { display: flex; flex-direction: column; gap: 0.4rem; }
.form-label { color: var(--skin-grey); font-family: var(--font-body); }

.input-wrap { position: relative; display: flex; align-items: center; }

.input-icon {
  position: absolute;
  left: 0.9rem;
  color: var(--skin-grey-light);
  font-size: 0.82rem;
  pointer-events: none;
}

.auth-input {
  width: 100%;
  padding: 0.75rem 0.9rem 0.75rem 2.5rem;
  border: 1px solid var(--skin-border);
  border-radius: 8px;
  background: var(--skin-offwhite);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--skin-text);
  outline: none;
  transition: var(--transition);
}

.auth-input:focus {
  border-color: var(--skin-accent);
  background: var(--skin-white);
  box-shadow: 0 0 0 3px rgba(197, 53, 80, 0.08);
}

.auth-input--padded-right  { padding-right: 2.5rem; }
.auth-input--error         { border-color: var(--skin-accent); }

.pwd-toggle {
  position: absolute;
  right: 0.85rem;
  background: none;
  border: none;
  color: var(--skin-grey-light);
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  transition: var(--transition);
}

.field-error { color: var(--skin-accent); font-size: 0.68rem; margin-top: 2px; }

.btn-auth-primary {
  width: 100%;
  padding: 0.85rem;
  background: var(--skin-accent);
  color: var(--skin-white);
  border: none;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-auth-primary:hover:not(:disabled) { background: var(--skin-dark); }
.btn-auth-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.auth-divider { display: flex; align-items: center; gap: 0.75rem; }
.divider-line { flex: 1; height: 1px; background: var(--skin-border); }
.divider-text { color: var(--skin-grey-light); white-space: nowrap; }

.btn-google {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid var(--skin-border);
  border-radius: 8px;
  font-family: var(--font-body);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  color: var(--skin-grey);
  transition: var(--transition);
}

.btn-google:hover { border-color: var(--skin-grey-light); background: var(--skin-white); }

.auth-switch { text-align: center; font-size: 0.85rem; color: var(--skin-grey); }

.auth-switch-link {
  color: var(--skin-accent);
  font-weight: 500;
  transition: var(--transition);
}
.auth-switch-link:hover { opacity: 0.75; }

@media (max-width: 768px) {
  .auth-page { grid-template-columns: 1fr; }
  .auth-left  { display: none; }
  .auth-card  { padding: 2rem 1.5rem; }
}
</style>
