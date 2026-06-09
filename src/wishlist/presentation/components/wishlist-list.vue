<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { wishlistStore } from '../../application/wishlist.store.js'
import { cartStore }     from '../../../cart/application/cart.store.js'
import WishlistLineItem  from './wishlist-line-item.vue'

const router = useRouter()

const items     = computed(() => wishlistStore.wishlist.items)
const itemCount = computed(() => wishlistStore.wishlist.getItemCount())
const isEmpty   = computed(() => items.value.length === 0)

const onMoveToCart = (product) => {
  cartStore.addToCart(product, 1)
  wishlistStore.removeFromWishlist(product.id)
}

const onRemoveItem = (productId) => wishlistStore.removeFromWishlist(productId)

const clearAll = () => wishlistStore.clearWishlist()

const exploreProducts = () => router.push('/shop')
</script>

<template>
  <div class="wishlist-page">

    <!-- Header strip -->
    <div class="wishlist-header">
      <div class="container wishlist-header-inner">
        <div class="breadcrumb label-wide">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">My Wishlist</span>
        </div>
        <p v-if="!isEmpty" class="wishlist-count label-wider">
          {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
        </p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="isEmpty" class="wishlist-empty">
      <i class="pi pi-heart empty-icon" />
      <h2 class="empty-title">Your wishlist is empty</h2>
      <p class="empty-subtitle">Save products you love to revisit them later.</p>
      <button class="btn-primary" @click="exploreProducts">
        Explore Products
      </button>
    </div>

    <!-- Wishlist grid -->
    <div v-else class="container wishlist-body">

      <div class="wishlist-grid">
        <wishlist-line-item
          v-for="item in items"
          :key="item.product.id"
          :item="item"
          @move-to-cart="onMoveToCart"
          @remove-item="onRemoveItem"
        />
      </div>

      <!-- Bottom actions -->
      <div class="wishlist-actions">
        <button class="btn-outline" @click="clearAll">
          <i class="pi pi-trash" /> Clear Wishlist
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.wishlist-page {
  min-height: 80vh;
  background: var(--skin-offwhite);
  padding-bottom: 5rem;
}

/* Header strip */
.wishlist-header {
  background: var(--skin-light);
  height: 100px;
  display: flex;
  align-items: center;
}

.wishlist-header-inner {
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

.wishlist-count {
  font-size: 0.72rem;
  color: var(--skin-grey);
}

/* Empty state */
.wishlist-empty {
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

/* Body */
.wishlist-body {
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.wishlist-actions {
  display: flex;
  justify-content: flex-start;
}

/* Responsive */
@media (max-width: 1024px) {
  .wishlist-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .wishlist-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .wishlist-grid { grid-template-columns: 1fr; }
}
</style>
