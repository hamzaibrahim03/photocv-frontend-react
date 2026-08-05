import { defineStore } from 'pinia'
import axios from '@/api/axios'

export const useMemberStore = defineStore('member', {
  state: () => ({
    memberData: [],
    memberCount: 0,
    eventCount: 0,
    loading: false,
    error: null
  }),

  actions: {
    async fetchMembers() {
      this.loading = true
      try {
        const res = await axios.get('/members')
        const memberList = res.data?.data?.original?.data || []
        this.memberData = memberList
        this.memberCount = memberList.length
        let totalComments = 0;
        let totalLikes = 0;

        this.memberData.forEach(member => {
          totalComments += member.gallery_total_comments || 0;
          totalLikes += member.gallery_total_likes || 0;
        });

        this.eventCount = totalComments + totalLikes;
        this.error = null
      } catch (err) {
        console.error('Fetch error:', err)
        this.error = err
      } finally {
        this.loading = false
      }
    }
  }
})
