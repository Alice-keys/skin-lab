<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Product } from '../../domain/model/product.entity.js'
import { wishlistStore } from '../../../wishlist/application/wishlist.store.js'
import { authStore }     from '../../../identity/application/auth.store.js'

const props = defineProps({ product: { type: Product, required: true } })
const emit  = defineEmits(['add-to-cart'])

const router = useRouter()

const isWishlisted = computed(() => wishlistStore.isInWishlist(props.product.id))

const CATEGORY_GRADIENTS = {
  'Serums':       'linear-gradient(145deg, #FDE7E8 0%, #F5BFC2 100%)',
  'Toners':       'linear-gradient(145deg, #E8F4FD 0%, #BFD9F5 100%)',
  'Cleansers':    'linear-gradient(145deg, #E8FDE9 0%, #BFF5C1 100%)',
  'Moisturizers': 'linear-gradient(145deg, #F3E8FD 0%, #D9BFF5 100%)',
  'Ampoules':     'linear-gradient(145deg, #FDEEE8 0%, #F5C9BF 100%)',
  'Lip Care':     'linear-gradient(145deg, #FDE7F0 0%, #F5BFD2 100%)',
  'Essences':     'linear-gradient(145deg, #E8FDFA 0%, #BFF5EE 100%)'
}

const cardBg = computed(() =>
  CATEGORY_GRADIENTS[props.product.category?.name] || 'linear-gradient(145deg, #FAFAFA 0%, #EEEEEE 100%)'
)

const tagClass = computed(() => ({
  'tag--new':        props.product.tag === 'NEW',
  'tag--bestseller': props.product.tag === 'BESTSELLER'
}))

const stockLabel = computed(() => {
  if (!props.product.isInStock()) return 'out-of-stock'
  if (props.product.isLowStock())  return 'low-stock'
  return null
})

const goToDetail = () => router.push(`/shop/${props.product.id}`)

const addToCart = (e) => {
  e.stopPropagation()
  emit('add-to-cart', props.product)
}

const toggleWishlist = (e) => {
  e.stopPropagation()
  if (!authStore.isAuthenticated) { router.push('/login'); return }
  if (isWishlisted.value) {
    wishlistStore.removeFromWishlist(props.product.id)
  } else {
    wishlistStore.addToWishlist(props.product)
  }
}
</script>

<template>
  <article class="product-card" @click="goToDetail">

    <!-- Image area -->
    <div class="product-img-box" :style="{ background: cardBg }">
      <span v-if="product.tag" class="product-tag label-wider" :class="tagClass">
        {{ product.tag }}
      </span>
      <button
        class="wishlist-btn"
        :class="{ 'wishlist-btn--active': isWishlisted }"
        :aria-label="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
        @click="toggleWishlist"
      >
        <i :class="isWishlisted ? 'pi pi-heart-fill' : 'pi pi-heart'" />
      </button>
      <div v-if="stockLabel === 'out-of-stock'" class="stock-overlay label-wider">
        Out of Stock
      </div>
      <img
        v-if="product.images?.[0]"
        :src="product.images[0]"
        :alt="product.name"
        class="product-img"
      />
      <div v-else class="product-img-placeholder">
        <span class="category-initial">{{ product.category?.name?.[0] ?? '·' }}</span>
      </div>
    </div>

    <!-- Info area -->
    <div class="product-info">
      <p class="product-category label-wider">{{ product.category?.name }}</p>
      <h3 class="product-name">{{ product.name }}</h3>

      <div class="product-rating">
        <span class="stars">
          <i v-for="n in 5" :key="n" class="pi" :class="n <= Math.round(product.rating) ? 'pi-star-fill' : 'pi-star'" />
        </span>
        <span class="rating-count">({{ product.reviewCount }})</span>
      </div>

      <div class="product-footer">
        <span class="product-price">{{ product.getFormattedPrice() }}</span>
        <button
          class="add-btn label-wide"
          :disabled="!product.isInStock()"
          @click="addToCart"
        >
          Add to Cart
        </button>
      </div>
    </div>

  </article>
</template>

<style scoped>
.product-img-box {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 3px 10px;
  border-radius: 2px;
  color: var(--skin-white);
}

.tag--new        { background: var(--skin-accent); }
.tag--bestseller { background: var(--skin-text); }

.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255,255,255,0.85);
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--skin-grey);
  font-size: 0.85rem;
  transition: var(--transition);
  opacity: 0;
}

.product-card:hover .wishlist-btn,
.wishlist-btn--active {
  opacity: 1;
}

.wishlist-btn:hover,
.wishlist-btn--active {
  color: var(--skin-accent);
  background: var(--skin-white);
}

.stock-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--skin-grey);
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-initial {
  font-family: var(--font-heading);
  font-size: 5rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.08);
  user-select: none;
  line-height: 1;
}

/* Info */
.product-info {
  padding: 1.1rem 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.product-category {
  color: var(--skin-grey-light);
}

.product-name {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.3;
  color: var(--skin-text);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.1rem;
}

.stars {
  display: flex;
  gap: 1px;
}

.stars .pi {
  font-size: 0.65rem;
  color: #F5A623;
}

.rating-count {
  font-size: 0.72rem;
  color: var(--skin-grey-light);
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  gap: 0.5rem;
}

.product-price {
  font-weight: 600;
  font-size: 1rem;
  color: var(--skin-text);
  font-family: var(--font-body);
}

.add-btn {
  background: transparent;
  border: 1px solid var(--skin-border);
  padding: 0.4rem 0.85rem;
  border-radius: 4px;
  color: var(--skin-grey);
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-body);
  white-space: nowrap;
}

.add-btn:hover:not(:disabled) {
  background: var(--skin-accent);
  border-color: var(--skin-accent);
  color: var(--skin-white);
}

.add-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
