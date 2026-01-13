<template>
  <div
    class="rounded-lg shadow-md p-6 transition-all"
    :class="{
      'bg-gray-100 opacity-60': !item.inStock,
      'bg-white': item.inStock,
      'border-2 border-red-300': !item.inStock,
      'border-2 border-yellow-300': hasPriceChange && item.inStock
    }"
  >
    <div class="flex flex-col md:flex-row gap-4">
      <img
        :src="item.image"
        :alt="item.name"
        class="w-full md:w-32 h-32 object-cover rounded-lg"
        :class="{ 'grayscale opacity-50': !item.inStock }"
      />
      <div class="flex-1">
        <h3 
          class="text-xl font-semibold mb-2"
          :class="item.inStock ? 'text-gray-800' : 'text-gray-500'"
        >
          {{ item.name }}
        </h3>
        
        <div v-if="!item.inStock" class="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-red-700 text-sm font-medium">
            ⚠️ Товар больше не в наличии. Удалите его из корзины или замените.
          </p>
        </div>

        <div
          v-if="hasPriceChange"
          class="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md"
        >
          <p class="text-yellow-700 text-sm font-medium mb-2">
            ⚠️ Цена изменилась с ${{ priceChange.oldPrice.toFixed(2) }}
            на ${{ priceChange.newPrice.toFixed(2) }}.
            Подтвердите пересчёт.
          </p>
          <button
            @click="$emit('confirm-price-change')"
            class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Обновить цену
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p :class="item.inStock ? 'text-gray-600' : 'text-gray-400'">
              Цена за шт.: <span class="font-semibold">${{ item.price.toFixed(2) }}</span>
            </p>
            <p :class="item.inStock ? 'text-gray-600' : 'text-gray-400'" class="mt-1">
              Количество:
              <button
                @click="$emit('update-quantity', item.qty - 1)"
                :disabled="item.qty <= 1 || !item.inStock"
                class="mx-2 w-8 h-8 rounded border transition-colors"
                :class="item.inStock 
                  ? 'border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed' 
                  : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'"
                aria-label="Уменьшить количество"
              >
                -
              </button>
              <span class="font-semibold mx-2" :class="item.inStock ? 'text-gray-800' : 'text-gray-400'">
                {{ item.qty }}
              </span>
              <button
                @click="$emit('update-quantity', item.qty + 1)"
                :disabled="!item.inStock"
                class="mx-2 w-8 h-8 rounded border transition-colors"
                :class="item.inStock 
                  ? 'border-gray-300 hover:bg-gray-50' 
                  : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'"
                aria-label="Увеличить количество"
              >
                +
              </button>
            </p>
            <p 
              class="font-bold text-lg mt-2"
              :class="item.inStock ? 'text-gray-800' : 'text-gray-400 line-through'"
            >
              Итого: ${{ (item.price * item.qty).toFixed(2) }}
              <span v-if="!item.inStock" class="text-xs font-normal ml-2">(не учитывается)</span>
            </p>
          </div>
          <button
            @click="$emit('remove')"
            class="px-4 py-2 rounded-md font-medium transition-colors"
            :class="item.inStock 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gray-300 hover:bg-gray-400 text-gray-600'"
            aria-label="Удалить товар"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem, PriceChangeNotification } from '../../types'

// DEFININGS
const props = defineProps<{
  item: CartItem
  priceChange?: PriceChangeNotification | null
}>()

defineEmits<{
  'update-quantity': [qty: number]
  remove: []
  'confirm-price-change': []
}>()

// DATA
// FUNCTIONS
const hasPriceChange = computed(() => !!props.priceChange)
</script>
