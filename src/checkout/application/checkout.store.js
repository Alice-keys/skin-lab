import { reactive } from 'vue'
import { Order }           from '../domain/model/order.entity.js'
import { OrderItem }       from '../domain/model/order-item.entity.js'
import { Address }         from '../domain/model/address.entity.js'
import { OrderApi }        from '../infrastructure/order-api.js'
import { OrderAssembler }  from '../infrastructure/order.assembler.js'

const orderApi = new OrderApi()

const MOCK_ADDRESS = new Address({ street: '123 Glow Ave', city: 'Los Angeles', state: 'CA', zipCode: '90001', country: 'United States' })

const MOCK_ORDERS = [
  new Order({
    id: 'o1', orderNumber: 'SL-2026-0421', customerId: 'c1',
    items: [
      new OrderItem({ productId: '4', productName: 'Hydra Boost Moisturizer', quantity: 1, unitPrice: 62 }),
      new OrderItem({ productId: '6', productName: 'Niacinamide 10% + Zinc Serum', quantity: 2, unitPrice: 36 })
    ],
    shippingAddress: MOCK_ADDRESS,
    status: 'delivered', subtotal: 134, tax: 10.72, total: 144.72,
    createdAt: '2026-04-15', estimatedDelivery: '2026-04-20'
  }),
  new Order({
    id: 'o2', orderNumber: 'SL-2026-0489', customerId: 'c1',
    items: [
      new OrderItem({ productId: '1', productName: 'Vitamin C Brightening Serum', quantity: 1, unitPrice: 48 })
    ],
    shippingAddress: MOCK_ADDRESS,
    status: 'processing', subtotal: 48, tax: 3.84, total: 51.84,
    createdAt: '2026-05-01', estimatedDelivery: '2026-05-08'
  }),
  new Order({
    id: 'o3', orderNumber: 'SL-2026-0501', customerId: 'c1',
    items: [
      new OrderItem({ productId: '7', productName: 'Snail Mucin 96% Essence', quantity: 1, unitPrice: 42 }),
      new OrderItem({ productId: '3', productName: 'Gentle Milky Cleanser', quantity: 1, unitPrice: 28 })
    ],
    shippingAddress: MOCK_ADDRESS,
    status: 'shipped', subtotal: 70, tax: 5.60, total: 75.60,
    createdAt: '2026-05-04', estimatedDelivery: '2026-05-09'
  })
]

export const checkoutStore = reactive({
  currentOrder:  null,
  orderHistory:  [],
  isLoading:     false,

  placeOrder(cart, address) {
    this.isLoading = true
    const orderData = {
      items: cart.items.map(item => ({
        productId:   item.product.id,
        productName: item.product.name,
        productImage: '',
        quantity:    item.quantity,
        unitPrice:   item.unitPrice
      })),
      shippingAddress: address,
      subtotal:       cart.getSubtotal(),
      tax:            cart.getTax(),
      total:          cart.getTotal()
    }

    return orderApi.create(orderData)
      .then(response => {
        this.currentOrder = OrderAssembler.toEntityFromResource(response.data)
        this.orderHistory.unshift(this.currentOrder)
      })
      .catch(() => {
        const order = new Order({
          id:               `o_${Date.now()}`,
          orderNumber:      `SL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          customerId:       'c1',
          items:            orderData.items,
          shippingAddress:  address,
          status:           'processing',
          subtotal:         orderData.subtotal,
          tax:              orderData.tax,
          total:            orderData.total,
          createdAt:        new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        })
        this.currentOrder = order
        this.orderHistory.unshift(order)
      })
      .finally(() => { this.isLoading = false })
  },

  fetchOrderHistory(customerId) {
    this.isLoading = true
    return orderApi.getByCustomerId(customerId)
      .then(response => {
        this.orderHistory = OrderAssembler.toEntitiesFromResponse(response)
      })
      .catch(() => {
        this.orderHistory = [...MOCK_ORDERS]
      })
      .finally(() => { this.isLoading = false })
  },

  trackOrder(orderId) {
    this.isLoading = true
    return orderApi.getById(orderId)
      .then(response => {
        this.currentOrder = OrderAssembler.toEntityFromResource(response.data)
      })
      .catch(() => {
        this.currentOrder = this.orderHistory.find(o => o.id === orderId) ?? null
      })
      .finally(() => { this.isLoading = false })
  }
})
