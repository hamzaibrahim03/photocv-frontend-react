<template>
    <NavigationRoute />
    <HeaderRoute title="Competitions" />
    <section class="content">
        <div class="dashboard-card">
            <div class="profile-card">
                <div class="profile-left">
                    <div class="profile-info">
                        <small class="greeting">Planned and regular club competition</small>
                        <h2 class="name">2024 - 2025 Season</h2>
                    </div>
                </div>
                <div class="search-bar">
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
                <div class="event-card" style="width: 100%">
                    <small class="ca-details">Next Competition</small>
                    <div class="row">
                        <div class="col-md-5">
                            <h3 class="number">{{ EventDay }}</h3>
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
                    <div v-if="filteredCompetitions.length">
                        <div v-for="competition in filteredCompetitions" :key="competition.id" class="custom-card mb-3 p-3">
                        <div class="d-flex gap-3">
                            <img:src="competition.featured_image" alt="Competition Image" />
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5>{{ competition.name || 'Untitled Competition' }}</h5>
                                    <div class="icon-container">
                                        <i class="fas fa-comment-alt me-2"></i>
                                        <i class="fas fa-camera me-2"></i>
                                        <i class="fas fa-calendar-alt"></i>
                                    </div>
                                </div>
                                <p style="margin: 5px 0; font-size: 14px; columns: 2">
                                    <strong style="color: red">Open:</strong>{{ formatDate(competition.start_date)}}
                                    <br />
                                    <strong style="color: brown">Result:</strong> {{ formatDate(competition.result_announcement_date)}}
                                    <br />
                                    <strong style="color: brown">Theme:</strong>{{ competition.theme_id }}<br />
                                    <strong style="color: red">Close:</strong>{{ formatDate(competition.submission_deadline)}}
                                    <br />
                                    <strong style="color: brown">Max:</strong>{{ competition.max_entries_print }}
                                    <br />
                                    <strong style="color: brown">Format:</strong> {{ competition.allowed_image_formats }}
                                </p>
                                <p class="text-secondary">
                                    {{ competition.description || 'No description provided.' }}
                                </p>
                                <div>
                                    <router-link to="/competitionsingle" custom v-slot="{ navigate }">
                                        <button class="btn me-2" id="view" @click="navigate">View</button>
                                </router-link>
                                <router-link to="/comp_edit" custom v-slot="{ navigate }">
                                    <button class="btn me-2" id="edit" @click="navigate">Edit</button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center text-muted">No competitions found.</div>
        <nav v-if="filteredCompetitions.length">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{disabled: currentPage === 1 }">
                <button class="page-link" @click="prevPage">Previous</button>
        </li>
        <li class="page-item disabled">
            <span class="page-link">
                Page {{ currentPage }} of {{ totalPages }}
            </span>
        </li>
        <li class="page-item" :class="{disabled: currentPage === totalPages }">
        <button class="page-link" @click="nextPage">Next</button>
</li>
                    </ul >
                </nav >
            </div >
        </div >
    <div class="col-md-4">
        <div class="calen">
            <CalendarDashboard />
        </div>
        <div id="news">
            <RecentSubmissions />
            <MoreCompetitions />
        </div>
    </div>
    </div >
</section >
</template >

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiClient from 'axios'
import { useCompetitionStore } from '@/stores/club_admin/CompetitionStore'
import NavigationRoute from "@/components/NavigationRoute.vue";
import HeaderRoute from "@/components/HeaderRoute.vue";
import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import RecentSubmissions from "@/partials/club_admin/competitions/RecentSubmissions.vue";
import MoreCompetitions from "@/partials/club_admin/competitions/MoreCompetitions.vue";

const { competitions, fetchCompetitions, eventDay } = useCompetitionStore()
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

watch(search, (newSearch) => {
    if (newSearch.length >= 3) {
        fetchSearchedCompetitions(newSearch)
    } else {
        fetchCompetitions()
    }
})

onMounted(() => {
    fetchCompetitions()
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
