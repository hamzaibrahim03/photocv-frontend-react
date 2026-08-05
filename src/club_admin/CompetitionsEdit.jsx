<template>
<NavigationRoute />
<HeaderRoute title="Competitions" />
<div class="content">
    <section>
        <div class="container">
            <div class="dashboard-card">
                <div class="profile-card">
                    <div class="profile-left">
                        <div class="profile-info">
                            <small class="greeting">Planned and Regular Club Competition</small>
                            <h2 class="name">2024 - 2025 Season</h2>
                            <small class="role">{{ CompetitionCount }} Competitions to go</small>
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
            <div id="news">
                <div class="news-list">
                    <div class="form-containers">
                        <form @submit.prevent="submitForm">
                            <h5>Basic Information</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <label> Competition Name </label>
                                    <input type="text" v-model="name" class="form-control" />
                                </div>
                                <div class="col-md-6">
                                    <label> Competition Type </label>
                                    <input type="number" v-model="competition_type_id" class="form-control" />
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <label> Competition Description </label>
                            <textarea class="form-control" v-model="description" style="height: 250px"></textarea>
                            <div class="divider3"></div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label> Judging Type </label>
                                    <select class="form-control">
                                        <option></option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label> Assign Judge </label>
                                    <select class="form-control">
                                        <option></option>
                                        <option>Ammar</option>
                                        <option>Sohaib</option>
                                        <option>Kamran</option>
                                        <option>Sarfraz</option>
                                    </select>
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <label for="event_status">Status</label>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-control">
                                                <input type="radio" name="status" value="scheduled" ref="statusscheduled" class="icheck-status" />&nbsp;
                                                <span>scheduled</span>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-control">
                                                <input type="radio" name="status" value="draft" ref="statusdraft" class="icheck-status" />&nbsp;
                                                <span>draft</span>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-control">
                                                <input type="radio" name="status" value="postponed" ref="statuspostponed" class="icheck-status" />&nbsp;
                                                <span>postponed</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-control">
                                                <input type="radio" name="status" value="cancelled" ref="statuscancelled" class="icheck-status" />&nbsp;
                                                <span>cancelled</span>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-control">
                                                <input type="radio" name="status" value="completed" ref="statuscompleted" class="icheck-status" />&nbsp;
                                                <span>completed</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <h5>Submission Rules</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <label> Start Date & Time </label>
                                    <input type="date" class="form-control" v-model="start_date" />
                                </div>
                                <div class="col-md-6">
                                    <label> Deadlines for Submissions </label>
                                    <input type="date" class="form-control" v-model="submission_deadline" />
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label> Max Number of PDI Entries Per Participant </label>
                                    <input type="number" v-model="max_entries_digital" class="form-control" />
                                </div>
                                <div class="col-md-6">
                                    <label> Max Number of PRINT Per Participant </label>
                                    <input type="number" v-model="max_entries_print" class="form-control" />
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label> Max File Size </label>
                                    <input type="number" v-model="max_file_size" class="form-control" />
                                </div>
                                <div class="col-md-6">
                                    <label> Allowed Image Formats </label>
                                    <select name="formats" id="formats" v-model="allowed_image_formats" class="form-control">
                                        <option value="Allowed Image Formats" disabled selected>
                                            Allowed Image Formats
                                        </option>
                                        <option value="active">Active</option>
                                        <option value="enable">Enable</option>
                                        <option value="diactive">Diactive</option>
                                        <option value="disable">Disable</option>
                                    </select>
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <h5>Categories and Themes</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <label> Theme (If applicable) </label>
                                    <input type="number" v-model="theme_id" class="form-control" />
                                </div>
                                <div class="col-md-6">
                                    <label> Competition Categories </label>
                                    <input type="number" v-model="category_id" class="form-control" />
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label> Print vs Digital Submission </label>
                                    <select name="theme" id="theme" v-model="print_vs_digital" class="form-control">
                                        <option value="Themes" disabled selected>print_vs_digital</option>
                                        <option value="print">Print</option>
                                        <option value="digital">Digital</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label> Colour vs. Monochrome (Any restrictions) </label>
                                    <select name="theme" id="theme" v-model="color_vs_mono" class="form-control">
                                        <option value="Themes" disabled selected>color_vs_mono</option>
                                        <option value="color">Color</option>
                                        <option value="monochrome">Monochrome</option>\
                                    </select>
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <h5>Judging and Scoring</h5>
                            <label> Judging Panels </label>
                            <textarea class="form-control" v-model="judging_panel"></textarea>
                            <div class="divider3"></div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label> Voting Method </label>
                                    <input type="number" v-model="voting_method_id" class="form-control" />
                                </div>
                                <div class="col-md-6"></div>
                            </div>
                            <div class="divider3"></div>

                            <h5>Results & Awards</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <label> Announcement Date </label>
                                    <input type="date" v-model="result_announcement_date" class="form-control" />
                                </div>
                                <div class="col-md-6">
                                    <label> Awards - Top Places Available </label>
                                    <input type="text" v-model="top_places" class="form-control" />
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label> Award - No. of High Commendations Available </label>
                                    <input type="number" v-model="high_commendation_number" class="form-control" />
                                </div>
                                <div class="col-md-6">
                                    <label> Awards - Number of Commendations Available </label>
                                    <input type="number" v-model="commendation_number" class="form-control" />
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label> Prizes (if any) </label>
                                    <textarea class="form-control" v-model="prizes"></textarea>
                                </div>
                                <div class="col-md-6"></div>
                            </div>
                            <div class="divider3"></div>
                            <div class="divider3"></div>
                            <div class="divider3"></div>
                            <div class="divider3"></div>

                            <h5>Addtional Features</h5>
                            <div>
                                <p>
                                    <input type="checkbox" />
                                    Comments & Critique Section (For Consecutive Purpose)
                                </p>
                                <p>
                                    <input type="checkbox" />
                                    Auto generated Certificates (For Winners & Participants)
                                </p>
                                <p>
                                    <input type="checkbox" />
                                    Allow Feedback from the judges to be visible to partcipants
                                </p>
                            </div>
                            <div class="button-group">
                                <button class="btn me-2" id="view">Back</button>
                                <button class="btn" id="edit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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
                        <GlobalSettings style="height: auto" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>
</template>

<script setup>
import NavigationRoute from "@/components/NavigationRoute.vue";
import HeaderRoute from "@/components/HeaderRoute.vue";
import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import RecentSubmissions from "@/partials/club_admin/competitions/RecentSubmissions.vue";
import MoreCompetitions from "@/partials/club_admin/competitions/MoreCompetitions.vue";
import GlobalSettings from "@/partials/club_admin/competitionsadd/GlobalSettings.vue";
import { useCompetitionStore } from '@/stores/club_admin/CompetitionStore'
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/api/axios";
/* global $ */

const route = useRoute();
const router = useRouter();

const name = ref("");
const competition_type_id = ref("");
const description = ref("");
const judging_type_id = ref("");
const status = ref("");
const start_date = ref("");
const submission_deadline = ref("");
const max_entries_digital = ref("");
const max_entries_print = ref("");
const max_file_size = ref("");
const allowed_image_formats = ref("");
const theme_id = ref("");
const category_id = ref("");
const print_vs_digital = ref("");
const color_vs_mono = ref("");
const judging_panel = ref("");
const voting_method_id = ref("");
const result_announcement_date = ref("");
const top_places = ref("");
const high_commendation_number = ref("");
const commendation_number = ref("");
const prizes = ref("");

const {
    fetchCompetitions,
    memberCount,
    competitionCount,
    eventDay
} = useCompetitionStore()
const CompetitionCount = competitionCount
const MemberCount = memberCount
const EventDay = eventDay

const submitForm = async () => {
    const payload = {
        name: name.value,
        competition_type_id: competition_type_id.value,
        judging_type_id: judging_type_id.value,
        status: status.value,
        description: description.value,
        start_date: start_date.value,
        submission_deadline: submission_deadline.value,
        max_entries_digital: max_entries_digital.value,
        max_entries_print: max_entries_print.value,
        max_file_size: max_file_size.value,
        allowed_image_formats: allowed_image_formats.value,
        theme_id: theme_id.value,
        category_id: category_id.value,
        print_vs_digital: print_vs_digital.value,
        color_vs_mono: color_vs_mono.value,
        judging_panel: judging_panel.value,
        voting_method_id: voting_method_id.value,
        result_announcement_date: result_announcement_date.value,
        top_places: top_places.value,
        high_commendation_number: high_commendation_number.value,
        commendation_number: commendation_number.value,
        prizes: prizes.value,
    };

    const competitionId = route.params.id;

    try {
        if (competitionId) {
            await apiClient.put(`/competitions/${competitionId}`, payload);
        } else {
            await apiClient.post(`/competitions`, payload);
        }

        alert("Competition saved successfully!");
        router.push("/competitions");
    } catch (error) {
        console.error("Error submitting competition:", error);
    }
};

const fetchFormData = async (id) => {
    try {
        const response = await apiClient.get(`/competitions/${id}`);
        const data = response?.data?.data || {};

        name.value = data.name || "";
        competition_type_id.value = data.competition_type_id || "";
        description.value = data.description || "";
        judging_type_id.value = data.judging_type_id || "";
        status.value = data.status || "";

        const rawStart = data.start_date;
        const rawDeadline = data.submission_deadline;
        const rawResult = data.result_announcement_date;

        start_date.value = rawStart ? rawStart.substring(0, 10) : "";
        submission_deadline.value = rawDeadline ? rawDeadline.substring(0, 10) : "";
        result_announcement_date.value = rawResult ? rawResult.substring(0, 10) : "";

        max_entries_digital.value = data.max_entries_digital || "";
        max_entries_print.value = data.max_entries_print || "";
        max_file_size.value = data.max_file_size || "";
        allowed_image_formats.value = data.allowed_image_formats || "";
        theme_id.value = data.theme_id || "";
        category_id.value = data.category_id || "";
        print_vs_digital.value = data.print_vs_digital || "";
        color_vs_mono.value = data.color_vs_mono || "";
        judging_panel.value = data.judging_panel || "";
        voting_method_id.value = data.voting_method_id || "";
        top_places.value = data.top_places || "";
        high_commendation_number.value = data.high_commendation_number || "";
        commendation_number.value = data.commendation_number || "";
        prizes.value = data.prizes || "";

        console.log("Populated fields:", data);
    } catch (error) {
        console.error("Error fetching competition by ID:", error);
    }
};

onMounted(() => {
    fetchCompetitions();
    const competitionId = route.params.id;
    if (competitionId) {
        fetchFormData(competitionId);
    }

    setTimeout(() => {
        $(".icheck-status").on("ifChecked", (event) => {
            status.value = event.target.value;
        });
    }, 0);
});

watch(status, (newVal) => {
    setTimeout(() => {
        $(".icheck-status").iCheck("uncheck");
        $(`.icheck-status[value="${newVal}"]`).iCheck("check");
    }, 0);
});
</script>

<style scoped>
.form-control {
     height: 50px;
     font-size: 16.61px;
     font-weight: 400;
     padding: 12px;
     border-radius: 5px;
     color: #4C4036;
     border: 1.04px solid #99816B;
}
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
     padding: 20px 0px;
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
