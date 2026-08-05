import { defineStore } from 'pinia';
import api from '@/api/club_public/clubdata';

export const useHomeStore = defineStore('home', {
  state: () => ({
    homeData: {},
    clubSettings: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchHomeData(domain) {
      this.loading = true;
      try {
        const response = await api.getAllClubData(domain);
        this.homeData = response.data;
        this.clubSettings = response.data.data.clubSettings.original.data.settings
        this.clubSetting = response.data.data.clubSettings.original.data
        console.log(this.clubSettings.cover_images)
        this.error = null;
      } catch (err) {
        console.error('Failed to load home data:', err);
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
