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
            <div class="dt-search">
                <div class="input-group">
                    <span class="input-group-text" style="background-color: #fff; border: 1px solid #a0846c;">
                        <i class="fas fa-search" style="color: #a0846c;"></i>
                    </span>
                    <input v-model="search" type="search" class="form-control" placeholder="Search" aria-label="Search" style="border: 1px solid #a0846c;" />
                </div>
            </div>

            <div class="button-group d-flex align-items-center gap-2">
                <button class="btn d-flex align-items-center gap-2 px-3 py-2 text-white" style="background-color: #99816B;">
                    <i class="fas fa-sticky-note"></i> Note
                </button>
                <button class="btn d-flex align-items-center gap-2 px-3 py-2 text-white" style="background-color: #99816B;">
                    <i class="fas fa-list"></i> Add List
                </button>
                <button class="btn d-flex justify-center align-items-center" style="width: 43px; height: 43px; border-radius: 8px; background-color: #EBE6E1; color: #99816B;">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
        </div>
    </div>

    <div class="card" style="height: auto; padding: 15px;">
        <div class="d-flex justify-content-between align-items-center">
            <h5>Recent Notices</h5>
            <div class="d-flex align-items-center justify-content-between" style="gap: 10px;">
                <div class="input-group" style="flex: 1;">
                    <input v-model="search" type="search" class="form-control" placeholder="Search" aria-label="Search" style="border: 1px solid #a0846c;" />
                    <span class="input-group-text" style="background-color: #fff; border: 1px solid #a0846c;">
                        <i class="fas fa-search" style="color: #a0846c;"></i>
                    </span>
                </div>
                <button class="btn" id="view" style="white-space: nowrap;">View All</button>
            </div>
        </div>

        <div class="row" style="margin-top: 15px">
            <div class="col-md-4">
                <div class="note-card p-3 rounded">
                    <h6 class="fw-bold mb-2">Class</h6>
                    <p class="text-secondary small mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et do
                    </p>
                    <span class="badge mb-2">class</span>

                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <small class="text-muted">20 mins ago</small>
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

            <div class="col-md-4">
                <div class="note-card p-3 rounded">
                    <h6 class="fw-bold mb-2">Class</h6>
                    <p class="text-secondary small mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et do
                    </p>
                    <span class="badge mb-2">class</span>

                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <small class="text-muted">20 mins ago</small>
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

            <div class="col-md-4">
                <div class="note-card p-3 rounded">
                    <h6 class="fw-bold mb-2">Class</h6>
                    <p class="text-secondary small mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et do
                    </p>
                    <span class="badge mb-2">class</span>

                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <small class="text-muted">20 mins ago</small>
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

        <div class="row" style="margin-top: 20px">
            <div class="col-md-4">
                <div class="note-card p-3 rounded">
                    <h6 class="fw-bold mb-2">Class</h6>
                    <p class="text-secondary small mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et do
                    </p>
                    <span class="badge mb-2">class</span>

                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <small class="text-muted">20 mins ago</small>
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

            <div class="col-md-4">
                <div class="note-card p-3 rounded">
                    <h6 class="fw-bold mb-2">Class</h6>
                    <p class="text-secondary small mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et do
                    </p>
                    <span class="badge mb-2">class</span>

                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <small class="text-muted">20 mins ago</small>
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

            <div class="col-md-4">
                <div class="note-card p-3 rounded" style="text-align: center">
                    <img src="@/assets/images/profile/icon.png" alt="Create Note" class="note-icon" />
                    <p class="note-label">Create New Note</p>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-6">
            <div class="card" style="height:auto; padding: 15px; width: 95%">
                <h5 class="mb-3">Topics of Interest</h5>
                <div class="topics-grid">
                    <div class="left-column">
                        <div class="topic-item">
                            <img src="@/assets/images/topics/photography.jpg" class="topic-img" />
                            <span>Photography</span>
                        </div>
                        <div class="topic-item">
                            <img src="@/assets/images/topics/animal.jpg" class="topic-img" />
                            <span>Animal Photography</span>
                        </div>
                        <div class="topic-item">
                            <img src="@/assets/images/topics/moon.jpg" class="topic-img" />
                            <span>Moon Photography</span>
                        </div>
                        <div class="topic-item">
                            <img src="@/assets/images/topics/night.jpg" class="topic-img" />
                            <span>Night Photography</span>
                        </div>
                        <div class="topic-item">
                            <img src="@/assets/images/topics/digital.jpg" class="topic-img" />
                            <span>Digital Art</span>
                        </div>
                    </div>
                    <div class="right-column">
                        <div class="topic-item">
                            <img src="@/assets/images/topics/nature.jpg" class="topic-img" />
                            <span>Nature Photography</span>
                        </div>
                        <div class="topic-item">
                            <img src="@/assets/images/topics/flower.jpg" class="topic-img" />
                            <span>Flowers Photography</span>
                        </div>
                        <div class="topic-item">
                            <img src="@/assets/images/topics/paint.jpg" class="topic-img" />
                            <span>Paintings</span>
                        </div>
                        <div class="topic-item">
                            <img src="@/assets/images/topics/sketch.jpg" class="topic-img" />
                            <span>Sketches</span>
                        </div>
                        <div class="topic-item">
                            <img src="@/assets/images/topics/abstract.jpg" class="topic-img" />
                            <span>Abstract Art</span>
                        </div>
                    </div>
                </div>

                <div class="button-group">
                    <button class="btn me-2" id="view">View All</button>
                    <button class="btn me-2" id="new">Add New</button>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card" style="height:auto; padding: 15px; width: 95%">
                <h5>Classes Log</h5>
                <div class="event-items">
                    <div class="col-md-2">
                        <img class="img-fluid" src="@/assets/images/dashboard/simple.png" alt="Pag" />
                    </div>
                    <div class="col-md-6">
                        <div class="event-details">
                            <h5 class="names mb-1">Camera Focus</h5>
                            <h5 class="text-secondary">Description</h5>
                        </div>

                    </div>
                    <div class="col-md-4">
                        <h5 class="date">Feb 04, 2025 - Present </h5>
                    </div>
                </div>
                <div class="divider3"></div>

                <div class="event-items">
                    <div class="col-md-2">
                        <img class="img-fluid" src="@/assets/images/dashboard/simple.png" alt="Pag" />
                    </div>
                    <div class="col-md-6">
                        <div class="event-details">
                            <h5 class="names mb-1">Camera Focus</h5>
                            <h5 class="text-secondary">Description</h5>
                        </div>

                    </div>
                    <div class="col-md-4">
                        <h5 class="date">Feb 04, 2025 - Present </h5>
                    </div>
                </div>
                <div class="divider3"></div>

                <div class="event-items">
                    <div class="col-md-2">
                        <img class="img-fluid" src="@/assets/images/dashboard/simple.png" alt="Pag" />
                    </div>
                    <div class="col-md-6">
                        <div class="event-details">
                            <h5 class="names mb-1">Camera Focus</h5>
                            <h5 class="text-secondary">Description</h5>
                        </div>

                    </div>
                    <div class="col-md-4">
                        <h5 class="date">Feb 04, 2025 - Present </h5>
                    </div>
                </div>
                <div class="divider3"></div>

                <div class="event-items">
                    <div class="col-md-2">
                        <img class="img-fluid" src="@/assets/images/dashboard/simple.png" alt="Pag" />
                    </div>
                    <div class="col-md-6">
                        <div class="event-details">
                            <h5 class="names mb-1">Camera Focus</h5>
                            <h5 class="text-secondary">Description</h5>
                        </div>

                    </div>
                    <div class="col-md-4">
                        <h5 class="date">Feb 04, 2025 - Present </h5>
                    </div>
                </div>
                <div class="divider3"></div>

                <div class="button-group">
                    <button class="btn me-2" id="view">View All</button>
                    <button class="btn me-2" id="new">Add New</button>
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
import {
    ref
} from 'vue'

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
.event-details {
    display: flex;
    flex-direction: column;
}

.topics-grid {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.left-column,
.right-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.topic-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.topic-img {
    width: 63.35px;
    height: 63.35px;
    object-fit: cover;
    border-radius: 50%;
}

.bold {
    font-weight: 600;
}

.button-group {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

.btn {
    padding: 6px 16px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-weight: 500;
}

.brown {
    background-color: #c5a57d;
    color: white;
}

.dark {
    background-color: #4a3f35;
    color: white;
}

.note-card {
    background-color: #EBE6E1;
    border-radius: 10px;
    padding: 24px;
    gap: 40px;
    height: 200px
}

.badge {
    background-color: #4C4036;
    color: white;
    font-size: 0.75rem;
    padding: 4.25px;
    border-radius: 3.4px;
    font-weight: 400;
    font-family: Inter
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
