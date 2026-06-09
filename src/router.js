import { createRouter, createWebHistory } from 'vue-router'
import LandingPage         from './shared/presentation/components/landing-page.vue'
import AboutUsContent      from './shared/presentation/components/about-us-content.vue'
import ProductList         from './catalog/presentation/components/product-list.vue'
import ProductDetail       from './catalog/presentation/components/product-detail.vue'
import AdminProductList    from './catalog/presentation/components/admin-product-list.vue'
import AdminCategoryList   from './catalog/presentation/components/admin-category-list.vue'
import LoginForm           from './identity/presentation/components/login-form.vue'
import RegisterForm        from './identity/presentation/components/register-form.vue'
import CustomerProfile     from './identity/presentation/components/customer-profile.vue'
import AdminProfile        from './identity/presentation/components/admin-profile.vue'
import CartList            from './cart/presentation/components/cart-list.vue'
import WishlistList        from './wishlist/presentation/components/wishlist-list.vue'
import CheckoutForm        from './checkout/presentation/components/checkout-form.vue'
import OrderConfirmation   from './checkout/presentation/components/order-confirmation.vue'
import OrderList           from './checkout/presentation/components/order-list.vue'

const ComingSoon = {
  template: `
    <div style="display:flex;align-items:center;justify-content:center;min-height:60vh;flex-direction:column;gap:1rem;">
      <p class="label-wide" style="color:var(--skin-grey-light)">Coming Soon</p>
      <p style="color:var(--skin-grey);font-size:0.85rem;">This section is under construction.</p>
    </div>
  `
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',                    component: LandingPage },
    { path: '/about',               component: AboutUsContent },
    { path: '/shop',                component: ProductList },
    { path: '/shop/:id',            component: ProductDetail },
    { path: '/categories',          redirect: '/shop' },
    { path: '/cart',                component: CartList },
    { path: '/wishlist',            component: WishlistList },
    { path: '/checkout',            component: CheckoutForm },
    { path: '/order-confirmation',  component: OrderConfirmation },
    { path: '/orders',              component: OrderList },
    { path: '/orders/:id',          component: ComingSoon },
    { path: '/login',               component: LoginForm },
    { path: '/register',            component: RegisterForm },
    { path: '/account',             component: CustomerProfile },
    { path: '/profile',             redirect: '/account' },
    { path: '/admin',               redirect: '/admin/products' },
    { path: '/admin/products',      component: AdminProductList },
    { path: '/admin/categories',    component: AdminCategoryList },
    { path: '/admin/profile',       component: AdminProfile },
    { path: '/:pathMatch(.*)*',     redirect: '/' }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

import { authStore } from './identity/application/auth.store.js'

const AUTH_REQUIRED = ['/wishlist', '/checkout', '/order-confirmation', '/orders']

router.beforeEach((to) => {
  if (AUTH_REQUIRED.includes(to.path) && !authStore.isAuthenticated) {
    return '/login'
  }
})

export default router
