<script setup>
import { computed } from 'vue'
import { WishlistItem } from '../../domain/model/wishlist-item.entity.js'

const props = defineProps({ item: { type: WishlistItem, required: true } })
const emit  = defineEmits(['move-to-cart', 'remove-item'])

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
  CATEGORY_GRADIENTS[props.item.product?.category?.name] || 'linear-gradient(145deg, #FAFAFA 0%, #EEEEEE 100%)'
)

const inStock = computed(() => props.item.product?.isInStock())
</script>

<template>
  <article class="product-card wishlist-card">

    <!-- Remove button -->
    <button class="remove-btn" aria-label="Remove from wishlist" @click.stop="emit('remove-item', item.product.id)">
      <i class="pi pi-times" />
    </button>

    <!-- Image area -->
    <div class="wish-img-box" :style="{ background: cardBg }">
      <div v-if="!inStock" class="out-of-stock-badge label-wider">Out of Stock</div>
      <div class="wish-img-placeholder">
        <span class="category-initial">{{ item.product?.category?.name?.[0] ?? '·' }}</span>
      </div>
    </div>

    <!-- Info -->
    <div class="wish-info">
      <p class="wish-category label-wide">{{ item.product?.category?.name }}</p>
      <h3 class="wish-name">{{ item.product?.name }}</h3>

      <div class="wish-rating">
        <span class="stars">
          <i
            v-for="n in 5"
            :key="n"
            class="pi"
            :class="n <= Math.round(item.product?.rating ?? 0) ? 'pi-star-fill' : 'pi-star'"
          />
        </span>
        <span class="rating-count">({{ item.product?.reviewCount ?? 0 }})</span>
      </div>

      <p class="wish-price">${{ item.product?.price?.toFixed(2) }}</p>

      <p class="wish-added label-wider">Added {{ item.getFormattedDate() }}</p>

      <!-- CTA -->
      <button
        v-if="inStock"
        class="move-to-cart-btn label-wide"
        @click.stop="emit('move-to-cart', item.product)"
      >
        <i class="pi pi-shopping-bag" /> Move to Cart
      </button>
      <button
        v-else
        class="notify-btn label-wide"
      >
        Notify Me
      </button>
    </div>

  </article>
</template>

<style scoped>
.wishlist-card {
  position: relative;
  display: flex;
  flex-direction: column;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255,255,255,0.85);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--skin-grey);
  font-size: 0.75rem;
  transition: var(--transition);
  z-index: 2;
}

.remove-btn:hover {
  color: var(--skin-accent);
  background: var(--skin-white);
}

.wish-img-box {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.out-of-stock-badge {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--skin-light);
  color: var(--skin-accent);
  padding: 3px 12px;
  border-radius: 12px;
  font-size: 0.6rem;
  white-space: nowrap;
}

.wish-img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-initial {
  font-family: var(--font-heading);
  font-size: 4rem;
  font-weight: 700;
  color: rgba(0,0,0,0.08);
  user-select: none;
  line-height: 1;
}

.wish-info {
  padding: 1rem 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.wish-category { color: var(--skin-grey-light); }

.wish-name {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--skin-text);
  line-height: 1.3;
}

.wish-rating {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.1rem;
}

.stars { display: flex; gap: 1px; }
.stars .pi { font-size: 0.62rem; color: #F5A623; }
.rating-count { font-size: 0.7rem; color: var(--skin-grey-light); }

.wish-price {
  font-weight: 700;
  font-size: 1rem;
  color: var(--skin-text);
  margin-top: 0.2rem;
}

.wish-added {
  font-size: 0.62rem;
  color: var(--skin-grey-light);
  margin-bottom: 0.5rem;
}

.move-to-cart-btn {
  width: 100%;
  padding: 0.6rem;
  background: var(--skin-accent);
  color: var(--skin-white);
  border: none;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 0.78rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: auto;
}

.move-to-cart-btn:hover {
  background: var(--skin-dark);
}

.notify-btn {
  width: 100%;
  padding: 0.6rem;
  background: transparent;
  color: var(--skin-accent);
  border: 1px solid var(--skin-accent);
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 0.78rem;
  cursor: pointer;
  transition: var(--transition);
  margin-top: auto;
}

.notify-btn:hover {
  background: var(--skin-light);
}
</style>
