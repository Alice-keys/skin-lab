<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import NewsletterForm from '../../../subscription/presentation/components/newsletter-form.vue'

const { t } = useI18n()
</script>

<template>
  <footer class="footer">

    <!-- Newsletter band -->
    <div class="newsletter-band">
      <div class="container newsletter-inner">
        <div class="newsletter-copy">
          <h3 class="newsletter-title">{{ t('footer.newsletter-title') }}</h3>
          <p class="newsletter-subtitle">{{ t('footer.newsletter-subtitle') }}</p>
        </div>
        <newsletter-form />
      </div>
    </div>

    <!-- Main footer columns -->
    <div class="footer-main">
      <div class="container footer-columns">

        <!-- Brand -->
        <div class="footer-brand">
          <span class="footer-logo">SKIN LAB</span>
          <p class="footer-tagline label-wide">{{ t('footer.tagline') }}</p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Instagram">
              <i class="pi pi-instagram" />
            </a>
            <a href="#" class="social-link" aria-label="Facebook">
              <i class="pi pi-facebook" />
            </a>
            <a href="#" class="social-link" aria-label="Twitter/X">
              <i class="pi pi-twitter" />
            </a>
          </div>
        </div>

        <!-- Shop column -->
        <div class="footer-column">
          <h4 class="footer-col-title label-wide">{{ t('footer.shop') }}</h4>
          <ul class="footer-links">
            <li><router-link to="/shop">{{ t('footer.skincare') }}</router-link></li>
            <li><router-link to="/shop">{{ t('footer.serums') }}</router-link></li>
            <li><router-link to="/shop">{{ t('footer.moisturizers') }}</router-link></li>
            <li><router-link to="/shop">{{ t('footer.cleansers') }}</router-link></li>
            <li><router-link to="/shop">{{ t('footer.spf') }}</router-link></li>
            <li><router-link to="/shop">{{ t('footer.bundles') }}</router-link></li>
          </ul>
        </div>

        <!-- Support column -->
        <div class="footer-column">
          <h4 class="footer-col-title label-wide">{{ t('footer.customer-service') }}</h4>
          <ul class="footer-links">
            <li><router-link to="/orders">{{ t('footer.track-order') }}</router-link></li>
            <li><router-link to="/about">{{ t('footer.faq') }}</router-link></li>
            <li><router-link to="/about">{{ t('footer.shipping') }}</router-link></li>
            <li><router-link to="/about">{{ t('footer.contact') }}</router-link></li>
          </ul>
        </div>

      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p class="footer-copyright label-wider">{{ t('footer.copyright') }}</p>
      </div>
    </div>

  </footer>
</template>

<style scoped>
.footer {
  background: var(--skin-offwhite);
  border-top: 1px solid var(--skin-border);
  margin-top: auto;
}

/* Newsletter */
.newsletter-band {
  background: var(--skin-white);
  border-bottom: 1px solid var(--skin-border);
  padding: 3rem 0;
}

.newsletter-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  flex-wrap: wrap;
}

.newsletter-copy {
  flex: 1;
  min-width: 220px;
}

.newsletter-title {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.newsletter-subtitle {
  font-size: 0.85rem;
  color: var(--skin-grey);
  line-height: 1.6;
}

/* Main columns */
.footer-main {
  padding: 3.5rem 0 2.5rem;
}

.footer-columns {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr;
  gap: 3rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-logo {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--skin-text);
}

.footer-tagline {
  color: var(--skin-grey-light);
  margin-top: 0.25rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.social-link {
  color: var(--skin-grey);
  font-size: 1.1rem;
  transition: var(--transition);
}

.social-link:hover {
  color: var(--skin-accent);
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.footer-col-title {
  color: var(--skin-text);
  font-weight: 600;
  font-family: var(--font-body);
  margin-bottom: 0.25rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links a {
  font-size: 0.85rem;
  color: var(--skin-grey);
  text-decoration: none;
  transition: var(--transition);
}

.footer-links a:hover {
  color: var(--skin-accent);
}

/* Bottom bar */
.footer-bottom {
  border-top: 1px solid var(--skin-border);
  padding: 1.2rem 0;
}

.footer-bottom-inner {
  display: flex;
  justify-content: center;
}

.footer-copyright {
  color: var(--skin-grey-light);
}

/* Responsive */
@media (max-width: 768px) {
  .newsletter-inner {
    flex-direction: column;
    gap: 1.5rem;
  }

  .footer-columns {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
