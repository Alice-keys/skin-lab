import http from '../../shared/infrastructure/http.js'

export class CategoryApi {
  getAll() {
    return http.get('/categories')
  }

  create(data) {
    return http.post('/categories', data)
  }

  update(id, data) {
    return http.put(`/categories/${id}`, data)
  }

  delete(id) {
    return http.delete(`/categories/${id}`)
  }
}
