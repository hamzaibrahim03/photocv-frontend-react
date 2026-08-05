<template>
<div :style="{ backgroundColor: 'white' }">
    <Loader :show="isLoading" />
    <div v-if="!isLoading">
        <NavigationRoute />
        <HeaderRoute title="Competitions" />
        <div class="content">
            <section>
                <div class="container">
                    <div class="dashboard-card">
                        <div class="profile-card">
                            <div class="profile-left">
                                <div class="profile-info">
                                    <small class="greeting">Planned and regular club competition</small>
                                    <h2 class="name">2024 - 2025 Season</h2>
                                    <p class="role">{{CompetitionCount}} Competitions to go</p>
                                </div>
                            </div>
                            <div class="dt-search mx-auto">
                                <input v-model="search" type="search" class="form-control" id="dt-search-1" placeholder="Search" aria-controls="example1" />
                            </div>
                            <div class="quick-filter text-end">
                                <strong>Filter</strong>
                                <small class="d-block">(Click icons to filter)</small>
                                <div class="d-flex gap-2 justify-content-end">
                                    <img :src="Pri" alt="icon" style="width: 20px; height: 20px" />
                                    <img :src="Fax" alt="icon" style="width: 20px; height: 20px" />
                                    <img :src="Pai" alt="icon" style="width: 20px; height: 20px" />
                                </div>
                                <div class="d-flex gap-2 justify-content-end mt-2">
                                    <img :src="Flo" alt="icon" style="width: 20px; height: 20px" />
                                    <img :src="Prof" alt="icon" style="width: 20px; height: 20px" />
                                    <img :src="Ima" alt="icon" style="width: 20px; height: 20px" />
                                </div>
                            </div>
                        </div>
                        <div class="card-section">
                            <div class="stat-card">
                                <small class="ca-details">Competitions</small>
                                <h3 class="number">{{ MemberCount }}</h3>
                            </div>
                            <div class="event-card">
                                <small class="ca-details">Next Competition</small>
                                <div class="row">
                                    <div class="col-md-5">
                                        <h3 class="number">{{ String(EventDay).padStart(2, 0) }}</h3>
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
                        <div class="col-md-8">
                            <section>
                                <div class="container">
                                    <div class="mt-4">
                                        <div class="d-flex justify-content-end">
                                            <button class="btn" id="edit" style="max-width: 240px; width: 240px; height: 40px;" @click="navigate">Export Competitions&nbsp;<i class="fa-solid fa-chevron-down text-xs text-gray-500 down notification-desktop" @click.stop.prevent="toggleDropdown"></i></button>
                                        </div>
                                        <div v-if="filteredCompetitions.length">
                                            <div v-for="competition in filteredCompetitions" :key="competition.id" class="custom-card mb-3 p-3">
                                                <div class="d-flex gap-3" style="flex: 1">
                                                    <img :src="competition.featured_image" alt="Competition Image" />
                                                    <div class="flex-grow-1 d-flex flex-column justify-content-between">
                                                        <div class="d-flex justify-content-between align-items-center">
                                                            <h5>{{ competition.name || 'Untitled Competition' }}</h5>
                                                            <div class="icon-container ms-3">
                                                                <img :src="Mess" alt="icon" style="width: 20px; height: 20px" />
                                                                <img :src="Cam" alt="icon" style="width: 20px; height: 20px" />
                                                                <img :src="Pro" alt="icon" style="width: 20px; height: 20px" />
                                                                <img :src="Cal" alt="icon" style="width: 20px; height: 20px" />
                                                            </div>
                                                        </div>
                                                        <p style="margin: 5px 0; font-size: 14px; columns: 2">
                                                            <strong style="color: red">Open:</strong>{{formatDate(competition.start_date)}}
                                                            <br />
                                                            <strong style="color: brown">Result:</strong> {{formatDate(competition.result_announcement_date)}}
                                                            <br />
                                                            <strong style="color: brown">Theme:</strong>{{competition.theme_id}}<br />
                                                            <strong style="color: red">Close:</strong>{{formatDate(competition.submission_deadline)}}
                                                            <br />
                                                            <strong style="color: brown">Max:</strong>{{competition.max_entries_print}}
                                                            <br />
                                                            <strong style="color: brown">Format:</strong> {{competition.allowed_image_formats}}
                                                        </p>
                                                        <p class="text-secondary" v-html=" competition.description || 'No description provided.'">
                                                        </p>
                                                        <div class="d-flex justify-content-between align-items-center mt-3 w-100">
                                                            <div class="button-group d-flex align-items-center gap-2">
                                                                <router-link :to="{ name: 'competitionsingle', params: { id: competition.id } }" custom v-slot="{ navigate }">
                                                                    <button class="btn me-2" id="view" @click="navigate">View</button>
                                                                </router-link>
                                                                <router-link :to="{ name: 'comp_edit', params: { id: competition.id } }" custom v-slot="{ navigate }">
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

                                        <div v-else class="text-center text-muted">No competitions found.</div>
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
                                        <RecentSubmissions />
                                        <MoreCompetitions style="height: auto" />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiClient from 'axios'
import { useCompetitionStore } from '@/stores/club_admin/CompetitionStore'
import NavigationRoute from "@/components/NavigationRoute.vue";
import HeaderRoute from "@/components/HeaderRoute.vue";
import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import RecentSubmissions from "@/partials/club_admin/competitions/RecentSubmissions.vue";
import MoreCompetitions from "@/partials/club_admin/competitions/MoreCompetitions.vue";
import Pro from "@/assets/icons/event_list/pro.svg"
import Cal from "@/assets/icons/event_list/cal.svg"
import Cam from "@/assets/icons/event_list/cam.svg"
import Mess from "@/assets/icons/event_list/mess.svg"
import Flo from "@/assets/icons/quick_comp/flower.svg"
import Ima from "@/assets/icons/quick_comp/image.svg"
import Fax from "@/assets/icons/quick_comp/fax.svg"
import Pri from "@/assets/icons/quick_comp/print.svg"
import Pai from "@/assets/icons/quick_comp/paint.svg"
import Prof from "@/assets/icons/quick_comp/profile.svg"
import Share from "@/assets/icons/event_list/share.svg"
import Book from "@/assets/icons/event_list/bookmark.svg"
import Loader from "@/components/LoaderAll.vue";

const {
    competitions,
    fetchCompetitions,
    memberCount,
    competitionCount,
    eventDay
} = useCompetitionStore()
const CompetitionCount = competitionCount
const MemberCount = memberCount
const EventDay = eventDay
const search = ref('')
const currentPage = ref(1)
const isLoading = ref(true);
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

const fetchSearchedCompetitions = debounce(async (query) => {
    if (query.length >= 3 && query !== lastSearched) {
        lastSearched = query
        try {
            const response = await apiClient.get('/competitions', {
                params: {
                    search_term: query
                }
            })
            const result = response?.data?.data?.original?.data || []
            competitions.value = result
            currentPage.value = 1
        } catch (error) {
            console.error('Error fetching searched competitions:', error)
            competitions.value = []
        }
    }
}, 400)

const loadCompetitions = async () => {
    isLoading.value = true
    try {
        await fetchCompetitions()
    } catch (error) {
        console.error("Error fetching competitions:", error)
    } finally {
        isLoading.value = false
    }
}

watch(search, (newSearch) => {
    if (newSearch.length >= 3) {
        fetchSearchedCompetitions(newSearch)
    } else {
        fetchCompetitions()
    }
})

onMounted(() => {
    loadCompetitions()
})

const filteredCompetitions = computed(() => {
    let filtered = competitions.value

    if (search.value.trim()) {
        filtered = filtered.filter(competition =>
            competition?.name?.toLowerCase().includes(search.value.toLowerCase())
        )
    }

    const start = (currentPage.value - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filtered.slice(start, end)
})

const totalPages = computed(() => {
    const count = competitions.value.filter(competition =>
        competition?.name?.toLowerCase().includes(search.value.toLowerCase())
    ).length
    return Math.max(Math.ceil(count / rowsPerPage), 1)
})

const formatDate = (date) => {
    const d = new Date(date)
    return isNaN(d) ? '' : d.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

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
