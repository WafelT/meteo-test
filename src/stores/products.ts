import { defineStore } from 'pinia'
import { api } from '../services/api'
import type { Product, ProductFilters } from '../types'

// TYPES
interface ProductsState {
  items: Product[]
  total: number
  page: number
  limit: number
  loading: boolean
  error: string | null
  filters: ProductFilters
  productDetails: Record<string, Product>
}

// DATA
export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    loading: false,
    error: null,
    filters: {
      q: '',
      min: '',
      max: '',
      inStock: null,
      rarity: '',
      sort: 'price_asc'
    },
    productDetails: {}
  }),

  actions: {
    async fetchProducts(params: Partial<ProductFilters & { page?: number; limit?: number }> = {}): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const response = await api.products.list({
          ...this.filters,
          ...params,
          page: params.page || this.page,
          limit: params.limit || this.limit
        })
        this.items = response.items
        this.total = response.total
        this.page = response.page
        this.limit = response.limit
      } catch (error: any) {
        this.error = error.message || 'Ошибка загрузки товаров'
      } finally {
        this.loading = false
      }
    },

    async fetchProduct(id: string): Promise<Product> {
      this.loading = true
      this.error = null
      try {
        const product = await api.products.get(id)
        this.productDetails[id] = product
        return product
      } catch (error: any) {
        this.error = error.message || 'Ошибка загрузки товара'
        throw error
      } finally {
        this.loading = false
      }
    },

    updateFilters(filters: Partial<ProductFilters>): void {
      this.filters = { ...this.filters, ...filters }
    },

    updateProductInStore(productId: string, changes: Partial<Product>): void {
      const index = this.items.findIndex(p => p.id === productId)
      if (index >= 0) {
        this.items[index] = { ...this.items[index], ...changes }
      }
      
      if (this.productDetails[productId]) {
        this.productDetails[productId] = { ...this.productDetails[productId], ...changes }
      }
    }
  }
})
