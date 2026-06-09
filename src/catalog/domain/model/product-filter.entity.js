export class ProductFilter {
  constructor({
    categoryId = '',
    sortBy = 'featured',
    minPrice = 0,
    maxPrice = Infinity,
    skinType = ''
  } = {}) {
    this.categoryId = categoryId
    this.sortBy = sortBy
    this.minPrice = minPrice
    this.maxPrice = maxPrice
    this.skinType = skinType
  }

  apply(products) {
    let result = [...products]

    if (this.categoryId) {
      result = result.filter(p => p.category?.id === this.categoryId)
    }

    if (this.skinType) {
      result = result.filter(p =>
        p.skinTypes.includes(this.skinType) || p.skinTypes.includes('All')
      )
    }

    result = result.filter(p => p.price >= this.minPrice && p.price <= this.maxPrice)

    switch (this.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      default:
        break
    }

    return result
  }

  reset() {
    this.categoryId = ''
    this.sortBy = 'featured'
    this.minPrice = 0
    this.maxPrice = Infinity
    this.skinType = ''
  }
}
