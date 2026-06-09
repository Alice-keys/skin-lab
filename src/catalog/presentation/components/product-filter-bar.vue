<script setup>
import { ref } from 'vue'

const SORT_OPTIONS = [
  { label: 'Featured',        value: 'featured'   },
  { label: 'Price: Low–High', value: 'price-asc'  },
  { label: 'Price: High–Low', value: 'price-desc' },
  { label: 'Newest',          value: 'newest'     },
  { label: 'Most Popular',    value: 'popular'    }
]

const emit = defineEmits(['filter-changed'])

const selectedSort = ref('featured')

const handleSort = (value) => {
  selectedSort.value = value
  emit('filter-changed', { sortBy: value })
}
</script>

<template>
  <div class="filter-bar">
    <span class="filter-label label-wider">Sort:</span>
    <div class="sort-tabs">
      <button
        v-for="opt in SORT_OPTIONS"
        :key="opt.value"
        class="sort-tab label-wide"
        :class="{ 'sort-tab--active': selectedSort === opt.value }"
        @click="handleSort(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-label {
  flex-shrink: 0;
  color: var(--skin-grey-light);
}

.sort-tabs {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.sort-tab {
  background: transparent;
  border: none;
  padding: 0.35rem 0.75rem;
  color: var(--skin-grey);
  cursor: pointer;
  border-radius: 4px;
  transition: var(--transition);
  font-family: var(--font-body);
}

.sort-tab:hover {
  color: var(--skin-text);
  background: var(--skin-offwhite);
}

.sort-tab--active {
  color: var(--skin-accent);
  background: var(--skin-light);
}
</style>
