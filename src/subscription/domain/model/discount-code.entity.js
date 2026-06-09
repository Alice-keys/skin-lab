export class DiscountCode {
  constructor({ code = '', percentage = 0, expiresAt = null } = {}) {
    this.code       = code
    this.percentage = percentage
    this.expiresAt  = expiresAt ? new Date(expiresAt) : null
  }

  isExpired() {
    if (!this.expiresAt) return false
    return new Date() > this.expiresAt
  }

  getFormattedDiscount() {
    return `${this.percentage}% off`
  }
}
