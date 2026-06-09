<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const query = ref('')
const emit  = defineEmits(['search-submitted'])

let debounce = null

const handleInput = () => {
  clearTimeout(debounce)
  debounce = setTimeout(() => {
    emit('search-submitted', query.value.trim())
  }, 350)
}

const handleSubmit = () => {
  clearTimeout(debounce)
  emit('search-submitted', query.value.trim())
}

const clear = () => {
  query.value = ''
  emit('search-submitted', '')
}
</script>

<template>
  <div class="search-bar">
    <i class="pi pi-search search-icon" />
    <input
      v-model="query"
      type="text"
      class="search-input"
      :placeholder="t('nav.search') + '...'"
      @input="handleInput"
      @keyup.enter="handleSubmit"
    />
    <button v-if="query" class="search-clear" aria-label="Clear search" @click="clear">
      <i class="pi pi-times" />
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 380px;
}

.search-icon {
  position: absolute;
  left: 0.9rem;
  color: var(--skin-grey-light);
  font-size: 0.85rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.6rem 2.5rem 0.6rem 2.5rem;
  border: 1px solid var(--skin-border);
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--skin-text);
  background: var(--skin-white);
  outline: none;
  transition: var(--transition);
}

.search-input:focus {
  border-color: var(--skin-grey-light);
  box-shadow: 0 0 0 3px rgba(197, 53, 80, 0.06);
}

.search-input::placeholder {
  color: var(--skin-grey-light);
  letter-spacing: 0.04em;
}

.search-clear {
  position: absolute;
  right: 0.9rem;
  background: none;
  border: none;
  color: var(--skin-grey-light);
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.2rem;
  display: flex;
  transition: var(--transition);
}

.search-clear:hover {
  color: var(--skin-accent);
}
</style>
