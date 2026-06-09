<script setup>
import { computed } from 'vue'
import { CartItem } from '../../domain/model/cart-item.entity.js'

const props = defineProps({
  item:  { type: CartItem, required: true },
  index: { type: Number,   default: 0 }
})

const emit = defineEmits(['quantity-changed', 'item-removed'])

const categoryInitial = computed(() => props.item.product?.category?.name?.[0] ?? '·')

const decrease = () => {
  if (props.item.quantity <= 1) {
    emit('item-removed', props.item.product.id)
  } else {
    emit('quantity-changed', props.item.product.id, props.item.quantity - 1)
  }
}

const increase = () => {
  emit('quantity-changed', props.item.product.id, props.item.quantity + 1)
}

const remove = () => emit('item-removed', props.item.product.id)
</script>

<template>
  <div class="line-item" :class="{ 'line-item--alt': index % 2 !== 0 }">

    <!-- Thumbnail -->
    <div class="line-thumb">
      <span class="thumb-initial">{{ categoryInitial }}</span>
    </div>

    <!-- Info -->
    <div class="line-info">
      <p class="line-category label-wider">{{ item.product?.category?.name }}</p>
      <p class="line-name">{{ item.product?.name }}</p>
      <p class="line-unit-price">${{ item.unitPrice.toFixed(2) }} each</p>
    </div>

    <!-- Stepper -->
    <div class="line-stepper">
      <button class="stepper-btn" @click="decrease">−</button>
      <span class="stepper-qty">{{ item.quantity }}</span>
      <button class="stepper-btn" @click="increase">+</button>
    </div>

    <!-- Subtotal -->
    <p class="line-subtotal">${{ item.getSubtotal().toFixed(2) }}</p>

    <!-- Remove -->
    <button class="line-remove" aria-label="Remove item" @click="remove">
      <i class="pi pi-trash" />
    </button>

  </div>
</template>

<style scoped>
.line-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--skin-white);
  border-bottom: 1px solid var(--skin-border);
  transition: background 0.15s;
}

.line-item--alt {
  background: var(--skin-offwhite);
}

.line-thumb {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: var(--skin-light);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-initial {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 700;
  color: rgba(197, 53, 80, 0.25);
  user-select: none;
  line-height: 1;
}

.line-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.line-category {
  color: var(--skin-grey-light);
  font-size: 0.65rem;
}

.line-name {
  font-weight: 500;
  color: var(--skin-text);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-unit-price {
  font-size: 0.8rem;
  color: var(--skin-grey);
}

.line-stepper {
  display: flex;
  align-items: center;
  border: 1px solid var(--skin-border);
  border-radius: 4px;
  overflow: hidden;
  background: var(--skin-white);
  flex-shrink: 0;
}

.stepper-btn {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: var(--skin-accent);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.stepper-btn:hover {
  background: var(--skin-light);
}

.stepper-qty {
  width: 36px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  border-left: 1px solid var(--skin-border);
  border-right: 1px solid var(--skin-border);
  height: 32px;
  line-height: 32px;
}

.line-subtotal {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--skin-text);
  width: 72px;
  text-align: right;
  flex-shrink: 0;
}

.line-remove {
  background: none;
  border: none;
  color: var(--skin-grey-light);
  cursor: pointer;
  padding: 0.4rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.line-remove:hover {
  color: var(--skin-accent);
}

@media (max-width: 600px) {
  .line-unit-price { display: none; }
  .line-subtotal   { width: auto; }
}
</style>
