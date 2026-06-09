<script setup>
import { Category } from '../../domain/model/category.entity.js'
import CategoryItem from './category-item.vue'

const props = defineProps({
  categories:       { type: Array,    required: true },
  selectedCategory: { type: Category, default: null }
})

const emit = defineEmits(['category-selected'])

const allCategory = new Category({ id: '', name: 'All', productCount: 0 })

const isAllActive = () => !props.selectedCategory

const handleSelect = (cat) => {
  emit('category-selected', cat.id === '' ? null : cat)
}
</script>

<template>
  <div class="category-list">
    <category-item
      :category="allCategory"
      :is-active="isAllActive()"
      @category-selected="handleSelect"
    />
    <category-item
      v-for="cat in categories"
      :key="cat.id"
      :category="cat"
      :is-active="selectedCategory?.id === cat.id"
      @category-selected="handleSelect"
    />
  </div>
</template>

<style scoped>
.category-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
