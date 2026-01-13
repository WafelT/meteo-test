import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// FUNCTIONS
const enableMocking = async (): Promise<boolean> => {
  if (import.meta.env.MODE !== 'development') {
    return false
  }

  try {
    const { worker } = await import('./mocks/browser.js')
    
    await worker.start({
      onUnhandledRequest: 'bypass',
      waitUntilReady: true
    })
    
    console.log('✅ MSW initialized successfully')
    return true
  } catch (error) {
    console.warn('⚠️ MSW initialization failed:', error)
    console.warn('Continuing without MSW...')
    return false
  }
}

// SUBSCRIPTIONS
enableMocking().then(() => {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.mount('#app')
})
