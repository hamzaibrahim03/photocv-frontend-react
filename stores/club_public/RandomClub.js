import { defineStore } from 'pinia';
import api from '@/api/club_public/randomclubgallery';

export const useRandomClub = defineStore('club', {
  state: () => ({
    clubrandom: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchRandomClubGallery(domain) {
      this.loading = true;
      try {
        const response = await api.getAllRandomClub(domain);
        this.clubrandom = response.data;
        console.log("Random Club data =>", this.clubrandom);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
