import { Admin } from '../domain/model/admin.entity.js'

export class AdminAssembler {
  static toEntityFromResource(resource) {
    return new Admin(resource)
  }
}
