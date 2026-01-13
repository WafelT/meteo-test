<template>
  <div v-if="message" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
    {{ message }}
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// DEFININGS
defineProps<{
  message?: string
}>()
</script>
