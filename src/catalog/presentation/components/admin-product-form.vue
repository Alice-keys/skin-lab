<script setup>
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Product } from '../../domain/model/product.entity.js'
import { catalogStore } from '../../application/catalog.store.js'

const { t } = useI18n()

const props = defineProps({
  product:   { type: Product, default: null },
  isEditing: { type: Boolean, default: false }
})

const emit = defineEmits(['product-saved', 'cancel'])

const SKIN_TYPES = ['All', 'Normal', 'Oily', 'Dry', 'Combination', 'Sensitive', 'Mature', 'Acne-Prone', 'Dehydrated', 'Compromised']
const TAGS       = [{ label: 'None', value: null }, { label: 'NEW', value: 'NEW' }, { label: 'BESTSELLER', value: 'BESTSELLER' }]

const categories = computed(() => catalogStore.categories)

const form = reactive({
  name:          '',
  description:   '',
  price:         0,
  stock:         0,
  categoryId:    '',
  ingredientsRaw: '',
  skinTypes:     [],
  tag:           null,
  isNew:         false,
  images:        ['']
})

const resetForm = () => {
  if (props.product) {
    form.name           = props.product.name
    form.description    = props.product.description
    form.price          = props.product.price
    form.stock          = props.product.stock
    form.categoryId     = props.product.category?.id || ''
    form.ingredientsRaw = props.product.ingredients.join(', ')
    form.skinTypes      = [...props.product.skinTypes]
    form.tag            = props.product.tag
    form.isNew          = props.product.isNew
    form.images         = props.product.images.length ? [...props.product.images] : ['']
  } else {
    form.name = form.description = form.ingredientsRaw = form.categoryId = ''
    form.price = form.stock = 0
    form.skinTypes = []
    form.tag = null
    form.isNew = false
    form.images = ['']
  }
}

const addImageUrl    = () => form.images.push('')
const removeImageUrl = (i) => { if (form.images.length > 1) form.images.splice(i, 1) }

watch(() => props.product, resetForm, { immediate: true })

const toggleSkinType = (st) => {
  const idx = form.skinTypes.indexOf(st)
  if (idx === -1) form.skinTypes.push(st)
  else form.skinTypes.splice(idx, 1)
}

const save = () => {
  const selectedCategory = categories.value.find(c => c.id === form.categoryId) || null
  const data = {
    ...(props.product ? { id: props.product.id } : {}),
    name:        form.name.trim(),
    description: form.description.trim(),
    price:       Number(form.price),
    stock:       Number(form.stock),
    category:    selectedCategory,
    ingredients: form.ingredientsRaw.split(',').map(s => s.trim()).filter(Boolean),
    skinTypes:   [...form.skinTypes],
    tag:         form.tag,
    isNew:       form.isNew,
    rating:      props.product?.rating ?? 0,
    reviewCount: props.product?.reviewCount ?? 0,
    images:      form.images.map(u => u.trim()).filter(Boolean)
  }
  emit('product-saved', data)
}
</script>

<template>
  <div class="admin-form">
    <h2 class="form-title">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h2>

    <div class="form-grid">
      <!-- Name -->
      <div class="form-field form-field--full">
        <label class="form-label label-wide">Product Name</label>
        <input v-model="form.name" type="text" class="form-input" placeholder="e.g. Vitamin C Serum" />
      </div>

      <!-- Description -->
      <div class="form-field form-field--full">
        <label class="form-label label-wide">Description</label>
        <textarea v-model="form.description" class="form-textarea" rows="4" placeholder="Describe the product..." />
      </div>

      <!-- Price + Stock -->
      <div class="form-field">
        <label class="form-label label-wide">Price ($)</label>
        <input v-model.number="form.price" type="number" min="0" step="0.01" class="form-input" />
      </div>
      <div class="form-field">
        <label class="form-label label-wide">Stock</label>
        <input v-model.number="form.stock" type="number" min="0" class="form-input" />
      </div>

      <!-- Category -->
      <div class="form-field">
        <label class="form-label label-wide">Category</label>
        <select v-model="form.categoryId" class="form-select">
          <option value="">Select category...</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <!-- Tag -->
      <div class="form-field">
        <label class="form-label label-wide">Tag</label>
        <select v-model="form.tag" class="form-select">
          <option v-for="t in TAGS" :key="String(t.value)" :value="t.value">{{ t.label }}</option>
        </select>
      </div>

      <!-- Ingredients -->
      <div class="form-field form-field--full">
        <label class="form-label label-wide">Ingredients <span class="form-hint">(comma-separated)</span></label>
        <input v-model="form.ingredientsRaw" type="text" class="form-input" placeholder="Niacinamide 10%, Zinc PCA, Hyaluronic Acid..." />
      </div>

      <!-- Images -->
      <div class="form-field form-field--full">
        <label class="form-label label-wide">Images <span class="form-hint">(URLs)</span></label>
        <div class="image-url-list">
          <div v-for="(url, i) in form.images" :key="i" class="image-url-row">
            <input
              v-model="form.images[i]"
              type="url"
              class="form-input"
              placeholder="https://example.com/image.jpg"
            />
            <img
              v-if="url"
              :src="url"
              class="image-thumb"
              alt="preview"
              @error="(e) => e.target.style.display = 'none'"
              @load="(e) => e.target.style.display = 'block'"
            />
            <button type="button" class="btn-icon-remove" :disabled="form.images.length === 1" @click="removeImageUrl(i)">
              <i class="pi pi-times" />
            </button>
          </div>
          <button type="button" class="btn-add-image label-wide" @click="addImageUrl">
            <i class="pi pi-plus" /> Add image
          </button>
        </div>
      </div>

      <!-- Skin Types -->
      <div class="form-field form-field--full">
        <label class="form-label label-wide">Skin Types</label>
        <div class="skin-type-grid">
          <label v-for="st in SKIN_TYPES" :key="st" class="skin-checkbox">
            <input
              type="checkbox"
              :checked="form.skinTypes.includes(st)"
              @change="toggleSkinType(st)"
            />
            <span class="label-wide">{{ st }}</span>
          </label>
        </div>
      </div>

      <!-- Is New -->
      <div class="form-field">
        <label class="form-label form-label--checkbox label-wide">
          <input v-model="form.isNew" type="checkbox" />
          <span>Mark as New Arrival</span>
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn-primary" @click="save">
        <i class="pi pi-check" /> {{ isEditing ? 'Save Changes' : 'Add Product' }}
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.form-field { display: flex; flex-direction: column; gap: 0.4rem; }
.form-field--full { grid-column: 1 / -1; }

.form-label {
  color: var(--skin-grey);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-label--checkbox {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-hint { color: var(--skin-grey-light); font-weight: 400; letter-spacing: 0; text-transform: none; font-size: 0.75rem; }

.form-input,
.form-textarea,
.form-select {
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
.form-textarea:focus,
.form-select:focus { border-color: var(--skin-grey-light); }

.form-textarea { resize: vertical; }

.skin-type-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skin-checkbox {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  padding: 4px 10px;
  border: 1px solid var(--skin-border);
  border-radius: 999px;
  transition: var(--transition);
}

.skin-checkbox:has(input:checked) {
  background: var(--skin-light);
  border-color: var(--skin-accent);
  color: var(--skin-accent);
}

.skin-checkbox input { display: none; }

.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--skin-border);
}

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
}

.image-url-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.image-url-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.image-url-row .form-input { flex: 1; }

.image-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--skin-border);
  display: none;
  flex-shrink: 0;
}

.btn-icon-remove {
  background: none;
  border: 1px solid var(--skin-border);
  border-radius: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--skin-grey);
  transition: var(--transition);
  flex-shrink: 0;
}

.btn-icon-remove:hover:not(:disabled) {
  border-color: var(--skin-accent);
  color: var(--skin-accent);
}

.btn-icon-remove:disabled { opacity: 0.35; cursor: not-allowed; }

.btn-add-image {
  background: none;
  border: 1px dashed var(--skin-border);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: var(--skin-grey);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: fit-content;
  transition: var(--transition);
}

.btn-add-image:hover {
  border-color: var(--skin-accent);
  color: var(--skin-accent);
}
</style>
