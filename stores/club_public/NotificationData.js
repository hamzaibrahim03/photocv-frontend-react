import { defineStore } from 'pinia'
import api from '@/api/club_public/rytonnotification'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    loading: false,
    error: null
  }),

  getters: {
    unreadCount: (state) =>
      state.notifications.filter(n => !n.read_at).length
  },

  actions: {
    async fetchNotifications() {
      this.loading = true
      try {
        const response = await api.getAllRytonNotification()

        this.notifications = response.data.data || []

        this.error = null
      } catch (err) {
        console.error('Failed to load notifications:', err)
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async markAllAsRead() {
      try {
        await api.markAllNotificationsRead()

        this.notifications = this.notifications.map(n => ({
          ...n,
          read_at: new Date().toISOString()
        }))
      } catch (err) {
        console.error('Read all failed', err)
      }
    },

    async markAsRead(id) {
      try {
        await api.markSingleNotificationRead(id)

        const index = this.notifications.findIndex(n => n.id === id)
        if (index !== -1) {
          this.notifications[index].read_at = new Date().toISOString()
        }
      } catch (err) {
        console.error('Read single failed', err)
      }
    }
  }
})

