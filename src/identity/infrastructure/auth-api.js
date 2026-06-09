import http from '../../shared/infrastructure/http.js'

export class AuthApi {
  login(email, password) {
    return http.post('/auth/login', { email, password })
  }

  register(data) {
    return http.post('/auth/register', data)
  }

  loginAdmin(email, password) {
    return http.post('/auth/admin/login', { email, password })
  }

  updateProfile(id, data) {
    return http.put(`/customers/${id}`, data)
  }

  changePassword(id, data) {
    return http.put(`/customers/${id}/password`, data)
  }
}
