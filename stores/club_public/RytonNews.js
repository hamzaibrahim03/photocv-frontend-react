import { defineStore } from 'pinia';
import api from '@/api/club_public/rytonnews';

export const useRytonNewsStore = defineStore('news', {
  state: () => ({
    newsData: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchRytonNewsData(domain) {
      this.loading = true;
      try {
        const response = await api.getAllRytonNews(domain);
        this.newsData = response.data;
        console.log("News data =>", this.newsData);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
