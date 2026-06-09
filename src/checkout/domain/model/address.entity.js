export class Address {
  constructor({ street = '', city = '', state = '', zipCode = '', country = '' } = {}) {
    this.street  = street
    this.city    = city
    this.state   = state
    this.zipCode = zipCode
    this.country = country
  }

  getFullAddress() {
    return [this.street, this.city, this.state, this.zipCode, this.country]
      .filter(Boolean).join(', ')
  }
}
