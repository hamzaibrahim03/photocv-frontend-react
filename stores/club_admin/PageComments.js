import { ref } from 'vue'
import PageCommentsAPI from '@/api/club_admin/pagecomments'

export function usePageComments() {
  const pagecomments = ref([])
  const loading = ref(false)
  const error = ref(null)
  const eventDay = ref(0)
  const eventCount = ref(0)

  const fetchPageComments = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await PageCommentsAPI.getAllPageComments()
      const commentList = res?.data?.data?.recent_comments || []
      console.log("Comments :", commentList)
      pagecomments.value = commentList
      eventCount.value = commentList.length

      const today = new Date()
      const upcoming = commentList
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
      error.value = err.message || 'Failed to load page comments'
    } finally {
      loading.value = false
    }
  }

  return {
    pagecomments,
    loading,
    error,
    fetchPageComments,
    eventDay,
    eventCount
  }
}
