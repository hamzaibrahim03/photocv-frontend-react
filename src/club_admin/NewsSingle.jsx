<template>
<NavigationRoute />
<HeaderRoute title="Competitions" />
<div className="content">
    <section>
        <div className="container">
            <div className="dashboard-card">
                <ProfileWithoutSearch greeting="Planned and regular club competition" name="2024 - 2025 Season" role="Add new Competition" />
                <div className="card-section">
                    <div className="stat-card">
                        <small className="ca-details">Competitions</small>
                        <h3 className="number">{{ MemberCount }}</h3>
                    </div>
                    <div className="event-card">
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
        </div>
    </section>

    <div className="row">
        <div className="col-md-8">
            <section>
                <div className="container">
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
                                    <button className="btn" id="edit">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div className="col-md-4">
            <section>
                <div className="container" id="right">
                    <div className="cardddd" style="padding: 0; height: auto">
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
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useCompetitionStore } from '@/stores/club_admin/CompetitionStore'
import NavigationRoute from "@/components/NavigationRoute.vue"
import HeaderRoute from "@/components/HeaderRoute.vue"
import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import ProfileWithoutSearch from "@/partials/club_admin/competitionsadd/ProfileWithoutSearch.vue"
import RecentSubmissions from "@/partials/club_admin/competitions/RecentSubmissions.vue"
import MoreCompetitions from "@/partials/club_admin/competitions/MoreCompetitions.vue"

const route = useRoute()
const id = route.params.id

const { competitions, fetchCompetitions, memberCount, eventDay } = useCompetitionStore()

onMounted(() => {
    fetchCompetitions()
})

const competition = computed(() =>
    competitions.value.find(e => e.id == id) || {}
)

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

const MemberCount = memberCount
const EventDay = eventDay
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
 .cardddd {
     background: white;
     width: 100%;
     padding: 20px;
     height: 390px;
     border-radius: 10px;
     margin-bottom: 20px;
}
 .cardddd:first-child {
     background: white;
     width: 100%;
     padding: 20px;
     height: 390px;
     border-radius: 10px;
     margin-top: 20px;
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
     font-weight: 400;
     font-style: Regular;
     font-size: 20px;
     line-height: 100%;
     letter-spacing: 0%;
}
 #view {
     width: 100%;
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
     width: 100%;
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
 #new {
     width: 100%;
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
 .card {
     background: white;
     border-radius: 10px;
     flex: 1;
     width: 65%;
     height: auto;
     padding-bottom: 15px;
     border: none;
}
 .site-footer {
     padding: 15px 0;
     text-align: center;
     font-size: 14px;
     color: #99816b;
     bottom: 0;
     left: 0;
     width: 100%;
     position: relative;
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     line-height: 100%;
     letter-spacing: 0%;
}
 .ultrahead {
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     font-size: 72px;
     line-height: 20px;
     letter-spacing: 0%;
}
 .heading {
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     font-size: 36px;
     line-height: 100%;
     letter-spacing: 0%;
}
 .head {
     font-family: Inter;
     font-weight: 500;
     font-style: Medium;
     font-size: 24px;
     line-height: 100%;
     letter-spacing: 0%;
}
 .clubhead {
     font-family: Inter;
     font-weight: 600;
     font-style: Semi Bold;
     font-size: 20px;
     line-height: 100%;
     letter-spacing: 0%;
}
 .subhead {
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     font-size: 18px;
     line-height: 36px;
     letter-spacing: 0%;
}
 .memtext {
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     font-size: 16px;
     line-height: 100%;
     letter-spacing: 0%;
}
 .prehead {
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     font-size: 14px;
     line-height: 20px;
     letter-spacing: 0%;
}
 .galtext {
     font-family: Inter;
     font-weight: 400;
     font-size: 12px;
     line-height: 100%;
     letter-spacing: 0%;
}
 .event-img, .fallback-box {
     width: 100%;
     max-width: 50px;
     height: 50px;
     border-radius: 5px;
     object-fit: cover;
     background-color: #f0f0f0;
     box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
 .fallback-box {
     font-size: 14px;
     color: #888;
}
 .icon-circles .flickr-dots i, .flickr-dots i {
     font-size: 8px;
     padding-bottom: 8px;
     margin: 1px;
}
</style>
