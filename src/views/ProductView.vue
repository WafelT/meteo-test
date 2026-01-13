<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <UiLoadingSkeleton v-if="loading" :count="1" />

    <UiErrorMessage
      v-else-if="error"
      :message="error"
    >
      <router-link :to="ROUTES.CATALOG" class="block mt-4 text-indigo-600 hover:underline">
        Вернуться в каталог
      </router-link>
    </UiErrorMessage>

    <ProductDetails
      v-else-if="product"
      :product="product"
      :last-update="lastUpdate"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { getSocket } from '../services/websocket'
import { useToast } from '../composables/useToast'
import ProductDetails from '../components/features/ProductDetails.vue'
import UiLoadingSkeleton from '../components/ui/UiLoadingSkeleton.vue'
import UiErrorMessage from '../components/ui/UiErrorMessage.vue'
import { ROUTES } from '../consts/routes'

// DATA
const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const toast = useToast()

const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const lastUpdate = ref<string | null>(null)

const product = computed(() => {
  const id = route.params.id as string
  return productsStore.productDetails[id]
})

// FUNCTIONS
const loadProduct = async (): Promise<void> => {
  loading.value = true
  error.value = null
  try {
    await productsStore.fetchProduct(route.params.id as string)
  } catch (err: any) {
    error.value = err.message || 'Товар не найден'
  } finally {
    loading.value = false
  }
}

const setupWebSocket = (): void => {
  const socket = getSocket()
  if (!socket) return

  socket.on('product.updated', (payload: any) => {
    const { id, changes } = payload.data
    if (id === route.params.id) {
      productsStore.updateProductInStore(id, changes)
      lastUpdate.value = changes.updatedAt || new Date().toISOString()
    }
  })
}

const handleAddToCart = async (): Promise<void> => {
  try {
    await cartStore.addItem(product.value.id, 1)
    const productName = product.value?.name || 'Товар'
    toast.success(`${productName} добавлен в корзину`)
  } catch (err: any) {
    toast.error(err.error || 'Ошибка при добавлении в корзину')
  }
}

// SUBSCRIPTIONS
onMounted(async () => {
  await loadProduct()
  setupWebSocket()
})

onUnmounted(() => {
  const socket = getSocket()
  if (socket) {
    socket.off('product.updated')
  }
})
</script>
