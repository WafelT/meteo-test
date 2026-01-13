<template>
  <div
    v-if="loading"
    class="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
  >
    <div class="flex flex-col items-center gap-3">
      <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-600 font-medium">Загрузка...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// DEFININGS
defineProps<{
  loading?: boolean
}>()
</script>
