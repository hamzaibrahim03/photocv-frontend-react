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
        </div>
        <div class="card-section">
            <div class="event-card" style="width: 100%">
                <small class="ca-details">Next Competition</small>
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
            <div id="news">
                <div class="news-list">
                    <div class="form-containers">
                        <h5>Basic Information</h5>
                        <div class="row">
                            <div class="col-md-6">
                                <label class="role">Competition Name</label>
                                <h2 class="namess">{{competition.name}}</h2>
                            </div>
                            <div class="col-md-6">
                                <label class="role"> Competition Type </label>
                                <h2 class="namess">{{competition.competition_type_id}}</h2>
                            </div>
                        </div><br />

                        <div class="row">
                            <label class="role"> Competition Description </label>
                            <h2 class="namess">{{competition.description}}</h2>
                        </div><br />

                        <div class="row">
                            <div class="col-md-6">
                                <label class="role"> Judging Type </label>
                                <h2 class="namess">{{competition.judging_type_id}}</h2>
                            </div>
                        </div><br />

                        <div class="row">
                            <div class="col-md-6">
                                <label class="role"> Status </label>
                                <h2 class="namess">{{competition.status}}</h2>
                            </div>
                            <div class="col-md-6"></div>
                        </div><br /><br />

                        <h5>Submission Rules</h5><br />
                        <div class="row">
                            <div class="col-md-6">
                                <label class="role"> Start Date & Time </label>
                                <h2 class="namess">{{formattedStartDate}}</h2>
                            </div>
                            <div class="col-md-6">
                                <label class="role"> Deadlines for Submissions </label>
                                <h2 class="namess">{{formattedEndDate}}</h2>
                            </div>
                        </div><br />

                        <div class="row">
                            <div class="col-md-6">
                                <label class="role">Max Number of Entries Per Participant</label>
                                <h2 class="namess">{{competition.max_entries_print}}</h2>
                            </div>
                            <div class="col-md-6">
                                <label class="role"> Allowed Image Formats </label>
                                <h2 class="namess">{{competition.allowed_image_formats}}</h2>
                            </div>
                        </div><br />

                        <div class="row">
                            <div class="col-md-6">
                                <label class="role"> Max File Size </label>
                                <h2 class="namess">{{competition.max_file_size}}</h2>
                            </div>
                        </div><br /><br />

                        <h5>Categories and Themes</h5><br />
                        <div class="row">
                            <div class="col-md-6">
                                <label class="role"> Theme (If applicable) </label>
                                <h2 class="namess">{{competition.theme_id}}</h2>
                            </div>
                            <div class="col-md-6">
                                <label class="role"> Competition Categories </label>
                                <h2 class="namess">{{competition.category_id}}</h2>
                            </div>
                        </div><br />

                        <div class="row">
                            <div class="col-md-6">
                                <label class="role"> Print vs Digital Submission </label>
                                <h2 class="namess">{{competition.print_vs_digital}}</h2>
                            </div>
                            <div class="col-md-6">
                                <label class="role">Colour vs. Monochrome</label>
                                <h2 class="namess">{{competition.color_vs_mono}}</h2>
                            </div>
                        </div><br />

                        <h5>Judging and Scoring</h5>
                        <div class="row">
                            <div class="col-md-6">
                                <label class="role"> Judging Panels </label>
                                <h2 class="namess">{{competition.judging_panel}}</h2>
                            </div>
                        </div><br />

                        <div class="row">
                            <div class="col-md-6">
                                <label class="role"> Voting Method </label>
                                <h2 class="namess">{{competition.voting_method_id}}</h2>
                            </div>
                        </div><br /><br />

                        <h5>Results & Awards</h5><br />
                        <div class="row">
                            <div class="col-md-6">
                                <label class="role"> Announcement Date </label>
                                <h2 class="namess">{{formattedResultDate}}</h2>
                            </div>
                            <div class="col-md-6">
                                <label class="role"> Awards - Top Places Available </label>
                                <h2 class="namess">{{competition.top_places}}</h2>
                            </div>
                        </div><br />

                        <div class="row">
                            <div class="col-md-6">
                                <label class="role">Award - Number of High Commendations Available</label>
                                <h2 class="namess">{{competition.high_commendation_number}}</h2>
                            </div>
                            <div class="col-md-6">
                                <label class="role">Awards - Number of Commendations Available</label>
                                <h2 class="namess">{{competition.commendation_number}}</h2>
                            </div>
                        </div><br />

                        <div class="row">
                            <div class="col-md-6">
                                <label class="role"> Prizes (if any) </label>
                                <h2 class="namess">{{competition.prizes}}</h2>
                            </div>
                            <div class="col-md-6"></div>
                        </div><br />

                        <h2 class="role">Addtional Features</h2>
                        <h2 class="namess">
                            <input type="checkbox" />Comments & Critique Section (For Consecutive Purpose)
                        </h2>
                        <h2 class="namess">
                            <input type="checkbox" />Auto generated Certificates (For Winners & Participants)
                        </h2>
                        <h2 class="namess">
                            <input type="checkbox" />Allow Feedback from the judges to be visible to partcipants
                        </h2>
                        <div class="button-group">
                            <button class="btn me-2" id="view">Back</button>
                            <button class="btn" id="edit">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="calen">
                <CalendarDashboard />
            </div>
            <div id="news">
                <RecentSubmissions />
                <MoreCompetitions />
            </div>
        </div>
    </div>
</section>
</template>

<script>
import dayjs from 'dayjs'
import {
    onMounted,
    computed
} from 'vue'
import {
    useCompetitionStore
} from '@/stores/club_admin/CompetitionStore';
import NavigationRoute from "@/components/NavigationRoute.vue";
import HeaderRoute from "@/components/HeaderRoute.vue";
import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import RecentSubmissions from "@/partials/club_admin/competitions/RecentSubmissions.vue";
import MoreCompetitions from "@/partials/club_admin/competitions/MoreCompetitions.vue";

export default {
    name: "CompetitionSingle",
    components: {
        HeaderRoute,
        NavigationRoute,
        CalendarDashboard,
        RecentSubmissions,
        MoreCompetitions,
    },
    setup() {
        const {
            competitions,
            fetchCompetitions,
            memberCount,
            eventDay
        } = useCompetitionStore()
        const formattedStartDate = computed(() =>
            competition.value?.start_date ?
            dayjs(competition.value.start_date).format('MMMM D, YYYY h:mm A') :
            ''
        )
        const formattedEndDate = computed(() =>
            competition.value?.submission_deadline ?
            dayjs(competition.value.submission_deadline).format('MMMM D, YYYY h:mm A') :
            ''
        )
        const formattedResultDate = computed(() =>
            competition.value?.result_announcement_date ?
            dayjs(competition.value.result_announcement_date).format('MMMM D, YYYY h:mm A') :
            ''
        )

        onMounted(() => {
            fetchCompetitions()
        })

        const competition = computed(() => competitions.value[0] || {})

        return {
            competition,
            MemberCount: memberCount,
            EventDay: eventDay,
            formattedStartDate,
            formattedEndDate,
            formattedResultDate
        }
    }
}
</script>

<style scoped>
.calen {
     margin-top: 15px;
}
</style>
