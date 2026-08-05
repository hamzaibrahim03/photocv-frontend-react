import { defineStore } from 'pinia';
import api from '@/api/club_public/rytonfilters';

export const useRytonFilterStore = defineStore('filter', {
  state: () => ({
    filterData: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchRytonFilterData(domain) {
      this.loading = true;
      try {
        const response = await api.getAllRytonFilters(domain);
        this.filterData = response.data.data;
        console.log("Filter data =>", this.filterData);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
