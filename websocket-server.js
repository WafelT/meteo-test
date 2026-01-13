// Simple WebSocket server mock using socket.io
import { Server } from 'socket.io'
import { createServer } from 'http'
import * as dataStore from './src/mocks/dataStore.js'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Simulate product updates every 8 seconds with both price and stock changes
  const productUpdateInterval = setInterval(() => {
    // Random product ID
    const productId = `postcard_${String(Math.floor(Math.random() * 80) + 1).padStart(3, '0')}`
    const currentProduct = dataStore.getProduct(productId)
    
    if (!currentProduct) return
    
    const changes = {}
    
    // Всегда меняем цену
    const priceChange = (Math.random() * 0.1 + 0.05) * (Math.random() > 0.5 ? 1 : -1)
    changes.price = parseFloat(Math.max(2.99, Math.min(49.99, currentProduct.price * (1 + priceChange))).toFixed(2))
    
    // Всегда меняем статус наличия (переключаем)
    changes.inStock = !currentProduct.inStock
    
    changes.updatedAt = new Date().toISOString()

    const updated = dataStore.updateProduct(productId, changes)
    if (updated) {
      socket.emit('product.updated', {
        type: 'product.updated',
        data: {
          id: productId,
          changes
        }
      })
      console.log(`Product ${productId} updated:`, changes)
    }
  }, 8000) // Every 8 seconds

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
    clearInterval(productUpdateInterval)
  })
})

const PORT = 3001
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on http://localhost:${PORT}`)
})
