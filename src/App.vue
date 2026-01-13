<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <AppNavigation @logout="handleLogout" />

    <!-- Тестовая кнопка нужна чтобы сразу добавить все товары в 
     корзину чтобы можно было легче тестить функционал с WSS ценой и стоком,
     (да знаю реализация плохая она спамит запросами но эт для теста ток)
    -->
    <button
      v-if="authStore.isAuthenticated"
      @click="addAllProductsToCart"
      :disabled="isAddingAll"
      class="fixed bottom-4 left-4 z-40 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
      title="Тестовая кнопка нужна чтобы сразу добавить все товары в корзину чтобы можно было легче тестить функционал с WSS ценой и стоком"
    >
      <span v-if="isAddingAll">Добавление...</span>
      <span v-else>🧪 Добавить все доступные товары</span>
    </button>

    <main>
      <router-view />
    </main>

    <UiNotificationToast />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { connectWebSocket, disconnectWebSocket } from './services/websocket'
import { useProductsStore } from './stores/products'
import { useToast } from './composables/useToast'
import { useTestingFeatures } from './composables/useTestingFeatures'
import AppNavigation from './components/layout/AppNavigation.vue'
import UiNotificationToast from './components/ui/UiNotificationToast.vue'
import { ROUTES } from './consts/routes'

// DATA
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const productsStore = useProductsStore()
const toast = useToast()
const { isAddingAll, addAllProductsToCart } = useTestingFeatures()

let wsSetup = false

// FUNCTIONS
const setupWebSocket = (): void => {
  if (wsSetup) return
  
  const socket = connectWebSocket(authStore.token)
  
  socket.on('product.updated', (payload: any) => {
    const { id, changes } = payload.data
    
    productsStore.updateProductInStore(id, changes)
    
    const cartItem = cartStore.items.find(item => item.productId === id)
    if (cartItem) {
      const oldPrice = cartItem.price
      const oldInStock = cartItem.inStock
      
      if (changes.price !== undefined) {
        cartItem.price = changes.price
      }
      if (changes.inStock !== undefined) {
        cartItem.inStock = changes.inStock
      }
      if (changes.name !== undefined) {
        cartItem.name = changes.name
      }
      if (changes.image !== undefined) {
        cartItem.image = changes.image
      }
      
      if (changes.inStock !== undefined && changes.inStock !== oldInStock) {
        if (!changes.inStock && oldInStock) {
          toast.warning(`Товар "${cartItem.name}" больше не в наличии`)
          cartStore.recalculateSubtotal()
        } else if (changes.inStock && !oldInStock) {
          toast.success(`Товар "${cartItem.name}" снова в наличии`)
          cartStore.recalculateSubtotal()
        }
      }
      
      if (changes.price !== undefined && Math.abs(changes.price - oldPrice) > 0.01) {
        const newPrice = changes.price
        
        if (cartItem.inStock) {
          cartStore.priceChangeNotifications.set(id, {
            oldPrice: oldPrice,
            newPrice: newPrice
          })
          toast.warning(`Цена "${cartItem.name}" изменилась: $${oldPrice.toFixed(2)} → $${newPrice.toFixed(2)}. Подтвердите обновление.`)
        }
        
        cartStore.recalculateSubtotal()
      }
    }
  })
  
  wsSetup = true
}

const handleLogout = async (): Promise<void> => {
  await authStore.logout()
  disconnectWebSocket()
  wsSetup = false
  router.push(ROUTES.LOGIN)
}

// SUBSCRIPTIONS
onMounted(() => {
  authStore.init()
  if (authStore.isAuthenticated) {
    cartStore.fetchCart()
    setupWebSocket()
  }
})

watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    cartStore.fetchCart()
    setupWebSocket()
  } else {
    disconnectWebSocket()
  }
})

onUnmounted(() => {
  disconnectWebSocket()
})
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>
