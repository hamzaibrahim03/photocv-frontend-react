<template>
<NavigationRoute />
<HeaderRoute title="Profile" />
<section class="content">
    <div class="dashboard-card">
        <div class="profile-card">
            <div class="profile-left">
                <div class="profile-info">
                    <small class="greeting">This page all about you</small>
                    <h2 class="name">My Profile</h2>
                    <small class="role">View your profile here</small>
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
    <div class="photographeres">
        <ProfileMember />
    </div>
    <div class="row" style="margin-top: 20px">
        <div class="col-md-6">
            <KamranComments title="My Recent Comments" />
        </div>
        <div class="col-md-6">
            <KamranLikes title="My Recent Likes" />
        </div>
    </div>
    <div class="row" style="margin-top: 20px">
        <div class="col-md-6">
            <KamranEntries title="My Competition Entries" />
        </div>
        <div class="col-md-6">
            <KamranAwards title="My Awards" />
        </div>
    </div>
    <KamranGallery title="Recent Photos" />

    <div class="row" style="margin-top: 10px">
        <div class="col-md-6">
            <div class="comments-cards">
                <h5>My Interests</h5>
                <div class="row">
                    <div class="col-md-4">
                        <img src="@/assets/images/dashboard/c1.jpg" />
                    </div>
                    <div class="col-md-6">
                        <p><label class="role">Colour Competition</label></p>
                        <a href="#" class="text-secondary">Remove</a> | <a href="#" class="text-secondary">Edit</a>
                    </div>
                </div>
                <div class="divider2"></div>
                <div class="row">
                    <div class="col-md-4">
                        <img src="@/assets/images/dashboard/c2.jpg" />
                    </div>
                    <div class="col-md-6">
                        <p><label class="role">Print Competition</label></p>
                        <a href="#" class="text-secondary">Remove</a> | <a href="#" class="text-secondary">Edit</a>
                    </div>
                </div>
                <div class="divider2"></div>
                <div class="row">
                    <div class="col-md-4">
                        <img src="@/assets/images/dashboard/c1.jpg" />
                    </div>
                    <div class="col-md-6">
                        <p><label class="role">Potrait Competition</label></p>
                        <a href="#" class="text-secondary">Remove</a> | <a href="#" class="text-secondary">Edit</a>
                    </div>
                </div>
                <div class="divider2"></div>
                <div class="row">
                    <div class="col-md-4">
                        <img src="@/assets/images/dashboard/c1.jpg" />
                    </div>
                    <div class="col-md-6">
                        <p><label class="role">Colour Competition</label></p>
                        <a href="#" class="text-secondary">Remove</a> | <a href="#" class="text-secondary">Edit</a>
                    </div>
                </div>
                <div class="divider2"></div>
                <div class="row">
                    <div class="col-md-4">
                        <img src="@/assets/images/dashboard/c1.jpg" />
                    </div>
                    <div class="col-md-6">
                        <p><label class="role">Print Competition</label></p>
                        <a href="#" class="text-secondary">Remove</a> | <a href="#" class="text-secondary">Edit</a>
                    </div>
                </div>
                <div class="divider2"></div>
                <div class="row">
                    <div class="col-md-4">
                        <img src="@/assets/images/dashboard/c1.jpg" />
                    </div>
                    <div class="col-md-6">
                        <p><label class="role">Potrait Competition</label></p>
                        <a href="#" class="text-secondary">Remove</a> | <a href="#" class="text-secondary">Edit</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="comments-cards">
                <h5>My Brands</h5>
                <div class="row">
                    <div class="col-md-3">
                        <img src="@/assets/images/profile/b1.png" alt="br" />
                    </div>
                    <div class="col-md-3">
                        <img src="@/assets/images/profile/b2.png" alt="br" />
                    </div>
                    <div class="col-md-3">
                        <img src="@/assets/images/profile/b3.png" alt="br" />
                    </div>
                    <div class="col-md-3">
                        <img src="@/assets/images/profile/b4.png" alt="br" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <img src="@/assets/images/profile/b5.png" alt="br" />
                    </div>
                    <div class="col-md-3">
                        <img src="@/assets/images/profile/b6.png" alt="br" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <img src="@/assets/images/profile/b1.png" alt="br" />
                    </div>
                    <div class="col-md-3">
                        <img src="@/assets/images/profile/b2.png" alt="br" />
                    </div>
                    <div class="col-md-3">
                        <img src="@/assets/images/profile/b3.png" alt="br" />
                    </div>
                    <div class="col-md-3">
                        <img src="@/assets/images/profile/b4.png" alt="br" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <img src="@/assets/images/profile/b5.png" alt="br" />
                    </div>
                    <div class="col-md-3">
                        <img src="@/assets/images/profile/b6.png" alt="br" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div class="card">
                <h5>My Social Links</h5>
                <div class="row align-items-center mb-3">
                    <div class="col-md-2 text-center">
                        <div class="social-media-icones">
                            <a href="#" style="background-color: #99816b; color: white"><i class="fab fa-facebook-f"></i></a>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <p class="mb-0 fw-bold">Facebook</p>
                        <p class="mb-0 text-muted">www.facebook.com/username</p>
                    </div>
                    <div class="col-md-3 text-end">
                        <a href="#" class="btn btn-outline-dark px-4" style="width: 100px; font-size: 16px">Edit</a>
                    </div>
                </div>
                <div class="row align-items-center mb-3">
                    <div class="col-md-2 text-center">
                        <div class="social-media-icones">
                            <a href="#" style="background-color: #99816b; color: white"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <p class="mb-0 fw-bold">Instagram</p>
                        <p class="mb-0 text-muted">www.instagram.com/username</p>
                    </div>
                    <div class="col-md-3 text-end">
                        <a href="#" class="btn btn-outline-dark px-4" style="width: 100px; font-size: 16px">Edit</a>
                    </div>
                </div>
                <div class="row align-items-center mb-3">
                    <div class="col-md-2 text-center">
                        <div class="social-media-icones">
                            <a href="#" style="background-color: #99816b; color: white"><i class="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <p class="mb-0 fw-bold">Twitter</p>
                        <p class="mb-0 text-muted">www.twitter.com/username</p>
                    </div>
                    <div class="col-md-3 text-end">
                        <a href="#" class="btn btn-outline-dark px-4" style="width: 100px; font-size: 16px">Edit</a>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn me-2" id="view">Add</button>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card">
                <h5>My Contact</h5>
                <div class="row align-items-center mb-3">
                    <div class="col-md-2 text-center">
                        <div class="social-media-icones">
                            <a href="#" style="background-color: #99816b; color: white"><i class="fab fa-facebook-f"></i></a>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <p class="mb-0 text-muted">123, Street, Town, City, Country</p>
                    </div>
                    <div class="col-md-3 text-end">
                        <a href="#" class="btn btn-outline-dark px-4" style="width: 100px; font-size: 16px">Edit</a>
                    </div>
                </div>
                <div class="row align-items-center mb-3">
                    <div class="col-md-2 text-center">
                        <div class="social-media-icones">
                            <a href="#" style="background-color: #99816b; color: white"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <p class="mb-0 text-muted">123 - 456 - 789</p>
                    </div>
                    <div class="col-md-3 text-end">
                        <a href="#" class="btn btn-outline-dark px-4" style="width: 100px; font-size: 16px">Edit</a>
                    </div>
                </div>
                <div class="row align-items-center mb-3">
                    <div class="col-md-2 text-center">
                        <div class="social-media-icones">
                            <a href="#" style="background-color: #99816b; color: white"><i class="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <p class="mb-0 text-muted">username@example.com</p>
                    </div>
                    <div class="col-md-3 text-end">
                        <a href="#" class="btn btn-outline-dark px-4" style="width: 100px; font-size: 16px">Edit</a>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn me-2" id="view">Add</button>
                </div>
            </div>
        </div>
    </div>
</section>
</template>

<script setup>
import NavigationRoute from "@/components/NavigationRoute.vue"
import HeaderRoute from "@/components/HeaderRoute.vue"
import ProfileMember from "@/partials/club_admin/membersingle/ProfileMember.vue";
import KamranComments from "@/partials/club_admin/membersingle/KamranComments.vue";
import KamranLikes from "@/partials/club_admin/membersingle/KamranLikes.vue";
import KamranEntries from "@/partials/club_admin/membersingle/KamranEntries.vue";
import KamranAwards from "@/partials/club_admin/membersingle/KamranAwards.vue";
import KamranGallery from "@/partials/club_admin/membersingle/KamranGallery.vue";
</script>

<style scoped>
.comments-cards {
     width: 95%;
     margin-left: 4%;
     max-height: 250px;
     overflow-y: auto;
     padding-right: 10px;
}
.card {
     width: 95%;
     height: 360px;
     padding: 15px;
}
.social-media-icones {
     margin-top: 15%
}
</style>
