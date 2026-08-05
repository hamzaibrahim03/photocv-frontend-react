import { defineStore } from 'pinia';
import api from '@/api/club_public/rytonnotice';

export const useRytonNoticeStore = defineStore('notice', {
  state: () => ({
    noticeData: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchRytonNoticeData(domain) {
      this.loading = true;
      try {
        const response = await api.getAllRytonNotice(domain);
        this.noticeData = response.data;
        console.log("Notice data =>", this.noticeData);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
