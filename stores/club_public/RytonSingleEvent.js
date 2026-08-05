import { defineStore } from 'pinia';
import api from '@/api/club_public/rytonsingleevent';

export const useRytonSingleEventStore = defineStore('sinevent', {
  state: () => ({
    sineventData: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchRytonSingleEventData(event_id) {
      this.loading = true;
      try {
        const response = await api.getAllRytonSingleEvent(event_id);
        this.sineventData = response.data;
        console.log("Single Event data =>", this.sineventData);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
