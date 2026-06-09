<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import LanguageSwitcher from './language-switcher.vue'
import { authStore } from '../../../identity/application/auth.store.js'
import { cartStore }     from '../../../cart/application/cart.store.js'
import { wishlistStore } from '../../../wishlist/application/wishlist.store.js'

const { t } = useI18n()
const router = useRouter()

const mobileMenuOpen = ref(false)

const cartCount     = computed(() => cartStore.getItemCount())
const wishlistCount = computed(() => wishlistStore.wishlist.getItemCount())

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin         = computed(() => authStore.isAdmin)
const accountRoute    = computed(() => isAdmin.value ? '/admin/profile' : '/account')

const navLinks = [
  { key: 'nav.shop',       to: '/shop' },
  { key: 'nav.categories', to: '/categories' },
  { key: 'nav.about',      to: '/about' }
]

const handleLogout = () => {
  authStore.logout()
  router.push('/')
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner container">

      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
        SKIN LAB
      </router-link>

      <!-- Desktop nav links -->
      <nav class="navbar-links">
        <router-link
          v-for="link in navLinks"
          :key="link.key"
          :to="link.to"
          class="navbar-link label-wide"
        >
          {{ t(link.key) }}
        </router-link>
      </nav>

      <!-- Actions -->
      <div class="navbar-actions">
        <language-switcher />

        <button class="nav-icon-btn" :aria-label="t('nav.search')">
          <i class="pi pi-search" />
        </button>

        <router-link to="/wishlist" class="nav-icon-btn" :aria-label="t('nav.wishlist')">
          <span class="icon-wrapper">
            <i class="pi pi-heart" />
            <span v-if="wishlistCount > 0" class="nav-badge">{{ wishlistCount }}</span>
          </span>
        </router-link>

        <router-link to="/cart" class="nav-icon-btn" :aria-label="t('nav.cart')">
          <span class="icon-wrapper">
            <i class="pi pi-shopping-bag" />
            <span v-if="cartCount > 0" class="nav-badge">{{ cartCount }}</span>
          </span>
        </router-link>

        <router-link
          :to="isAuthenticated ? accountRoute : '/login'"
          class="nav-icon-btn"
          :aria-label="t('nav.account')"
        >
          <i :class="isAuthenticated ? 'pi pi-user-edit' : 'pi pi-user'" />
        </router-link>

        <button
          v-if="isAuthenticated"
          class="nav-icon-btn"
          :aria-label="t('nav.logout')"
          @click="handleLogout"
        >
          <i class="pi pi-sign-out" />
        </button>

        <!-- Mobile hamburger -->
        <button
          class="nav-icon-btn mobile-only"
          :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <nav v-if="mobileMenuOpen" class="mobile-menu">
      <router-link
        v-for="link in navLinks"
        :key="link.key"
        :to="link.to"
        class="mobile-menu-link label-wide"
        @click="mobileMenuOpen = false"
      >
        {{ t(link.key) }}
      </router-link>
      <div class="mobile-menu-divider" />
      <router-link
        :to="isAuthenticated ? accountRoute : '/login'"
        class="mobile-menu-link label-wide"
        @click="mobileMenuOpen = false"
      >
        {{ isAuthenticated ? t('nav.account') : t('nav.login') }}
      </router-link>
      <button
        v-if="isAuthenticated"
        class="mobile-menu-link label-wide mobile-logout-btn"
        @click="handleLogout"
      >
        {{ t('nav.logout') }}
      </button>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--skin-white);
  border-bottom: 1px solid var(--skin-border);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: 2rem;
}

.navbar-logo {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--skin-text);
  text-decoration: none;
  text-transform: uppercase;
  flex-shrink: 0;
  transition: var(--transition);
}

.navbar-logo:hover {
  color: var(--skin-accent);
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  flex: 1;
  justify-content: center;
}

.navbar-link {
  color: var(--skin-text);
  text-decoration: none;
  transition: var(--transition);
  position: relative;
  padding-bottom: 2px;
}

.navbar-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--skin-accent);
  transition: var(--transition);
}

.navbar-link:hover,
.navbar-link.router-link-active {
  color: var(--skin-accent);
}

.navbar-link:hover::after,
.navbar-link.router-link-active::after {
  width: 100%;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.nav-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0.4rem;
  color: var(--skin-text);
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  font-size: 1rem;
}

.nav-icon-btn:hover {
  color: var(--skin-accent);
}

.icon-wrapper {
  position: relative;
  display: flex;
}

.nav-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: var(--skin-accent);
  color: var(--skin-white);
  font-size: 0.6rem;
  font-weight: 600;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mobile menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 1rem 2rem 1.5rem;
  border-top: 1px solid var(--skin-border);
  background: var(--skin-white);
  gap: 1.25rem;
}

.mobile-menu-link {
  color: var(--skin-text);
  text-decoration: none;
  transition: var(--transition);
}

.mobile-menu-link:hover {
  color: var(--skin-accent);
}

.mobile-menu-divider {
  height: 1px;
  background: var(--skin-border);
}

.mobile-logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  text-align: left;
  padding: 0;
  color: var(--skin-accent);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }
}

@media (min-width: 769px) {
  .mobile-only {
    display: none;
  }

  .mobile-menu {
    display: none !important;
  }
}
</style>
