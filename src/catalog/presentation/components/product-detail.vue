<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { catalogStore }  from '../../application/catalog.store.js'
import { cartStore }     from '../../../cart/application/cart.store.js'
import { wishlistStore } from '../../../wishlist/application/wishlist.store.js'
import { authStore }     from '../../../identity/application/auth.store.js'

const { t } = useI18n()
const route  = useRoute()
const router = useRouter()

const product  = computed(() => catalogStore.currentProduct)
const reviews  = computed(() => catalogStore.currentProductReviews)
const isLoading = ref(true)

const quantity = ref(1)
const activeTab = ref('description')
const activeImageIndex = ref(0)

const CATEGORY_GRADIENTS = {
  'Serums':       'linear-gradient(145deg, #FDE7E8, #F5BFC2)',
  'Toners':       'linear-gradient(145deg, #E8F4FD, #BFD9F5)',
  'Cleansers':    'linear-gradient(145deg, #E8FDE9, #BFF5C1)',
  'Moisturizers': 'linear-gradient(145deg, #F3E8FD, #D9BFF5)',
  'Ampoules':     'linear-gradient(145deg, #FDEEE8, #F5C9BF)',
  'Lip Care':     'linear-gradient(145deg, #FDE7F0, #F5BFD2)',
  'Essences':     'linear-gradient(145deg, #E8FDFA, #BFF5EE)'
}

const cardBg = computed(() =>
  product.value
    ? CATEGORY_GRADIENTS[product.value.category?.name] || 'linear-gradient(145deg, #FAFAFA, #EEEEEE)'
    : '#FAFAFA'
)

const decreaseQty = () => { if (quantity.value > 1) quantity.value-- }
const increaseQty = () => { if (product.value && quantity.value < product.value.stock) quantity.value++ }

const addToCart = () => {
  if (product.value) cartStore.addToCart(product.value, quantity.value)
}

const isWishlisted = computed(() =>
  product.value ? wishlistStore.isInWishlist(product.value.id) : false
)

const toggleWishlist = () => {
  if (!authStore.isAuthenticated) { router.push('/login'); return }
  if (isWishlisted.value) {
    wishlistStore.removeFromWishlist(product.value.id)
  } else {
    wishlistStore.addToWishlist(product.value)
  }
}

onMounted(() => {
  catalogStore.fetchProductById(route.params.id)
  setTimeout(() => { isLoading.value = false }, 400)
})
</script>

<template>
  <div class="product-detail-page">

    <!-- Breadcrumb -->
    <div class="breadcrumb-bar container">
      <button class="breadcrumb-link label-wide" @click="router.push('/shop')">
        <i class="pi pi-arrow-left" /> Shop
      </button>
      <span class="breadcrumb-sep">/</span>
      <span class="label-wide breadcrumb-current">{{ product?.category?.name ?? '...' }}</span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading || !product" class="container detail-layout">
      <div class="detail-gallery">
        <pv-skeleton height="480px" border-radius="16px" />
        <div class="thumbnail-row">
          <pv-skeleton v-for="n in 4" :key="n" width="80px" height="80px" border-radius="8px" />
        </div>
      </div>
      <div class="detail-info" style="display:flex; flex-direction:column; gap:1rem;">
        <pv-skeleton width="30%" height="14px" />
        <pv-skeleton width="75%" height="36px" />
        <pv-skeleton width="50%" height="20px" />
        <pv-skeleton width="100%" height="100px" />
      </div>
    </div>

    <!-- Product detail -->
    <div v-else class="container detail-layout">

      <!-- Gallery -->
      <div class="detail-gallery">
        <div class="main-image" :style="product.images?.length ? {} : { background: cardBg }">
          <img
            v-if="product.images?.[activeImageIndex]"
            :src="product.images[activeImageIndex]"
            :alt="product.name"
            class="main-image-img"
          />
          <span v-else class="img-watermark">{{ product.category?.name?.[0] ?? '·' }}</span>
          <span v-if="product.tag" class="detail-tag label-wider">{{ product.tag }}</span>
        </div>
        <div v-if="product.images?.length > 1" class="thumbnail-row">
          <div
            v-for="(img, i) in product.images"
            :key="i"
            class="thumbnail"
            :class="{ 'thumbnail--active': activeImageIndex === i }"
            @click="activeImageIndex = i"
          >
            <img :src="img" :alt="`${product.name} ${i + 1}`" class="thumbnail-img" />
          </div>
        </div>
      </div>

      <!-- Info panel -->
      <div class="detail-info">
        <p class="label-wider detail-category">{{ product.category?.name }}</p>
        <h1 class="detail-name">{{ product.name }}</h1>

        <div class="detail-rating">
          <div class="stars">
            <i v-for="n in 5" :key="n" class="pi" :class="n <= Math.round(product.rating) ? 'pi-star-fill' : 'pi-star'" />
          </div>
          <span class="rating-text">{{ product.rating }} ({{ product.reviewCount }} reviews)</span>
        </div>

        <p class="detail-price">{{ product.getFormattedPrice() }}</p>

        <!-- Skin types -->
        <div v-if="product.skinTypes.length" class="skin-types">
          <p class="label-wider skin-types-label">Skin Types</p>
          <div class="skin-type-chips">
            <span v-for="st in product.skinTypes" :key="st" class="skin-chip label-wide">{{ st }}</span>
          </div>
        </div>

        <!-- Quantity -->
        <div class="qty-row">
          <p class="label-wider qty-label">Quantity</p>
          <div class="qty-selector">
            <button class="qty-btn" @click="decreaseQty">−</button>
            <span class="qty-value">{{ quantity }}</span>
            <button class="qty-btn" @click="increaseQty">+</button>
          </div>
          <span v-if="product.isLowStock()" class="low-stock-label label-wider">
            Only {{ product.stock }} left
          </span>
        </div>

        <!-- CTAs -->
        <div class="detail-cta">
          <button
            class="btn-primary cta-cart"
            :disabled="!product.isInStock()"
            @click="addToCart"
          >
            <i class="pi pi-shopping-bag" /> {{ t('common.add-to-cart') }}
          </button>
          <button
            class="btn-outline cta-wishlist"
            :class="{ 'cta-wishlist--active': isWishlisted }"
            @click="toggleWishlist"
          >
            <i :class="isWishlisted ? 'pi pi-heart-fill' : 'pi pi-heart'" />
            {{ isWishlisted ? 'Wishlisted' : t('common.add-to-wishlist') }}
          </button>
        </div>

        <div v-if="!product.isInStock()" class="out-of-stock-msg label-wider">
          This product is currently out of stock.
        </div>

        <!-- Tabs -->
        <div class="detail-tabs">
          <button
            v-for="tab in ['description', 'ingredients']"
            :key="tab"
            class="detail-tab label-wide"
            :class="{ 'detail-tab--active': activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </div>

        <div class="tab-content">
          <p v-if="activeTab === 'description'" class="detail-description">
            {{ product.description }}
          </p>
          <ul v-else class="ingredients-list">
            <li v-for="ing in product.ingredients" :key="ing" class="ingredient-item label-wide">
              {{ ing }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Reviews section -->
    <div v-if="reviews.length" class="reviews-section">
      <div class="container">
        <h2 class="reviews-title">Customer Reviews</h2>
        <div class="reviews-grid">
          <div v-for="review in reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <div class="reviewer-avatar">{{ review.customerName[0] }}</div>
              <div>
                <p class="reviewer-name">{{ review.customerName }}</p>
                <p class="review-date label-wider">{{ review.getFormattedDate() }}</p>
              </div>
              <div class="review-stars">
                <i v-for="n in 5" :key="n" class="pi"
                   :class="n <= review.rating ? 'pi-star-fill' : 'pi-star'" />
              </div>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.product-detail-page {
  background: var(--skin-white);
  padding-bottom: 5rem;
}

/* Breadcrumb */
.breadcrumb-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
}

.breadcrumb-link {
  background: none;
  border: none;
  color: var(--skin-grey);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: var(--transition);
  font-family: var(--font-body);
}

.breadcrumb-link:hover { color: var(--skin-accent); }

.breadcrumb-sep { color: var(--skin-grey-light); }
.breadcrumb-current { color: var(--skin-grey); }

/* Layout */
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding-top: 2rem;
  align-items: start;
}

/* Gallery */
.detail-gallery { display: flex; flex-direction: column; gap: 1rem; }

.main-image {
  height: 480px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.main-image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-watermark {
  font-family: var(--font-heading);
  font-size: 10rem;
  font-weight: 700;
  color: rgba(0,0,0,0.06);
  user-select: none;
}

.detail-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--skin-accent);
  color: var(--skin-white);
  padding: 4px 12px;
  border-radius: 2px;
}

.thumbnail-row {
  display: flex;
  gap: 0.75rem;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
}

.thumbnail--active { border-color: var(--skin-accent); }
.thumbnail:hover   { border-color: var(--skin-soft); }

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

/* Info panel */
.detail-info { display: flex; flex-direction: column; gap: 1.25rem; }

.detail-category { color: var(--skin-accent); }

.detail-name {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 700;
  line-height: 1.1;
}

.detail-rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stars { display: flex; gap: 2px; }
.stars .pi { font-size: 0.85rem; color: #F5A623; }

.rating-text { font-size: 0.82rem; color: var(--skin-grey); }

.detail-price {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--skin-text);
  font-family: var(--font-body);
}

/* Skin types */
.skin-types { display: flex; flex-direction: column; gap: 0.5rem; }
.skin-types-label { color: var(--skin-grey-light); }
.skin-type-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.skin-chip {
  padding: 4px 12px;
  border: 1px solid var(--skin-border);
  border-radius: 999px;
  color: var(--skin-grey);
  background: var(--skin-offwhite);
}

/* Quantity */
.qty-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.qty-label { color: var(--skin-grey-light); }

.qty-selector {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--skin-border);
  border-radius: 4px;
  overflow: hidden;
}

.qty-btn {
  background: var(--skin-offwhite);
  border: none;
  width: 36px;
  height: 36px;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--skin-text);
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover { background: var(--skin-border); }

.qty-value {
  width: 48px;
  text-align: center;
  font-weight: 600;
  border-left: 1px solid var(--skin-border);
  border-right: 1px solid var(--skin-border);
  height: 36px;
  line-height: 36px;
  font-size: 0.9rem;
}

.low-stock-label { color: #E67E22; }

/* CTAs */
.detail-cta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.cta-cart { flex: 1; justify-content: center; }
.cta-wishlist { flex: 0 0 auto; }
.cta-wishlist--active { color: var(--skin-accent); border-color: var(--skin-accent); }

.out-of-stock-msg { color: var(--skin-grey-light); }

/* Tabs */
.detail-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--skin-border);
  margin-top: 0.5rem;
}

.detail-tab {
  background: none;
  border: none;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  color: var(--skin-grey);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: var(--transition);
  font-family: var(--font-body);
}

.detail-tab:hover { color: var(--skin-text); }
.detail-tab--active { color: var(--skin-accent); border-bottom-color: var(--skin-accent); }

.tab-content { padding-top: 0.5rem; }

.detail-description {
  font-size: 0.9rem;
  color: var(--skin-grey);
  line-height: 1.8;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ingredient-item {
  padding: 4px 12px;
  background: var(--skin-offwhite);
  border: 1px solid var(--skin-border);
  border-radius: 999px;
  color: var(--skin-grey);
}

/* Reviews */
.reviews-section {
  background: var(--skin-offwhite);
  padding: 4rem 0;
  margin-top: 4rem;
  border-top: 1px solid var(--skin-border);
}

.reviews-title {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  margin-bottom: 2rem;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.review-card {
  background: var(--skin-white);
  border: 1px solid var(--skin-border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: var(--transition);
}

.review-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.05); }

.review-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.reviewer-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--skin-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--skin-accent);
  flex-shrink: 0;
}

.reviewer-name { font-weight: 600; font-size: 0.9rem; }
.review-date   { color: var(--skin-grey-light); }

.review-stars {
  margin-left: auto;
  display: flex;
  gap: 1px;
}
.review-stars .pi { font-size: 0.7rem; color: #F5A623; }

.review-comment {
  font-size: 0.875rem;
  color: var(--skin-grey);
  line-height: 1.7;
}

/* Responsive */
@media (max-width: 900px) {
  .detail-layout { grid-template-columns: 1fr; gap: 2rem; }
  .main-image    { height: 360px; }
  .reviews-grid  { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .thumbnail-row { display: none; }
  .detail-cta    { flex-direction: column; }
  .cta-cart      { flex: 1 1 auto; }
}
</style>
