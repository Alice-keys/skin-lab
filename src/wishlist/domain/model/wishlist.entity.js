import { WishlistItem } from './wishlist-item.entity.js'

export class Wishlist {
  constructor({ id = '', customerId = '' } = {}) {
    this.id         = id
    this.customerId = customerId
    this.items      = []
  }

  addItem(product) {
    if (!this.hasProduct(product.id)) {
      this.items.push(new WishlistItem({ product }))
    }
  }

  removeItem(productId) {
    const idx = this.items.findIndex(i => i.product.id === productId)
    if (idx !== -1) this.items.splice(idx, 1)
  }

  hasProduct(productId) {
    return this.items.some(i => i.product.id === productId)
  }

  getItemCount() {
    return this.items.length
  }
}
