import { defineStore } from 'pinia';
import api from '@/api/club_public/rytonsinglemembergallery';

export const useRytonSingleMemGalStore = defineStore('singleMemberGallery', {
  state: () => ({
    sinmemgalData: null,
    galleryImages: [],
    galleryName: '',
    loading: false,
    error: null,
    member: null,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    profileImage: '',
    role: '',
    socialLinks: []
  }),

  actions: {
    async fetchRytonSingleMemGalData(galleryId) {
      this.loading = true;
      try {
        const response = await api.getAllRytonMemberSingleGalleries(galleryId);
        console.log("Single Member Gallery data =>", response.data);

        const gallery = response.data?.data?.memberGalleries?.original?.data?.galleries
          || response.data?.data?.galleries
          || response.data?.galleries
          || null;

        const member = response.data?.data?.memberGalleries?.original?.data?.member;

        if (member) {
          this.member = member;
          this.username = member.username || '';
          this.firstName = member.first_name || '';
          this.lastName = member.last_name || '';
          this.email = member.email || '';
          this.profileImage = member.profile_image || '';
          this.role = member.role || '';
          this.socialLinks = member.social_links || [];
        }
        console.log(gallery)
        this.sinmemgalData = gallery[0];
        this.galleryName = gallery[0]?.gallery_name || 'Unnamed Gallery';
        this.galleryImages = gallery[0]?.photos || [];
        console.log(this.galleryImages)
      } catch (err) {
        console.error("Error fetching single gallery:", err);
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
