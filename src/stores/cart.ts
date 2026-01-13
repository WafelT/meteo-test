import { defineStore } from 'pinia'
import { api } from '../services/api'
import type { CartItem, Cart, PriceChangeNotification, PendingUpdate } from '../types'

// TYPES
interface CartState {
  items: CartItem[]
  subtotal: number
  currency: string
  updatedAt: string | null
  loading: boolean
  error: string | null
  pendingUpdates: Map<string, PendingUpdate>
  priceChangeNotifications: Map<string, PriceChangeNotification>
}

// DATA
export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    subtotal: 0,
    currency: 'USD',
    updatedAt: null,
    loading: false,
    error: null,
    pendingUpdates: new Map(),
    priceChangeNotifications: new Map()
  }),

  getters: {
    itemCount: (state): number => state.items
      .filter(item => item.inStock)
      .reduce((sum, item) => sum + item.qty, 0),
    hasItems: (state): boolean => state.items.length > 0,
    hasAvailableItems: (state): boolean => state.items.some(item => item.inStock)
  },

  actions: {
    async fetchCart(): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const cart = await api.cart.get()
        this.items = cart.items
        this.subtotal = cart.subtotal
        this.currency = cart.currency
        this.updatedAt = cart.updatedAt
      } catch (error: any) {
        this.error = error.message || 'Ошибка загрузки корзины'
      } finally {
        this.loading = false
      }
    },

    async addItem(productId: string, qty: number = 1): Promise<void> {
      const item = this.items.find(i => i.productId === productId)
      const oldQty = item?.qty || 0
      
      if (item) {
        item.qty += qty
      } else {
        this.items.push({
          productId,
          name: 'Loading...',
          price: 0,
          qty,
          image: '',
          inStock: true
        })
      }
      this.recalculateSubtotal()
      this.pendingUpdates.set(productId, { action: 'add', qty, oldQty })

      try {
        const cart = await api.cart.add({ productId, qty })
        this.items = cart.items
        this.subtotal = cart.subtotal
        this.currency = cart.currency
        this.updatedAt = cart.updatedAt
        this.pendingUpdates.delete(productId)
      } catch (error) {
        if (item) {
          item.qty = oldQty
        } else {
          this.items = this.items.filter(i => i.productId !== productId)
        }
        this.recalculateSubtotal()
        this.pendingUpdates.delete(productId)
        throw error
      }
    },

    async updateItem(productId: string, qty: number): Promise<void> {
      const item = this.items.find(i => i.productId === productId)
      if (!item) return

      const oldQty = item.qty
      const oldPrice = item.price

      item.qty = qty
      this.recalculateSubtotal()
      this.pendingUpdates.set(productId, { action: 'update', qty, oldQty, oldPrice })

      try {
        const cart = await api.cart.update({ productId, qty })
        this.items = cart.items
        this.subtotal = cart.subtotal
        this.currency = cart.currency
        this.updatedAt = cart.updatedAt
        this.pendingUpdates.delete(productId)
        this.priceChangeNotifications.delete(productId)
      } catch (error: any) {
        item.qty = oldQty
        this.recalculateSubtotal()
        this.pendingUpdates.delete(productId)
        
        if (error.error === 'PRICE_CHANGED') {
          this.priceChangeNotifications.set(productId, {
            oldPrice,
            newPrice: error.newPrice
          })
        }
        throw error
      }
    },

    async removeItem(productId: string): Promise<void> {
      const item = this.items.find(i => i.productId === productId)
      if (!item) return

      const removedItem = { ...item }
      const index = this.items.findIndex(i => i.productId === productId)

      this.items.splice(index, 1)
      this.recalculateSubtotal()
      this.pendingUpdates.set(productId, { action: 'remove', item: removedItem })

      try {
        const cart = await api.cart.remove(productId)
        this.items = cart.items
        this.subtotal = cart.subtotal
        this.currency = cart.currency
        this.updatedAt = cart.updatedAt
        this.pendingUpdates.delete(productId)
      } catch (error) {
        this.items.splice(index, 0, removedItem)
        this.recalculateSubtotal()
        this.pendingUpdates.delete(productId)
        throw error
      }
    },

    syncCart(serverCart: Cart): void {
      this.items = serverCart.items
      this.subtotal = serverCart.subtotal
      this.currency = serverCart.currency
      this.updatedAt = serverCart.updatedAt
    },

    clearPriceNotification(productId: string): void {
      this.priceChangeNotifications.delete(productId)
    },

    recalculateSubtotal(): void {
      this.subtotal = parseFloat(
        this.items
          .filter(item => item.inStock)
          .reduce((sum, item) => sum + (item.price * item.qty), 0)
          .toFixed(2)
      )
    },

    clear(): void {
      this.items = []
      this.subtotal = 0
      this.updatedAt = null
      this.priceChangeNotifications.clear()
    }
  }
})
