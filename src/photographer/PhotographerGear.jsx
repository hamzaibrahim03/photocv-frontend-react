<template>
<NavigationRoute />
<HeaderRoute title="Profile" />
<section class="content">
    <div class="dashboard-card">
        <div class="profile-card">
            <div class="profile-left" style="align-items: center">
                <img class="img-fluid" :src="user.profile_image" alt="Profile Picture" />
                <div class="profile-info">
                    <h2 class="name">{{ user.first_name }}</h2>
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

    <MyCamera />
    <MyLenses />
    <MyAccessories />
    <div class="row">
        <div class="col-md-6">
            <MySales />
        </div>
        <div class="col-md-6">
            <MyWishlist />
            <MyGift />
        </div>
    </div>
</section>
</template>

<script setup>
import NavigationRoute from "@/components/NavigationRoute.vue"
import HeaderRoute from "@/components/HeaderRoute.vue"
import { useUserStore } from "@/stores/club_admin/UserStore";
import MyCamera from "@/partials/gear/MyCamera.vue"
import MyAccessories from "@/partials/gear/MyAccessories.vue"
import MyLenses from "@/partials/gear/MyLenses.vue"
import MySales from "@/partials/gear/MySales.vue"
import MyWishlist from "@/partials/gear/MyWishlist.vue"
import MyGift from "@/partials/gear/MyGift.vue"

const user = useUserStore()
</script>

<style scoped>
</style>
