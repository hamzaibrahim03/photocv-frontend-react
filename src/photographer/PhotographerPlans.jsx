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
    <div class="card" style="height: auto; padding: 15px;">
        <div class="d-flex justify-content-between align-items-center">
            <h5>Planned Locations</h5>
            <div class="d-flex align-items-center justify-content-between" style="gap: 10px;">
                <div class="input-group" style="flex: 1;">
                    <input v-model="search" type="search" class="form-control" placeholder="Search" aria-label="Search" style="border: 1px solid #a0846c;" />
                    <span class="input-group-text" style="background-color: #fff; border: 1px solid #a0846c;">
                        <i class="fas fa-search" style="color: #a0846c;"></i>
                    </span>
                </div>
                <button class="btn" id="view" style="white-space: nowrap;">Add</button>
            </div>
        </div>

        <div class="row" style="margin-top: 15px">
            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l1.jpg" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" checked /> Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l2.jpg" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" checked /> Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" style="margin-top: 15px">
            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l3.jpg" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" checked /> Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l4.png" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" />Not Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" style="margin-top: 15px">
            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l1.jpg" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" checked /> Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l2.jpg" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" checked /> Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" style="margin-top: 15px">
            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l3.jpg" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" checked /> Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l4.png" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" />Not Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" style="margin-top: 15px">
            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l1.jpg" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" checked /> Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l2.jpg" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" checked /> Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" style="margin-top: 15px">
            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l3.jpg" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" checked /> Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l4.png" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" />Not Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" style="margin-top: 15px">
            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l1.jpg" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" checked /> Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l2.jpg" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" checked /> Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" style="margin-top: 15px">
            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l3.jpg" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" checked /> Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="note-card p-3 rounded d-flex gap-3">
                    <div class="image-wrapper">
                        <img src="@/assets/images/topics/l4.png" alt="Notice Image" class="note-img" />
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1">Center Parcs Whinfell Forest</h6>
                            <h6 class="date">Penrith, UK</h6>
                            <p class="text-secondary small mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="small">
                                <input type="checkbox" />Not Visited
                            </label>
                            <div class="d-flex gap-2">
                                <button class="icon-btn" @click="deleteNote">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="icon-btn" @click="editNote">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</section>
</template>

<script setup>
import NavigationRoute from "@/components/NavigationRoute.vue"
import HeaderRoute from "@/components/HeaderRoute.vue"
import { useUserStore } from "@/stores/club_admin/UserStore";
import { ref } from 'vue'

const search = ref('')
const user = useUserStore();

const deleteNote = () => {
    alert('Delete clicked')
}

const editNote = () => {
    alert('Edit clicked')
}
</script>

<style scoped>
.note-card {
     background-color: #EBE6E1;
     border-radius: 10px;
     padding: 24px;
     gap: 40px;
     height: auto;
}
.note-img {
     width: 180px;
     height: 140px;
     object-fit: cover;
     border-radius: 6px;
}
.icon-btn {
     background: none;
     border: none;
     color: #c96f6f;
     cursor: pointer;
}
.icon-btn:hover {
     color: #a35050;
}
</style>
