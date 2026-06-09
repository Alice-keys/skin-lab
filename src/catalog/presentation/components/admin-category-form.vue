<script setup>
import { reactive, watch } from 'vue'
import { Category } from '../../domain/model/category.entity.js'

const props = defineProps({
  category:  { type: Category, default: null },
  isEditing: { type: Boolean, default: false }
})

const emit = defineEmits(['category-saved', 'cancel'])

const form = reactive({ name: '', description: '' })

const resetForm = () => {
  form.name        = props.category?.name ?? ''
  form.description = props.category?.description ?? ''
}

watch(() => props.category, resetForm, { immediate: true })

const save = () => {
  const data = {
    ...(props.category ? { id: props.category.id, productCount: props.category.productCount } : {}),
    name:        form.name.trim(),
    description: form.description.trim()
  }
  emit('category-saved', data)
}
</script>

<template>
  <div class="admin-form">
    <h2 class="form-title">{{ isEditing ? 'Edit Category' : 'Add New Category' }}</h2>

    <div class="form-fields">
      <div class="form-field">
        <label class="form-label label-wide">Category Name</label>
        <input v-model="form.name" type="text" class="form-input" placeholder="e.g. Serums" />
      </div>
      <div class="form-field">
        <label class="form-label label-wide">Description</label>
        <textarea v-model="form.description" class="form-textarea" rows="3" placeholder="Describe this category..." />
      </div>
    </div>

    <div class="form-actions">
      <button class="btn-primary" @click="save">
        <i class="pi pi-check" /> {{ isEditing ? 'Save Changes' : 'Add Category' }}
      </button>
      <button class="btn-outline" @click="emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.admin-form { display: flex; flex-direction: column; gap: 1.5rem; }

.form-title {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 600;
}

.form-fields { display: flex; flex-direction: column; gap: 1.1rem; }
.form-field  { display: flex; flex-direction: column; gap: 0.4rem; }

.form-label {
  color: var(--skin-grey);
}

.form-input,
.form-textarea {
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--skin-border);
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--skin-text);
  background: var(--skin-white);
  outline: none;
  transition: var(--transition);
  width: 100%;
}

.form-input:focus,
.form-textarea:focus { border-color: var(--skin-grey-light); }

.form-textarea { resize: vertical; }

.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--skin-border);
}
</style>
