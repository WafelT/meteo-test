/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

// Vue 3 compiler macros for <script setup>
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {}
}