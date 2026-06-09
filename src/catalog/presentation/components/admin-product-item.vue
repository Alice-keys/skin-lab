<script setup>
import { computed } from 'vue'
import { Product } from '../../domain/model/product.entity.js'

const props = defineProps({ product: { type: Product, required: true } })
const emit  = defineEmits(['edit-product', 'delete-product'])

const CATEGORY_COLORS = {
  'Serums':       '#FDE7E8', 'Toners':       '#E8F4FD',
  'Cleansers':    '#E8FDE9', 'Moisturizers': '#F3E8FD',
  'Ampoules':     '#FDEEE8', 'Lip Care':     '#FDE7F0',
  'Essences':     '#E8FDFA'
}

const imgBg = computed(() => CATEGORY_COLORS[props.product.category?.name] || '#FAFAFA')

const statusInfo = computed(() => {
  if (!props.product.isInStock())  return { label: 'Out of Stock', cls: 'status--out' }
  if (props.product.isLowStock())  return { label: 'Low Stock',    cls: 'status--low' }
  return                                  { label: 'Active',       cls: 'status--active' }
})
</script>

<template>
  <tr class="admin-product-row">
    <td class="col-img">
      <div class="product-thumb" :style="{ background: imgBg }">
        <span class="thumb-initial">{{ product.category?.name?.[0] ?? '·' }}</span>
      </div>
    </td>
    <td class="col-info">
      <p class="row-name">{{ product.name }}</p>
      <p class="row-category label-wider">{{ product.category?.name }}</p>
    </td>
    <td class="col-price">{{ product.getFormattedPrice() }}</td>
    <td class="col-stock">
      <span :class="{ 'stock-low': product.isLowStock(), 'stock-out': !product.isInStock() }">
        {{ product.stock }}
      </span>
    </td>
    <td class="col-status">
      <span class="status-badge label-wider" :class="statusInfo.cls">
        {{ statusInfo.label }}
      </span>
    </td>
    <td class="col-actions">
      <button class="action-btn action-btn--edit" aria-label="Edit" @click="emit('edit-product', product)">
        <i class="pi pi-pencil" />
      </button>
      <button class="action-btn action-btn--delete" aria-label="Delete" @click="emit('delete-product', product)">
        <i class="pi pi-trash" />
      </button>
    </td>
  </tr>
</template>

<style scoped>
.admin-product-row {
  border-bottom: 1px solid var(--skin-border);
  transition: var(--transition);
}

.admin-product-row:hover { background: var(--skin-offwhite); }

td { padding: 0.9rem 1rem; vertical-align: middle; }

/* Thumb */
.col-img { width: 60px; }
.product-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb-initial {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 700;
  color: rgba(0,0,0,0.15);
}

/* Info */
.row-name     { font-weight: 500; font-size: 0.88rem; color: var(--skin-text); }
.row-category { color: var(--skin-grey-light); margin-top: 2px; }

/* Price */
.col-price { font-weight: 600; font-size: 0.88rem; color: var(--skin-text); }

/* Stock */
.col-stock { font-size: 0.88rem; color: var(--skin-grey); }
.stock-low { color: #E67E22; font-weight: 600; }
.stock-out { color: var(--skin-accent); font-weight: 600; }

/* Status badge */
.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
}
.status--active { background: #E8FDE9; color: #27AE60; }
.status--low    { background: #FDF5E8; color: #E67E22; }
.status--out    { background: var(--skin-light); color: var(--skin-accent); }

/* Actions */
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
}

.action-btn--edit   { color: var(--skin-grey);   }
.action-btn--delete { color: var(--skin-grey);   }

.action-btn--edit:hover   { background: var(--skin-light);   color: var(--skin-accent); }
.action-btn--delete:hover { background: #FDEEE8; color: #C0392B; }
</style>
