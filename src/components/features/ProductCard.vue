<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <router-link :to="ROUTES.PRODUCT(product.id)" class="block">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-48 object-cover"
        loading="lazy"
      />
      <div class="p-4">
        <h3 class="font-semibold text-lg text-gray-800 mb-2">{{ product.name }}</h3>
        <div class="flex items-center justify-between mb-2">
          <span class="text-2xl font-bold text-indigo-600">${{ product.price.toFixed(2) }}</span>
          <span
            class="px-2 py-1 text-xs font-medium rounded"
            :class="rarityClass"
          >
            {{ rarityLabel }}
          </span>
        </div>
        <div class="flex flex-wrap gap-1 mb-3">
          <span
            v-for="tag in product.tags"
            :key="tag"
            class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
          >
            {{ tag }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span
            class="px-3 py-1 rounded text-sm font-medium"
            :class="product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            {{ product.inStock ? 'В наличии' : 'Нет в наличии' }}
          </span>
        </div>
      </div>
    </router-link>
    <div class="px-4 pb-4">
      <button
        @click.prevent="$emit('add-to-cart', product.id)"
        :disabled="!product.inStock"
        class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
        aria-label="Добавить в корзину"
      >
        В корзину
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ROUTES } from '../../consts/routes'
import type { Product } from '../../types'

// DEFININGS
const props = defineProps<{
  product: Product
}>()

defineEmits<{
  'add-to-cart': [productId: string]
}>()

// DATA
const rarityClasses: Record<string, string> = {
  consumer: 'bg-gray-100 text-gray-800',
  industrial: 'bg-blue-100 text-blue-800',
  'mil-spec': 'bg-green-100 text-green-800',
  restricted: 'bg-purple-100 text-purple-800',
  classified: 'bg-pink-100 text-pink-800',
  covert: 'bg-red-100 text-red-800'
}

const rarityLabels: Record<string, string> = {
  consumer: 'Обычная',
  industrial: 'Промышленная',
  'mil-spec': 'Военная',
  restricted: 'Ограниченная',
  classified: 'Секретная',
  covert: 'Скрытая'
}

// FUNCTIONS
const rarityClass = computed(() => rarityClasses[props.product.rarity] || 'bg-gray-100 text-gray-800')
const rarityLabel = computed(() => rarityLabels[props.product.rarity] || props.product.rarity)
</script>
