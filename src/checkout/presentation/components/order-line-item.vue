<script setup>
import { computed } from 'vue'
import { Order } from '../../domain/model/order.entity.js'

const props = defineProps({ order: { type: Order, required: true } })
const emit  = defineEmits(['track-order'])

const STATUS_STYLE = {
  delivered:  { bg: '#E8F8F1', color: '#18A262' },
  processing: { bg: 'var(--skin-light)', color: 'var(--skin-accent)' },
  shipped:    { bg: '#E8EEFF', color: '#2B4BCC' },
  cancelled:  { bg: '#F5F5F5', color: 'var(--skin-grey)' },
  pending:    { bg: 'var(--skin-light)', color: 'var(--skin-accent)' }
}

const badgeStyle = computed(() => STATUS_STYLE[props.order.status] ?? STATUS_STYLE.pending)

const productsSummary = computed(() => {
  const names = props.order.items.map(i => i.productName)
  return names.length <= 2 ? names.join(', ') : `${names[0]}, ${names[1]} +${names.length - 2} more`
})
</script>

<template>
  <div class="order-row">

    <div class="order-number">
      <p class="label-wide number-text">{{ order.orderNumber }}</p>
      <p class="order-date label-wider">{{ order.getFormattedDate() }}</p>
    </div>

    <div class="order-products">
      <p class="products-summary">{{ productsSummary }}</p>
      <p class="items-count label-wider">{{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'items' }}</p>
    </div>

    <p class="order-total">${{ order.total.toFixed(2) }}</p>

    <span
      class="status-badge label-wider"
      :style="{ background: badgeStyle.bg, color: badgeStyle.color }"
    >
      {{ order.getStatusLabel() }}
    </span>

    <button class="track-btn label-wide" @click="emit('track-order', order)">
      <i class="pi pi-map-marker" /> Track
    </button>

  </div>
</template>

<style scoped>
.order-row {
  display: grid;
  grid-template-columns: 1.8fr 2fr 0.8fr 1fr 0.8fr;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid var(--skin-border);
  background: var(--skin-white);
  transition: background 0.15s;
}

.order-row:last-child { border-bottom: none; }
.order-row:hover { background: var(--skin-offwhite); }

.number-text {
  color: var(--skin-accent);
  font-weight: 600;
  font-size: 0.82rem;
}

.order-date {
  color: var(--skin-grey-light);
  font-size: 0.7rem;
  margin-top: 2px;
}

.products-summary {
  font-size: 0.85rem;
  color: var(--skin-text);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.items-count {
  font-size: 0.7rem;
  color: var(--skin-grey-light);
  margin-top: 2px;
}

.order-total {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--skin-text);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
}

.track-btn {
  background: none;
  border: 1px solid var(--skin-border);
  border-radius: 6px;
  padding: 0.45rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: var(--skin-grey);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
}

.track-btn:hover {
  border-color: var(--skin-accent);
  color: var(--skin-accent);
}

@media (max-width: 768px) {
  .order-row {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
  }

  .order-products { grid-column: 1 / -1; }
}
</style>
