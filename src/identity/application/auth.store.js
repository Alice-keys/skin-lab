import { reactive } from 'vue'
import { Customer } from '../domain/model/customer.entity.js'
import { Admin } from '../domain/model/admin.entity.js'
import { AuthApi } from '../infrastructure/auth-api.js'
import { CustomerAssembler } from '../infrastructure/customer.assembler.js'
import { AdminAssembler } from '../infrastructure/admin.assembler.js'

const authApi = new AuthApi()

const STORAGE_KEY = 'skin-lab-auth'

// ─── Mock Data ────────────────────────────────────────────
const MOCK_CUSTOMER = new Customer({
  id: 'c1',
  name: 'Sofia Navarro',
  email: 'sofia@skinlab.com',
  phone: '+1 (555) 123-4567',
  address: { street: '123 Glow Ave', city: 'Los Angeles', state: 'CA', zipCode: '90001', country: 'US' },
  createdAt: '2025-01-15'
})

const MOCK_ADMIN = new Admin({
  id: 'a1',
  name: 'Admin User',
  email: 'admin@skinlab.com',
  role: 'Super Admin'
})

const MOCK_CREDENTIALS = [
  { type: 'customer', email: 'sofia@skinlab.com',  password: 'password' },
  { type: 'admin',    email: 'admin@skinlab.com',   password: 'admin'    }
]

// ─── Storage helpers ──────────────────────────────────────
function saveSession(type, user) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ type, user })) } catch {}
}

function clearSession() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

// ─── Store ────────────────────────────────────────────────
export const authStore = reactive({
  currentCustomer:  null,
  currentAdmin:     null,
  isAuthenticated:  false,
  isAdmin:          false,
  isLoading:        false,
  error:            null,

  login(email, password) {
    this.isLoading = true
    this.error = null
    return authApi.login(email, password)
      .then(response => {
        const customer = CustomerAssembler.toEntityFromResource(response.data)
        this._setCustomer(customer)
      })
      .catch(() => {
        // Fallback: validate against mock credentials
        const match = MOCK_CREDENTIALS.find(
          c => c.type === 'customer' && c.email === email && c.password === password
        )
        if (match) {
          this._setCustomer(MOCK_CUSTOMER)
        } else {
          this.error = 'Invalid email or password. Try: sofia@skinlab.com / password'
          throw new Error(this.error)
        }
      })
      .finally(() => { this.isLoading = false })
  },

  register(data) {
    this.isLoading = true
    this.error = null
    return authApi.register(data)
      .then(response => {
        const customer = CustomerAssembler.toEntityFromResource(response.data)
        this._setCustomer(customer)
      })
      .catch(() => {
        // Simulate successful registration with mock
        const newCustomer = new Customer({
          id: `c_${Date.now()}`,
          name: data.name,
          email: data.email,
          phone: '',
          address: null,
          createdAt: new Date().toISOString()
        })
        this._setCustomer(newCustomer)
      })
      .finally(() => { this.isLoading = false })
  },

  loginAdmin(email, password) {
    this.isLoading = true
    this.error = null
    return authApi.loginAdmin(email, password)
      .then(response => {
        const admin = AdminAssembler.toEntityFromResource(response.data)
        this._setAdmin(admin)
      })
      .catch(() => {
        const match = MOCK_CREDENTIALS.find(
          c => c.type === 'admin' && c.email === email && c.password === password
        )
        if (match) {
          this._setAdmin(MOCK_ADMIN)
        } else {
          this.error = 'Invalid admin credentials. Try: admin@skinlab.com / admin'
          throw new Error(this.error)
        }
      })
      .finally(() => { this.isLoading = false })
  },

  logout() {
    this.currentCustomer = null
    this.currentAdmin    = null
    this.isAuthenticated = false
    this.isAdmin         = false
    this.error           = null
    clearSession()
  },

  updateProfile(data) {
    if (!this.currentCustomer) return Promise.reject(new Error('Not authenticated'))
    this.isLoading = true
    return authApi.updateProfile(this.currentCustomer.id, data)
      .then(response => {
        Object.assign(this.currentCustomer, CustomerAssembler.toEntityFromResource(response.data))
      })
      .catch(() => {
        // Apply locally — no backend yet
        Object.assign(this.currentCustomer, data)
        saveSession('customer', this.currentCustomer)
      })
      .finally(() => { this.isLoading = false })
  },

  changePassword(oldPwd, newPwd) {
    if (!this.currentCustomer && !this.currentAdmin) return Promise.reject(new Error('Not authenticated'))
    this.isLoading = true
    const id = this.currentCustomer?.id ?? this.currentAdmin?.id
    return authApi.changePassword(id, { oldPassword: oldPwd, newPassword: newPwd })
      .catch(() => {
        // No-op without backend; in production would validate oldPwd
      })
      .finally(() => { this.isLoading = false })
  },

  _setCustomer(customer) {
    this.currentCustomer = customer
    this.currentAdmin    = null
    this.isAuthenticated = true
    this.isAdmin         = false
    saveSession('customer', { ...customer, createdAt: customer.createdAt?.toISOString() ?? '' })
  },

  _setAdmin(admin) {
    this.currentAdmin    = admin
    this.currentCustomer = null
    this.isAuthenticated = true
    this.isAdmin         = true
    saveSession('admin', { ...admin })
  },

  _restoreSession() {
    const session = loadSession()
    if (!session) return
    if (session.type === 'customer') {
      this.currentCustomer = new Customer(session.user)
      this.isAuthenticated = true
      this.isAdmin         = false
    } else if (session.type === 'admin') {
      this.currentAdmin    = new Admin(session.user)
      this.isAuthenticated = true
      this.isAdmin         = true
    }
  }
})

// Restore session on module load
authStore._restoreSession()
