import { ref } from 'vue'
import MoreCompetitionsAPI from '@/api/club_admin/morecompetitions'
export function useMoreCompetitions() {
  const randomcompetitions = ref([])
  const loading = ref(false)
  const error = ref(null)
  const eventDay = ref(0)
  const eventCount = ref(0)
  const fetchRandomCompetitions = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await MoreCompetitionsAPI.getAllMoreCompetitions()
      const randomList = res?.data?.data?.random_competitions || []
      console.log("Comments :", randomList)
      randomcompetitions.value = randomList
      eventCount.value = randomList.length
      const today = new Date()
      const upcoming = randomList
        .map(e => new Date(e.start_date))
        .filter(d => d > today)
        .sort((a, b) => a - b)[0]
      if (upcoming) {
        const diffInMs = upcoming - today
        eventDay.value = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
      } else {
        eventDay.value = 0
      }
    } catch (err) {
      error.value = err.message || 'Failed to load event comments'
    } finally {
      loading.value = false
    }
  }
  return {
    randomcompetitions,
    loading,
    error,
    fetchRandomCompetitions,
    eventDay,
    eventCount
  }
}
