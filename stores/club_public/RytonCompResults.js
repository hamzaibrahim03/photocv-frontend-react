import { defineStore } from 'pinia';
import api from '@/api/club_public/rytoncompresults';

export const useRytonCompResultStore = defineStore('comp', {
  state: () => ({
    compresData: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchRytonCompResData(domain) {
      this.loading = true;
      try {
        const response = await api.getAllRytonCompResults(domain);
        this.compresData = response.data.data;
        console.log("Competition Result data =>", this.compresData);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
