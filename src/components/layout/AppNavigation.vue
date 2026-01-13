<template>
  <Header
    v-if="authStore.isAuthenticated"
    :cart-count="cartStore.itemCount"
    :user-nickname="authStore.user?.nickname || ''"
    @logout="$emit('logout')"
  />
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import Header from '../widgets/Header.vue'

// DEFININGS
defineEmits<{
  logout: []
}>()

// DATA
const authStore = useAuthStore()
const cartStore = useCartStore()
</script>
