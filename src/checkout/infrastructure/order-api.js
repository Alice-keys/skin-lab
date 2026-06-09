import http from '../../shared/infrastructure/http.js'

export class OrderApi {
  create(data) {
    return http.post('/orders', data)
  }

  getByCustomerId(customerId) {
    return http.get('/orders', { params: { customerId } })
  }

  getById(orderId) {
    return http.get(`/orders/${orderId}`)
  }
}
