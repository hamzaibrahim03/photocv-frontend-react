import { ref } from 'vue'
import apiClient from '@/api/axios'

export function useEventStore() {
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)
  const memberCount = ref(0)
  const eventDay = ref(0)
  const eventCount = ref(0)

  const fetchEvents = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.get('/events')
      const eventList = response?.data?.data?.original?.data || []
      events.value = eventList
      memberCount.value = eventList.length

      const today = new Date()
      const upcomingEvents = eventList.filter(e => new Date(e.event_date) > today)
      eventCount.value = upcomingEvents.length
      const upcoming = eventList
        .map(e => new Date(e.event_date))
        .filter(d => d > today)
        .sort((a, b) => a - b)[0]

      if (upcoming) {
        const diffInMs = upcoming - today
        eventDay.value = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
      } else {
        eventDay.value = 0
      }

    } catch (err) {
      error.value = err.message || 'Failed to load events'
    } finally {
      loading.value = false
    }
  }

  return {
    events,
    loading,
    error,
    fetchEvents,
    memberCount,
    eventCount,
    eventDay
  }
}
