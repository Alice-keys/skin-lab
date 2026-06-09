export class CartItem {
  constructor({ product, quantity = 1, unitPrice = null } = {}) {
    this.product   = product
    this.quantity  = quantity
    this.unitPrice = unitPrice ?? product?.price ?? 0
  }

  getSubtotal() {
    return this.quantity * this.unitPrice
  }

  increaseQty() {
    this.quantity++
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--
  }
}
