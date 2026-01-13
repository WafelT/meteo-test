<template>
  <div class="bg-white rounded-lg shadow-md p-6 mt-6">
    <div class="flex justify-between items-center mb-4">
      <span class="text-xl font-semibold text-gray-800">Итого:</span>
      <span class="text-3xl font-bold text-indigo-600">
        ${{ subtotal.toFixed(2) }} {{ currency }}
      </span>
    </div>
    <router-link
      :to="ROUTES.CHECKOUT"
      class="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md text-center"
    >
      Оформить заказ
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ROUTES } from '../../consts/routes'

// DEFININGS
defineProps<{
  subtotal: number
  currency?: string
}>()
</script>
