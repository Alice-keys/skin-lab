export class Review {
  constructor({
    id = '',
    customerId = '',
    customerName = '',
    rating = 0,
    comment = '',
    createdAt = ''
  } = {}) {
    this.id = id
    this.customerId = customerId
    this.customerName = customerName
    this.rating = rating
    this.comment = comment
    this.createdAt = new Date(createdAt)
  }

  getFormattedDate() {
    return this.createdAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
