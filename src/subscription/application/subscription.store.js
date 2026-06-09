import { reactive } from 'vue'
import { Subscription }           from '../domain/model/subscription.entity.js'
import { DiscountCode }           from '../domain/model/discount-code.entity.js'
import { SubscriptionApi }        from '../infrastructure/subscription-api.js'
import { SubscriptionAssembler }  from '../infrastructure/subscription.assembler.js'

const subscriptionApi = new SubscriptionApi()

const STORAGE_KEY = 'skinlab_subscribed'

const MOCK_DISCOUNT = new DiscountCode({ code: 'SKINLAB15', percentage: 15, expiresAt: null })

export const subscriptionStore = reactive({
  subscription:  null,
  hasSubscribed: false,
  discountCode:  null,

  subscribe(email) {
    return subscriptionApi.subscribe(email)
      .then(response => {
        this.subscription = SubscriptionAssembler.toEntityFromResource(response.data)
        this.discountCode = this.subscription.discountCode
        this.markAsSubscribed()
      })
      .catch(() => {
        this.subscription = new Subscription({
          id:           `sub_${Date.now()}`,
          email,
          discountCode: MOCK_DISCOUNT,
          isActive:     true,
          subscribedAt: new Date().toISOString()
        })
        this.discountCode = MOCK_DISCOUNT
        this.markAsSubscribed()
      })
  },

  isFirstVisit() {
    try { return !localStorage.getItem(STORAGE_KEY) } catch { return false }
  },

  markAsSubscribed() {
    this.hasSubscribed = true
    try { localStorage.setItem(STORAGE_KEY, 'true') } catch {}
  }
})
