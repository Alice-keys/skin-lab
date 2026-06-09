export class Category {
  constructor({
    id = '',
    name = '',
    description = '',
    imageUrl = '',
    productCount = 0
  } = {}) {
    this.id = id
    this.name = name
    this.description = description
    this.imageUrl = imageUrl
    this.productCount = productCount
  }
}
