import { defineStore } from 'pinia';
import api from '@/api/club_admin/dashboard';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    dashboardData: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchDashboardData() {
      this.loading = true;
      try {
        const response = await api.getAllDashboardData();
        this.dashboardData = response.data;
        this.error = null;
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
