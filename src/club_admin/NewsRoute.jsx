<template>
<div :style="{ backgroundColor: 'white' }">
    <Loader :show="isLoading" />
    <div v-if="!isLoading">
        <NavigationRoute />
        <HeaderRoute title="News" />
        <div class="content">
            <section>
                <div class="container">
                    <div class="dashboard-card">
                        <div class="profile-card">
                            <div class="profile-left">
                                <div class="profile-info">
                                    <small class="greeting">News from the club admins</small>
                                    <h2 class="name">Club News</h2>
                                    <p class="role">{{CurrentMonthCount}} News posted this month</p>
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
                                <small class="ca-details">News</small>
                                <h3 class="number">{{ MemberCount }}</h3>
                            </div>
                            <div class="event-card">
                                <small class="ca-details">Latest News</small>
                                <div class="row">
                                    <div class="col-md-5">
                                        <h3 class="number">{{EventDay}}</h3>
                                    </div>
                                    <div class="days col-md-7">
                                        <span>days ago</span>
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
                                <div v-if="filteredNews.length">
                                    <div v-for="news in filteredNews" :key="news.id" class="custom-card mb-3 p-3">
                                        <div class="d-flex gap-3" style="flex: 1">
                                            <img v-if="news.club_news_type.icon" :src="news.featured_image" alt="News Image" />
                                            <div class="flex-grow-1 d-flex flex-column justify-content-between">
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <h5>{{ news.title || 'Untitled News' }}</h5>
                                                    <div class="icon-container ms-3">
                                                        <img :src="Mess" alt="icon" style="width: 20px; height: 20px" />
                                                        <img :src="Cam" alt="icon" style="width: 20px; height: 20px" />
                                                        <img :src="Pro" alt="icon" style="width: 20px; height: 20px" />
                                                        <img :src="Cal" alt="icon" style="width: 20px; height: 20px" />
                                                    </div>
                                                </div>
                                                <p class="date">
                                                    {{ formatDate(news.publish_date) || 'Date Not Available' }}
                                                </p>
                                                <p class="text-secondary" v-html="news.description || 'No description provided.'">
                                                </p>
                                                <div class="d-flex justify-content-between align-items-center mt-3 w-100">
                                                    <div class="button-group d-flex align-items-center gap-2">
                                                        <router-link :to="{ name: 'competitionsingle', params: { id: news.id } }" custom v-slot="{ navigate }">
                                                            <button class="btn me-2" id="view" @click="navigate">View</button>
                                                        </router-link>
                                                        <router-link :to="{ name: 'comp_edit', params: { id: news.id } }" custom v-slot="{ navigate }">
                                                            <button class="btn" id="edit" @click="navigate">Edit</button>
                                                        </router-link>
                                                    </div>

                                                    <div class="d-flex align-items-center gap-2">
                                                        <img :src="Books" alt="icon" style="width:20px; height:20px" />
                                                        <img :src="Share" alt="icon" style="width:20px; height:20px" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="text-center text-muted">No news found.</div>

                                <div class="dt-paging">
                                    <nav aria-label="pagination">
                                        <button class="dt-paging-button previous" :class="{ disabled: currentPage === 1 }" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)" aria-label="Previous">
                                            ‹
                                        </button>

                                        <button v-for="page in totalPages" :key="page" class="dt-paging-button" :class="{ current: page === currentPage }" @click="goToPage(page)">
                                            {{ page }}
                                        </button>

                                        <button class="dt-paging-button next" :class="{ disabled: currentPage === totalPages }" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)" aria-label="Next">
                                            ›
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div class="col-md-4">
                    <section>
                        <div class="container" id="right">
                            <div class="cardddd" style="padding: 0;height: auto">
                                <CalendarDashboard />
                            </div>
                            <div id="news">
                                <RecentComments />
                                <MoreNews style="height: auto" />
                            </div>
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
import apiClient from 'axios'
import { useNewsStore } from '@/stores/club_admin/NewsStore'
import NavigationRoute from "@/components/NavigationRoute.vue";
import HeaderRoute from "@/components/HeaderRoute.vue";
import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import RecentComments from "@/partials/club_admin/news/RecentComments.vue";
import MoreNews from "@/partials/club_admin/news/MoreNews.vue";
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
import Share from "@/assets/icons/event_list/share.svg"
import Books from "@/assets/icons/event_list/bookmark.svg"
import Loader from "@/components/LoaderAll.vue";

const { news, fetchNews, memberCount, currentMonthCount, completedDaysAgo } = useNewsStore()

const MemberCount = memberCount
const CurrentMonthCount = currentMonthCount
const EventDay = completedDaysAgo
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

const fetchSearchedNews = debounce(async (query) => {
    if (query !== lastSearched) {
        lastSearched = query
        try {
            const response = await apiClient.get('/news', {
                params: {
                    search_term: query
                }
            })
            const result = response?.data?.data?.original?.data || []
            news.value = result
            currentPage.value = 1
        } catch (error) {
            console.error('Error fetching searched news:', error)
            news.value = []
        }
    }
}, 400)

watch(search, (newSearch) => {
    if (newSearch.length >= 3) {
        fetchSearchedNews(newSearch)
    } else {
        fetchNews()
    }
})

const loadNews = async () => {
    isLoading.value = true
    try {
        await fetchNews()
    } catch (error) {
        console.error("Error fetching news:", error)
    } finally {
        isLoading.value = false
    }
}
onMounted(() => {
    loadNews()
})

const filteredNews = computed(() => {
    let filtered = news.value

    if (search.value.trim()) {
        filtered = filtered.filter(news =>
            news?.title?.toLowerCase().includes(search.value.toLowerCase())
        )
    }

    const start = (currentPage.value - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filtered.slice(start, end)
})

const totalPages = computed(() => {
    const count = news.value.filter(news =>
        news?.title?.toLowerCase().includes(search.value.toLowerCase())
    ).length
    return Math.max(Math.ceil(count / rowsPerPage), 1)
})

function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
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
 #view {
     width: 120px;
     max-width: 120px;
     height: 40px;
     border-radius: 7px;
     background-color: #99816b;
     font-weight: 400;
     font-size: 16px;
     line-height: 100%;
     font-family: Inter;
     color: white;
}
 #edit {
     width: 120px;
     max-width: 120px;
     height: 40px;
     border-radius: 7px;
     background-color: #4c4036;
     font-weight: 400;
     font-size: 16px;
     line-height: 100%;
     color: white;
     font-family: Inter;
}
 #right {
     margin-left: 20px;
}
</style>
