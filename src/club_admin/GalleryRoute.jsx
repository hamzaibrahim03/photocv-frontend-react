<template>
<div :style="{ backgroundColor: 'white' }">
    <Loader :show="isLoading" />
    <div v-if="!isLoading">
        <NavigationRoute />
        <HeaderRoute title="Galleries" />
        <div class="content">
            <section>
                <div class="container">
                    <div class="dashboard-card">
                        <div class="profile-card">
                            <div class="profile-left">
                                <div class="profile-info">
                                    <small class="greeting">Features Members & Club Galleries</small>
                                    <h2 class="name">24 Club Galleries</h2>
                                    <small class="role">15 Member Galleries</small>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end">
                                <div class="dt-search">
                                    <input type="search" style="width: 250px" class="form-control" id="dt-search-1" placeholder="Search" aria-controls="example1" />
                                </div>
                            </div>
                        </div>
                        <div class="card-section">
                            <div class="stat-card">
                                <small class="ca-details">Images</small>
                                <h3 class="number">{{ MemberCount }}</h3>
                            </div>
                            <div class="event-card">
                                <small class="ca-details">Interactions</small>
                                <div class="row">
                                    <div class="col-md-5">
                                        <h3 class="number">{{ EventDay }}</h3>
                                    </div>
                                    <div class="days col-md-7">
                                        <span>Likes & Comments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div class="container">
                    <div class="card">
                        <div class="d-flex justify-content-between align-items-center mb-3" style="padding: 15px">
                            <h4>Member Galleries</h4>
                            <router-link to="/mem_gallery" custom v-slot="{ navigate }">
                                <button class="btn btn-sm" id="view" @click="navigate">View All</button>
                            </router-link>
                        </div>

                        <div class="row g-0" style="margin-left: 0; margin-right: 0;">
                            <div v-for="(gallery, index) in member_gallery" :key="gallery.id" class="col-3 p-0">
                                <div class="galleriy" v-if="gallery.galleries.length && gallery.galleries[0].photos.length">
                                    <div class="galleriy-item">
                                        <img :src="gallery.galleries[0].photos[0].image_url" alt="Gallery Photo" class="img-fluid" style="border-radius:0px; max-width: 493px; max-height: 370px; object-fit: cover;" />
                                        <div style="border-radius: 0px" :class="[ 'galleriy-infos', index % 2 === 0 ? 'even-info' : 'odd-info', ]">
                                            <div class="gal-item">
                                                <img v-if="gallery.profile_image_url" class="img-fluid event-img" :src="gallery.profile_image_url" alt="Event" @error="gallery.profile_image_url = null" />
                                                <div v-else class="event-img fallback-box d-flex justify-content-center align-items-center">
                                                </div>
                                                <div class="gal-details">
                                                    <span>{{ gallery.galleries[0].gallery_name }}</span>
                                                </div>
                                            </div>

                                            <div class="profile-icon d-flex justify-content-between mt-2">
                                                <div class="icons">
                                                    <span>{{ gallery.gallery_total_photos }}</span>
                                                    <img :src="Ima" alt="icon" style="width:14px; height:14px;" />
                                                </div>
                                                <div class="icons">
                                                    <span>{{ gallery.gallery_total_likes }}</span>
                                                    <img :src="Hea" alt="icon" style="width:14px; height:14px;" />
                                                </div>
                                                <div class="icons">
                                                    <span>{{ gallery.gallery_total_comments }}</span>
                                                    <img :src="Com" alt="icon" style="width:14px; height:14px;" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section>
                <div class="container">
                    <div class="card">
                        <div class="d-flex justify-content-between align-items-center mb-3" style="padding: 15px">
                            <h4>Club Galleries</h4>
                            <router-link to="/club_gallery" custom v-slot="{ navigate }">
                                <button class="btn btn-sm" id="view" @click="navigate">View All</button>
                            </router-link>
                        </div>

                        <div class="row" style="margin-left:0.1%">
                            <div v-for="(gallery, index) in club_gallery" :key="gallery.gallery_id" style="width:24.8%; padding-left: 0; padding-right: 0;">
                                <div class="galleriy" v-if="gallery.photos && gallery.photos.length">
                                    <div class="galleriy-item">
                                        <img :src="gallery.photos[0].image" alt="Gallery Photo" class="img-fluid" style="border-radius:0px; max-width: 493px; max-height: 370px;" />
                                        <div style="border-radius: 0px" :class="[ 'galleriy-infos', index % 2 === 0 ? 'even-info' : 'odd-info', ]">
                                            <div class="gal-item">
                                                <span>{{ gallery.photos[0].title }}</span>
                                            </div>
                                            <div class="profile-icon d-flex justify-content-between">
                                                <div class="icons">
                                                    <span>{{ gallery.total_photos }}</span>
                                                    <img :src="Ima" alt="icon" style="width:14px; height: 14px;" />
                                                </div>
                                                <div class="icons">
                                                    <span>{{ gallery.photos[0].likes_count }}</span>
                                                    <img :src="Hea" alt="icon" style="width:14px; height: 14px;" />
                                                </div>
                                                <div class="icons">
                                                    <span>{{ gallery.photos[0].comments_count }}</span>
                                                    <img :src="Com" alt="icon" style="width:14px; height: 14px;" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>

</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import NavigationRoute from "@/components/NavigationRoute.vue"
import HeaderRoute from "@/components/HeaderRoute.vue"
import Ima from "@/assets/icons/gallery/image.svg"
import Hea from "@/assets/icons/gallery/heart.svg"
import Com from "@/assets/icons/gallery/comment.svg"
import Loader from "@/components/LoaderAll.vue";
import { useMemberGallery } from '@/stores/club_admin/MemberGallery'
import { useClubGallery } from '@/stores/club_admin/ClubGallery'

const isLoading = ref(true);

const {
    member_gallery,
    fetchMemberGallery
} = useMemberGallery()

const {
    club_gallery,
    fetchClubGallery
} = useClubGallery()

const loadGalleries = async () => {
    isLoading.value = true
    try {
        await fetchMemberGallery();
        await fetchClubGallery();
    } catch (error) {
        console.error("Error fetching galleries:", error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadGalleries()
})
</script>

<style scoped>
.container {
     max-width: 1810px;
     padding: 0 15px;
     margin: 0 auto;
}
 .content {
     padding: 0 30px;
}
 .dashboard-card {
     gap: 15px;
     border-radius: 10px;
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding: 20px 0px;
     width: 100%;
}
 .profile-card {
     display: flex;
     align-items: center;
     justify-content: space-between;
     background: white;
     padding: 15px 25px;
     border-radius: 12px;
     width: 65.8%;
     box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
     height: 148px;
}
 .profile-left {
     display: flex;
     align-items: left;
}
 .profile-left img {
     width: 100%;
     max-width: 108px;
     height: 108px;
     border-radius: 50%;
}
 .greeting {
     color: #99816b;
     font-weight: 400;
     font-size: 18px;
     line-height: 100%;
     font-family: Inter;
}
 .name {
     font-weight: 500;
     font-size: 30px;
     line-height: 100%;
     color: #4c4036;
     font-family: Inter;
}
 .names {
     font-family: Inter;
     font-weight: 400;
     font-size: 18.68px;
     line-height: 20.76px;
     letter-spacing: 0%;
}
 .namess {
     font-weight: 400;
     font-size: 16px;
     line-height: 100%;
     color: #4c4036;
     padding-left: 20px;
     font-family: Inter;
     text-align: justify;
}
 .left-header-container {
     display: flex;
     align-items: center;
     gap: 10px;
}
 .role {
     color: #cc445e;
     font-weight: 400;
     font-size: 18px;
     line-height: 100%;
     font-family: Inter;
}
 .profile-icons {
     display: flex;
     gap: 10px;
     flex-direction: column;
}
 .profile-icon {
     display: flex;
     flex-direction: column;
}
 .icons {
     display: flex;
     align-items: center;
     color: white;
     font-size: 14px;
     gap: 5px;
}
 .icon {
     display: flex;
     align-items: center;
     color: #cc445e;
     font-size: 14px;
     gap: 5px;
}
 .icon i {
     margin-right: 5px;
}
 .stat-card {
     background: #cc445e;
     color: white;
     padding: 20px;
     border-radius: 8px;
     text-align: center;
     width: 219px;
     font-family: Inter;
     font-size: 1.2rem;
     height: 148px;
}
 .event-card {
     background: #755840;
     color: white;
     padding: 20px;
     height: 148px;
     border-radius: 8px;
     text-align: center;
     font-family: Inter;
     font-size: 1.2rem;
     width: 219px;
}
 .number {
     font-weight: 500;
     font-size: 48px;
     font-family: Inter;
     line-height: 100%;
     color: white;
     margin-top: 30px;
}
 .ca-details {
     font-weight: 400;
     font-size: 20px;
     font-family: Inter;
     line-height: 100%;
}
 .days {
     margin-top: 35px;
     font-weight: 400;
     font-family: Inter;
     font-size: 16px;
     line-height: 100%;
}
 .card-section {
     display: flex;
     gap: 35px;
     width: 32%;
}
 .event-img, .fallback-box {
     width: 100%;
     max-width: 30px;
     height: 30px;
     border-radius: 5px;
     object-fit: cover;
     background-color: #f0f0f0;
     box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
 .fallback-box {
     font-size: 14px;
     color: #888;
}
 .row-wrapper {
     display: flex;
}
 .even-info {
     background-color: #99816b !important;
}
 .odd-info {
     background-color: #4c4036 !important;
}
</style>
