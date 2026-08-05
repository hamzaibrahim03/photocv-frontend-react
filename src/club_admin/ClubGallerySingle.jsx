<template>
<NavigationRoute />
<HeaderRoute title="Galleries" />
<section class="content">
    <div class="dashboard-card">
        <ClubProfile greeting="Galleries uploaded by Club" name="Food" role="Image 1 of 20" />
        <div class="card-section">
            <div class="stat-card">
                <small class="ca-details">Likes</small>
                <h3 class="number">46</h3>
            </div>
            <div class="event-card">
                <small class="ca-details">Comments</small>
                <div class="row">
                    <div class="col-md-5">
                        <h3 class="number">10</h3>
                    </div>
                    <div class="days col-md-7">
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="card">
        <h5>Club Gallery - Food</h5>
        <a class="prev" onclick="changeImage(-1)">&#10094;</a>
        <img id="display-img" class="card-img-top" src="" alt="Selected Image" />
        <p id="img-description" class="card-text"></p>
        <a class="nexts" onclick="changeImage(1)">&#10095;</a>
    </div>
    <div id="lightbox" class="lightbox">
        <span class="close">&times;</span>
        <a class="nav prev">&#10094;</a>

        <div class="lightbox-main">
            <img id="full-size-img" class="lightbox-content" src="" />
        </div>

        <a class="nav next">&#10095;</a>

        <div class="lightbox-thumbnails" id="thumbnail-container"></div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div class="comments-card">
                <h5>Comments</h5>
                <div class="row">
                    <div class="col-md-1">
                        <img src="@/assets/images/dashboard/c1.jpg" />
                    </div>
                    <div class="col-md-9">
                        <p>
                            <label class="role">John Michael</label> Hmm, This photo loooks
                            good
                        </p>
                        <a href="#" class="text-danger">Remove</a> |
                        <a href="#">Reply</a> | <a href="#">Translate</a>
                    </div>
                    <div class="col-md-2">
                        <label for="date"> 1 day ago </label>
                    </div>
                </div>
                <div class="divider2"></div>
                <div class="row">
                    <div class="col-md-1">
                        <img src="@/assets/images/dashboard/c2.jpg" />
                    </div>
                    <div class="col-md-9">
                        <p>
                            <label class="role">Alaxandra John</label> This photo perfectly
                            captures the beauty of the moment.
                        </p>
                        <a href="#" class="text-danger">Remove</a> |
                        <a href="#">Reply</a> | <a href="#">Translate</a>
                    </div>
                    <div class="col-md-2">
                        <label for="date"> 2 day ago </label>
                    </div>
                </div>
                <div class="divider2"></div>
                <div class="row">
                    <div class="col-md-1">
                        <img src="@/assets/images/dashboard/c3.jpg" />
                    </div>
                    <div class="col-md-9">
                        <p>
                            <label class="role">Anthony Decosa</label> Wow, this is simply
                            stunning! Amazing shot!
                        </p>
                        <a href="#" class="text-danger">Remove</a> |
                        <a href="#">Reply</a> | <a href="#">Translate</a>
                    </div>
                    <div class="col-md-2">
                        <label for="date"> 3 day ago </label>
                    </div>
                </div>
                <div class="divider2"></div>
                <div class="row">
                    <div class="col-md-1">
                        <img src="@/assets/images/dashboard/c3.jpg" />
                    </div>
                    <div class="col-md-9">
                        <p>
                            <label class="role">Anthony Decosa</label> Wow, this is simply
                            stunning! Amazing shot!
                        </p>
                        <a href="#" class="text-danger">Remove</a> |
                        <a href="#">Reply</a> | <a href="#">Translate</a>
                    </div>
                    <div class="col-md-2">
                        <label for="date"> 3 day ago </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="comments-cards">
                <h5>Likes</h5>
                <div class="row">
                    <div class="col-md-2 like-item">
                        <img src="@/assets/images/dashboard/c1.jpg" class="profile-img" />
                        <span class="heart-icon">❤</span>
                    </div>
                    <div class="col-md-2 like-item">
                        <img src="@/assets/images/dashboard/c2.jpg" class="profile-img" />
                        <span class="heart-icon">❤</span>
                    </div>
                    <div class="col-md-2 like-item">
                        <img src="@/assets/images/dashboard/c3.jpg" class="profile-img" />
                        <span class="heart-icon">❤</span>
                    </div>
                    <div class="col-md-2 like-item">
                        <img src="@/assets/images/dashboard/c4.jpg" class="profile-img" />
                        <span class="heart-icon">❤</span>
                    </div>
                    <div class="col-md-2 like-item">
                        <img src="@/assets/images/dashboard/c5.jpg" class="profile-img" />
                        <span class="heart-icon">❤</span>
                    </div>
                    <div class="col-md-2 like-item">
                        <img src="@/assets/images/dashboard/c6.jpg" class="profile-img" />
                        <span class="heart-icon">❤</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2 like-item">
                        <img src="@/assets/images/dashboard/c7.jpg" class="profile-img" />
                        <span class="heart-icon">❤</span>
                    </div>
                    <div class="col-md-2 like-item">
                        <img src="@/assets/images/dashboard/c1.jpg" class="profile-img" />
                        <span class="heart-icon">❤</span>
                    </div>
                    <div class="col-md-2 like-item">
                        <img src="@/assets/images/dashboard/c2.jpg" class="profile-img" />
                        <span class="heart-icon">❤</span>
                    </div>
                    <div class="col-md-2 like-item">
                        <img src="@/assets/images/dashboard/c3.jpg" class="profile-img" />
                        <span class="heart-icon">❤</span>
                    </div>
                    <div class="col-md-2 like-item">
                        <img src="@/assets/images/dashboard/c4.jpg" class="profile-img" />
                        <span class="heart-icon">❤</span>
                    </div>
                    <div class="col-md-2 like-item">
                        <img src="@/assets/images/dashboard/c5.jpg" class="profile-img" />
                        <span class="heart-icon">❤</span>
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
</section>
</template>

<script>
import NavigationRoute from "@/components/NavigationRoute.vue";
import HeaderRoute from "@/components/HeaderRoute.vue";
import ClubProfile from "@/partials/club_admin/club/ClubProfile.vue";

export default {
    name: "ClubGallerySingle",
    components: {
        HeaderRoute,
        NavigationRoute,
        ClubProfile,
    },
    data() {
        return {
            imageList: [],
            descriptions: [],
            currentIndex: 0,
        };
    },
    mounted() {
        this.imageList = JSON.parse(localStorage.getItem("imageList")) || [];
        this.descriptions =
            JSON.parse(localStorage.getItem("imageDescriptions")) || [];
        this.currentIndex =
            parseInt(localStorage.getItem("selectedImageIndex")) || 0;

        this.displayImage(this.currentIndex);
        this.setupLightbox();

        window.changeImage = this.changeImage;
    },
    methods: {
        displayImage(index) {
            if (!this.imageList.length) return;

            const img = document.getElementById("display-img");
            const desc = document.getElementById("img-description");

            if (img) img.src = this.imageList[index];
            if (desc) desc.textContent = this.descriptions[index] || "";

            this.currentIndex = index;
            localStorage.setItem("selectedImageIndex", index);
        },
        changeImage(step) {
            let newIndex = this.currentIndex + step;
            if (newIndex < 0) newIndex = this.imageList.length - 1;
            if (newIndex >= this.imageList.length) newIndex = 0;
            this.displayImage(newIndex);
        },
        setupLightbox() {
            const lightbox = document.getElementById("lightbox");
            const lightboxImg = document.getElementById("full-size-img");
            const closeBtn = document.querySelector(".close");
            const prevBtn = document.querySelector(".prev");
            const nextBtn = document.querySelector(".next");
            const thumbContainer = document.getElementById("thumbnail-container");

            if (!lightbox || !lightboxImg || !thumbContainer) return;

            thumbContainer.innerHTML = "";

            this.imageList.forEach((src, index) => {
                const thumb = document.createElement("img");
                thumb.src = src;
                thumb.dataset.index = index;
                thumb.style.cursor = "pointer";
                thumb.addEventListener("click", () => {
                    this.currentIndex = parseInt(thumb.dataset.index);
                    updateLightboxImage();
                });
                thumbContainer.appendChild(thumb);
            });

            const updateLightboxImage = () => {
                lightboxImg.src = this.imageList[this.currentIndex];
                const thumbs = thumbContainer.querySelectorAll("img");
                thumbs.forEach((img) => img.classList.remove("active"));
                if (thumbs[this.currentIndex])
                    thumbs[this.currentIndex].classList.add("active");
            };

            const cardImg = document.getElementById("display-img");
            if (cardImg) {
                cardImg.addEventListener("click", () => {
                    lightbox.style.display = "flex";
                    updateLightboxImage();
                });
            }

            if (closeBtn) {
                closeBtn.addEventListener("click", () => {
                    lightbox.style.display = "none";
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener("click", () => {
                    this.currentIndex = (this.currentIndex + 1) % this.imageList.length;
                    updateLightboxImage();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener("click", () => {
                    this.currentIndex =
                        (this.currentIndex - 1 + this.imageList.length) %
                        this.imageList.length;
                    updateLightboxImage();
                });
            }

            lightbox.addEventListener("click", (e) => {
                if (e.target === lightbox) {
                    lightbox.style.display = "none";
                }
            });
        },
    },
};
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
.card {
     height: 600px
}
.card h5 {
     margin-top: 15px; 
     margin-left: 10px
}
.card-img-top {
     height: 450px; 
     width: 92%; 
     margin-left: 40px; 
     border-radius: 0px; 
     margin-top: 10px; 
}
.card-text {
     margin-top: 10px; 
     margin-left: 40px
}
.comments-card {
     width: 100%; 
     margin-left: 4%; 
     max-height: 250px; 
     overflow-y: auto; 
     padding-right: 10px;
}
.comments-cards {
     width: 92%; 
     margin-left: 5%
}
</style>
