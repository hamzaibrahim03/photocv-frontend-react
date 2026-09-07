import { ref } from 'vue'
import NewsCommentsAPI from '@/api/club_admin/newscomments'
export function useNewsComments() {
  const randomnews = ref([])
  const loading = ref(false)
  const error = ref(null)
  const eventDay = ref(0)
  const eventCount = ref(0)
  const fetchRandomNews = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await NewsCommentsAPI.getAllNewsComments()
      const randomList = res?.data?.data?.random_news || []
      console.log("Comments News :", randomList)
      randomnews.value = randomList
      eventCount.value = randomList.length
      const today = new Date()
      const upcoming = randomList
        .map(e => new Date(e.created_at))
        .filter(d => d > today)
        .sort((a, b) => a - b)[0]
      if (upcoming) {
        const diffInMs = upcoming - today
        eventDay.value = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
      } else {
        eventDay.value = 0
      }
    } catch (err) {
      error.value = err.message || 'Failed to load news'
    } finally {
      loading.value = false
    }
  }
  return {
    randomnews,
    loading,
    error,
    fetchRandomNews,
    eventDay,
    eventCount
  }
}
