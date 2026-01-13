<template>
  <div class="text-center py-12">
    <p class="text-gray-500 text-lg">{{ message }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
// DEFININGS
defineProps<{
  message?: string
}>()
</script>
