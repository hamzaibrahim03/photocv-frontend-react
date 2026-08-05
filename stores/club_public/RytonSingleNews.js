import { defineStore } from 'pinia';
import api from '@/api/club_public/rytonsinglenews';

export const useRytonSingleNewsStore = defineStore('sinnews', {
  state: () => ({
    sinnewsData: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchRytonSingleNewsData(news_id) {
      this.loading = true;
      try {
        const response = await api.getAllRytonSingleNews(news_id);
        this.sinnewsData = response.data;
        console.log("Single news data =>", this.sinnewsData);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
