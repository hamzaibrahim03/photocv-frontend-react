<template>
<div :style="{ backgroundColor: 'white' }">
    <Loader :show="isLoading" />
    <div v-if="!isLoading">
        <NavigationRoute />
        <HeaderRoute title="Notices" />
        <div class="content">
            <section>
                <div class="container">
                    <div class="dashboard-card">
                        <div class="profile-card">
                            <div class="profile-left">
                                <div class="profile-info">
                                    <small class="greeting">All kinds of notices on the club website</small>
                                    <h2 class="name">Club Notices</h2>
                                    <p class="role">{{CurrentMonthCount}} Notices posted this month</p>
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
                                <small class="ca-details">Notices</small>
                                <h3 class="number">{{ MemberCount }}</h3>
                            </div>
                            <div class="event-card">
                                <small class="ca-details">Last Notice</small>
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
                                <div v-if="filteredNotices.length">
                                    <div v-for="notice in filteredNotices" :key="notice.id" class="custom-card mb-3 p-3">
                                        <div class="d-flex gap-3" style="flex: 1">
                                            <img :src="notice.featured_image" alt="Notice Image" />
                                            <div class="flex-grow-1 d-flex flex-column justify-content-between">
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <h5>{{ notice.title || 'Untitled Notice' }}</h5>
                                                    <div class="icon-container ms-3">
                                                        <img :src="Mess" alt="icon" style="width: 20px; height: 20px" />
                                                        <img :src="Cam" alt="icon" style="width: 20px; height: 20px" />
                                                        <img :src="Pro" alt="icon" style="width: 20px; height: 20px" />
                                                        <img :src="Cal" alt="icon" style="width: 20px; height: 20px" />
                                                    </div>
                                                </div>
                                                <p class="names" style="font-size: 14px">{{ notice.names }}</p>
                                                <p class="date">{{ formatDate(notice.created_at) }}</p>
                                                <p class="text-secondary" v-html="notice.description || 'No description provided.'">
                                                </p>
                                                <div class="d-flex justify-content-between align-items-center mt-3 w-100">
                                                    <div class="button-group d-flex align-items-center gap-2">
                                                        <router-link :to="{ name: 'noticesingle', params: { id: notice.id } }" custom v-slot="{ navigate }">
                                                            <button class="btn me-2" id="view" @click="navigate">View</button>
                                                        </router-link>

                                                        <router-link :to="{ name: 'noticeedit', params: { id: notice.id } }" custom v-slot="{ navigate }">
                                                            <button class="btn me-2" id="edit" @click="navigate">Edit</button>
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

                                <div v-else class="text-center text-muted">No notices found.</div>
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
                            <div class="cardddd" style="padding: 0; height: auto">
                                <CalendarDashboard />
                            </div>
                            <div id="news">
                                <div class="cardddd d-flex flex-column" style="padding: 35px">
                                    <h5 class="head">Recent Comments on Notice</h5>

                                    <div class="event-list" style="margin-bottom: 10px" v-for="c in noticecomments.slice(0, 4)" :key="c.id">
                                        <div v-for="comment in c.comments" :key="comment.id" class="event-item">
                                            <img v-if="comment.user?.profile_image_url" class="img-fluid event-img" :src="comment.user.profile_image_url" @error="comment.user.profile_image_url = null" />
                                            <div v-else class="event-img fallback-box d-flex justify-content-center align-items-center">
                                                <i class="fa-regular fa-user" style="font-size: 24px; color: gray"></i>
                                            </div>
                                            <div class="event-details">
                                                <div class="event-info" style="display: flex; flex-direction: column">
                                                    <span id="ename">{{ comment.comment }}</span>
                                                </div>
                                            </div>
                                            <div class="event-time" id="edate">
                                                <small class="event-date galtext">{{ formatDate(comment.created_at) }}</small><br />
                                                <small class="event-time-details galtext">{{ formatTime(comment.created_at) }}</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="button-group mt-auto">
                                        <router-link to="/notices" custom v-slot="{ navigate }">
                                            <button class="btn btn-sm" id="view" @click="navigate">View All</button>
                                        </router-link>
                                        <router-link to="/notice_single" custom v-slot="{ navigate }">
                                            <button class="btn btn-sm" id="new" @click="navigate">Add New</button>
                                        </router-link>
                                    </div>
                                </div>
                                <MoreNotices style=" height: auto" />
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
import {
    ref,
    computed,
    onMounted,
    watch
} from 'vue'
import apiClient from 'axios'
import {
    useNoticeStore
} from '@/stores/club_admin/NoticeStore'
import NavigationRoute from "@/components/NavigationRoute.vue";
import HeaderRoute from "@/components/HeaderRoute.vue";
import MoreNotices from "@/partials/club_admin/notices/MoreNotices.vue";
import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import Pro from "@/assets/icons/event_list/pro.svg"
import Cal from "@/assets/icons/event_list/cal.svg"
import Cam from "@/assets/icons/event_list/cam.svg"
import Mess from "@/assets/icons/event_list/mess.svg"
import Book from "@/assets/icons/quick_notice/book.svg"
import Cale from "@/assets/icons/quick_notice/calender.svg"
import Com from "@/assets/icons/quick_notice/com.svg"
import Cup from "@/assets/icons/quick_notice/cup.svg"
import Hand from "@/assets/icons/quick_notice/hand.svg"
import Share from "@/assets/icons/event_list/share.svg"
import Books from "@/assets/icons/event_list/bookmark.svg"
import Note from "@/assets/icons/quick_notice/note.svg"
import Loader from "@/components/LoaderAll.vue";
import {
    useNoticeComments
} from "@/stores/club_admin/NoticeComments";

const {
    completedDaysAgo,
    notices,
    fetchNotices,
    memberCount,
    currentMonthCount,
} = useNoticeStore()
const {
    noticecomments,
    fetchNoticeComments
} = useNoticeComments();
const CurrentMonthCount = currentMonthCount
const MemberCount = memberCount
const EventDay = completedDaysAgo
const search = ref('')
const currentPage = ref(1)
const rowsPerPage = 4
const isLoading = ref(true);

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

const loadNotices = async () => {
    isLoading.value = true
    try {
        await fetchNotices()
    } catch (error) {
        console.error("Error fetching notices:", error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchNoticeComments();
    loadNotices();
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

function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const formatDate = (date) => {
    const d = new Date(date)
    return isNaN(d) ? '' : d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    return date.toLocaleTimeString("en-US", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
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
 .event-list {
     padding-top: 30px;
}
 .event-list {
     display: flex;
     flex-direction: column;
     gap: 10px;
}
 .event-item {
     display: flex;
     align-items: center;
     gap: 10px;
}
 .event-item img {
     width: 100%;
     max-width: 50px;
     height: 50px;
     border-radius: 5px;
     object-fit: cover;
}
 .event-details {
     display: flex;
     justify-content: space-between;
     align-items: center;
     flex: 1;
     font-size: 0.875rem;
     width: 100%;
}
 #ename {
     font-family: Inter;
     font-weight: 500;
     font-style: Regular;
     font-size: 16px;
     line-height: 100%;
     letter-spacing: 0%;
}
 .event-img, .fallback-box {
     width: 100%;
     max-width: 50px;
     height: 50px;
     border-radius: 5px;
     object-fit: cover;
     background-color: #ddd;
     box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
 .fallback-box {
     font-size: 14px;
     color: #888;
}
</style>
