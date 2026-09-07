import { ref } from 'vue'
import MoreCompetitionsAPI from '@/api/club_admin/morecompetitions'
export function useMoreCompetitions() {
  const recentsubmissions = ref([])
  const loading = ref(false)
  const error = ref(null)
  const eventDay = ref(0)
  const eventCount = ref(0)
  const fetchRecentSubmissions = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await MoreCompetitionsAPI.getAllMoreCompetitions()
      const randomList = res?.data?.data?.recent_submissions || []
      console.log("Submission :", randomList)
      recentsubmissions.value = randomList
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
      error.value = err.message || 'Failed to load submissions'
    } finally {
      loading.value = false
    }
  }
  return {
    recentsubmissions,
    loading,
    error,
    fetchRecentSubmissions,
    eventDay,
    eventCount
  }
}
