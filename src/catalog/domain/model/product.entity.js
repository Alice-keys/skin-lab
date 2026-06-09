export class Product {
  constructor({
    id = '',
    name = '',
    description = '',
    price = 0,
    stock = 0,
    images = [],
    ingredients = [],
    skinTypes = [],
    tag = null,
    isNew = false,
    rating = 0,
    reviewCount = 0,
    category = null
  } = {}) {
    this.id = id
    this.name = name
    this.description = description
    this.price = price
    this.stock = stock
    this.images = images
    this.ingredients = ingredients
    this.skinTypes = skinTypes
    this.tag = tag
    this.isNew = isNew
    this.rating = rating
    this.reviewCount = reviewCount
    this.category = category
  }

  isInStock() {
    return this.stock > 0
  }

  isLowStock() {
    return this.stock > 0 && this.stock <= 10
  }

  getFormattedPrice() {
    return `$${this.price.toFixed(2)}`
  }

  getAverageRating() {
    return this.rating
  }
}
