<template>
  <div class="relative">
    <UiLoadingOverlay :loading="loading && items.length > 0" />
    
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      :class="{ 'opacity-50': loading && items.length > 0 }"
    >
      <ProductCard
        v-for="product in items"
        :key="product.id"
        :product="product"
        @add-to-cart="$emit('add-to-cart', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '../features/ProductCard.vue'
import UiLoadingOverlay from '../ui/UiLoadingOverlay.vue'
import type { Product } from '../../types'

// DEFININGS
defineProps<{
  items: Product[]
  loading?: boolean
}>()

defineEmits<{
  'add-to-cart': [productId: string]
}>()
</script>
