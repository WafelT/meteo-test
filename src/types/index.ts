// TYPES
export interface User {
  id: string
  nickname: string
  avatar: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  rarity: 'consumer' | 'industrial' | 'mil-spec' | 'restricted' | 'classified' | 'covert'
  tags: string[]
  inStock: boolean
  updatedAt?: string
}

export interface CartItem {
  productId: string
  name: string
  price: number
  qty: number
  image: string
  inStock: boolean
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  currency: string
  updatedAt: string | null
}

export interface ProductsResponse {
  items: Product[]
  total: number
  page: number
  limit: number
}

export interface ProductFilters {
  q?: string
  min?: string | number
  max?: string | number
  inStock?: boolean | null
  rarity?: string
  sort?: string
}

export interface CheckoutData {
  name: string
  email: string
  phone: string
  address: string
  paymentMethod: string
}

export interface ToastNotification {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
}

export interface PriceChangeNotification {
  oldPrice: number
  newPrice: number
}

export interface PendingUpdate {
  action: 'add' | 'update' | 'remove'
  qty?: number
  oldQty?: number
  oldPrice?: number
  item?: CartItem
}
