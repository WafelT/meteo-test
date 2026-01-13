import type { AuthResponse, ProductsResponse, Product, Cart, CheckoutData, ProductFilters } from '../types'

// DATA
const API_BASE = '/api'

// FUNCTIONS
const request = async (url: string, options: RequestInit = {}): Promise<any> => {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  })

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    if (!response.ok) {
      throw { status: response.status, message: response.statusText }
    }
    return null
  }

  const text = await response.text()
  if (!text) {
    if (!response.ok) {
      throw { status: response.status, message: 'Empty response' }
    }
    return null
  }

  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    if (!response.ok) {
      throw { status: response.status, message: 'Invalid JSON response' }
    }
    return null
  }
  
  if (!response.ok) {
    throw { status: response.status, ...data }
  }

  return data
}

export const api = {
  auth: {
    login: async (data: { provider: string; nickname: string; avatar: string }): Promise<AuthResponse> => {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    logout: async (): Promise<void> => {
      return await request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({})
      })
    }
  },
  products: {
    list: (params: ProductFilters & { limit?: number; page?: number } = {}): Promise<ProductsResponse> => {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          query.append(key, String(value))
        }
      })
      return request(`/products?${query.toString()}`)
    },
    get: (id: string): Promise<Product> => request(`/products/${id}`)
  },
  cart: {
    get: (): Promise<Cart> => request('/cart'),
    add: (data: { productId: string; qty: number }): Promise<Cart> => request('/cart/add', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (data: { productId: string; qty: number }): Promise<Cart> => request('/cart/update', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    remove: (productId: string): Promise<Cart> => request('/cart/remove', {
      method: 'POST',
      body: JSON.stringify({ productId })
    })
  },
  checkout: {
    create: (data: CheckoutData): Promise<any> => request('/checkout', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}
