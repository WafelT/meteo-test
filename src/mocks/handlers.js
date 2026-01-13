import { http, HttpResponse } from 'msw'
import * as dataStore from './dataStore.js'

// Helper to get product by ID
function getProduct(id) {
  return dataStore.getProduct(id)
}

// Helper to calculate cart
function calculateCart() {
  return dataStore.calculateCart()
}

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    try {
      const body = await request.json().catch(() => ({}))
      
      // Validate request format according to task
      const provider = body?.provider || 'mock'
      const nickname = body?.nickname || 'User'
      const avatar = body?.avatar || '/avatars/u1.png'
      
      const token = 'fake-jwt-token'
      const user = {
        id: `u_${Date.now()}`,
        nickname: nickname,
        avatar: avatar
      }
      
      dataStore.setCurrentUser(user)
      
      console.log('🔐 Mock login:', { provider, nickname, token })
      
      return HttpResponse.json({
        token,
        user
      }, { status: 200 })
    } catch (error) {
      console.error('Login handler error:', error)
      return HttpResponse.json(
        { error: 'LOGIN_FAILED', message: error.message },
        { status: 500 }
      )
    }
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    try {
      // Accept empty body as per task specification
      await request.json().catch(() => ({}))
    } catch (error) {
      // Ignore parsing errors for empty body
    }
    
    dataStore.setCurrentUser(null)
    dataStore.setCart({ items: [], subtotal: 0, currency: 'USD', updatedAt: new Date().toISOString() })
    return new HttpResponse(null, { status: 204 })
  }),

  // Products endpoints
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase() || ''
    const min = parseFloat(url.searchParams.get('min') || '0')
    const max = parseFloat(url.searchParams.get('max') || '999999')
    const inStock = url.searchParams.get('inStock')
    const rarity = url.searchParams.get('rarity')
    const sort = url.searchParams.get('sort') || 'price_asc'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')

    const products = dataStore.getProducts()
    let filtered = products.filter(p => {
      if (q && !p.name.toLowerCase().includes(q)) return false
      if (p.price < min || p.price > max) return false
      if (inStock !== null && p.inStock !== (inStock === 'true')) return false
      if (rarity && p.rarity !== rarity) return false
      return true
    })

    // Sorting
    if (sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price)
    }

    // Pagination
    const total = filtered.length
    const start = (page - 1) * limit
    const end = start + limit
    const items = filtered.slice(start, end)

    return HttpResponse.json({
      items,
      total,
      page,
      limit
    })
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = getProduct(params.id)
    if (!product) {
      return HttpResponse.json(
        { error: 'PRODUCT_NOT_FOUND', message: 'Товар не найден' },
        { status: 404 }
      )
    }
    return HttpResponse.json(product)
  }),

  // Cart endpoints
  http.get('/api/cart', () => {
    return HttpResponse.json(dataStore.getCart())
  }),

  http.post('/api/cart/add', async ({ request }) => {
    const body = await request.json()
    const product = getProduct(body.productId)
    
    if (!product) {
      return HttpResponse.json(
        { error: 'PRODUCT_NOT_FOUND' },
        { status: 404 }
      )
    }

    if (body.qty <= 0) {
      return HttpResponse.json(
        { error: 'BAD_QTY' },
        { status: 400 }
      )
    }

    if (!product.inStock) {
      return HttpResponse.json(
        { error: 'OUT_OF_STOCK' },
        { status: 409 }
      )
    }

    const cart = dataStore.getCart()
    const existingIndex = cart.items.findIndex(item => item.productId === product.id)
    if (existingIndex >= 0) {
      cart.items[existingIndex].qty += body.qty
    } else {
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: body.qty,
        image: product.image,
        inStock: product.inStock
      })
    }

    return HttpResponse.json(calculateCart())
  }),

  http.post('/api/cart/update', async ({ request }) => {
    const body = await request.json()
    const product = getProduct(body.productId)
    
    if (!product) {
      return HttpResponse.json(
        { error: 'PRODUCT_NOT_FOUND' },
        { status: 404 }
      )
    }

    if (body.qty <= 0) {
      return HttpResponse.json(
        { error: 'BAD_QTY' },
        { status: 400 }
      )
    }

    const cart = dataStore.getCart()
    const existingIndex = cart.items.findIndex(item => item.productId === product.id)
    if (existingIndex < 0) {
      return HttpResponse.json(
        { error: 'ITEM_NOT_IN_CART' },
        { status: 404 }
      )
    }

    // Check if price changed
    if (cart.items[existingIndex].price !== product.price) {
      return HttpResponse.json(
        { error: 'PRICE_CHANGED', newPrice: product.price },
        { status: 409 }
      )
    }

    cart.items[existingIndex].qty = body.qty
    return HttpResponse.json(calculateCart())
  }),

  http.post('/api/cart/remove', async ({ request }) => {
    const body = await request.json()
    const cart = dataStore.getCart()
    cart.items = cart.items.filter(item => item.productId !== body.productId)
    return HttpResponse.json(calculateCart())
  }),

  // Checkout endpoint
  http.post('/api/checkout', async ({ request }) => {
    const body = await request.json()
    
    if (!body.name) {
      return HttpResponse.json(
        { error: 'INVALID_CUSTOMER' },
        { status: 422 }
      )
    }

    // Simulate cart outdated check
    if (Math.random() < 0.1) { // 10% chance
      return HttpResponse.json(
        { error: 'CART_OUTDATED', serverCart: calculateCart() },
        { status: 409 }
      )
    }

    const orderId = `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
    dataStore.setCart({ items: [], subtotal: 0, currency: 'USD', updatedAt: new Date().toISOString() })
    
    console.log('✅ Checkout:', { name: body.name, comment: body.comment || '(нет комментария)' })
    
    return HttpResponse.json({ orderId })
  })
]
