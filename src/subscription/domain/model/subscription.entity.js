import { DiscountCode } from './discount-code.entity.js'

export class Subscription {
  constructor({ id = '', email = '', discountCode = null, isActive = true, subscribedAt = null } = {}) {
    this.id           = id
    this.email        = email
    this.discountCode = discountCode instanceof DiscountCode ? discountCode : (discountCode ? new DiscountCode(discountCode) : null)
    this.isActive     = isActive
    this.subscribedAt = subscribedAt ? new Date(subscribedAt) : new Date()
  }

  isFirstTimeSubscriber() {
    return this.isActive && this.discountCode !== null
  }

  getFormattedDate() {
    return this.subscribedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }
}
