<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="announcement-bar">
    <p class="announcement-text">{{ t('announcement.message') }}</p>
  </div>
</template>

<style scoped>
.announcement-bar {
  background-color: var(--skin-text);
  color: var(--skin-white);
  text-align: center;
  padding: 0.55rem 1rem;
}

.announcement-text {
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  margin: 0;
}
</style>
