import { CartItem } from './cart-item.entity.js'

const DISCOUNT_CODES = {
  WELCOME10: 0.10,
  SKINLAB15: 0.15,
  SAVE20:    0.20
}

const TAX_RATE = 0.08

export class ShoppingCart {
  constructor({ id = '', customerId = '' } = {}) {
    this.id             = id
    this.customerId     = customerId
    this.items          = []
    this.discountCode   = null
    this.discountAmount = 0
  }

  addItem(product, qty = 1) {
    const existing = this.items.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity += qty
    } else {
      this.items.push(new CartItem({ product, quantity: qty }))
    }
  }

  removeItem(productId) {
    const idx = this.items.findIndex(i => i.product.id === productId)
    if (idx !== -1) this.items.splice(idx, 1)
  }

  updateQuantity(productId, qty) {
    if (qty <= 0) {
      this.removeItem(productId)
      return
    }
    const item = this.items.find(i => i.product.id === productId)
    if (item) item.quantity = qty
  }

  applyDiscountCode(code) {
    const rate = DISCOUNT_CODES[code?.toUpperCase()]
    if (!rate) {
      this.discountCode   = null
      this.discountAmount = 0
      return false
    }
    this.discountCode   = code.toUpperCase()
    this.discountAmount = this.getSubtotal() * rate
    return true
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + item.getSubtotal(), 0)
  }

  getTax() {
    return (this.getSubtotal() - this.discountAmount) * TAX_RATE
  }

  getTotal() {
    return this.getSubtotal() - this.discountAmount + this.getTax()
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  clear() {
    this.items          = []
    this.discountCode   = null
    this.discountAmount = 0
  }
}
