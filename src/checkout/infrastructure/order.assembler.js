import { Order } from '../domain/model/order.entity.js'

export class OrderAssembler {
  static toEntityFromResource(resource) {
    return new Order(resource)
  }

  static toEntitiesFromResponse(response) {
    const raw  = response.data
    const list = Array.isArray(raw) ? raw : raw.data ?? raw.orders ?? raw.items ?? []
    return list.map(r => this.toEntityFromResource(r))
  }
}
