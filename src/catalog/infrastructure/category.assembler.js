import { Category } from '../domain/model/category.entity.js'

export class CategoryAssembler {
  static toEntityFromResource(resource) {
    return new Category(resource)
  }

  static toEntitiesFromResponse(response) {
    const raw = response.data
    const list = Array.isArray(raw)
      ? raw
      : raw.data ?? raw.categories ?? raw.items ?? []
    return list.map(r => this.toEntityFromResource(r))
  }
}
