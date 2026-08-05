<template>
<NavigationRoute />
<HeaderRoute title="Member Requests" />
<div class="content">
    <section>
        <div class="container">
            <div class="dashboard-card">
                <div class="profile-card">
                    <div class="profile-left">
                        <div class="profile-info">
                            <small class="greeting">List of members in the club</small>
                            <h2 class="name">All Members</h2>
                            <small class="role">25 Member Galleries</small>
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
                        <small class="ca-details">Members</small>
                        <h3 class="number">{{ MemberCount }}</h3>
                    </div>
                    <div class="event-card">
                        <small class="ca-details">Interactions</small>
                        <div class="row">
                            <div class="col-md-5">
                                <h3 class="number">{{EventCount}}</h3>
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
            <div v-for="(row, rowIndex) in chunkedCards" :key="rowIndex" class="row-wrapper">
                <div class="photographers">
                    <div v-for="(member, index) in row" :key="index" class="photographer-card">
                        <img :src="member.profile_image_url" alt="Profile Picture" class="profile-pic" />
                        <div class="social-media-icons">
                            <a href="#" style="background-color: #99816b; color: white"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" style="background-color: #cc445e; color: white"><i class="fab fa-instagram"></i></a>
                            <a href="#" style="background-color: #99816b; color: white"><i class="fab fa-twitter"></i></a>
                        </div>
                        <h3>{{ member.username }}</h3>
                        <small class="role">{{ member.tag_line }}</small>
                        <div class="social-icons">
                            <div class="icon"><span>{{member.gallery_total_photos}}</span><img :src="Ima" alt="icon" style="width: 20px; height: 20px" /></div>
                            <div class="icon"><span>{{member.gallery_total_comments}}</span><img :src="Com" alt="icon" style="width: 20px; height: 20px" /></div>
                            <div class="icon"><span>{{member.gallery_total_likes}}</span><img :src="Lik" alt="icon" style="width: 20px; height: 20px" /></div>
                        </div>
                        <div class="gallery-preview">
                            <div v-for="(gallery, index) in member.galleries.slice(0, 2)" :key="index" class="pic-item">
                                <img :src="gallery.photos.length ? gallery.photos[0].image_url : '/placeholder.jpg'" alt="Gallery Image" />
                                <div class="pic-info">
                                    <span>{{ gallery.gallery_name.length > 10 ? gallery.gallery_name.slice(0, 10) + '...' : gallery.gallery_name }}</span>
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
            <div class="d-flex justify-content-between">
                <div class="button-group" style="margin-left: 2%">
                    <button class="btn" id="edit" @click="navigate">Add New</button>
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
        </div>
    </section>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMemberStore } from '@/stores/club_admin/MemberStore';
import NavigationRoute from "@/components/NavigationRoute.vue"
import HeaderRoute from "@/components/HeaderRoute.vue"
import Ima from "@/assets/icons/member/image.svg"
import Com from "@/assets/icons/member/comment.svg"
import Lik from "@/assets/icons/member/like.svg"

const memberStore = useMemberStore()
const memberData = computed(() => memberStore.memberData)

const currentPage = ref(1)
const itemsPerPage = 24

const MemberCount = computed(() => memberStore.memberCount)
const EventCount = computed(() => memberStore.eventCount)
onMounted(() => {
    console.log("Total Interactions (Comments + Likes):", EventCount);
    memberStore.fetchMembers()
});

const paginatedCards = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return memberData.value.slice(start, end)
})

const chunkedCards = computed(() => {
    const chunkSize = 4
    const chunks = []
    let i = 0;
    const currentPageItems = paginatedCards.value
    for (i = 0; i < currentPageItems.length; i += chunkSize) {
        chunks.push(currentPageItems.slice(i, i + chunkSize))
    }
    return chunks
})

const totalPages = computed(() => {
    return Math.ceil(memberData.value.length / itemsPerPage)
})

// const totalPhotoCount = computed(() => {
//   return memberStore.memberData.reduce((memberSum, member) => {
//     const gallerySum = member.galleries?.reduce((gallerySum, gallery) => {
//       return gallerySum + (gallery.photos?.length || 0);
//     }, 0);
//     return memberSum + gallerySum;
//   }, 0);
// });

function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}
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
 .social-icons {
     background-color: #cc445e;
     height: 50px;
     font-size: 14px;
}
 .social-icons .icon {
     color: white;
}
 .photographers {
     margin-top: 10px;
     display: flex;
     width: 100%;
     gap: 20px;
     flex-wrap: wrap;
}
 .photographer-card {
     background: white;
     justify-content: center;
     text-align: center;
     border-radius: 10px;
     width: 23.6%;
     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
     border: 1px solid #99816b;
}
 .photographer-card img.profile-pic {
     width: 192px;
     height: 192px;
     border-radius: 50%;
     margin-bottom: 10px;
     margin-top: 15px;
}
 .photographer-card .social-icons {
     display: flex;
     justify-content: center;
     gap: 10px;
     width: 100%;
}
 .photographer-card .social-icons a {
     display: flex;
     align-items: center;
     justify-content: center;
     width: 100%;
     height: 40px;
     color: #5a4735;
     font-size: 18px;
     font-family: Inter;
     border-radius: 50%;
     text-decoration: none;
     background-color: #ddd;
}
 .social-media-icons {
     margin-top: -25px;
     margin-bottom: 10px;
     display: flex;
     justify-content: center;
     gap: 10px;
}
 .social-media-icons a {
     display: flex;
     align-items: center;
     justify-content: center;
     width: 100%;
     max-width: 40px;
     height: 40px;
     border-radius: 50%;
     background-color: #ddd;
     color: #333;
     font-size: 16px;
     font-family: Inter;
     transition: 0.3s;
}
 .social-media-icons a:hover {
     background-color: #dc3545;
     color: #fff;
}
 .photographer-card .gallery-preview {
     display: flex;
}
 .photographer-card .gallery-preview .pic-item img {
     width: 170px;
     height: 100px;
     object-fit: cover;
}
 ::-webkit-scrollbar {
     width: 10px;
}
 ::-webkit-scrollbar-track {
     background: #f1f1f1;
     border-radius: 10px;
}
 ::-webkit-scrollbar-thumb {
     background: #a0846c;
     border-radius: 10px;
}
 ::-webkit-scrollbar-thumb:hover {
     background: #8a6f58;
}
 .edit-icon {
     position: relative;
     top: 8px;
     right: 8px;
     border-radius: 50%;
     padding: 6px;
     cursor: pointer;
     z-index: 10;
     text-align: right;
}
 .edit-icon i {
     color: #cc445e;
     font-size: 16px;
}
 .social-icons {
     background-color: #d64561;
     display: flex;
     justify-content: center;
     padding: 10px 25px;
}
 .icon {
     display: flex;
     align-items: center;
     gap: 6px;
     color: #ffffff;
     font-size: 15px;
}
 .icon i {
     font-size: 22px;
}
 .event-img, .fallback-box {
     width: 192px;
     height: 192px;
     border-radius: 50%;
     margin-bottom: 10px;
     margin-top: 15px;
     margin-left: 22%;
     object-fit: cover;
     background-color: #f0f0f0;
     box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
 .fallback-box {
     font-size: 14px;
     color: #888;
}
</style>
