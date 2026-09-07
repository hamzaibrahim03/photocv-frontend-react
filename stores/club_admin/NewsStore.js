import { ref } from 'vue'
import NewsAPI from '@/api/club_admin/news'
export function useNewsStore() {
  const news = ref([])
  const loading = ref(false)
  const error = ref(null)
  const memberCount = ref(0)
  const currentMonthCount = ref(0)
  const completedDaysAgo = ref(0)
  const fetchNews = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await NewsAPI.getAllNews()
      const newsList = res?.data?.data?.original?.data || []
      news.value = newsList
      memberCount.value = newsList.length
      const today = new Date()
      currentMonthCount.value = newsList.filter(e => {
        const date = new Date(e.publish_date)
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        )
      }).length
      const isValidDate = (d) => d instanceof Date && !isNaN(d)
      const pastNews = newsList
        .map(e => {
          const date = new Date(e.publish_date)
          return isValidDate(date) ? { ...e, createdAtParsed: date } : null
        })
        .filter(e => e && e.createdAtParsed < today)
        .sort((a, b) => b.createdAtParsed - a.createdAtParsed)
      if (pastNews.length > 0) {
        const lastNewsDate = pastNews[0].createdAtParsed
        const diffInMs = today - lastNewsDate
        completedDaysAgo.value = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
      } else {
        completedDaysAgo.value = 0
      }
    } catch (err) {
      error.value = err.message || 'Failed to load news'
    } finally {
      loading.value = false
    }
  }
  return {
    news,
    loading,
    error,
    fetchNews,
    memberCount,
    currentMonthCount,
    completedDaysAgo,
  }
}
