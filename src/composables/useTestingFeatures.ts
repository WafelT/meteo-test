import { ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useToast } from './useToast'
import { api } from '../services/api'

// DATA
export const useTestingFeatures = () => {
  const cartStore = useCartStore()
  const toast = useToast()
  const isAddingAll = ref<boolean>(false)

  // FUNCTIONS
  const addAllProductsToCart = async (): Promise<void> => {
    if (isAddingAll.value) return
    
    isAddingAll.value = true
    
    try {
      const allProducts = await api.products.list({ limit: 1000, page: 1 })
      
      if (!allProducts || !allProducts.items || allProducts.items.length === 0) {
        toast.error('Товары не найдены')
        isAddingAll.value = false
        return
      }
      
      const products = allProducts.items
      let addedCount = 0
      let errorCount = 0
      let skippedCount = 0
      
      for (const product of products) {
        try {
          const existingItem = cartStore.items.find(item => item.productId === product.id)
          if (existingItem) {
            skippedCount++
            continue
          }
          
          await cartStore.addItem(product.id, 1)
          addedCount++
          await new Promise(resolve => setTimeout(resolve, 30))
        } catch (error) {
          errorCount++
          console.error(`Failed to add ${product.name}:`, error)
        }
      }
      
      if (addedCount > 0) {
        toast.success(`Добавлено ${addedCount} товаров в корзину${skippedCount > 0 ? ` (пропущено: ${skippedCount})` : ''}${errorCount > 0 ? ` (ошибок: ${errorCount})` : ''}`)
      } else if (skippedCount > 0) {
        toast.info(`Все товары уже в корзине (${skippedCount})`)
      } else {
        toast.error('Не удалось добавить товары в корзину')
      }
    } catch (error: any) {
      toast.error('Ошибка при добавлении товаров: ' + (error.message || 'Неизвестная ошибка'))
    } finally {
      isAddingAll.value = false
    }
  }

  return {
    isAddingAll,
    addAllProductsToCart
  }
}
