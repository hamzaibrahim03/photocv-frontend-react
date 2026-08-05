import { ref } from 'vue'
import PagesAPI from '@/api/club_admin/pages'

export function usePagesStore() {
  const pages = ref([])
  const loading = ref(false)
  const error = ref(null)
  const memberCount = ref(0)
  const currentMonthCount = ref(0)
  const eventDay = ref(0)

  const fetchPages = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await PagesAPI.getAllPages()
      const pageList = res?.data?.data?.original?.data || []

      pages.value = pageList
      memberCount.value = pageList.length

      const today = new Date()
      currentMonthCount.value = pageList.filter(e => {
        const date = new Date(e.publish_date)
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        )
      }).length
      const upcoming = pageList
        .map(e => new Date(e.publish_date))
        .filter(d => d > today)
        .sort((a, b) => a - b)[0]

      if (upcoming) {
        const diffInMs = upcoming - today
        eventDay.value = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
      } else {
        eventDay.value = 0
      }

    } catch (err) {
      error.value = err.message || 'Failed to load pages'
    } finally {
      loading.value = false
    }
  }

  return {
    pages,
    loading,
    error,
    fetchPages,
    memberCount,
    currentMonthCount,
    eventDay
  }
}
