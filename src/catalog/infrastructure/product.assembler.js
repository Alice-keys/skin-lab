import { Product } from '../domain/model/product.entity.js'
import { Category } from '../domain/model/category.entity.js'

export class ProductAssembler {
  static toEntityFromResource(resource) {
    return new Product({
      ...resource,
      category: resource.category ? new Category(resource.category) : null
    })
  }

  static toEntitiesFromResponse(response) {
    const raw = response.data
    const list = Array.isArray(raw)
      ? raw
      : raw.data ?? raw.products ?? raw.items ?? []
    return list.map(r => this.toEntityFromResource(r))
  }
}
