export class OrderItem {
  constructor({ productId = '', productName = '', productImage = '', quantity = 1, unitPrice = 0 } = {}) {
    this.productId    = productId
    this.productName  = productName
    this.productImage = productImage
    this.quantity     = quantity
    this.unitPrice    = unitPrice
  }

  getSubtotal() {
    return this.quantity * this.unitPrice
  }
}
