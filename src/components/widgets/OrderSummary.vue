<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Товары в заказе</h2>
    <div class="space-y-2 mb-4">
      <div
        v-for="item in items"
        :key="item.productId"
        class="flex justify-between"
        :class="item.inStock ? 'text-gray-600' : 'text-gray-400 opacity-60'"
      >
        <span>
          {{ item.name }} x{{ item.qty }}
          <span v-if="!item.inStock" class="text-xs text-red-500 ml-2">(не в наличии)</span>
        </span>
        <span :class="item.inStock ? '' : 'line-through'">
          ${{ (item.price * item.qty).toFixed(2) }}
        </span>
      </div>
    </div>
    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
      <span class="text-xl font-semibold text-gray-800">Итого:</span>
      <span class="text-2xl font-bold text-indigo-600">
        ${{ subtotal.toFixed(2) }} {{ currency }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '../../types'

// DEFININGS
defineProps<{
  items: CartItem[]
  subtotal: number
  currency?: string
}>()
</script>
