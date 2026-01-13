// Shared in-memory data store for MSW and WebSocket server
import { generateProducts } from '../utils/mockData.js'

let products = generateProducts(80)
let cart = {
  items: [],
  subtotal: 0,
  currency: 'USD',
  updatedAt: new Date().toISOString()
}
let currentUser = null

export function getProducts() {
  return products
}

export function getProduct(id) {
  return products.find(p => p.id === id)
}

export function updateProduct(id, changes) {
  const product = products.find(p => p.id === id)
  if (product) {
    Object.assign(product, changes, { updatedAt: new Date().toISOString() })
    return product
  }
  return null
}

export function getCart() {
  return cart
}

export function setCart(newCart) {
  cart = newCart
}

export function calculateCart() {
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0)
  cart.subtotal = parseFloat(subtotal.toFixed(2))
  cart.updatedAt = new Date().toISOString()
  return cart
}

export function getCurrentUser() {
  return currentUser
}

export function setCurrentUser(user) {
  currentUser = user
}
