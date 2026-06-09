import { Subscription }  from '../domain/model/subscription.entity.js'
import { DiscountCode }  from '../domain/model/discount-code.entity.js'

export class SubscriptionAssembler {
  static toEntityFromResource(resource) {
    return new Subscription({
      ...resource,
      discountCode: resource.discountCode ? new DiscountCode(resource.discountCode) : null
    })
  }
}
