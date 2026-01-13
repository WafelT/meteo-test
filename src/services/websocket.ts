import { io, Socket } from 'socket.io-client'

// DATA
let socket: Socket | null = null

// FUNCTIONS
export const connectWebSocket = (token: string | null = null): Socket => {
  if (socket?.connected) {
    return socket
  }

  const url = 'http://localhost:3001'
  socket = io(url, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  })

  socket.on('connect', () => {
    console.log('WebSocket connected')
  })

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected')
  })

  socket.on('error', (error: Error) => {
    console.error('WebSocket error:', error)
  })

  return socket
}

export const disconnectWebSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = (): Socket | null => {
  return socket
}
