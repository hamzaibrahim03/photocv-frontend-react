import { defineStore } from 'pinia';
import api from '@/api/club_public/rytonsingleresult';
export const useRytonSingleCompResultStore = defineStore('sincompres', {
  state: () => ({
    sincompresData: {},
    loading: false,
    entries: [],
    profileImage: null,
    error: null
  }),
  actions: {
    async fetchRytonSingleCompResData(competitionresult_id) {
      this.loading = true
      try {
        const response = await api.getAllRytonSingleCompResult(competitionresult_id)
        const data = response.data.data
        this.entries = (data.entries || []).map(entry => ({
          ...entry,
          exif: {
            camera_model: entry.camera_model || 'N/A',
            lens: entry.lens || 'N/A',
            focal_length: entry.focal_length || 'N/A',
            aperture: entry.aperture || 'N/A',
            shutter_speed: entry.shutter_speed || 'N/A',
            iso: entry.iso || 'N/A'
          },
          comments: entry.comments || [],
          likes: entry.likes_count,
          entry_id: entry.id
        }))
        this.profileImage = data.featured_image_url || null
        this.sincompresData = data
        console.log('Normalized entries =>', this.entries)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    }
  }
});