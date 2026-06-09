export class Customer {
  constructor({
    id = '',
    name = '',
    email = '',
    phone = '',
    address = null,
    createdAt = ''
  } = {}) {
    this.id = id
    this.name = name
    this.email = email
    this.phone = phone
    this.address = address
    this.createdAt = createdAt ? new Date(createdAt) : null
  }

  getFullName() {
    return this.name
  }

  getInitials() {
    return this.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  getFormattedJoinDate() {
    if (!this.createdAt) return ''
    return this.createdAt.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }
}
