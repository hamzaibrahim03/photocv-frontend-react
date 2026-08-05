import { defineStore } from 'pinia';
import api from '@/api/club_public/rytonclub';

export const useRytonClubStore = defineStore('club', {
  state: () => ({
    clubData: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchRytonClubData(domain) {
      this.loading = true;
      try {
        const response = await api.getAllRytonClub(domain);
        this.clubData = response.data;
        console.log("Club data =>", this.clubData);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
