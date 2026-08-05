<template>
<NavigationRoute />
<HeaderRoute title="Galleries" />
<div class="content">
    <div class="dashboard-card">
        <div class="profile-card">
            <div class="profile-left">
                <div class="profile-info">
                    <small class="greeting">Galleries uploaded by Club Members</small>
                    <h2 class="name">15 Club Galleries</h2>
                    <small class="role">Average 20 Images</small>
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

    <div class="card" style="height: auto">
        <div class="d-flex justify-content-between align-items-center mb-3" style="padding: 15px">
            <h4>Club Galleries</h4>
        </div>

        <div class="row" style="margin-left:0.1%">
            <div v-for="(row, rowIndex) in chunkedCards" :key="'row-' + rowIndex" class="row g-0" style="margin-left: 0; margin-right: 0;">
                <div v-for="(gallery, index) in row" :key="gallery.id" class="galleriy col-4 p-0">
                    <div class="galleriy-item">
                        <img :src="gallery.photos[0].image" alt="Gallery Photo" class="img-fluid" />
                        <div :class="[ 'galleriy-infos', index % 2 === 0 ? 'even-info' : 'odd-info', ]">
                            <div class="gal-item">
                                <span>{{ gallery.photos[0].title }}</span>
                            </div>
                            <div class="profile-icon d-flex justify-content-between">
                                <div class="icons">
                                    <span>{{ gallery.total_photos }}</span>
                                    <img :src="Ima" alt="icon" />
                                </div>
                                <div class="icons">
                                    <span>{{ gallery.photos[0].likes_count }}</span>
                                    <img :src="Hea" alt="icon" />
                                </div>
                                <div class="icons">
                                    <span>{{ gallery.photos[0].comments_count }}</span>
                                    <img :src="Com" alt="icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="dt-paging">
        <nav aria-label="pagination">
            <button class="dt-paging-button first" :class="{ disabled: currentPage === 1 }" :disabled="currentPage === 1" @click="goToPage(1)" aria-label="First">
                «
            </button>

            <button class="dt-paging-button previous" :class="{ disabled: currentPage === 1 }" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)" aria-label="Previous">
                ‹
            </button>

            <button v-for="page in totalPages" :key="page" class="dt-paging-button" :class="{ current: page === currentPage }" @click="goToPage(page)">
                {{ page }}
            </button>

            <button class="dt-paging-button next" :class="{ disabled: currentPage === totalPages }" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)" aria-label="Next">
                ›
            </button>

            <button class="dt-paging-button last" :class="{ disabled: currentPage === totalPages }" :disabled="currentPage === totalPages" @click="goToPage(totalPages)" aria-label="Last">
                »
            </button>
        </nav>
    </div>
</div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import NavigationRoute from "@/components/NavigationRoute.vue";
import HeaderRoute from "@/components/HeaderRoute.vue";
import { useClubGallery } from '@/stores/club_admin/ClubGallery'
import Ima from "@/assets/icons/gallery/image.svg"
import Hea from "@/assets/icons/gallery/heart.svg"
import Com from "@/assets/icons/gallery/comment.svg"
const {
    club_gallery,
    fetchClubGallery
} = useClubGallery()

const cards = ref([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = 9

const totalPages = computed(() => {
    return Math.ceil(cards.value.length / pageSize)
})

const paginatedCards = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return cards.value.slice(start, start + pageSize)
})

const chunkedCards = computed(() => {
    const chunkSize = 3
    const chunks = []
    const currentCards = paginatedCards.value
    for (let i = 0; i < currentCards.length; i += chunkSize) {
        chunks.push(currentCards.slice(i, i + chunkSize))
    }
    return chunks
})

function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

onMounted(async () => {
    await fetchClubGallery()
    cards.value = club_gallery.value
    loading.value = false
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
 .row-wrapper {
     display: flex;
}
 .odd-info {
     background-color: #99816b !important;
}
 .even-info {
     background-color: #4c4036 !important;
}
.galleriy-item img {
     border-radius:0px; 
     max-width: 493px; 
     max-height: 370px; 
     object-fit: cover;
}
.galleriy-infos {
     border-radius: 0px;
}
.profile-icon .icons img  {
     width:14px; 
     height: 14px;
}
</style>
