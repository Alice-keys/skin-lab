<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const values = [
  { key: 'clean',      icon: 'pi pi-heart', gradient: 'linear-gradient(135deg, #fde7e8, #f5bfc2)' },
  { key: 'science',    icon: 'pi pi-verified', gradient: 'linear-gradient(135deg, #e8f4fd, #bfd9f5)' },
  { key: 'sustainable', icon: 'pi pi-globe', gradient: 'linear-gradient(135deg, #e8fde9, #bff5c1)' }
]
</script>

<template>
  <div class="about-page">

    <!-- Page header -->
    <div class="about-header">
      <div class="container about-header-inner">
        <p class="label-wider" style="color:var(--skin-accent); margin-bottom:0.75rem;">
          {{ t('about.subtitle') }}
        </p>
        <h1 class="about-title">{{ t('about.title') }}</h1>
      </div>
    </div>

    <!-- Mission -->
    <section class="section-padding">
      <div class="container mission-inner">
        <div class="mission-text">
          <h2 class="mission-intro">{{ t('about.intro') }}</h2>
          <p class="mission-body">{{ t('about.mission') }}</p>
        </div>
        <div class="mission-visual">
          <div class="mission-box">
            <span class="mission-watermark">LAB</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="section-padding values-section">
      <div class="container">
        <p class="section-eyebrow label-wider">{{ t('about.values-title') }}</p>
        <div class="values-grid">
          <div
            v-for="value in values"
            :key="value.key"
            class="value-card"
          >
            <div class="value-icon-wrap" :style="{ background: value.gradient }">
              <i :class="value.icon" class="value-icon" />
            </div>
            <h3 class="value-name">{{ t(`about.${value.key}`) }}</h3>
            <p class="value-desc">{{ t(`about.${value.key}-desc`) }}</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.about-page {
  background: var(--skin-white);
}

/* Header */
.about-header {
  background: var(--skin-offwhite);
  padding: 5rem 0 4rem;
  border-bottom: 1px solid var(--skin-border);
}

.about-header-inner {
  text-align: center;
}

.about-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
}

/* Mission */
.mission-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 5rem;
}

.mission-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mission-intro {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 600;
  line-height: 1.25;
}

.mission-body {
  font-size: 0.95rem;
  color: var(--skin-grey);
  line-height: 1.8;
}

.mission-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mission-box {
  width: 100%;
  max-width: 380px;
  height: 380px;
  background: linear-gradient(135deg, var(--skin-light) 0%, var(--skin-soft) 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.mission-watermark {
  font-family: var(--font-heading);
  font-size: 8rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: rgba(197, 53, 80, 0.12);
  user-select: none;
}

/* Values */
.values-section {
  background: var(--skin-offwhite);
}

.section-eyebrow {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--skin-grey-light);
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.value-card {
  background: var(--skin-white);
  border: 1px solid var(--skin-border);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: var(--transition);
  text-align: center;
}

.value-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.07);
}

.value-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.value-icon {
  font-size: 1.5rem;
  color: var(--skin-text);
}

.value-name {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 600;
}

.value-desc {
  font-size: 0.85rem;
  color: var(--skin-grey);
  line-height: 1.7;
}

/* Responsive */
@media (max-width: 768px) {
  .mission-inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .mission-visual {
    display: none;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }
}
</style>
