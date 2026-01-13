<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
        💌 Магазин открыток
      </h1>
      <p class="text-center text-gray-600 mb-6">
        Добро пожаловать! Войдите для продолжения
      </p>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="nickname" class="block text-sm font-medium text-gray-700 mb-2">
            Имя пользователя
          </label>
          <input
            id="nickname"
            v-model="nickname"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Введите ваше имя"
            aria-label="Имя пользователя"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          aria-label="Войти"
        >
          <span v-if="loading">Вход...</span>
          <span v-else>Войти</span>
        </button>
      </form>

      <UiErrorMessage v-if="error" :message="error" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UiErrorMessage from '../ui/UiErrorMessage.vue'

// DEFININGS
const props = defineProps<{
  loading?: boolean
  error?: string
}>()

const emit = defineEmits<{
  submit: [data: { provider: string; nickname: string; avatar: string }]
}>()

// DATA
const nickname = ref<string>('')

// FUNCTIONS

const handleSubmit = (): void => {
  if (!nickname.value.trim()) {
    return
  }
  
  emit('submit', {
    provider: 'mock',
    nickname: nickname.value.trim(),
    avatar: '/avatars/u1.png'
  })
}
</script>
