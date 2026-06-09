<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../../application/auth.store.js'

const router = useRouter()

const admin     = computed(() => authStore.currentAdmin)
const isEditing = ref(false)

const form = reactive({ name: '', email: '' })

const pwdForm = reactive({ current: '', newPwd: '', confirm: '' })
const showPwdSection = ref(false)
const pwdError  = ref('')
const pwdSuccess = ref(false)

const resetForm = () => {
  form.name  = admin.value?.name  ?? ''
  form.email = admin.value?.email ?? ''
}

onMounted(() => {
  if (!authStore.isAdmin) {
    router.push('/login')
    return
  }
  resetForm()
})

const saveProfile = async () => {
  await authStore.updateProfile({ name: form.name, email: form.email })
  isEditing.value = false
}

const changePassword = async () => {
  pwdError.value   = ''
  pwdSuccess.value = false
  if (pwdForm.newPwd !== pwdForm.confirm) {
    pwdError.value = 'New passwords do not match.'
    return
  }
  if (pwdForm.newPwd.length < 8) {
    pwdError.value = 'Password must be at least 8 characters.'
    return
  }
  await authStore.changePassword(pwdForm.current, pwdForm.newPwd)
  pwdSuccess.value = true
  pwdForm.current = pwdForm.newPwd = pwdForm.confirm = ''
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="admin-profile-page">

    <div class="admin-page-header">
      <div class="admin-header-text">
        <p class="label-wider admin-eyebrow">Admin</p>
        <h1 class="admin-title">My Profile</h1>
      </div>
    </div>

    <div class="profile-layout">

      <!-- Profile card -->
      <div class="profile-card">

        <!-- Avatar + role -->
        <div class="admin-hero">
          <div class="admin-avatar">{{ admin?.getInitials() ?? 'A' }}</div>
          <div>
            <p class="admin-display-name">{{ admin?.getFullName() }}</p>
            <span class="role-badge label-wider">{{ admin?.role }}</span>
          </div>
          <button
            v-if="!isEditing"
            class="btn-outline-accent btn-sm ml-auto"
            @click="isEditing = true"
          >
            <i class="pi pi-pencil" /> Edit
          </button>
        </div>

        <div class="card-divider" />

        <!-- Info or form -->
        <div v-if="!isEditing" class="profile-info">
          <div class="info-row">
            <span class="info-label label-wider">Name</span>
            <span class="info-value">{{ admin?.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label label-wider">Email</span>
            <span class="info-value">{{ admin?.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label label-wider">Role</span>
            <span class="info-value">{{ admin?.role }}</span>
          </div>
        </div>

        <form v-else class="profile-form" @submit.prevent="saveProfile">
          <div class="form-field">
            <label class="form-label label-wide">Name</label>
            <input v-model="form.name" type="text" class="profile-input" required />
          </div>
          <div class="form-field">
            <label class="form-label label-wide">Email</label>
            <input v-model="form.email" type="email" class="profile-input" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="authStore.isLoading">
              <i v-if="authStore.isLoading" class="pi pi-spin pi-spinner" />
              <span v-else>Save Changes</span>
            </button>
            <button type="button" class="btn-outline" @click="isEditing = false; resetForm()">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Change password card -->
      <div class="profile-card">
        <div class="card-header">
          <h2 class="card-title">Security</h2>
          <button
            class="btn-outline-accent btn-sm"
            @click="showPwdSection = !showPwdSection"
          >
            {{ showPwdSection ? 'Cancel' : 'Change Password' }}
          </button>
        </div>

        <div v-if="!showPwdSection" class="security-hint">
          <i class="pi pi-lock" style="color:var(--skin-grey-light);" />
          <p class="label-wide" style="color:var(--skin-grey);">Password last updated recently.</p>
        </div>

        <form v-else class="profile-form" @submit.prevent="changePassword">
          <div v-if="pwdError" class="auth-error label-wide">{{ pwdError }}</div>
          <div v-if="pwdSuccess" class="auth-success label-wide">Password updated successfully.</div>

          <div class="form-field">
            <label class="form-label label-wide">Current Password</label>
            <input v-model="pwdForm.current" type="password" class="profile-input" required />
          </div>
          <div class="form-field">
            <label class="form-label label-wide">New Password</label>
            <input v-model="pwdForm.newPwd" type="password" class="profile-input" required />
          </div>
          <div class="form-field">
            <label class="form-label label-wide">Confirm New Password</label>
            <input v-model="pwdForm.confirm" type="password" class="profile-input" required />
          </div>
          <button type="submit" class="btn-primary" style="align-self:flex-start;" :disabled="authStore.isLoading">
            Update Password
          </button>
        </form>
      </div>

      <!-- Logout -->
      <div class="logout-section">
        <button class="btn-outline logout-btn" @click="handleLogout">
          <i class="pi pi-sign-out" /> Log Out
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.admin-profile-page {
  padding: 3rem 2rem 5rem;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.admin-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.admin-eyebrow { color: var(--skin-accent); margin-bottom: 0.25rem; }

.admin-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
}

/* Profile layout */
.profile-layout { display: flex; flex-direction: column; gap: 1.5rem; }

/* Cards */
.profile-card {
  border: 1px solid var(--skin-border);
  border-radius: 16px;
  padding: 2rem;
  background: var(--skin-white);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Admin hero row */
.admin-hero {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.admin-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--skin-accent);
  color: var(--skin-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 700;
  flex-shrink: 0;
}

.admin-display-name { font-weight: 600; font-size: 1rem; }

.role-badge {
  display: inline-block;
  background: var(--skin-light);
  color: var(--skin-accent);
  padding: 2px 10px;
  border-radius: 999px;
  margin-top: 4px;
}

.ml-auto { margin-left: auto; }

.card-divider { height: 1px; background: var(--skin-border); }

/* Info rows */
.profile-info { display: flex; flex-direction: column; gap: 0.85rem; }

.info-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: baseline;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--skin-border);
}

.info-row:last-child { border-bottom: none; }
.info-label { color: var(--skin-grey-light); }
.info-value  { font-size: 0.9rem; color: var(--skin-text); }

/* Card header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-sm { padding: 0.4rem 1rem; font-size: 0.72rem; }

/* Security hint */
.security-hint {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--skin-offwhite);
  border-radius: 8px;
}

/* Errors/success */
.auth-error {
  background: var(--skin-light);
  color: var(--skin-accent);
  border: 1px solid var(--skin-soft);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.72rem;
}

.auth-success {
  background: #E8FDE9;
  color: #27AE60;
  border: 1px solid #BFF5C1;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.72rem;
}

/* Form */
.profile-form { display: flex; flex-direction: column; gap: 1rem; }
.form-field   { display: flex; flex-direction: column; gap: 0.35rem; }
.form-label   { color: var(--skin-grey); }
.form-actions { display: flex; gap: 0.75rem; padding-top: 0.25rem; }

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

/* Logout */
.logout-section { display: flex; }

.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--skin-grey);
  border-color: var(--skin-border);
}

.logout-btn:hover {
  background: var(--skin-light);
  border-color: var(--skin-accent);
  color: var(--skin-accent);
}
</style>
