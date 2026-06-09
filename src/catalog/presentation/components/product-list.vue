<script setup>
import { computed, onMounted, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { catalogStore } from '../../application/catalog.store.js'
import { cartStore }    from '../../../cart/application/cart.store.js'
import { ProductFilter } from '../../domain/model/product-filter.entity.js'
import SearchBar from './search-bar.vue'
import CategoryList from './category-list.vue'
import ProductFilterBar from './product-filter-bar.vue'
import ProductItem from './product-item.vue'

const { t } = useI18n()

const products    = computed(() => catalogStore.displayedProducts)
const categories  = computed(() => catalogStore.categories)
const selected    = computed(() => catalogStore.selectedCategory)
const isLoading   = computed(() => catalogStore.isLoading)

onMounted(() => {
  catalogStore.fetchCategories()
  catalogStore.fetchProducts()
})

const onSearch = (query) => catalogStore.searchProducts(query)

const onCategorySelected = (cat) => catalogStore.filterByCategory(cat)

const onFilterChanged = (change) => {
  const current = catalogStore.activeFilter
  catalogStore.applyFilter(new ProductFilter({
    categoryId: current.categoryId,
    sortBy:     change.sortBy ?? current.sortBy,
    minPrice:   current.minPrice,
    maxPrice:   current.maxPrice,
    skinType:   current.skinType
  }))
}

const onAddToCart = (product) => cartStore.addToCart(product, 1)
</script>

<template>
  <div class="shop-page">
    <div class="shop-header">
      <div class="container">
        <p class="label-wider shop-eyebrow">Shop</p>
        <h1 class="shop-title">Skincare Collection</h1>
      </div>
    </div>

    <div class="container shop-body">
      <!-- Controls row -->
      <div class="controls-row">
        <search-bar @search-submitted="onSearch" />
        <product-filter-bar @filter-changed="onFilterChanged" />
      </div>

      <!-- Category chips -->
      <category-list
        :categories="categories"
        :selected-category="selected"
        @category-selected="onCategorySelected"
      />

      <!-- Results count -->
      <div class="results-meta">
        <span class="label-wider">
          {{ isLoading ? t('common.loading') : `${products.length} products` }}
        </span>
        <button
          v-if="selected"
          class="clear-filter-btn label-wide"
          @click="onCategorySelected(null)"
        >
          <i class="pi pi-times" style="font-size:0.65rem;" /> Clear filter
        </button>
      </div>

      <!-- Skeleton loading -->
      <div v-if="isLoading" class="products-grid">
        <div v-for="n in 8" :key="n" class="product-skeleton">
          <pv-skeleton height="240px" border-radius="12px 12px 0 0" />
          <div style="padding:1.1rem; display:flex; flex-direction:column; gap:0.5rem;">
            <pv-skeleton width="50%" height="12px" />
            <pv-skeleton width="85%" height="16px" />
            <pv-skeleton width="35%" height="14px" />
          </div>
        </div>
      </div>

      <!-- Products grid -->
      <div v-else-if="products.length" class="products-grid">
        <product-item
          v-for="product in products"
          :key="product.id"
          :product="product"
          @add-to-cart="onAddToCart"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <i class="pi pi-search" style="font-size:2rem; color:var(--skin-grey-light);" />
        <p class="label-wide" style="color:var(--skin-grey-light);">No products found</p>
        <button class="btn-outline" @click="catalogStore.searchProducts(''); onCategorySelected(null)">
          Clear filters
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-header {
  background: var(--skin-offwhite);
  padding: 4rem 0 3rem;
  border-bottom: 1px solid var(--skin-border);
}

.shop-eyebrow {
  color: var(--skin-accent);
  margin-bottom: 0.5rem;
}

.shop-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
}

.shop-body {
  padding-top: 2.5rem;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.results-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.results-meta .label-wider {
  color: var(--skin-grey-light);
}

.clear-filter-btn {
  background: none;
  border: none;
  color: var(--skin-accent);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: var(--font-body);
  transition: var(--transition);
}

.clear-filter-btn:hover {
  opacity: 0.7;
}

/* Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.product-skeleton {
  border: 1px solid var(--skin-border);
  border-radius: 12px;
  overflow: hidden;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 40vh;
}

/* Responsive */
@media (max-width: 1200px) {
  .products-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 900px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .products-grid { grid-template-columns: 1fr; }
  .controls-row  { flex-direction: column; align-items: flex-start; }
}
</style>
