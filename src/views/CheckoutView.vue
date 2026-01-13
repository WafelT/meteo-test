<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Оформление заказа</h1>

    <UiSuccessMessage
      v-if="orderId"
      title="Заказ оформлен!"
    >
      Номер заказа: <span class="font-bold text-indigo-600">{{ orderId }}</span>
      <template #action>
        <router-link
          :to="ROUTES.CATALOG"
          class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md mt-4"
        >
          Вернуться в каталог
        </router-link>
      </template>
    </UiSuccessMessage>

    <div v-else class="space-y-6">
      <OrderSummary
        :items="cartStore.items"
        :subtotal="cartStore.subtotal"
        :currency="cartStore.currency"
      />

      <CheckoutForm
        :loading="loading"
        :disabled="!cartStore.hasAvailableItems"
        :error="error"
        @submit="handleCheckout"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { api } from '../services/api'
import OrderSummary from '../components/widgets/OrderSummary.vue'
import CheckoutForm from '../components/widgets/CheckoutForm.vue'
import UiSuccessMessage from '../components/ui/UiSuccessMessage.vue'
import { ROUTES } from '../consts/routes'
import type { CheckoutData } from '../types'

// DATA
const router = useRouter()
const cartStore = useCartStore()

const loading = ref<boolean>(false)
const error = ref<string>('')
const orderId = ref<string>('')

// FUNCTIONS
const handleCheckout = async (form: CheckoutData): Promise<void> => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.checkout.create({
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      paymentMethod: form.paymentMethod
    })

    orderId.value = response.orderId || ''
    cartStore.clear()
  } catch (err: any) {
    if (err.error === 'CART_OUTDATED') {
      error.value = 'Корзина устарела. Обновляю...'
      cartStore.syncCart(err.serverCart)
      setTimeout(() => {
        error.value = 'Пожалуйста, проверьте корзину и попробуйте снова'
      }, 2000)
    } else {
      error.value = err.message || 'Ошибка при оформлении заказа'
    }
  } finally {
    loading.value = false
  }
}

// SUBSCRIPTIONS
onMounted(() => {
  if (!cartStore.hasAvailableItems) {
    router.push(ROUTES.CART)
  }
})
</script>
