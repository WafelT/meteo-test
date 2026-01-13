<template>
  <LoginForm
    :loading="loading"
    :error="error"
    @submit="handleLogin"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import LoginForm from '../components/widgets/LoginForm.vue'
import { ROUTES } from '../consts/routes'

// DATA
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const loading = ref<boolean>(false)
const error = ref<string>('')

// FUNCTIONS
const handleLogin = async (loginData: { provider: string; nickname: string; avatar: string }): Promise<void> => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(loginData)
    cartStore.fetchCart()
    router.push(ROUTES.CATALOG)
  } catch (err: any) {
    error.value = err.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>
