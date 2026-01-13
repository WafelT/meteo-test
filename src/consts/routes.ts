// CONSTANTS
export const ROUTE_LOGIN = 'login'
export const ROUTE_CATALOG = 'catalog'
export const ROUTE_PRODUCT = 'product'
export const ROUTE_CART = 'cart'
export const ROUTE_CHECKOUT = 'checkout'
export const ROUTE_ROOT = ''

// Helper function to build product route
export const buildProductRoute = (id: string): string => {
  return `/${ROUTE_PRODUCT}/${id}`
}

// Object with full paths for convenience
export const ROUTES = {
  LOGIN: `/${ROUTE_LOGIN}`,
  CATALOG: `/${ROUTE_CATALOG}`,
  PRODUCT: buildProductRoute,
  CART: `/${ROUTE_CART}`,
  CHECKOUT: `/${ROUTE_CHECKOUT}`,
  ROOT: '/'
} as const

export const ROUTE_NAMES = {
  LOGIN: 'Login',
  CATALOG: 'Catalog',
  PRODUCT: 'Product',
  CART: 'Cart',
  CHECKOUT: 'Checkout'
} as const
