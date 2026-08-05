<template>
<div :style="{ backgroundColor: 'white' }">
    <Loader :show="isLoading" />
    <div v-if="!isLoading">
        <NavigationRoute />
        <HeaderRoute title="Events" />
        <div class="content">
            <section>
                <div class="container">
                    <div class="dashboard-card">
                        <div class="profile-card">
                            <div class="profile-left">
                                <div class="profile-info">
                                    <small class="greeting">Planned and regular club event</small>
                                    <h2 class="name">2024 - 2025 Season</h2>
                                    <p class="role">{{EventCount}} Events to go</p>
                                </div>
                            </div>
                            <div class="dt-search mx-auto">
                                <input v-model="search" type="search" class="form-control" id="dt-search-1" placeholder="Search" aria-controls="example1" />
                            </div>
                            <div class="quick-filter text-end">
                                <strong>Quick Filter</strong>
                                <small class="d-block">(Click icons to filter)</small>
                                <div class="d-flex gap-2 justify-content-end">
                                    <img :src="Video" alt="icon" style="width: 20px; height: 20px" />
                                    <img :src="Project" alt="icon" style="width: 20px; height: 20px" />
                                    <img :src="Star" alt="icon" style="width: 20px; height: 20px" />
                                </div>
                                <div class="d-flex gap-2 justify-content-end mt-2">
                                    <img :src="Camera" alt="icon" style="width: 20px; height: 20px" />
                                    <img :src="Stick" alt="icon" style="width: 20px; height: 20px" />
                                    <img :src="Set" alt="icon" style="width: 20px; height: 20px" />
                                </div>
                            </div>
                        </div>
                        <div class="card-section">
                            <div class="stat-card">
                                <small class="ca-details">Total Events</small>
                                <h3 class="number">{{ MemberCount }}</h3>
                            </div>
                            <div class="event-card">
                                <small class="ca-details">Next Event</small>
                                <div class="row">
                                    <div class="col-md-5">
                                        <h3 class="number">{{ String(EventDay).padStart(2, '0') }}</h3>
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

            <section>
                <div class="container">
                    <div class="row">
                        <div class="col-md-8" style="padding: 0px">
                            <section>
                                <div class="container">
                                    <div class="mt-4">
                                        <div class="d-flex justify-content-end">
                                            <button class="btn" id="edit" style="max-width: 158px; width: 158px; height: 40px;" @click="navigate">Export Events&nbsp;<i class="fa-solid fa-chevron-down text-xs text-gray-500 down notification-desktop" @click.stop.prevent="toggleDropdown"></i></button>
                                        </div>
                                        <div v-if="filteredEvents.length">
                                            <div v-for="event in filteredEvents" :key="event.id" class="custom-card mb-3">
                                                <div class="d-flex gap-3" style="flex: 1;">
                                                    <img v-if="event.images" :src="event.featured_image_url" alt="Event Image" />
                                                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                                                        <div>
                                                            <div class="d-flex justify-content-between align-items-start">
                                                                <h5>{{ event.name || 'Untitled Event' }}</h5>
                                                                <div class="icon-container ms-3">
                                                                    <img :src="Mess" alt="icon" style="width: 20px; height: 20px" />
                                                                    <img :src="Cam" alt="icon" style="width: 20px; height: 20px" />
                                                                    <img :src="Pro" alt="icon" style="width: 20px; height: 20px" />
                                                                    <img :src="Cal" alt="icon" style="width: 20px; height: 20px" />
                                                                </div>
                                                            </div>
                                                            <p class="date">
                                                                {{ formatDate(event.event_date) || 'Date Not Available' }}
                                                            </p>
                                                            <p class="text-secondary" v-html="event.description || 'No description provided.'">
                                                            </p>
                                                        </div>

                                                        <div class="d-flex justify-content-between align-items-center mt-3 w-100">
                                                            <div class="button-group d-flex align-items-center">
                                                                <router-link :to="{ name: 'eventsingle', params: { id: event.id } }" custom v-slot="{ navigate }">
                                                                    <button class="btn" id="view" @click="navigate">View</button>
                                                                </router-link>

                                                                <router-link :to="{ name: 'events_add', params: { id: event.id } }" custom v-slot="{ navigate }">
                                                                    <button class="btn" id="edit" @click="navigate">Edit</button>
                                                                </router-link>
                                                            </div>

                                                            <div class="d-flex align-items-center gap-2">
                                                                <img :src="Book" alt="icon" style="width:20px; height:20px" />
                                                                <img :src="Share" alt="icon" style="width:20px; height:20px" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div v-else class="text-center text-muted">No events found.</div>

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
                                    <div class="cardddd" style="padding: 0px; height: auto">
                                        <CalendarDashboard />
                                    </div>
                                    <div id="news">
                                        <div class="cardddd d-flex flex-column" :style="{padding: '35px'}">
                                            <h5 class="head">Recent Comments</h5>

                                            <div class="event-list" style="margin-bottom: 10px" v-for="c in eventcomments.slice(0, 1)" :key="c.id">
                                                <div v-for="comment in c.comments" :key="comment.id" class="event-item">
                                                    <div class="col-md-2">
                                                        <img v-if="comment.user?.profile_image_url" :src="comment.user?.profile_image_url" alt="Com" style="width: 50px; height: 50px" />
                                                        <div v-else class="event-img fallback-box d-flex justify-content-center align-items-center">
                                                            <i class="fa-regular fa-user" style="font-size: 24px; color: gray"></i>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-5">
                                                        <p class="text-secondary">{{ comment.comment }}</p>
                                                    </div>
                                                    <div class="col-md-5">
                                                        <div class="event-time" style="text-align: right">
                                                            <small class="event-date">{{ formatDate(comment.created_at) }}</small><br />
                                                            <small class="event-time-details">{{ formatTime(comment.created_at) }}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
            <footer class="site-footer">
                <div class="footer-content">
                    <p class="memtext" id="fcopy">Copyright &copy; 2025 – {{dashboardStore?.dashboardData?.data?.user_details?.username}}</p>
                </div>
            </footer>

        </div>
    </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiClient from '@/api/axios'
import { useEventStore } from '@/stores/club_admin/EventStore'
import Video from "@/assets/icons/quick_event/video.svg"
import Star from "@/assets/icons/quick_event/star.svg"
import Set from "@/assets/icons/quick_event/set.svg"
import Stick from "@/assets/icons/quick_event/stick.svg"
import Camera from "@/assets/icons/quick_event/camera.svg"
import Project from "@/assets/icons/quick_event/project.svg"
import Pro from "@/assets/icons/event_list/pro.svg"
import Cal from "@/assets/icons/event_list/cal.svg"
import Cam from "@/assets/icons/event_list/cam.svg"
import Mess from "@/assets/icons/event_list/mess.svg"
import Share from "@/assets/icons/event_list/share.svg"
import Book from "@/assets/icons/event_list/bookmark.svg"
import HeaderRoute from '@/components/HeaderRoute.vue'
import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import NavigationRoute from '@/components/NavigationRoute.vue'
import Loader from "@/components/LoaderAll.vue";
import { useEventComments } from "@/stores/club_admin/EventComments";
import { useDashboardStore } from "@/stores/club_admin/DashboardStore";

const {
    events,
    fetchEvents,
    memberCount,
    eventCount,
    eventDay
} = useEventStore()
const {
    eventcomments,
    fetchEventComments
} = useEventComments();
const MemberCount = memberCount
const EventDay = eventDay
const EventCount = eventCount
const search = ref('')
const currentPage = ref(1)
const isLoading = ref(true);
const rowsPerPage = 4
const dashboardStore = useDashboardStore();

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

const fetchSearchedEvents = debounce(async (query) => {
    if (query.length >= 3 && query !== lastSearched) {
        lastSearched = query
        try {
            const response = await apiClient.get('/events', {
                params: {
                    search_term: query
                }
            })
            const result = response?.data?.data?.original?.data || []
            events.value = result
            currentPage.value = 1
        } catch (error) {
            console.error('Error fetching searched events:', error)
            events.value = []
        }
    }
}, 400)

const loadEvents = async () => {
    isLoading.value = true
    try {
        await fetchEvents()
        await dashboardStore.fetchDashboardData();
    } catch (error) {
        console.error("Error fetching events:", error)
    } finally {
        isLoading.value = false
    }
}

watch(search, (newSearch) => {
    if (newSearch.length >= 3) {
        fetchSearchedEvents(newSearch)
    } else {
        fetchEvents()
    }
})

onMounted(() => {
    loadEvents();
    fetchEventComments();
})

const filteredEvents = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage
    const end = start + rowsPerPage
    return events.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.max(Math.ceil(events.value.length / rowsPerPage), 1)
})

const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

const formatTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    return date.toLocaleTimeString("en-US", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
};

function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
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
    width: 100%;
    padding: 15px 0px 35px;
}

.profile-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    padding: 30px;
    border-radius: 10px;
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
    font-size: 16px;
    line-height: 100%;
    font-style: Regular;
    font-family: Inter;
}

.name {
    font-weight: 500;
    font-size: 30px;
    line-height: 100%;
    color: #4c4036;
    font-style: Medium;
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
.date {
    text-align: left;
}
.left-header-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.role {
    color: #cc445e;
    font-weight: 400;
    font-size: 16px;
    line-height: 100%;
    font-family: Inter;
    font-style: Regular;
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
    width: 100%;
    padding: 20px;
    height: 390px;
    border-radius: 10px;
    margin-bottom: 20px;
    margin-top: 20px;
}

.cardddd {
    background: white;
    width: 100%;
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
    padding: 30px;
    border-radius: 10px;
    width: 100%;
    height: 310px;
    margin-right: auto;
    flex-direction: row;
    margin-top: 30px;
}

.custom-card img {
    max-width: 300px;
    height: 250px;
    width: 300px;
    border-radius: 7px;
}
.button-group {
    gap: 20px;
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
#right {
    margin-top: -30px;
    width: 103%
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
 .site-footer {
     padding-top: 25px;
     padding-bottom: 10px;
     text-align: center;
     font-size: 14px;
     color: #555;
     border-top: 1px solid #ddd;
     margin-top: 40px;
}
 .site-footer a {
     color: #007bff;
     text-decoration: none;
}
 .site-footer a:hover {
     text-decoration: underline;
}
.memtext {
    text-align: center
}
</style>
