<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-14 sm:h-16">
        <!-- Logo -->
        <router-link 
          :to="ROUTES.CATALOG" 
          class="text-lg sm:text-xl font-bold text-gray-800 flex-shrink-0"
        >
          💌 <span class="hidden sm:inline">Магазин открыток</span><span class="sm:hidden">Открытки</span>
        </router-link>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-4">
          <router-link
            :to="ROUTES.CATALOG"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-indigo-600 font-semibold bg-indigo-50"
          >
            Каталог
          </router-link>
          <router-link
            :to="ROUTES.CART"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium relative transition-colors"
            active-class="text-indigo-600 font-semibold bg-indigo-50"
          >
            Корзина
            <span
              v-if="cartCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartCount }}
            </span>
          </router-link>
        </nav>

        <!-- Desktop User Menu -->
        <div class="hidden md:flex items-center gap-4">
          <span class="text-gray-700 text-sm">{{ userNickname }}</span>
          <button
            @click="$emit('logout')"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            aria-label="Выйти"
          >
            Выйти
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          aria-label="Меню"
          :aria-expanded="isMobileMenuOpen"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!isMobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <nav
          v-if="isMobileMenuOpen"
          class="md:hidden border-t border-gray-200 py-3 flex flex-col gap-1"
        >
          <router-link
            :to="ROUTES.CATALOG"
            @click="closeMobileMenu"
            class="px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            active-class="text-indigo-600 bg-indigo-50 font-semibold"
          >
            Каталог
          </router-link>
          <router-link
            :to="ROUTES.CART"
            @click="closeMobileMenu"
            class="px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between"
            active-class="text-indigo-600 bg-indigo-50 font-semibold"
          >
            <span>Корзина</span>
            <span
              v-if="cartCount > 0"
              class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full"
            >
              {{ cartCount }}
            </span>
          </router-link>
          <div class="border-t border-gray-200 pt-2 flex flex-col gap-1">
            <div class="px-3 py-2 text-sm font-medium text-gray-700">
              {{ userNickname }}
            </div>
            <button
              @click="handleLogout"
              class="text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              Выйти
            </button>
          </div>
        </nav>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import { ROUTES } from '../../consts/routes'

// DEFININGS
const props = defineProps<{
  cartCount?: number
  userNickname?: string
}>()

const emit = defineEmits<{
  logout: []
}>()

// DATA
const isMobileMenuOpen = ref<boolean>(false)

// FUNCTIONS

const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false
}

const handleLogout = (): void => {
  closeMobileMenu()
  emit('logout')
}
</script>
