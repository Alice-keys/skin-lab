import { reactive } from 'vue'
import { Wishlist } from '../domain/model/wishlist.entity.js'

export const wishlistStore = reactive({
  wishlist: new Wishlist({ id: 'wishlist-1' }),

  addToWishlist(product) {
    this.wishlist.addItem(product)
  },

  removeFromWishlist(productId) {
    this.wishlist.removeItem(productId)
  },

  isInWishlist(productId) {
    return this.wishlist.hasProduct(productId)
  },

  clearWishlist() {
    this.wishlist.items = []
  },

  fetchWishlist(customerId) {
    this.wishlist = new Wishlist({ id: 'wishlist-1', customerId })
  }
})
