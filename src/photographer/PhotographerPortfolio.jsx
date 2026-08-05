<template>
<NavigationRoute />
<HeaderRoute title="Profile" />
<section class="content">
    <div class="dashboard-card">
        <div class="profile-card">
            <div class="profile-left" style="align-items: center">
                <img class="img-fluid" src="@/assets/images/dashboard/c1.jpg" alt="Profile Picture" />
                <div class="profile-info">
                    <h2 class="name" style="align-content: horizontal-center">{{ user.first_name }}</h2>
                </div>
            </div>
            <div class="profile-icons">
                <div class="icon">
                    <span>20</span>
                    <i class="fas fa-comments"></i>
                </div>
                <div class="icon">
                    <span>53</span>
                    <i class="fas fa-desktop"></i>
                </div>
                <div class="icon">
                    <span>39</span>
                    <i class="fas fa-users"></i>
                </div>
            </div>
        </div>
        <div class="card-section">
            <div class="stat-card">
                <small class="ca-details">My Photos</small>
                <h3 class="number">21</h3>
            </div>
            <div class="event-card">
                <small class="ca-details">Interactions</small>
                <div class="row">
                    <div class="col-md-5">
                        <h3 class="number">99</h3>
                    </div>
                    <div class="days col-md-7">
                        <span>Likes & Coments</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="card" style="height: auto">
        <div class="d-flex justify-content-between align-items-center mb-3" style="padding-left: 15px; padding-top: 15px">
            <h4>My Portfolio</h4>
        </div>
        <div v-for="(row, rowIndex) in chunkedCards" :key="rowIndex" class="row-wrapper">
            <div class="galleriy">
                <div v-for="(item, index) in row" :key="item.id" class="galleriy-item">
                    <img :src="item.image" alt="Gallery Image" />
                    <div :class="[
              'galleriy-infos',
              (rowIndex * 4 + index) % 2 === 0 ? 'even-info' : 'odd-info',
            ]">
                        <div class="gal-item">
                            <img :src="item.img" alt="Profile Picture" />
                            <div class="gal-details">
                                <span>Kamran Chohdry</span>
                            </div>
                        </div>
                        <div class="profile-icon">
                            <div class="icons">
                                <span>20</span>
                                <i class="fas fa-image"></i>
                            </div>
                            <div class="icons">
                                <span>53</span>
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="icons">
                                <span>39</span>
                                <i class="fas fa-comment"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <PhotographerGalleries />
    <div class="row">
        <div class="col-md-6">
            <div class="card" style="width: 95%; height: auto">
                <SalesCards />
            </div>
        </div>
        <div class="col-md-6">
            <div class="card" style="width: 95%; height: 1000px">
                <PhotoRequests />
            </div>
            <div class="card" style="width: 95%; height: 340px">
                <div class="d-flex justify-content-between align-items-center mb-3" style="padding: 15px">
                    <h4>My QR Code</h4>
                </div>
                <div style="text-align: center">
                    <img src="@/assets/images/profile/qr_code.png" alt="QR CODE" />
                    <div class="divider3"></div>
                    <p class="text-secondary" style="text-align: center">username.photo.cv</p>
                </div>
            </div>
        </div>
    </div>
</section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavigationRoute from "@/components/NavigationRoute.vue"
import HeaderRoute from "@/components/HeaderRoute.vue"
import { useUserStore } from "@/stores/club_admin/UserStore"
import PhotoRequests from "@/partials/post/PhotoRequests.vue"
import PhotographerGalleries from "@/partials/post/PhotographerGalleries.vue"
import SalesCards from "@/partials/post/SalesCards.vue"
const user = useUserStore()

const cards = ref([])
const loading = ref(true)

const chunkedCards = computed(() => {
    const chunkSize = 3
    const chunks = []
    for (let i = 0; i < cards.value.length; i += chunkSize) {
        chunks.push(cards.value.slice(i, i + chunkSize))
    }
    return chunks
})

onMounted(() => {
    setTimeout(() => {
        cards.value = [{
                id: 1,
                image: require("@/assets/images/dashboard/m1.png"),
                img: require("@/assets/images/dashboard/pro.png"),
            },
            {
                id: 2,
                image: require("@/assets/images/dashboard/m2.jpg"),
                img: require("@/assets/images/dashboard/pro.png"),
            },
            {
                id: 3,
                image: require("@/assets/images/dashboard/m3.jpg"),
                img: require("@/assets/images/dashboard/pro.png"),
            },
        ]
        loading.value = false
    }, 1000)
})
</script>

<style scoped>
</style>
