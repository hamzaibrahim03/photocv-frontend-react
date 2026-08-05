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

    <MyPosts />

    <div class="d-flex justify-content-between align-items-center" style="padding: 25px">
        <h5>My Notices</h5>
        <button class="btn me-2" id="view">View All</button>
    </div>
    <div class="row">
        <div class="col-md-8">
            <div class="container mt-4">
                <div v-if="filteredNotices.length">
                    <div v-for="notice in filteredNotices" :key="notice.id" class="custom-card mb-3 p-3">
                        <div class="d-flex gap-3">
                            <img :src="notice.featured_image" alt="Notice Image" />
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5>{{ notice.title || 'Untitled Notice' }}</h5>
                                    <div class="icon-container">
                                        <i class="fas fa-comment-alt me-2"></i>
                                        <i class="fas fa-camera me-2"></i>
                                        <i class="fas fa-calendar-alt"></i>
                                    </div>
                                </div>
                                <p class="names" style="font-size: 14px">{{ notice.location }}</p>
                                <p class="date">{{ formatDate(notice.created_at) }}</p>
                                <p class="text-secondary">
                                    {{ notice.description || 'No description provided.' }}
                                </p>
                                <div>
                                    <button class="btn me-2" id="view">View</button>
                                    <button class="btn" id="edit">Edit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center text-muted">No notices found.</div>
                <nav v-if="filteredNotices.length">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="prevPage">Previous</button>
                        </li>
                        <li class="page-item disabled">
                            <span class="page-link">
                                Page {{ currentPage }} of {{ totalPages }}
                            </span>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="nextPage">Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <div class="col-md-4">
            <div id="news">
                <RecentComments style="width: 90%" />
                <MoreNotices style="width: 90%" />
            </div>
        </div>
    </div>

</section>
</template>

<script setup>
import NavigationRoute from "@/components/NavigationRoute.vue"
import MyPosts from "@/partials/post/MyPosts.vue";
import HeaderRoute from "@/components/HeaderRoute.vue"
import { useUserStore } from "@/stores/club_admin/UserStore";
import { ref, computed, onMounted, watch } from 'vue'
import apiClient from 'axios'
import { useNoticeStore } from '@/stores/club_admin/NoticeStore'
import RecentComments from "@/partials/club_admin/notices/RecentComments.vue";
import MoreNotices from "@/partials/club_admin/notices/MoreNotices.vue";

const { notices, fetchNotices } = useNoticeStore()

const search = ref('')
const currentPage = ref(1)
const rowsPerPage = 4

let debounceTimeout
const debounce = (func, delay) => {
    return (...args) => {
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => {
            func(...args)
        }, delay)
    }
}

let lastSearched = ''

const fetchSearchedNotices = debounce(async (query) => {
    if (query !== lastSearched) {
        lastSearched = query
        try {
            const response = await apiClient.get('/notices', {
                params: {
                    search_term: query
                }
            })
            const result = response?.data?.data?.original?.data || []
            notices.value = result
            currentPage.value = 1
        } catch (error) {
            console.error('Error fetching searched notices:', error)
            notices.value = []
        }
    }
}, 400)

watch(search, (newSearch) => {
    if (newSearch.length >= 3) {
        fetchSearchedNotices(newSearch)
    } else {
        fetchNotices();
    }
})

onMounted(() => {
    fetchNotices()
})

const filteredNotices = computed(() => {
    let filtered = notices.value

    if (search.value.trim()) {
        filtered = filtered.filter(notice =>
            notice?.title?.toLowerCase().includes(search.value.toLowerCase())
        )
    }

    const start = (currentPage.value - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filtered.slice(start, end)
})

const totalPages = computed(() => {
    const count = notices.value.filter(notice =>
        notice?.title?.toLowerCase().includes(search.value.toLowerCase())
    ).length
    return Math.max(Math.ceil(count / rowsPerPage), 1)
})

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

const formatDate = (date) => {
    const d = new Date(date)
    return isNaN(d) ? '' : d.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const user = useUserStore();
</script>

<style scoped>
#news {
     margin-top: 8%
}
.icon-container i {
     color: #666;
     font-size: 16px;
}
.custom-card {
     margin-left: 1%;
     width: 103%
}
</style>
