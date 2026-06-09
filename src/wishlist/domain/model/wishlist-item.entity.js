export class WishlistItem {
  constructor({ product, addedAt = null } = {}) {
    this.product = product
    this.addedAt = addedAt ? new Date(addedAt) : new Date()
  }

  getFormattedDate() {
    return this.addedAt.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }
}
