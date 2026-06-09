import { reactive } from 'vue'
import { ShoppingCart } from '../domain/model/shopping-cart.entity.js'

export const cartStore = reactive({
  cart: new ShoppingCart({ id: 'cart-1' }),

  addToCart(product, qty = 1) {
    this.cart.addItem(product, qty)
  },

  removeFromCart(productId) {
    this.cart.removeItem(productId)
  },

  updateQuantity(productId, qty) {
    this.cart.updateQuantity(productId, qty)
  },

  applyDiscountCode(code) {
    return this.cart.applyDiscountCode(code)
  },

  clearCart() {
    this.cart.clear()
  },

  getItemCount() {
    return this.cart.getItemCount()
  }
})
