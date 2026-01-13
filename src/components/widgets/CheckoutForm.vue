<template>
  <form @submit.prevent="$emit('submit', form)" class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Данные для заказа</h2>
    
    <div class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
          Имя <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Введите ваше имя"
          aria-label="Имя"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email <span class="text-red-500">*</span>
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Введите email"
          aria-label="Email"
        />
      </div>

      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
          Телефон <span class="text-red-500">*</span>
        </label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Введите телефон"
          aria-label="Телефон"
        />
      </div>

      <div>
        <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
          Адрес <span class="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          v-model="form.address"
          rows="3"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Введите адрес доставки"
          aria-label="Адрес"
        ></textarea>
      </div>

      <div>
        <label for="paymentMethod" class="block text-sm font-medium text-gray-700 mb-2">
          Способ оплаты <span class="text-red-500">*</span>
        </label>
        <select
          id="paymentMethod"
          v-model="form.paymentMethod"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          aria-label="Способ оплаты"
        >
          <option value="">Выберите способ оплаты</option>
          <option value="card">Банковская карта</option>
          <option value="cash">Наличные</option>
        </select>
      </div>
    </div>

    <UiErrorMessage v-if="error" :message="error" />

    <div class="mt-6 flex space-x-4">
      <router-link
        :to="ROUTES.CART"
        class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md text-center"
      >
        Назад
      </router-link>
      <button
        type="submit"
        :disabled="loading || disabled"
        class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-md"
        aria-label="Оформить заказ"
      >
        <span v-if="loading">Оформление...</span>
        <span v-else>Оформить заказ</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import UiErrorMessage from '../ui/UiErrorMessage.vue'
import { ROUTES } from '../../consts/routes'
import type { CheckoutData } from '../../types'

// DEFININGS
const props = defineProps<{
  loading?: boolean
  disabled?: boolean
  error?: string
}>()

defineEmits<{
  submit: [data: CheckoutData]
}>()

// DATA
const authStore = useAuthStore()

const form = ref<CheckoutData>({
  name: '',
  email: '',
  phone: '',
  address: '',
  paymentMethod: ''
})

// FUNCTIONS
// SUBSCRIPTIONS
onMounted(() => {
  if (authStore.user?.nickname) {
    form.value.name = authStore.user.nickname
  }
})
</script>
