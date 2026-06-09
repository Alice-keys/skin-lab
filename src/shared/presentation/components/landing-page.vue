<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { catalogStore } from '../../../catalog/application/catalog.store.js'

const { t } = useI18n()
const router = useRouter()

const CATEGORY_GRADIENTS = {
  'Serums':       'linear-gradient(135deg, #fde7e8 0%, #f5bfc2 100%)',
  'Toners':       'linear-gradient(135deg, #e8f4fd 0%, #bfd9f5 100%)',
  'Cleansers':    'linear-gradient(135deg, #e8fde9 0%, #bff5c1 100%)',
  'Moisturizers': 'linear-gradient(135deg, #f3e8fd 0%, #d9bff5 100%)',
  'Ampoules':     'linear-gradient(135deg, #fdeee8 0%, #f5c9bf 100%)',
  'Lip Care':     'linear-gradient(135deg, #fde7f0 0%, #f5bfd2 100%)',
  'Essences':     'linear-gradient(135deg, #e8fdfa 0%, #bff5ee 100%)',
  'SPF':          'linear-gradient(135deg, #fdf8e8 0%, #f5eabf 100%)'
}

const categories = [
  { name: 'Serums',       gradient: CATEGORY_GRADIENTS['Serums'] },
  { name: 'Moisturizers', gradient: CATEGORY_GRADIENTS['Moisturizers'] },
  { name: 'Cleansers',    gradient: CATEGORY_GRADIENTS['Cleansers'] },
  { name: 'SPF',          gradient: CATEGORY_GRADIENTS['SPF'] }
]

const newArrivals = computed(() => catalogStore.products.slice(0, 4))

const cardBg = (product) =>
  CATEGORY_GRADIENTS[product.category?.name] || 'linear-gradient(135deg, #fafafa 0%, #eeeeee 100%)'

</script>

<template>
  <div class="landing">

    <!-- ─── Hero ─── -->
    <section class="hero">
      <div class="hero-inner container">
        <div class="hero-text">
          <p class="hero-eyebrow label-wider">{{ t('landing.hero-eyebrow') }}</p>
          <h1 class="hero-title">{{ t('landing.hero-title') }}</h1>
          <p class="hero-subtitle">{{ t('landing.hero-subtitle') }}</p>
          <div class="hero-cta">
            <button class="btn-primary" @click="router.push('/shop')">
              {{ t('landing.shop-now') }}
            </button>
            <button class="btn-outline" @click="router.push('/about')">
              {{ t('landing.discover') }}
            </button>
          </div>
        </div>
        <div class="hero-visual">
          <span class="particle-back pb1"></span>
          <span class="particle-back pb2"></span>
          <span class="particle-back pb3"></span>
          <span class="particle-back pb4"></span>
          <div class="product-wrapper">
            <img src="@/assets/hero-serum.png" alt="Skin Lab Serum" class="hero-product-img" />
          </div>
          <span class="particle-front pf1"></span>
          <span class="particle-front pf2"></span>
          <span class="particle-front pf3"></span>
          <span class="particle-front pf4"></span>
        </div>
      </div>
    </section>

    <!-- ─── Categories ─── -->
    <section class="section-padding categories-section">
      <div class="container">
        <p class="section-eyebrow label-wider">{{ t('landing.categories-title') }}</p>
        <div class="categories-grid">
          <button
            v-for="cat in categories"
            :key="cat.name"
            class="category-card"
            :style="{ background: cat.gradient }"
            @click="router.push('/categories')"
          >
            <span class="category-name label-wide">{{ cat.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ─── New Arrivals ─── -->
    <section class="section-padding arrivals-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ t('landing.featured-title') }}</h2>
          <button class="btn-outline-accent" @click="router.push('/shop')">
            {{ t('common.view-all') }}
          </button>
        </div>
        <div class="products-grid">
          <article
            v-for="product in newArrivals"
            :key="product.id"
            class="product-card"
            @click="router.push(`/shop/${product.id}`)"
          >
            <div class="product-image-box" :style="product.images?.[0] ? {} : { background: cardBg(product) }">
              <div v-if="product.tag" class="product-tag label-wider">{{ product.tag }}</div>
              <img
                v-if="product.images?.[0]"
                :src="product.images[0]"
                :alt="product.name"
                class="product-img"
              />
              <div v-else class="product-placeholder-icon">
                <i class="pi pi-sparkles" />
              </div>
            </div>
            <div class="product-info">
              <p class="product-category label-wider">{{ product.category?.name }}</p>
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-footer">
                <span class="product-price">{{ product.getFormattedPrice() }}</span>
                <button class="product-add-btn label-wide" @click.stop="() => {}">
                  {{ t('common.add-to-cart') }}
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ─── Promo banner ─── -->
    <section class="promo-banner">
      <img src="@/assets/molecules.png" alt="" class="deco-mol deco-mol--top"    aria-hidden="true" />
      <img src="@/assets/molecules.png" alt="" class="deco-mol deco-mol--bottom" aria-hidden="true" />
      <div class="container promo-inner">
        <div class="promo-text">
          <p class="label-wider" style="color: var(--skin-soft); margin-bottom: 0.75rem;">
            {{ t('landing.ingredients-title') }}
          </p>
          <h2 class="promo-title">{{ t('landing.promo-title') }}</h2>
          <p class="promo-subtitle">{{ t('landing.promo-subtitle') }}</p>
          <button class="btn-outline" style="border-color: white; color: white;" @click="router.push('/shop')">
            {{ t('landing.promo-cta') }}
          </button>
        </div>
        <div class="promo-visual">
          <div class="promo-circle" />
          <img
            src="@/assets/toner.png"
            alt="Skin Lab Toner"
            class="science-product-img"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>

    <!-- ─── Testimonials ─── -->
    <section class="section-padding testimonials-section">
      <div class="container">
        <p class="section-eyebrow label-wider">{{ t('landing.testimonials-title') }}</p>
        <div class="testimonials-grid">
          <blockquote class="testimonial-card">
            <p class="testimonial-text">"My skin has never felt this hydrated. The Hydra Boost Moisturizer is a game changer."</p>
            <footer class="testimonial-author label-wide">— Sofia M.</footer>
          </blockquote>
          <blockquote class="testimonial-card">
            <p class="testimonial-text">"The Vitamin C Serum gave me a visible glow in just two weeks. Absolutely love it."</p>
            <footer class="testimonial-author label-wide">— Camille R.</footer>
          </blockquote>
          <blockquote class="testimonial-card">
            <p class="testimonial-text">"Finally a brand that's honest about ingredients. Clean, science-backed and effective."</p>
            <footer class="testimonial-author label-wide">— Mia T.</footer>
          </blockquote>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ─── Hero ─── */
.hero {
  padding: 5rem 0 4rem;
  background: var(--skin-offwhite);
  overflow: hidden;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 5rem;
  min-height: 480px;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hero-eyebrow {
  color: var(--skin-accent);
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 700;
  line-height: 1.05;
  font-family: var(--font-heading);
}

.hero-subtitle {
  font-size: 1rem;
  color: var(--skin-grey);
  font-weight: 300;
  letter-spacing: 0.04em;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.hero-visual {
  position: relative;
  width: 100%;
  height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-wrapper {
  position: relative;
  z-index:  3;
}

.hero-product-img {
  width:      32vw;
  max-width:  460px;
  min-width:  260px;
  height:     auto;
  object-fit: contain;
  z-index:    3;
  position:   relative;
  filter:     drop-shadow(0 20px 50px rgba(0, 0, 0, 0.10));
  animation:  float 4s ease-in-out infinite;
}

/* ─── Partículas ─── */

.particle-front,
.particle-back {
  position:                absolute;
  pointer-events:          none;
  background:              rgba(255, 255, 255, 0.55);
  backdrop-filter:         blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border:                  1.5px solid rgba(255, 255, 255, 0.85);
  box-shadow:
    inset 0  3px  6px rgba(255, 255, 255, 0.80),
    inset 0 -2px  4px rgba(200, 200, 210, 0.20),
    0     6px 20px rgba(0,   0,   0,   0.10),
    0     2px  6px rgba(0,   0,   0,   0.06);
  animation:
    sweep-across linear       infinite,
    morph-drop   3s ease-in-out infinite;
}

.particle-front { z-index: 4; }
.particle-back  { z-index: 2; }

/* Frente */
.pf1 { width: 36px; height: 36px; top: 28%; left: 50%; animation-duration: 5s,   3s;   animation-delay:    0s,    0s; }
.pf2 { width: 26px; height: 26px; top: 55%; left: 50%; animation-duration: 7s,   3.5s; animation-delay:   -2s,   -1s; }
.pf3 { width: 42px; height: 42px; top: 42%; left: 50%; animation-duration: 6s,   4s;   animation-delay:   -4s,   -2s; }
.pf4 { width: 20px; height: 20px; top: 68%; left: 50%; animation-duration: 8s,   2.5s; animation-delay:   -1s, -0.5s; }

/* Detrás */
.pb1 { width: 32px; height: 32px; top: 22%; left: 50%; animation-duration: 6s,   3.5s; animation-delay:   -3s, -1.5s; }
.pb2 { width: 24px; height: 24px; top: 60%; left: 50%; animation-duration: 5s,   3s;   animation-delay: -1.5s,   -2s; }
.pb3 { width: 38px; height: 38px; top: 35%; left: 50%; animation-duration: 9s,   4s;   animation-delay:   -5s,   -1s; }
.pb4 { width: 28px; height: 28px; top: 75%; left: 50%; animation-duration: 7s,   2.8s; animation-delay: -2.5s, -0.8s; }

/* ─── Keyframes ─── */

@keyframes float {
  0%, 100% { transform: translateY(0px);   }
  50%       { transform: translateY(-16px); }
}

@keyframes morph-drop {
  0%   { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
  20%  { border-radius: 40% 60% 45% 55% / 60% 40% 55% 45%; }
  40%  { border-radius: 55% 45% 60% 40% / 45% 55% 50% 50%; }
  60%  { border-radius: 45% 55% 40% 60% / 55% 45% 60% 40%; }
  80%  { border-radius: 50% 50% 55% 45% / 40% 60% 45% 55%; }
  100% { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
}

@keyframes sweep-across {
  0%   { transform: translateX(-120px) translateY(0px);   opacity: 0; }
  10%  { opacity: 1; }
  50%  { transform: translateX(0px)    translateY(-20px); opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateX(120px)  translateY(0px);   opacity: 0; }
}

@keyframes float-mol {
  0%, 100% { translate: 0 0px;   }
  50%       { translate: 0 -20px; }
}

@keyframes rotate-mol {
  from { rotate: 0deg;   }
  to   { rotate: 360deg; }
}

.deco-mol {
  position:       absolute;
  width:          640px;
  height:         auto;
  opacity:        0.14;
  pointer-events: none;
  filter:         brightness(1.5) saturate(0.3);
  will-change:    transform;
  animation:
    float-mol  5s  ease-in-out infinite,
    rotate-mol 18s linear      infinite;
}

.deco-mol--top {
  top:             -40px;
  right:           15%;
  animation-delay: 0s, 0s;
}

.deco-mol--bottom {
  bottom:          -40px;
  left:            12%;
  scale:           -1 1;
  animation-delay: -2.5s, -6s;
}

/* ─── Categories ─── */
.categories-section {
  background: var(--skin-white);
}

.section-eyebrow {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--skin-grey-light);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.category-card {
  border: none;
  border-radius: 12px;
  padding: 2.5rem 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: flex-end;
  min-height: 140px;
  background: var(--skin-light);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.07);
}

.category-name {
  color: var(--skin-text);
}

/* ─── Products ─── */
.arrivals-section {
  background: var(--skin-offwhite);
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}

.section-title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 600;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.product-image-box {
  position: relative;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px 12px 0 0;
}

.product-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--skin-accent);
  color: var(--skin-white);
  padding: 3px 10px;
  border-radius: 2px;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-placeholder-icon {
  color: rgba(0,0,0,0.12);
  font-size: 2.5rem;
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.product-category {
  color: var(--skin-grey-light);
}

.product-name {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.3;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
}

.product-price {
  font-weight: 600;
  font-size: 1rem;
  color: var(--skin-text);
}

.product-add-btn {
  background: none;
  border: 1px solid var(--skin-border);
  padding: 0.4rem 0.9rem;
  border-radius: 4px;
  color: var(--skin-grey);
  cursor: pointer;
  transition: var(--transition);
}

.product-add-btn:hover {
  background: var(--skin-accent);
  border-color: var(--skin-accent);
  color: var(--skin-white);
}

/* ─── Promo ─── */
.promo-banner {
  background: var(--skin-text);
  color: var(--skin-white);
  padding: 5rem 0;
  overflow: hidden;
  position: relative;
}

.promo-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
}

.promo-text {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: relative;
  z-index: 1;
}

.promo-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 3.5vw, 3.2rem);
  font-weight: 600;
  color: var(--skin-white);
  line-height: 1.1;
}

.promo-subtitle {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.65);
  font-weight: 300;
  line-height: 1.7;
  max-width: 420px;
}

.promo-visual {
  position: relative;
  height: 300px;
}

.promo-circle {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.science-product-img {
  position:       absolute;
  inset:          0;
  margin:         auto;
  width:          280px;
  height:         280px;
  object-fit:     contain;
  pointer-events: none;
  z-index:        2;
}

/* ─── Testimonials ─── */
.testimonials-section {
  background: var(--skin-white);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 0.5rem;
}

.testimonial-card {
  border: 1px solid var(--skin-border);
  border-radius: 12px;
  padding: 2rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: var(--transition);
}

.testimonial-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
}

.testimonial-text {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-style: italic;
  color: var(--skin-text);
  line-height: 1.65;
  flex: 1;
}

.testimonial-author {
  color: var(--skin-accent);
}

/* ─── Responsive ─── */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    min-height: auto;
  }

  .hero-visual {
    display: none;
  }

  .promo-inner {
    grid-template-columns: 1fr;
  }

  .promo-visual {
    display: none;
  }

  .products-grid {
    grid-template-columns: 1fr 1fr;
  }

  .categories-grid {
    grid-template-columns: 1fr 1fr;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
