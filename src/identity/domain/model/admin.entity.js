export class Admin {
  constructor({
    id = '',
    name = '',
    email = '',
    role = 'Admin'
  } = {}) {
    this.id = id
    this.name = name
    this.email = email
    this.role = role
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
}
