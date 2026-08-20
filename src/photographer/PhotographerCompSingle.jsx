<template>
<NavigationRoute />
<HeaderRoute title="Competitions" />
<section className="content">
    <div className="dashboard-card">
        <div className="profile-card">
            <div className="profile-left">
                <div className="profile-info">
                    <small className="greeting">Planned and regular club competition</small>
                    <h2 className="name">2024 - 2025 Season</h2>
                </div>
            </div>
        </div>
        <div className="card-section">
            <div className="event-card" style="width: 100%">
                <small className="ca-details">Next Competition</small>
                <div className="row">
                    <div className="col-md-5">
                        <h3 className="number">{{EventDay}}</h3>
                    </div>
                    <div className="days col-md-7">
                        <span>days to go</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="row">
        <div className="col-md-8">
            <div id="news">
                <div className="news-list">
                    <div className="form-containers">
                        <h5>Basic Information</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <label className="role">Competition Name</label>
                                <h2 className="namess">{{competition.name}}</h2>
                            </div>
                            <div className="col-md-6">
                                <label className="role"> Competition Type </label>
                                <h2 className="namess">{{competition.competition_type_id}}</h2>
                            </div>
                        </div><br />

                        <div className="row">
                            <label className="role"> Competition Description </label>
                            <h2 className="namess">{{competition.description}}</h2>
                        </div><br />

                        <div className="row">
                            <div className="col-md-6">
                                <label className="role"> Judging Type </label>
                                <h2 className="namess">{{competition.judging_type_id}}</h2>
                            </div>
                        </div><br />

                        <div className="row">
                            <div className="col-md-6">
                                <label className="role"> Status </label>
                                <h2 className="namess">{{competition.status}}</h2>
                            </div>
                            <div className="col-md-6"></div>
                        </div><br /><br />

                        <h5>Submission Rules</h5><br />
                        <div className="row">
                            <div className="col-md-6">
                                <label className="role"> Start Date & Time </label>
                                <h2 className="namess">{{formattedStartDate}}</h2>
                            </div>
                            <div className="col-md-6">
                                <label className="role"> Deadlines for Submissions </label>
                                <h2 className="namess">{{formattedEndDate}}</h2>
                            </div>
                        </div><br />

                        <div className="row">
                            <div className="col-md-6">
                                <label className="role">Max Number of Entries Per Participant</label>
                                <h2 className="namess">{{competition.max_entries_print}}</h2>
                            </div>
                            <div className="col-md-6">
                                <label className="role"> Allowed Image Formats </label>
                                <h2 className="namess">{{competition.allowed_image_formats}}</h2>
                            </div>
                        </div><br />

                        <div className="row">
                            <div className="col-md-6">
                                <label className="role"> Max File Size </label>
                                <h2 className="namess">{{competition.max_file_size}}</h2>
                            </div>
                        </div><br /><br />

                        <h5>Categories and Themes</h5><br />
                        <div className="row">
                            <div className="col-md-6">
                                <label className="role"> Theme (If applicable) </label>
                                <h2 className="namess">{{competition.theme_id}}</h2>
                            </div>
                            <div className="col-md-6">
                                <label className="role"> Competition Categories </label>
                                <h2 className="namess">{{competition.category_id}}</h2>
                            </div>
                        </div><br />

                        <div className="row">
                            <div className="col-md-6">
                                <label className="role"> Print vs Digital Submission </label>
                                <h2 className="namess">{{competition.print_vs_digital}}</h2>
                            </div>
                            <div className="col-md-6">
                                <label className="role">Colour vs. Monochrome</label>
                                <h2 className="namess">{{competition.color_vs_mono}}</h2>
                            </div>
                        </div><br />

                        <h5>Judging and Scoring</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <label className="role"> Judging Panels </label>
                                <h2 className="namess">{{competition.judging_panel}}</h2>
                            </div>
                        </div><br />

                        <div className="row">
                            <div className="col-md-6">
                                <label className="role"> Voting Method </label>
                                <h2 className="namess">{{competition.voting_method_id}}</h2>
                            </div>
                        </div><br /><br />

                        <h5>Results & Awards</h5><br />
                        <div className="row">
                            <div className="col-md-6">
                                <label className="role"> Announcement Date </label>
                                <h2 className="namess">{{formattedResultDate}}</h2>
                            </div>
                            <div className="col-md-6">
                                <label className="role"> Awards - Top Places Available </label>
                                <h2 className="namess">{{competition.top_places}}</h2>
                            </div>
                        </div><br />

                        <div className="row">
                            <div className="col-md-6">
                                <label className="role">Award - Number of High Commendations Available</label>
                                <h2 className="namess">{{competition.high_commendation_number}}</h2>
                            </div>
                            <div className="col-md-6">
                                <label className="role">Awards - Number of Commendations Available</label>
                                <h2 className="namess">{{competition.commendation_number}}</h2>
                            </div>
                        </div><br />

                        <div className="row">
                            <div className="col-md-6">
                                <label className="role"> Prizes (if any) </label>
                                <h2 className="namess">{{competition.prizes}}</h2>
                            </div>
                            <div className="col-md-6"></div>
                        </div><br />

                        <h2 className="role">Addtional Features</h2>
                        <h2 className="namess">
                            <input type="checkbox" />Comments & Critique Section (For Consecutive Purpose)
                        </h2>
                        <h2 className="namess">
                            <input type="checkbox" />Auto generated Certificates (For Winners & Participants)
                        </h2>
                        <h2 className="namess">
                            <input type="checkbox" />Allow Feedback from the judges to be visible to partcipants
                        </h2>
                        <div className="button-group">
                            <button className="btn me-2" id="view">Back</button>
                            <button className="btn" id="edit">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="calen">
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
