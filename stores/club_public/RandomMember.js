import { defineStore } from 'pinia';
import api from '@/api/club_public/randommembergallery';

export const useRandomMember = defineStore('member', {
  state: () => ({
    memberrandom: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchRandomMemberGallery(domain) {
      this.loading = true;
      try {
        const response = await api.getAllRandomMember(domain);
        this.memberrandom = response.data;
        console.log("Random Member data =>", this.memberrandom);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
