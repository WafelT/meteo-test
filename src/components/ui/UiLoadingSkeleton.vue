<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div v-for="i in count" :key="i" class="bg-white rounded-lg shadow-md animate-pulse">
      <div class="h-48 bg-gray-200 rounded-t-lg"></div>
      <div class="p-4 space-y-2">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// DEFININGS
defineProps<{
  count?: number
}>()
</script>
