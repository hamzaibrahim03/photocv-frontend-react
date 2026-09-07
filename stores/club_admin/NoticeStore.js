import { ref } from 'vue'
import NoticesAPI from '@/api/club_admin/notices'
export function useNoticeStore() {
  const notices = ref([])
  const loading = ref(false)
  const error = ref(null)
  const memberCount = ref(0)
  const currentMonthCount = ref(0)
  const completedDaysAgo = ref(0)
  const fetchNotices = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await NoticesAPI.getAllNotices()
      const noticeList = res?.data?.data?.original?.data || []
      notices.value = noticeList
      memberCount.value = noticeList.length
      const today = new Date()
      currentMonthCount.value = noticeList.filter(e => {
        const date = new Date(e.created_at)
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        )
      }).length
      const isValidDate = (d) => d instanceof Date && !isNaN(d)
      const pastNotices = noticeList
        .map(e => {
          const date = new Date(e.created_at)
          return isValidDate(date) ? { ...e, createdAtParsed: date } : null
        })
        .filter(e => e && e.createdAtParsed < today)
        .sort((a, b) => b.createdAtParsed - a.createdAtParsed)
      if (pastNotices.length > 0) {
        const lastNoticeDate = pastNotices[0].createdAtParsed
        const diffInMs = today - lastNoticeDate
        completedDaysAgo.value = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
      } else {
        completedDaysAgo.value = 0
      }
    } catch (err) {
      error.value = err.message || 'Failed to load notices'
    } finally {
      loading.value = false
    }
  }
  return {
    notices,
    loading,
    error,
    fetchNotices,
    memberCount,
    currentMonthCount,
    completedDaysAgo,
  }
}
