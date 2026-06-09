import http from '../../shared/infrastructure/http.js'

export class SubscriptionApi {
  subscribe(email) {
    return http.post('/subscriptions', { email })
  }

  validateDiscountCode(code) {
    return http.get(`/discount-codes/${code}`)
  }
}
