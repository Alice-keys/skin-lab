<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authStore } from '../../application/auth.store.js'

const { t } = useI18n()
const router = useRouter()

const activeTab = ref('profile')
const isEditing = ref(false)

const customer = computed(() => authStore.currentCustomer)

const form = reactive({ name: '', email: '', phone: '' })

const resetForm = () => {
  form.name  = customer.value?.name  ?? ''
  form.email = customer.value?.email ?? ''
  form.phone = customer.value?.phone ?? ''
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  resetForm()
})

const saveProfile = async () => {
  await authStore.updateProfile({ name: form.name, email: form.email, phone: form.phone })
  isEditing.value = false
}

const cancelEdit = () => {
  resetForm()
  isEditing.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="account-page">

    <!-- Page header -->
    <div class="account-header">
      <div class="container account-header-inner">
        <div class="account-avatar">
          {{ customer?.getInitials() ?? '?' }}
        </div>
        <div class="account-hero">
          <p class="label-wider account-eyebrow">My Account</p>
          <h1 class="account-name">{{ customer?.getFullName() }}</h1>
          <p class="account-email">{{ customer?.email }}</p>
          <p v-if="customer?.createdAt" class="account-joined label-wider">
            Member since {{ customer.getFormattedJoinDate() }}
          </p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="account-tabs-bar">
      <div class="container">
        <div class="account-tabs">
          <button
            v-for="tab in ['profile', 'orders', 'wishlist']"
            :key="tab"
            class="account-tab label-wide"
            :class="{ 'account-tab--active': activeTab === tab }"
            @click="tab === 'orders' ? router.push('/orders') : tab === 'wishlist' ? router.push('/wishlist') : (activeTab = tab)"
          >
            <i :class="{
              'pi pi-user': tab === 'profile',
              'pi pi-shopping-bag': tab === 'orders',
              'pi pi-heart': tab === 'wishlist'
            }" />
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tab content -->
    <div class="container account-body">

      <!-- Profile tab -->
      <div v-if="activeTab === 'profile'" class="profile-tab">
        <div class="profile-card">
          <div class="card-header">
            <h2 class="card-title">Personal Information</h2>
            <button v-if="!isEditing" class="btn-outline-accent btn-sm" @click="isEditing = true">
              <i class="pi pi-pencil" /> Edit
            </button>
          </div>

          <div v-if="!isEditing" class="profile-info">
            <div class="info-row">
              <span class="info-label label-wider">Full Name</span>
              <span class="info-value">{{ customer?.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label label-wider">Email</span>
              <span class="info-value">{{ customer?.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label label-wider">Phone</span>
              <span class="info-value">{{ customer?.phone || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label label-wider">Address</span>
              <span class="info-value">
                {{ customer?.address
                  ? `${customer.address.street}, ${customer.address.city}`
                  : '—' }}
              </span>
            </div>
          </div>

          <form v-else class="profile-form" @submit.prevent="saveProfile">
            <div class="form-field">
              <label class="form-label label-wide">Full Name</label>
              <input v-model="form.name" type="text" class="profile-input" required />
            </div>
            <div class="form-field">
              <label class="form-label label-wide">Email</label>
              <input v-model="form.email" type="email" class="profile-input" required />
            </div>
            <div class="form-field">
              <label class="form-label label-wide">Phone</label>
              <input v-model="form.phone" type="tel" class="profile-input" />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="authStore.isLoading">
                <i v-if="authStore.isLoading" class="pi pi-spin pi-spinner" />
                <span v-else>Save Changes</span>
              </button>
              <button type="button" class="btn-outline" @click="cancelEdit">Cancel</button>
            </div>
          </form>
        </div>

        <!-- Danger zone -->
        <div class="danger-zone">
          <button class="btn-outline logout-btn" @click="handleLogout">
            <i class="pi pi-sign-out" /> Log Out
          </button>
        </div>
      </div>

      <!-- Orders tab -->
      <div v-else-if="activeTab === 'orders'" class="placeholder-tab">
        <i class="pi pi-shopping-bag placeholder-icon" />
        <p class="placeholder-title">No orders yet</p>
        <p class="placeholder-sub">Your order history will appear here once you place your first order.</p>
        <button class="btn-primary" @click="router.push('/shop')">Start Shopping</button>
      </div>

      <!-- Wishlist tab -->
      <div v-else-if="activeTab === 'wishlist'" class="placeholder-tab">
        <i class="pi pi-heart placeholder-icon" />
        <p class="placeholder-title">Your wishlist is empty</p>
        <p class="placeholder-sub">Save your favourite products here to find them easily later.</p>
        <button class="btn-primary" @click="router.push('/shop')">Browse Products</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.account-page { background: var(--skin-white); padding-bottom: 5rem; }

/* Header */
.account-header {
  background: linear-gradient(155deg, var(--skin-offwhite) 0%, var(--skin-light) 100%);
  padding: 4rem 0 3rem;
  border-bottom: 1px solid var(--skin-border);
}

.account-header-inner {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.account-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--skin-accent);
  color: var(--skin-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 700;
  flex-shrink: 0;
}

.account-hero { display: flex; flex-direction: column; gap: 0.3rem; }
.account-eyebrow { color: var(--skin-accent); margin-bottom: 0.2rem; }

.account-name {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 700;
  margin: 0;
}

.account-email { color: var(--skin-grey); font-size: 0.9rem; }
.account-joined { color: var(--skin-grey-light); margin-top: 0.2rem; }

/* Tabs bar */
.account-tabs-bar {
  border-bottom: 1px solid var(--skin-border);
  background: var(--skin-white);
  position: sticky;
  top: 64px;
  z-index: 10;
}

.account-tabs {
  display: flex;
  gap: 0;
}

.account-tab {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  color: var(--skin-grey);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
}

.account-tab:hover { color: var(--skin-text); }
.account-tab--active { color: var(--skin-accent); border-bottom-color: var(--skin-accent); }

/* Body */
.account-body { padding-top: 2.5rem; }

/* Profile card */
.profile-tab { display: flex; flex-direction: column; gap: 2rem; max-width: 600px; }

.profile-card {
  border: 1px solid var(--skin-border);
  border-radius: 16px;
  padding: 2rem;
  background: var(--skin-white);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 600;
}

.btn-sm { padding: 0.4rem 1rem; font-size: 0.72rem; }

/* Info rows */
.profile-info { display: flex; flex-direction: column; gap: 1rem; }

.info-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: baseline;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--skin-border);
}

.info-row:last-child { border-bottom: none; }

.info-label { color: var(--skin-grey-light); }
.info-value  { font-size: 0.9rem; color: var(--skin-text); }

/* Profile form */
.profile-form { display: flex; flex-direction: column; gap: 1.1rem; }
.form-field   { display: flex; flex-direction: column; gap: 0.4rem; }
.form-label   { color: var(--skin-grey); font-family: var(--font-body); }

.profile-input {
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--skin-border);
  border-radius: 8px;
  background: var(--skin-offwhite);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--skin-text);
  outline: none;
  transition: var(--transition);
}

.profile-input:focus {
  border-color: var(--skin-accent);
  background: var(--skin-white);
  box-shadow: 0 0 0 3px rgba(197,53,80,0.07);
}

.form-actions { display: flex; gap: 0.75rem; padding-top: 0.5rem; }

/* Logout */
.danger-zone { display: flex; }

.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Placeholder tabs */
.placeholder-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 40vh;
  text-align: center;
}

.placeholder-icon { font-size: 2.5rem; color: var(--skin-grey-light); }

.placeholder-title {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--skin-text);
}

.placeholder-sub { font-size: 0.875rem; color: var(--skin-grey); max-width: 360px; line-height: 1.7; }

@media (max-width: 768px) {
  .account-header-inner { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  .account-tab { padding: 0.85rem 1rem; }
  .info-row { grid-template-columns: 110px 1fr; }
}
</style>
