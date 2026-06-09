<script setup>
</script>

<template>
  <pv-select-button
    v-model="$i18n.locale"
    :options="$i18n.availableLocales"
    class="lang-switcher"
  />
</template>

<style scoped>
.lang-switcher :deep(.p-button) {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.3rem 0.7rem;
  font-family: var(--font-body);
}
</style>
