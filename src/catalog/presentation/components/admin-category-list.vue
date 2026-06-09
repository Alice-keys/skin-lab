<script setup>
import { computed, onMounted, ref } from 'vue'
import { catalogStore } from '../../application/catalog.store.js'
import AdminCategoryItem from './admin-category-item.vue'
import AdminCategoryForm from './admin-category-form.vue'

const categories  = computed(() => catalogStore.categories)

const dialogVisible   = ref(false)
const editingCategory = ref(null)
const isEditing       = ref(false)
const deleteDialog    = ref(false)
const pendingDelete   = ref(null)

onMounted(() => catalogStore.fetchCategories())

const openCreate = () => {
  editingCategory.value = null
  isEditing.value = false
  dialogVisible.value = true
}

const openEdit = (cat) => {
  editingCategory.value = cat
  isEditing.value = true
  dialogVisible.value = true
}

const closeDialog = () => { dialogVisible.value = false }

const onCategorySaved = (data) => {
  if (isEditing.value) {
    catalogStore.updateCategory(data)
  } else {
    catalogStore.createCategory(data)
  }
  closeDialog()
}

const confirmDelete = (cat) => {
  pendingDelete.value = cat
  deleteDialog.value = true
}

const executeDelete = () => {
  if (!pendingDelete.value) return
  catalogStore.deleteCategory(pendingDelete.value.id)
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
        <h1 class="admin-title">Categories</h1>
      </div>
      <button class="btn-primary" @click="openCreate">
        <i class="pi pi-plus" /> Add Category
      </button>
    </div>

    <!-- Summary -->
    <div class="categories-summary">
      <div class="summary-card" v-for="cat in categories" :key="cat.id">
        <span class="summary-name">{{ cat.name }}</span>
        <span class="summary-count label-wider">{{ cat.productCount }} products</span>
      </div>
    </div>

    <!-- Table -->
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th class="label-wider">Name</th>
            <th class="label-wider">Description</th>
            <th class="label-wider">Products</th>
            <th class="label-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          <admin-category-item
            v-for="cat in categories"
            :key="cat.id"
            :category="cat"
            @edit-category="openEdit"
            @delete-category="confirmDelete"
          />
          <tr v-if="!categories.length">
            <td colspan="4" class="empty-row label-wider">No categories found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Category form dialog -->
    <pv-dialog
      v-model:visible="dialogVisible"
      modal
      :header="isEditing ? 'Edit Category' : 'Add Category'"
      :style="{ width: '480px', maxWidth: '96vw' }"
      :draggable="false"
    >
      <admin-category-form
        :category="editingCategory"
        :is-editing="isEditing"
        @category-saved="onCategorySaved"
        @cancel="closeDialog"
      />
    </pv-dialog>

    <!-- Delete confirmation -->
    <pv-dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete Category"
      :style="{ width: '420px' }"
      :draggable="false"
    >
      <p style="color:var(--skin-grey); margin-bottom:1.5rem;">
        Are you sure you want to delete <strong>{{ pendingDelete?.name }}</strong>?
        All associated products will lose their category.
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

/* Summary pills */
.categories-summary {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: var(--skin-offwhite);
  border: 1px solid var(--skin-border);
  border-radius: 999px;
}

.summary-name { font-size: 0.85rem; font-weight: 500; color: var(--skin-text); }
.summary-count { color: var(--skin-grey-light); }

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
</style>
