<template>
<NavigationRoute />
<HeaderRoute title="Events" />
<div class="content">
    <section>
        <div class="container">
            <div class="dashboard-card">
                <div class="profile-card">
                    <div class="profile-left">
                        <div class="profile-info">
                            <small class="greeting">Viewing event</small>
                            <h2 class="name">{{event.name}}</h2>
                            <p class="role">{{formattedStartDate}}</p>
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
                            <div id="news">
                                <div class="news-list">
                                    <div class="custom-card">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <img :src="event.featured_image_url" alt="Meeting" style="max-width: 300px; width: 300px; height: 250px" />
                                            </div>
                                            <div class="col-md-8">
                                                <div class="d-flex align-items-center justify-content-between">
                                                    <h5>{{event.name}}</h5>
                                                    <div class="icon-container ms-3">
                                                        <img :src="Mess" alt="icon" style="width: 20px; height: 20px" />
                                                        <img :src="Cam" alt="icon" style="width: 20px; height: 20px" />
                                                        <img :src="Pro" alt="icon" style="width: 20px; height: 20px" />
                                                        <img :src="Cal" alt="icon" style="width: 20px; height: 20px" />
                                                    </div>
                                                </div>
                                                <p class="date">{{formattedStartDate}}</p>
                                                <p class="text-secondary" v-html="event.description">
                                                </p>
                                            </div>
                                            <div class="divider3"></div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <h5 class="role">Event Duration</h5>
                                                </div>
                                                <div class="col-md-6">
                                                    <h5 class="namess">{{event.duration}}</h5>
                                                </div>
                                            </div>
                                            <div class="divider3"></div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <h5 class="role">Event Speaker</h5>
                                                </div>
                                                <div class="col-md-6">
                                                    <h5 class="namess">{{event.speaker}}</h5>
                                                </div>
                                            </div>
                                            <div class="divider3"></div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <h5 class="role">Event Speaker Club</h5>
                                                </div>
                                                <div class="col-md-6">
                                                    <h5 class="namess">{{event.speaker_club}}</h5>
                                                </div>
                                            </div>
                                            <div class="divider3"></div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <h5 class="role">Event Speaker Qualifications</h5>
                                                </div>
                                                <div class="col-md-6">
                                                    <h5 class="namess">{{event.speaker_qualification}}</h5>
                                                </div>
                                            </div>
                                            <div class="divider3"></div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <h5 class="role">Event Status</h5>
                                                </div>
                                                <div class="col-md-6">
                                                    <h5 class="namess">{{event.status}}</h5>
                                                </div>
                                            </div>
                                            <div class="divider3"></div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <h5 class="role">Gear Required</h5>
                                                </div>
                                                <div class="col-md-6">
                                                    <h5 class="namess">{{event.required_gear}}</h5>
                                                </div>
                                            </div>
                                            <div class="divider3"></div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <h5 class="role">Tags / Keywords Speaker</h5>
                                                </div>
                                                <div class="col-md-6">
                                                    <h5 class="namess">
                                                        {{event.tags_keywords}}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div class="divider3"></div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <h5 class="role">Link to related page</h5>
                                                </div>
                                                <div class="col-md-6">
                                                    <h5 class="namess">{{event.url}}</h5>
                                                </div>
                                            </div>
                                            <div class="divider3"></div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <h5 class="role">RSVP Detail</h5>
                                                </div>
                                                <div class="col-md-6">
                                                    <h5 class="namess">
                                                        {{event.rsvp_detail}}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <h5 class="namess">
                                                        <input type="checkbox" /> Dropbox upload
                                                    </h5>
                                                </div>
                                            </div>
                                            <div class="button-group">
                                                <button class="btn me-2" id="view">Back</button>
                                                <router-link :to="{ name: 'events_add', params: { id: event.id } }" custom v-slot="{ navigate }">
                                                    <button class="btn" id="edit" @click="navigate">Edit</button>
                                                </router-link>
                                            </div>
                                        </div>
                                    </div>
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

                                    <div class="button-group mt-auto">
                                        <router-link to="/notices" custom v-slot="{ navigate }">
                                            <button class="btn btn-sm" id="view" @click="navigate">View All</button>
                                        </router-link>
                                        <router-link to="/notice_single" custom v-slot="{ navigate }">
                                            <button class="btn btn-sm" id="new" @click="navigate">Add New</button>
                                        </router-link>
                                    </div>
                                </div>

                                <MoreEvents />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </section>
</div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useEventStore } from '@/stores/club_admin/EventStore'
import NavigationRoute from "@/components/NavigationRoute.vue"
import HeaderRoute from "@/components/HeaderRoute.vue"
import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import dayjs from 'dayjs'
import Pro from "@/assets/icons/event_list/pro.svg"
import Cal from "@/assets/icons/event_list/cal.svg"
import Cam from "@/assets/icons/event_list/cam.svg"
import Mess from "@/assets/icons/event_list/mess.svg"
import { useRoute } from 'vue-router';
import MoreEvents from '@/partials/club_admin/events/MoreEvents.vue'
import { useEventComments } from "@/stores/club_admin/EventComments";

const route = useRoute();
const id = route.params.id;

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
const EventDay = eventDay;
const MemberCount = memberCount
const event = computed(() =>
    events.value.find(e => e.id == id) || {}
)
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
const formattedStartDate = computed(() =>
    event.value?.event_date 
    ? dayjs(event.value.event_date).format('MMMM D, dddd')
    : ''
)

onMounted(() => {
    fetchEventComments();
    fetchEvents()
})
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
     padding: 20px 0px 40px;
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
 .left-header-container {
     display: flex;
     align-items: center;
     gap: 10px;
}
 .date {
     text-align: left 
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
