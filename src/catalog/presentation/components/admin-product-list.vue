<script setup>
import { computed, onMounted, ref } from 'vue'
import { catalogStore } from '../../application/catalog.store.js'
import AdminProductItem from './admin-product-item.vue'
import AdminProductForm from './admin-product-form.vue'

const products    = computed(() => catalogStore.products)
const isLoading   = computed(() => catalogStore.isLoading)

const searchQuery   = ref('')
const dialogVisible = ref(false)
const editingProduct = ref(null)
const isEditing      = ref(false)
const deleteDialog   = ref(false)
const pendingDelete  = ref(null)

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p =>
    p.name.toLowerCase().includes(q) || p.category?.name.toLowerCase().includes(q)
  )
})

onMounted(() => {
  catalogStore.fetchCategories()
  catalogStore.fetchProducts()
})

const openCreate = () => {
  editingProduct.value = null
  isEditing.value = false
  dialogVisible.value = true
}

const openEdit = (product) => {
  editingProduct.value = product
  isEditing.value = true
  dialogVisible.value = true
}

const closeDialog = () => { dialogVisible.value = false }

const onProductSaved = (data) => {
  if (isEditing.value) {
    catalogStore.updateProduct(data)
  } else {
    catalogStore.createProduct(data)
  }
  closeDialog()
}

const confirmDelete = (product) => {
  pendingDelete.value = product
  deleteDialog.value = true
}

const executeDelete = () => {
  if (!pendingDelete.value) return
  catalogStore.deleteProduct(pendingDelete.value.id)
  deleteDialog.value = false
  pendingDelete.value = null
}
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="admin-page-header">
      <div class="admin-header-text">
        <p class="label-wider admin-eyebrow">Admin</p>
        <h1 class="admin-title">Products</h1>
      </div>
      <button class="btn-primary" @click="openCreate">
        <i class="pi pi-plus" /> Add Product
      </button>
    </div>

    <!-- Search bar -->
    <div class="admin-controls">
      <div class="admin-search">
        <i class="pi pi-search search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          class="admin-search-input"
          placeholder="Search products..."
        />
      </div>
      <span class="label-wider" style="color:var(--skin-grey-light);">
        {{ filteredProducts.length }} products
      </span>
    </div>

    <!-- Table -->
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th class="label-wider">Image</th>
            <th class="label-wider">Product</th>
            <th class="label-wider">Price</th>
            <th class="label-wider">Stock</th>
            <th class="label-wider">Status</th>
            <th class="label-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="6" style="padding:2rem; text-align:center;">
              <pv-skeleton height="44px" />
            </td>
          </tr>
          <admin-product-item
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @edit-product="openEdit"
            @delete-product="confirmDelete"
          />
          <tr v-if="!isLoading && !filteredProducts.length">
            <td colspan="6" class="empty-row label-wider">No products found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Product form dialog -->
    <pv-dialog
      v-model:visible="dialogVisible"
      modal
      :header="isEditing ? 'Edit Product' : 'Add Product'"
      :style="{ width: '680px', maxWidth: '96vw' }"
      :draggable="false"
    >
      <admin-product-form
        :product="editingProduct"
        :is-editing="isEditing"
        @product-saved="onProductSaved"
        @cancel="closeDialog"
      />
    </pv-dialog>

    <!-- Delete confirmation dialog -->
    <pv-dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete Product"
      :style="{ width: '420px' }"
      :draggable="false"
    >
      <p style="color:var(--skin-grey); margin-bottom:1.5rem;">
        Are you sure you want to delete <strong>{{ pendingDelete?.name }}</strong>? This action cannot be undone.
      </p>
      <div style="display:flex; gap:0.75rem;">
        <button class="btn-primary" style="background:var(--skin-accent);" @click="executeDelete">
          Delete
        </button>
        <button class="btn-outline" @click="deleteDialog = false">Cancel</button>
      </div>
    </pv-dialog>
  </div>
</template>

<style scoped>
.admin-page {
  padding: 3rem 2rem 5rem;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.admin-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.admin-eyebrow { color: var(--skin-accent); margin-bottom: 0.25rem; }

.admin-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
}

/* Controls */
.admin-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.admin-search {
  position: relative;
  flex: 1;
  max-width: 360px;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--skin-grey-light);
  font-size: 0.82rem;
  pointer-events: none;
}

.admin-search-input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.3rem;
  border: 1px solid var(--skin-border);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  outline: none;
  transition: var(--transition);
  color: var(--skin-text);
  background: var(--skin-white);
}

.admin-search-input:focus { border-color: var(--skin-grey-light); }

/* Table */
.admin-table-wrap {
  border: 1px solid var(--skin-border);
  border-radius: 12px;
  overflow: hidden;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table thead tr {
  background: var(--skin-offwhite);
  border-bottom: 1px solid var(--skin-border);
}

.admin-table th {
  padding: 0.8rem 1rem;
  text-align: left;
  color: var(--skin-grey-light);
  font-weight: 500;
  font-family: var(--font-body);
}

.empty-row {
  text-align: center;
  color: var(--skin-grey-light);
  padding: 3rem 1rem !important;
}

@media (max-width: 768px) {
  .admin-page { padding: 2rem 1rem 4rem; }
  .admin-table thead { display: none; }
}
</style>
