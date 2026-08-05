import { ref } from 'vue'
import apiClient from '@/api/axios'

export function useMemberGallery() {
  const member_gallery = ref([])
  const loading = ref(false)
  const error = ref(null)
  const memberCount = ref(0)
  const eventDay = ref(0)
  const eventCount = ref(0)

  const fetchMemberGallery = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await apiClient.get('/members-galleries')
      const galleryList = res?.data?.data || []
      member_gallery.value = galleryList
      memberCount.value = galleryList.length
      console.log(galleryList)
      galleryList.forEach((member) => {
        console.log(`👤 Member: ${member.first_name} ${member.last_name}`)

        if (Array.isArray(member.galleries)) {
          member.galleries.forEach((gallery, index) => {
            console.log(`📁 Gallery ${index + 1}: ${gallery.gallery_name || 'No name'}`)
            if (Array.isArray(gallery.photos)) {
              gallery.photos.forEach((photo, photoIndex) => {
                console.log(`🖼️ Photo ${photoIndex + 1}: ${photo.image || 'No image field'}`)
              })
            } else {
              console.log('❌ No photos array in gallery')
            }
          })
        } else {
          console.log('❌ No galleries found for this member')
        }

        console.log('--------------------------')
      })

    } catch (err) {
      error.value = err.message || 'Failed to load galleries'
    } finally {
      loading.value = false
    }
  }


  return {
    member_gallery,
    loading,
    error,
    fetchMemberGallery,
    memberCount,
    eventCount,
    eventDay
  }
}
