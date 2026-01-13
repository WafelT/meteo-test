<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <div>
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-96 object-cover rounded-lg"
        />
      </div>
      <div>
        <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ product.name }}</h1>
        
        <div class="mb-4">
          <span class="text-4xl font-bold text-indigo-600">${{ product.price.toFixed(2) }}</span>
        </div>

        <div class="mb-4">
          <span
            class="px-3 py-1 rounded text-sm font-medium"
            :class="rarityClass"
          >
            {{ rarityLabel }}
          </span>
        </div>

        <div class="mb-4">
          <span
            class="px-3 py-1 rounded text-sm font-medium"
            :class="product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            {{ product.inStock ? 'В наличии' : 'Нет в наличии' }}
          </span>
        </div>

        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Теги:</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in product.tags"
              :key="tag"
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div v-if="lastUpdate" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p class="text-sm text-blue-700">
            ⚡ Последнее обновление: {{ formatDate(lastUpdate) }}
          </p>
        </div>

        <button
          @click="$emit('add-to-cart')"
          :disabled="!product.inStock"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-md transition-colors text-lg"
          aria-label="Добавить в корзину"
        >
          Добавить в корзину
        </button>

        <router-link
          :to="ROUTES.CATALOG"
          class="block mt-4 text-center text-indigo-600 hover:text-indigo-800"
        >
          ← Вернуться в каталог
        </router-link>
      </div>
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
  lastUpdate?: string | null
}>()

defineEmits<{
  'add-to-cart': []
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

const formatDate = (dateString: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU')
}
</script>
