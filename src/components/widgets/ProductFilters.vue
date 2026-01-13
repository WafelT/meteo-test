<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
        <input
          :model-value="filters.q"
          @input="handleSearchInput"
          type="text"
          placeholder="Название товара"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          aria-label="Поиск по названию"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Мин. цена</label>
        <input
          :value="minValue"
          @input="(e) => handlePriceInput('min', (e.target as HTMLInputElement).value)"
          type="number"
          min="0"
          placeholder="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          aria-label="Минимальная цена"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Макс. цена</label>
        <input
          :value="maxValue"
          @input="(e) => handlePriceInput('max', (e.target as HTMLInputElement).value)"
          type="number"
          min="0"
          placeholder="999"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          aria-label="Максимальная цена"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Редкость</label>
        <select
          :model-value="filters.rarity"
          @change="handleFilterChange('rarity', (e.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          aria-label="Фильтр по редкости"
        >
          <option value="">Все</option>
          <option value="consumer">Обычная</option>
          <option value="industrial">Промышленная</option>
          <option value="mil-spec">Военная</option>
          <option value="restricted">Ограниченная</option>
          <option value="classified">Секретная</option>
          <option value="covert">Скрытая</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">В наличии</label>
        <select
          :model-value="filters.inStock"
          @change="handleInStockChange"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          aria-label="Фильтр по наличию"
        >
          <option :value="null">Все</option>
          <option :value="true">В наличии</option>
          <option :value="false">Нет в наличии</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Сортировка</label>
        <select
          :model-value="filters.sort"
          @change="handleFilterChange('sort', (e.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          aria-label="Сортировка"
        >
          <option value="price_asc">Цена: по возрастанию</option>
          <option value="price_desc">Цена: по убыванию</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { ProductFilters } from '../../types'

// DEFININGS
const props = defineProps<{
  filters: ProductFilters
}>()

const emit = defineEmits<{
  'search-input': [data: { value: string; immediate: boolean }]
  'price-input': [data: { field: 'min' | 'max'; value: string; immediate: boolean }]
  'filter-change': [data: { field: keyof ProductFilters; value: any }]
}>()

// DATA
const route = useRoute()
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
let priceDebounceTimer: ReturnType<typeof setTimeout> | null = null

// COMPUTED
const minValue = computed<string>(() => {
  const value = props.filters.min
  if (value === undefined || value === null || value === '') return ''
  return String(value)
})

const maxValue = computed<string>(() => {
  const value = props.filters.max
  if (value === undefined || value === null || value === '') return ''
  return String(value)
})

// FUNCTIONS
const syncFromURL = (): void => {
  const query = route.query
  
  // Синхронизируем значения из URL с фильтрами через emit
  if (query.q && query.q !== props.filters.q) {
    emit('search-input', { value: String(query.q), immediate: true })
  }
  
  if (query.min && String(query.min) !== minValue.value) {
    emit('price-input', { field: 'min', value: String(query.min), immediate: true })
  }
  
  if (query.max && String(query.max) !== maxValue.value) {
    emit('price-input', { field: 'max', value: String(query.max), immediate: true })
  }
  
  if (query.rarity && query.rarity !== props.filters.rarity) {
    emit('filter-change', { field: 'rarity', value: String(query.rarity) })
  }
  
  if (query.inStock !== undefined && String(query.inStock) !== String(props.filters.inStock)) {
    const inStockValue = query.inStock === 'true' ? true : query.inStock === 'false' ? false : null
    emit('filter-change', { field: 'inStock', value: inStockValue })
  }
  
  if (query.sort && query.sort !== props.filters.sort) {
    emit('filter-change', { field: 'sort', value: String(query.sort) })
  }
}

const handleSearchInput = (event: Event): void => {
  const value = (event.target as HTMLInputElement).value
  clearTimeout(searchDebounceTimer!)
  
  emit('search-input', { value, immediate: true })
  
  searchDebounceTimer = setTimeout(() => {
    emit('search-input', { value, immediate: false })
  }, 500)
}

const handlePriceInput = (field: 'min' | 'max', value: string): void => {
  clearTimeout(priceDebounceTimer!)
  
  emit('price-input', { field, value, immediate: true })
  
  priceDebounceTimer = setTimeout(() => {
    emit('price-input', { field, value, immediate: false })
  }, 500)
}

const handleInStockChange = (event: Event): void => {
  const value = (event.target as HTMLSelectElement).value
  let parsedValue: boolean | null = null
  if (value === 'true') parsedValue = true
  else if (value === 'false') parsedValue = false
  emit('filter-change', { field: 'inStock', value: parsedValue })
}

const handleFilterChange = (field: keyof ProductFilters, value: any): void => {
  emit('filter-change', { field, value })
}

// SUBSCRIPTIONS
onMounted(() => {
  // Синхронизируем значения из URL при монтировании
  syncFromURL()
})

watch(() => route.query, () => {
  // Синхронизируем при изменении query параметров
  syncFromURL()
}, { deep: true })

onUnmounted(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
  if (priceDebounceTimer) {
    clearTimeout(priceDebounceTimer)
  }
})
</script>
