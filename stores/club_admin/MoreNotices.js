import { ref } from 'vue'
import NoticeCommentsAPI from '@/api/club_admin/noticecomments'
export function useNoticeComments() {
  const randomnotices = ref([])
  const loading = ref(false)
  const error = ref(null)
  const eventDay = ref(0)
  const eventCount = ref(0)
  const fetchRandomNotices = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await NoticeCommentsAPI.getAllNoticeComments()
      const randomList = res?.data?.data?.random_notices || []
      console.log("Comments Notices :", randomList)
      randomnotices.value = randomList
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
      error.value = err.message || 'Failed to load notices'
    } finally {
      loading.value = false
    }
  }
  return {
    randomnotices,
    loading,
    error,
    fetchRandomNotices,
    eventDay,
    eventCount
  }
}
