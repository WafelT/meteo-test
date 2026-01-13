<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Каталог открыток</h1>

    <ProductFilters
      :filters="localFilters"
      @search-input="handleSearchInput"
      @price-input="handlePriceInput"
      @filter-change="handleFilterChange"
    />

    <UiLoadingSkeleton
      v-if="productsStore.loading && productsStore.items.length === 0"
    />

    <UiErrorMessage
      v-else-if="productsStore.error && productsStore.items.length === 0"
      :message="productsStore.error"
    />

    <UiEmptyState
      v-else-if="!productsStore.loading && productsStore.items.length === 0"
      message="Товары не найдены"
    />

    <ProductGrid
      v-else
      :items="productsStore.items"
      :loading="productsStore.loading"
      @add-to-cart="handleAddToCart"
    />

    <UiPagination
      v-if="productsStore.total > 0"
      :page="productsStore.page"
      :total="productsStore.total"
      :limit="productsStore.limit"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useToast } from '../composables/useToast'
import ProductFilters from '../components/widgets/ProductFilters.vue'
import ProductGrid from '../components/widgets/ProductGrid.vue'
import UiLoadingSkeleton from '../components/ui/UiLoadingSkeleton.vue'
import UiLoadingOverlay from '../components/ui/UiLoadingOverlay.vue'
import UiPagination from '../components/ui/UiPagination.vue'
import UiEmptyState from '../components/ui/UiEmptyState.vue'
import UiErrorMessage from '../components/ui/UiErrorMessage.vue'
import type { ProductFilters as ProductFiltersType } from '../types'

// DATA
const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const toast = useToast()

const localFilters = ref<ProductFiltersType>({
  q: '',
  min: '',
  max: '',
  inStock: null,
  rarity: '',
  sort: 'price_asc'
})

let isInternalUpdate = false

// FUNCTIONS
const syncFiltersFromURL = (): void => {
  const query = route.query
  localFilters.value = {
    q: (query.q as string) || '',
    min: (query.min as string) || '',
    max: (query.max as string) || '',
    inStock: query.inStock === 'true' ? true : query.inStock === 'false' ? false : null,
    rarity: (query.rarity as string) || '',
    sort: (query.sort as string) || 'price_asc'
  }
  productsStore.updateFilters(localFilters.value)
}

const updateFilters = (): void => {
  productsStore.updateFilters(localFilters.value)
  updateURL(true)
  productsStore.fetchProducts({ page: 1 })
}

const handleSearchInput = ({ value, immediate }: { value: string; immediate: boolean }): void => {
  localFilters.value.q = value
  
  if (immediate) {
    updateURL(true)
  } else {
    isInternalUpdate = true
    productsStore.updateFilters(localFilters.value)
    productsStore.fetchProducts({ page: 1 })
    setTimeout(() => { isInternalUpdate = false }, 50)
  }
}

const handlePriceInput = ({ field, value, immediate }: { field: 'min' | 'max'; value: string; immediate: boolean }): void => {
  localFilters.value[field] = value ? parseFloat(value) || '' : ''
  
  if (immediate) {
    updateURL(true)
  } else {
    isInternalUpdate = true
    productsStore.updateFilters(localFilters.value)
    productsStore.fetchProducts({ page: 1 })
    setTimeout(() => { isInternalUpdate = false }, 50)
  }
}

const handleFilterChange = ({ field, value }: { field: keyof ProductFiltersType; value: any }): void => {
  localFilters.value[field] = value
  updateFilters()
}

const updateURL = (isInternal = false): void => {
  if (isInternal) {
    isInternalUpdate = true
  }
  
  const query: Record<string, string> = {}
  if (localFilters.value.q) query.q = localFilters.value.q as string
  if (localFilters.value.min) query.min = String(localFilters.value.min)
  if (localFilters.value.max) query.max = String(localFilters.value.max)
  if (localFilters.value.inStock !== null) query.inStock = String(localFilters.value.inStock)
  if (localFilters.value.rarity) query.rarity = localFilters.value.rarity as string
  if (localFilters.value.sort) query.sort = localFilters.value.sort as string
  
  router.replace({ query })
  
  if (isInternal) {
    setTimeout(() => { isInternalUpdate = false }, 50)
  }
}

const handlePageChange = (page: number): void => {
  productsStore.fetchProducts({ page })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleAddToCart = async (productId: string): Promise<void> => {
  try {
    await cartStore.addItem(productId, 1)
    const product = productsStore.items.find(p => p.id === productId)
    const productName = product?.name || 'Товар'
    toast.success(`${productName} добавлен в корзину`)
  } catch (error: any) {
    toast.error(error.error || 'Ошибка при добавлении в корзину')
  }
}

// SUBSCRIPTIONS
onMounted(() => {
  syncFiltersFromURL()
  productsStore.fetchProducts()
})

watch(() => route.query, () => {
  if (isInternalUpdate) {
    return
  }
  
  syncFiltersFromURL()
  productsStore.fetchProducts()
}, { deep: true })
</script>
