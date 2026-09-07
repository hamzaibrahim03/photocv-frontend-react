import { defineStore } from 'pinia';
import api from '@/api/club_public/rytonsinglenotice';
export const useRytonSingleNoticeStore = defineStore('sinnotice', {
  state: () => ({
    sinnoticeData: {},
    loading: false,
    error: null
  }),
  actions: {
    async fetchRytonSingleNoticeData(id) {
      this.loading = true;
      try {
        const response = await api.getAllRytonSingleNotice(id);
        this.sinnoticeData = response.data;
        console.log("Single notice data =>", this.sinnoticeData);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
