import { Address }   from './address.entity.js'
import { OrderItem } from './order-item.entity.js'

const STATUS_LABELS = {
  pending:    'Pending',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
  cancelled:  'Cancelled'
}

export class Order {
  constructor({
    id                = '',
    orderNumber       = '',
    customerId        = '',
    items             = [],
    shippingAddress   = null,
    status            = 'pending',
    subtotal          = 0,
    tax               = 0,
    total             = 0,
    createdAt         = null,
    estimatedDelivery = null
  } = {}) {
    this.id                = id
    this.orderNumber       = orderNumber
    this.customerId        = customerId
    this.items             = items.map(i => i instanceof OrderItem ? i : new OrderItem(i))
    this.shippingAddress   = shippingAddress instanceof Address ? shippingAddress : new Address(shippingAddress ?? {})
    this.status            = status
    this.subtotal          = subtotal
    this.tax               = tax
    this.total             = total
    this.createdAt         = createdAt  ? new Date(createdAt)         : new Date()
    this.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : null
  }

  getFormattedDate() {
    return this.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  getFormattedDelivery() {
    if (!this.estimatedDelivery) return '—'
    return this.estimatedDelivery.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  getStatusLabel() {
    return STATUS_LABELS[this.status] ?? this.status
  }

  getFormattedTotal() {
    return `$${this.total.toFixed(2)}`
  }
}
