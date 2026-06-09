<script setup>
import { Category } from '../../domain/model/category.entity.js'

const props = defineProps({
  category: { type: Category, required: true },
  isActive:  { type: Boolean, default: false }
})

const emit = defineEmits(['category-selected'])
</script>

<template>
  <button
    class="category-chip label-wide"
    :class="{ 'category-chip--active': isActive }"
    @click="emit('category-selected', category)"
  >
    {{ category.name }}
    <span v-if="category.productCount" class="chip-count">{{ category.productCount }}</span>
  </button>
</template>

<style scoped>
.category-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 1.1rem;
  background: transparent;
  border: 1px solid var(--skin-border);
  border-radius: 999px;
  color: var(--skin-grey);
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  font-family: var(--font-body);
}

.category-chip:hover {
  border-color: var(--skin-accent);
  color: var(--skin-accent);
}

.category-chip--active {
  background: var(--skin-accent);
  border-color: var(--skin-accent);
  color: var(--skin-white);
}

.chip-count {
  font-size: 0.62rem;
  background: rgba(255, 255, 255, 0.25);
  padding: 1px 5px;
  border-radius: 999px;
}

.category-chip--active .chip-count {
  background: rgba(255,255,255,0.25);
}

.category-chip:not(.category-chip--active) .chip-count {
  background: var(--skin-offwhite);
  color: var(--skin-grey-light);
}
</style>
