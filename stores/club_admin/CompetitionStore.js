import { ref } from 'vue'
import CompetitionsAPI from '@/api/club_admin/competitions'
export function useCompetitionStore() {
  const competitions = ref([])
  const loading = ref(false)
  const error = ref(null)
  const memberCount = ref(0)
  const competitionCount = ref(0)
  const eventDay = ref(0)
  const fetchCompetitions = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await CompetitionsAPI.getAllCompetitions()
      const competitionList = res?.data?.data?.competitions?.original?.data || []
      competitions.value = competitionList
      memberCount.value = competitionList.length
      const today = new Date()
      const upcomingCompetitions = competitionList.filter(e => new Date(e.start_date) > today)
      competitionCount.value = upcomingCompetitions.length
      const upcoming = competitionList
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
      error.value = err.message || 'Failed to load competitions'
    } finally {
      loading.value = false
    }
  }
  return {
    competitions,
    loading,
    error,
    fetchCompetitions,
    memberCount,
    competitionCount,
    eventDay
  }
}
