import { defineStore } from 'pinia';
import api from '@/api/club_public/rytongallery';

export const useRytonGalleryStore = defineStore('gallery', {
  state: () => ({
    galleryData: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchRytonGalleryData(domain) {
      this.loading = true;
      try {
        const response = await api.getAllRytonGalleries(domain);
        this.galleryData = response.data;
        console.log("Gallery data =>", this.galleryData);
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
