import { Customer } from '../domain/model/customer.entity.js'

export class CustomerAssembler {
  static toEntityFromResource(resource) {
    return new Customer(resource)
  }
}
