import { defineStore } from 'pinia';
import api from '@/api/club_public/rytonsingleclubgallery';
export const useRytonSingleClubGalStore = defineStore('singleClubGallery', {
  state: () => ({
    sinclubgalData: null,
    galleryImages: [],
    galleryName: '',
    loading: false,
    error: null,
  }),
  actions: {
    async fetchRytonSingleClubGalData(galleryId) {
      this.loading = true;
      try {
        const response = await api.getAllRytonClubSingleGalleries(galleryId);
        console.log("✅ Single Club Gallery API Response =>", response.data);
        const galleryData = response.data?.data?.clubGallery?.original?.data || {};
        this.sinclubgalData = galleryData;
        this.galleryName = galleryData?.gallery_name || 'Unnamed Gallery';
        this.galleryImages = (galleryData?.photos || []).map(photo => ({
          ...photo,
          id: photo.id ?? photo.photo_id
        }))
        console.log(galleryData)
        console.log("🖼️ Final Photos:", this.sinclubgalData);
      } catch (err) {
        console.error("❌ Error fetching single club gallery:", err);
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  },
});
