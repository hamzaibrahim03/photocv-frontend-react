<template>
<div :style="{ backgroundColor: 'white' }">
    <Loader :show="isLoading" />
    <div v-if="!isLoading">
        <NavigationRoute />
        <HeaderRoute title="Pages" />
        <div class="content">
            <section>
                <div class="container">
                    <div class="dashboard-card">
                        <div class="profile-card">
                            <div class="profile-left">
                                <div class="profile-info">
                                    <small class="greeting">Live and Draft Club Website Pages</small>
                                    <h2 class="name">Club Website Pages</h2>
                                    <p class="role">{{CurrentMonthCount}} Live Pages</p>
                                </div>
                            </div>
                            <div class="dt-search mx-auto">
                                <input v-model="search" type="search" class="form-control" id="dt-search-1" placeholder="Search" aria-controls="example1" />
                            </div>
                            <div class="quick-filter text-end">
                                <strong>Quick Filter</strong>
                                <small class="d-block">(Click icons to filter)</small>
                                <div class="d-flex gap-2 justify-content-end">
                                    <img :src="Com" alt="icon" style="width: 20px; height: 20px" />
                                    <img :src="Cale" alt="icon" style="width: 20px; height: 20px" />
                                    <img :src="Book" alt="icon" style="width: 20px; height: 20px" />
                                </div>
                                <div class="d-flex gap-2 justify-content-end mt-2">
                                    <img :src="Cup" alt="icon" style="width: 20px; height: 20px" />
                                    <img :src="Hand" alt="icon" style="width: 20px; height: 20px" />
                                    <img :src="Note" alt="icon" style="width: 20px; height: 20px" />
                                </div>
                            </div>
                        </div>
                        <div class="card-section">
                            <div class="stat-card">
                                <small class="ca-details">Drafts</small>
                                <h3 class="number">{{ MemberCount }}</h3>
                            </div>
                            <div class="event-card">
                                <small class="ca-details">Latest Change</small>
                                <div class="row">
                                    <div class="col-md-5">
                                        <h3 class="number">{{EventDay}}</h3>
                                    </div>
                                    <div class="days col-md-7">
                                        <span>days to go</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div class="row">
                <div class="col-md-8">
                    <section>
                        <div class="container">
                            <div class="mt-4">
                                <div v-if="filteredPages.length">
                                    <div v-for="page in filteredPages" :key="page.id" class="custom-card mb-3 p-3">
                                        <div class="d-flex gap-3" style="flex: 1">
                                            <img :src="page.featured_image" alt="Page Image" />
                                            <div class="flex-grow-1 d-flex flex-column justify-content-between">
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <h5>{{ page.title || 'Untitled Page' }}</h5>
                                                    <div class="icon-container ms-3">
                                                        <img :src="Mess" alt="icon" style="width: 20px; height: 20px" />
                                                        <img :src="Cam" alt="icon" style="width: 20px; height: 20px" />
                                                        <img :src="Pro" alt="icon" style="width: 20px; height: 20px" />
                                                        <img :src="Cal" alt="icon" style="width: 20px; height: 20px" />
                                                    </div>
                                                </div>
                                                <p class="date"> {{ formatDate(page.publish_date) || 'Date Not Available' }}
                                                </p>
                                                <p class="text-secondary">
                                                    {{ page.description || 'No description provided.' }}
                                                </p>
                                                <div class="button-group mt-3 d-flex">
                                                    <button class="btn me-2" id="view">View</button>
                                                    <button class="btn" id="edit">Edit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="text-center text-muted">No pages found.</div>

                                <nav v-if="filteredPages.length">
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
                    </section>
                </div>
                <div class="col-md-4">
                    <section>
                        <div class="container" id="right">
                            <RecentComments />
                            <MorePages />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiClient from '@/api/axios'
import { usePagesStore } from '@/stores/club_admin/PagesStore'
import NavigationRoute from "@/components/NavigationRoute.vue"
import HeaderRoute from "@/components/HeaderRoute.vue"
import RecentComments from "@/partials/club_admin/pages/RecentComments.vue"
import MorePages from "@/partials/club_admin/pages/MorePages.vue"
import Pro from "@/assets/icons/event_list/pro.svg"
import Cal from "@/assets/icons/event_list/cal.svg"
import Cam from "@/assets/icons/event_list/cam.svg"
import Mess from "@/assets/icons/event_list/mess.svg"
import Book from "@/assets/icons/quick_notice/book.svg"
import Cale from "@/assets/icons/quick_notice/calender.svg"
import Com from "@/assets/icons/quick_notice/com.svg"
import Cup from "@/assets/icons/quick_notice/cup.svg"
import Hand from "@/assets/icons/quick_notice/hand.svg"
import Note from "@/assets/icons/quick_notice/note.svg"
import Loader from "@/components/LoaderAll.vue";

const { pages, fetchPages, memberCount, eventDay, currentMonthCount } = usePagesStore()
const MemberCount = memberCount
const CurrentMonthCount = currentMonthCount
const EventDay = eventDay

const search = ref('')
const currentPage = ref(1)
const rowsPerPage = 4
const isLoading = ref(true)

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

const fetchSearchedPages = debounce(async (query) => {
    if (query !== lastSearched) {
        lastSearched = query
        try {
            const response = await apiClient.get('/pages', {
                params: {
                    search_term: query
                }
            })
            const result = response?.data?.data?.original?.data || []
            pages.value = result
            currentPage.value = 1
        } catch (error) {
            console.error('Error fetching searched pages:', error)
            pages.value = []
        }
    }
}, 400)

watch(search, (newSearch) => {
    if (newSearch.length >= 3) {
        fetchSearchedPages(newSearch)
    } else {
        fetchPages()
    }
})

const loadPages = async () => {
    isLoading.value = true
    try {
        await fetchPages()
    } catch (error) {
        console.error("Error fetching pages:", error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadPages()
})

const filteredPages = computed(() => {
    let filtered = pages.value

    if (search.value.trim()) {
        filtered = filtered.filter(page =>
            page?.title?.toLowerCase().includes(search.value.toLowerCase())
        )
    }

    const start = (currentPage.value - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filtered.slice(start, end)
})

const totalPages = computed(() => {
    const count = pages.value.filter(page =>
        page?.title?.toLowerCase().includes(search.value.toLowerCase())
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
 .cardddd:first-child {
     background: white;
     width: 95%;
     padding: 20px;
     height: 390px;
     border-radius: 10px;
     margin-bottom: 20px;
     margin-top: 20px;
}
 .cardddd {
     background: white;
     width: 95%;
     padding: 20px;
     height: 390px;
     border-radius: 10px;
     margin-bottom: 20px;
}
 .custom-card {
     display: flex;
     align-items: center;
     background-color: white;
     box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
     margin-bottom: 15px;
     padding: 20px;
     border-radius: 10px;
     width: 103.5%;
     margin-right: auto;
     flex-direction: row;
}
 #right {
     margin-left: 20px;
}
</style>
