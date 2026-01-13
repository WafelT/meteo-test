import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ROUTES, ROUTE_NAMES } from '../consts/routes'

// DATA
const routes = [
  {
    path: ROUTES.LOGIN,
    name: ROUTE_NAMES.LOGIN,
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: ROUTES.CATALOG,
    name: ROUTE_NAMES.CATALOG,
    component: () => import('../views/CatalogView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product/:id',
    name: ROUTE_NAMES.PRODUCT,
    component: () => import('../views/ProductView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: ROUTES.CART,
    name: ROUTE_NAMES.CART,
    component: () => import('../views/CartView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: ROUTES.CHECKOUT,
    name: ROUTE_NAMES.CHECKOUT,
    component: () => import('../views/CheckoutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: ROUTES.ROOT,
    redirect: ROUTES.CATALOG
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// SUBSCRIPTIONS
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next(ROUTES.LOGIN)
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next(ROUTES.CATALOG)
  } else {
    next()
  }
})

export default router
