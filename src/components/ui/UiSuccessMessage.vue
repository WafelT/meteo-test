<template>
  <div class="bg-white rounded-lg shadow-md p-12 text-center">
    <div class="text-6xl mb-4">✅</div>
    <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ title }}</h2>
    <p class="text-lg text-gray-600 mb-6">
      <slot></slot>
    </p>
    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
// DEFININGS
defineProps<{
  title?: string
}>()
</script>
