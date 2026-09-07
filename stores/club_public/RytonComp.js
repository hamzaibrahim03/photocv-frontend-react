import { defineStore } from 'pinia';
import api from '@/api/club_public/rytoncomp';
export const useRytonCompStore = defineStore('comp', {
  state: () => ({
    compData: {},
    loading: false,
    error: null
  }),
  actions: {
    async fetchRytonCompData(domain) {
      this.loading = true;
      try {
        const response = await api.getAllRytonComps(domain);
        this.compData = response.data;
        console.log("Competition data =>", this.compData);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
