<script setup>
import { Category } from '../../domain/model/category.entity.js'

const props = defineProps({ category: { type: Category, required: true } })
const emit  = defineEmits(['edit-category', 'delete-category'])
</script>

<template>
  <tr class="admin-cat-row">
    <td class="col-name">{{ category.name }}</td>
    <td class="col-desc">{{ category.description }}</td>
    <td class="col-count">
      <span class="count-badge label-wide">{{ category.productCount }} products</span>
    </td>
    <td class="col-actions">
      <button class="action-btn action-btn--edit" aria-label="Edit" @click="emit('edit-category', category)">
        <i class="pi pi-pencil" />
      </button>
      <button class="action-btn action-btn--delete" aria-label="Delete" @click="emit('delete-category', category)">
        <i class="pi pi-trash" />
      </button>
    </td>
  </tr>
</template>

<style scoped>
.admin-cat-row {
  border-bottom: 1px solid var(--skin-border);
  transition: var(--transition);
}
.admin-cat-row:hover { background: var(--skin-offwhite); }

td { padding: 0.9rem 1rem; vertical-align: middle; }

.col-name { font-weight: 600; font-size: 0.9rem; color: var(--skin-text); }
.col-desc { font-size: 0.84rem; color: var(--skin-grey); max-width: 320px; }

.count-badge {
  background: var(--skin-offwhite);
  border: 1px solid var(--skin-border);
  padding: 3px 10px;
  border-radius: 999px;
  color: var(--skin-grey);
}

.col-actions { white-space: nowrap; }

.action-btn {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--skin-grey);
}

.action-btn--edit:hover   { background: var(--skin-light);   color: var(--skin-accent); }
.action-btn--delete:hover { background: #FDEEE8; color: #C0392B; }
</style>
