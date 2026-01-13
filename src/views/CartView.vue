<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Корзина</h1>

    <UiLoadingSkeleton v-if="cartStore.loading" :count="2" />

    <UiEmptyState
      v-else-if="!cartStore.hasItems"
      message="Корзина пуста"
    >
      <template #action>
        <router-link
          :to="ROUTES.CATALOG"
          class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md mt-4"
        >
          Перейти в каталог
        </router-link>
      </template>
    </UiEmptyState>

    <div v-else class="space-y-4">
      <CartItem
        v-for="item in cartStore.items"
        :key="item.productId"
        :item="item"
        :price-change="cartStore.priceChangeNotifications.get(item.productId)"
        @update-quantity="(qty) => handleUpdateQuantity(item.productId, qty)"
        @remove="handleRemoveItem(item.productId)"
        @confirm-price-change="handleConfirmPriceChange(item.productId)"
      />

      <CartSummary
        :subtotal="cartStore.subtotal"
        :currency="cartStore.currency"
      />
    </div>

    <UiConfirmationModal
      :is-open="showDeleteModal"
      title="Удалить товар?"
      :message="itemToDelete ? `Вы уверены, что хотите удалить «${itemToDelete.name}» из корзины?` : ''"
      confirm-text="Удалить"
      @confirm="confirmRemoveItem"
      @cancel="cancelRemoveItem"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useToast } from '../composables/useToast'
import CartItem from '../components/features/CartItem.vue'
import CartSummary from '../components/widgets/CartSummary.vue'
import UiLoadingSkeleton from '../components/ui/UiLoadingSkeleton.vue'
import UiEmptyState from '../components/ui/UiEmptyState.vue'
import UiConfirmationModal from '../components/ui/UiConfirmationModal.vue'
import { ROUTES } from '../consts/routes'
import type { CartItem as CartItemType } from '../types'

// DATA
const cartStore = useCartStore()
const toast = useToast()

const showDeleteModal = ref<boolean>(false)
const itemToDelete = ref<CartItemType | null>(null)

// FUNCTIONS
const handleUpdateQuantity = async (productId: string, qty: number): Promise<void> => {
  if (qty < 1) return
  
  const item = cartStore.items.find(i => i.productId === productId)
  if (item && !item.inStock) {
    toast.warning('Нельзя изменить количество товара, который не в наличии')
    return
  }
  
  try {
    await cartStore.updateItem(productId, qty)
  } catch (error: any) {
    if (error.error !== 'PRICE_CHANGED') {
      toast.error(error.error || 'Ошибка при обновлении количества')
    }
  }
}

const handleRemoveItem = (productId: string): void => {
  const item = cartStore.items.find(i => i.productId === productId)
  if (item) {
    itemToDelete.value = item
    showDeleteModal.value = true
  }
}

const confirmRemoveItem = async (): Promise<void> => {
  if (!itemToDelete.value) return
  
  try {
    await cartStore.removeItem(itemToDelete.value.productId)
    toast.success('Товар удален из корзины')
  } catch (error: any) {
    toast.error(error.error || 'Ошибка при удалении товара')
  } finally {
    showDeleteModal.value = false
    itemToDelete.value = null
  }
}

const cancelRemoveItem = (): void => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const handleConfirmPriceChange = (productId: string): void => {
  const notification = cartStore.priceChangeNotifications.get(productId)
  if (!notification) return

  const item = cartStore.items.find(i => i.productId === productId)
  if (!item) return

  item.price = notification.newPrice
  cartStore.recalculateSubtotal()
  cartStore.clearPriceNotification(productId)
}

// SUBSCRIPTIONS
onMounted(() => {
  cartStore.fetchCart()
})
</script>
