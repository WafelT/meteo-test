import { ref } from 'vue'
import type { ToastNotification } from '../types'

// DATA
const notifications = ref<ToastNotification[]>([])
let notificationId = 0

// FUNCTIONS
const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000): number => {
  const id = ++notificationId
  const notification: ToastNotification = {
    id,
    message,
    type,
    duration
  }
  
  notifications.value.push(notification)
  
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
  
  return id
}

const removeToast = (id: number): void => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const success = (message: string, duration: number = 3000): number => {
  return showToast(message, 'success', duration)
}

const error = (message: string, duration: number = 5000): number => {
  return showToast(message, 'error', duration)
}

const warning = (message: string, duration: number = 4000): number => {
  return showToast(message, 'warning', duration)
}

const info = (message: string, duration: number = 3000): number => {
  return showToast(message, 'info', duration)
}

export const useToast = () => {
  return {
    notifications,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}
