import { defineStore } from 'pinia';
import api from '@/api/club_public/rytonsinglecomp';
export const useRytonSingleCompStore = defineStore('sincomp', {
  state: () => ({
    sincompData: {},
    loading: false,
    error: null
  }),
  actions: {
    async fetchRytonSingleCompData(competition_id) {
      this.loading = true;
      try {
        const response = await api.getAllRytonSingleComp(competition_id);
        this.sincompData = response.data;
        console.log("Single competition data =>", this.sincompData);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});