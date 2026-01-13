<template>
  <div v-if="total > 0" class="mt-8 flex justify-center items-center space-x-2">
    <button
      @click="$emit('page-change', page - 1)"
      :disabled="page === 1"
      class="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      aria-label="Предыдущая страница"
    >
      Назад
    </button>
    <span class="px-4 py-2 text-gray-700">
      Страница {{ page }} из {{ totalPages }}
    </span>
    <button
      @click="$emit('page-change', page + 1)"
      :disabled="page >= totalPages"
      class="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      aria-label="Следующая страница"
    >
      Вперед
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// DEFININGS
const props = defineProps<{
  page: number
  total: number
  limit: number
}>()

defineEmits<{
  'page-change': [page: number]
}>()

// DATA
const totalPages = computed(() => Math.ceil(props.total / props.limit))
</script>
