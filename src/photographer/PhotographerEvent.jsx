<template>
<NavigationRoute />
<HeaderRoute title="Events" />
<section class="content">
    <div class="dashboard-card">
        <div class="profile-card">
            <div class="profile-left">
                <div class="profile-info">
                    <small class="greeting">Planned and regular club competition</small>
                    <h2 class="name">2024 - 2025 Season</h2>
                </div>
            </div>
            <div class="dt-search mx-auto">
                <input v-model="search" type="search" class="form-control" id="dt-search-1" placeholder="Search" aria-controls="example1" />
            </div>
            <div class="quick-filter text-end">
                <strong>Quick Filter</strong>
                <small class="d-block">(Click icons to filter)</small>
                <div class="d-flex gap-2 justify-content-end">
                    <i class="bi bi-calendar-event"></i>
                    <i class="bi bi-camera"></i>
                    <i class="bi bi-newspaper"></i>
                </div>
                <div class="d-flex gap-2 justify-content-end mt-2">
                    <i class="bi bi-trophy"></i>
                    <i class="bi bi-info"></i>
                    <i class="bi bi-bell"></i>
                </div>
            </div>
        </div>
        <div class="card-section">
            <div class="stat-card">
                <small class="ca-details">Events</small>
                <h3 class="number">{{ MemberCount }}</h3>
            </div>
            <div class="event-card">
                <small class="ca-details">Next Event</small>
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

    <div class="row">
        <div class="col-md-8">
            <div class="container mt-4">
                <div v-if="filteredEvents.length">
                    <div v-for="event in filteredEvents" :key="event.id" class="custom-card mb-3 p-3">
                        <div class="d-flex gap-3">
                            <img v-if="event.images" :src="event.featured_image" alt="Event Image" />
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5>{{ event.name || 'Untitled Event' }}</h5>
                                    <div class="icon-container">
                                        <i class="fas fa-comment-alt me-2"></i>
                                        <i class="fas fa-camera me-2"></i>
                                        <i class="fas fa-calendar-alt"></i>
                                    </div>
                                </div>
                                <p class="date">
                                    {{ formatDate(event.event_date) || 'Date Not Available' }}
                                </p>
                                <p class="text-secondary">
                                    {{ event.description || 'No description provided.' }}
                                </p>
                                <div>
                                    <router-link to="/eventsingle" custom v-slot="{ navigate }">
                                        <button class="btn me-2" id="view" @click="navigate">View</button>
                                    </router-link>
                                    <router-link to="/events_add" custom v-slot="{ navigate }">
                                        <button class="btn me-2" id="edit" @click="navigate">Edit</button>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center text-muted">No events found.</div>

                <nav v-if="filteredEvents.length">
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
            <div class="calen">
                <CalendarDashboard />
            </div>
            <div id="news">
                <div class="cardddd d-flex flex-column" :style="{padding: '35px'}">
                    <h5 class="head">Recent Comments</h5>

                    <div class="row" style="margin-bottom: 10px" v-for="c in eventcomments.slice(0, 4)" :key="c.id">
                        <div v-for="comment in c.comments" :key="comment.id" class="row">
                            <div class="col-md-2">
                                <img :src="comment.user?.profile_image_url" alt="Com" style="width: 50px; height: 50px" />
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

                    <div class="button-group mt-auto">
                        <router-link to="/notices" custom v-slot="{ navigate }">
                            <button class="btn btn-sm" id="view" @click="navigate">View All</button>
                        </router-link>
                        <router-link to="/notice_single" custom v-slot="{ navigate }">
                            <button class="btn btn-sm" id="new" @click="navigate">Add New</button>
                        </router-link>
                    </div>
                </div>

                <MoreEvents style="width: 90%" />
            </div>
        </div>
    </div>
</section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiClient from '@/api/axios'
import { useEventStore } from '@/stores/club_admin/EventStore'
import HeaderRoute from '@/components/HeaderRoute.vue'
import NavigationRoute from '@/components/NavigationRoute.vue'
import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import { useEventComments } from "@/stores/club_admin/EventComments";
import MoreEvents from '@/partials/club_admin/events/MoreEvents.vue'


const {
    events,
    fetchEvents,
    memberCount,
    eventDay
} = useEventStore()
const {
    eventcomments,
    fetchEventComments
} = useEventComments();
const MemberCount = memberCount
const EventDay = eventDay
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

watch(search, (newSearch) => {
    if (newSearch.length >= 3) {
        fetchSearchedEvents(newSearch)
    } else {
        fetchEvents()
    }
})

onMounted(() => {
    fetchEvents();
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
.calen {
    margin-top: 15px;
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
