import { ref } from 'vue'
import PageCommentsAPI from '@/api/club_admin/pagecomments'
export function usePageComments() {
  const randompages = ref([])
  const loading = ref(false)
  const error = ref(null)
  const eventDay = ref(0)
  const eventCount = ref(0)
  const fetchRandomPages = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await PageCommentsAPI.getAllPageComments()
      const randomList = res?.data?.data?.random_pages || []
      console.log("Comments Pages :", randomList)
      randompages.value = randomList
      eventCount.value = randomList.length
      const today = new Date()
      const upcoming = randomList
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
    randompages,
    loading,
    error,
    fetchRandomPages,
    eventDay,
    eventCount
  }
}
