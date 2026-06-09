import http from '../../shared/infrastructure/http.js'

export class ProductApi {
  getAll() {
    return http.get('/products')
  }

  getById(id) {
    return http.get(`/products/${id}`)
  }

  getByCategory(categoryId) {
    return http.get('/products', { params: { categoryId } })
  }

  search(query) {
    return http.get('/products', { params: { q: query } })
  }

  create(data) {
    return http.post('/products', data)
  }

  update(id, data) {
    return http.put(`/products/${id}`, data)
  }

  delete(id) {
    return http.delete(`/products/${id}`)
  }
}
