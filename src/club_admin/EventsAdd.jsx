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
                            <small class="greeting">Viewing Event</small>
                            <h2 class="name">{{name}}</h2>
                            <p class="role">{{EventCount}} Events to go</p>
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

    <div class="row">
        <div class="col-md-8">
            <div id="news">
                <div class="news-list">
                    <div class="form-containers">
                        <form @submit.prevent="submitForm">
                            <div class="row">
                                <div class="col-md-4">
                                    <img :src="featured_thumb_url" alt="Meeting" />
                                </div>
                                <div class="col-md-8 mb-3">
                                    <label for="names"> Event Name </label>
                                    <input type="text" v-model="name" class="form-control" />
                                    <div class="divider3"></div>
                                    <label for="date"> Event Date </label>
                                    <input type="date" v-model="event_date" class="form-control" />
                                </div>
                            </div>
                            <div class="divider3"></div>
                            <div class="row" style=" background-color: #99816b33; margin-top: 15px; border-radius: 7px; padding: 10px; margin-left: 2px;">
                                <h5>Event Description</h5>
                                <textarea v-model="description" style="border: none; background-color: transparent;">
                                </textarea>
                            </div>
                            <div class="divider3"></div>
                            <div class="row">
                                <div class="col-md-6">
                                    <label for="kind"> Event Kind </label>
                                    <input type="number" class="form-control" v-model="event_kind_id" />
                                </div>
                                <div class="col-md-6">
                                    <label for="type"> Event Type </label>
                                    <input type="number" class="form-control" v-model="event_type_id" />
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label for="duration"> Event Duration </label>
                                    <input type="text" v-model="duration" class="form-control" />
                                </div>
                                <div class="col-md-6">
                                    <label for="Speaker"> Event Speaker </label>
                                    <input type="text" v-model="speaker" class="form-control" />
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label for="club"> Event Speaker Club </label>
                                    <input type="text" v-model="speaker_club" class="form-control" />
                                </div>
                                <div class="col-md-6">
                                    <label for="Qualifications">
                                        Event Speaker Qualifications
                                    </label>
                                    <input type="text" v-model="speaker_qualification" class="form-control" />
                                </div>
                            </div>
                            <div class="divider3"></div>
                            <label for="event_status">Event Status</label>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-control">
                                                <input type="radio" name="status" value="scheduled" ref="statusscheduled" v-model="status" class="icheck-status" />&nbsp;
                                                <span>Schdule</span>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-control">
                                                <input type="radio" name="status" value="draft" ref="statusdraft" v-model="status" class="icheck-status" />&nbsp;
                                                <span>Draft</span>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-control">
                                                <input type="radio" name="status" value="tbc" ref="statustbc" v-model="status" class="icheck-status" />&nbsp;
                                                <span>TBC</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-control">
                                                <input type="radio" name="status" value="cancelled" ref="statuscancelled" v-model="status" class="icheck-status" />&nbsp;
                                                <span>Cancelled</span>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-control">
                                                <input type="radio" name="status" value="completed" ref="statuscompleted" v-model="status" class="icheck-status" />&nbsp;
                                                <span>Completed</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="divider3"></div>

                            <label for="gear"> Gear Required </label>
                            <input type="text" v-model="required_gear" class="form-control" />

                            <div class="container col-md-12 mb-3">
                                <label for="tags">Tags/Keywords</label>
                                <div class="tag-dropdown" @click="toggleDropdown">
                                    <div id="tagContainer" class="d-flex flex-wrap">
                                        <div v-for="(tag, index) in selectedTags" :key="index" class="tag">
                                            {{ tag }}
                                            <button @click.stop="removeTag(index)">✖</button>
                                        </div>
                                    </div>
                                    <input type="text" v-model="searchInput" placeholder="Search..." class="sea" @focus="showDropdown = true" />
                                </div>
                                <div class="dropdown" v-if="showDropdown">
                                    <ul class="dropdown-menu show">
                                        <li v-if="filteredTags.length === 0" style="color: gray">
                                            No results found
                                        </li>
                                        <li v-for="(tag, index) in filteredTags" :key="index" @click="addTag(tag)">
                                            {{ tag }}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div class="divider3"></div>
                            <label for="link"> Link to related Page </label>
                            <input type="url" v-model="url" class="form-control" />
                            <div class="divider3"></div>
                            <label for="RSVP"> RSVP Details </label>
                            <textarea class="form-control" v-model="rsvp_detail"></textarea>

                            <div class="divider3"></div>
                            <div class="row">
                                <div class="col-md-6">
                                    <label for="imageUpload">
                                        Image to be chosen <small>(max 4)</small>
                                    </label>
                                    <input type="file" id="imageUpload" class="form-control" accept="image/*" @change="handleImageUpload" :disabled="images.length >= 4" multiple />
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-12 d-flex gap-3 flex-wrap">
                                    <div v-for="(img, index) in images" :key="index" class="image-card">
                                        <button class="close-btn" @click="removeImage(index)">×</button>
                                        <img :src="img" class="preview-image" />
                                        <textarea class="caption-box" v-model="captions[index]" placeholder="Add caption..."></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4">
                                <label for="attachmentUpload">Attachments (docs only)</label>
                                <input type="file" id="attachmentUpload" class="form-control" accept=".pdf,.doc,.docx,.txt,.zip,.ppt,.pptx" @change="handleAttachmentUpload" :disabled="attachments.length >= 4" multiple />
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-12 d-flex gap-3 flex-wrap">
                                    <div v-for="(file, index) in attachments" :key="'att-' + index" class="attachment-box position-relative">
                                        <div class="file-icon">📄</div>
                                        <small class="file-name">{{ file.name }}</small>

                                        <button class="remove-btn" @click="removeAttachment(index)">✖</button>
                                    </div>
                                </div>
                            </div>

                            <div class="divider3"></div>

                            <p><input type="checkbox" />&nbsp;&nbsp;Enable Dropbox uploads</p>
                            <div class="button-group">
                                <button class="btn me-2" id="view">Back</button>
                                <button type="submit" class="btn" id="edit">Save</button>
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

                        <MoreEvents style="height: auto" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/api/axios";
import { useEventStore } from '@/stores/club_admin/EventStore'
import NavigationRoute from "@/components/NavigationRoute.vue";
import HeaderRoute from "@/components/HeaderRoute.vue";
import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import MoreEvents from '@/partials/club_admin/events/MoreEvents.vue'
import { useEventComments } from "@/stores/club_admin/EventComments";
/* global $ */

const route = useRoute();
const router = useRouter();

const selectedTags = ref([]);
const attachments = ref([]);

const allTags = ref([
    "Urgent",
    "Meeting",
    "Reminder",
    "Policy Update",
    "Holiday Notice",
    "Exam Schedule",
]);

const searchInput = ref("");
const showDropdown = ref(false);

const images = ref([]);
const captions = ref([]);
const showLightbox = ref(false);

const featured_thumb_url = ref("");
const name = ref("");
const event_date = ref("");
const event_kind_id = ref("");
const event_type_id = ref("");
const description = ref("");
const duration = ref("");
const speaker = ref("");
const speaker_club = ref("");
const speaker_qualification = ref("");
const status = ref("");
const required_gear = ref("");
const url = ref("");
const rsvp_detail = ref("");
const tags_keywords = ref("");

const {
    memberCount,
    eventCount,
    fetchEvents,
    eventDay
} = useEventStore()
const {
    eventcomments,
    fetchEventComments
} = useEventComments();
const MemberCount = memberCount
const EventDay = eventDay
const EventCount = eventCount

const filteredTags = computed(() => {
    const query = searchInput.value.toLowerCase();
    return allTags.value.filter(
        (tag) =>
        tag.toLowerCase().includes(query) &&
        !selectedTags.value.includes(tag)
    );
});

const submitForm = async () => {
    const payload = {
        featured_thumb_url: featured_thumb_url.value,
        name: name.value,
        event_date: event_date.value,
        event_type_id: event_type_id.value,
        event_kind_id: event_kind_id.value,
        description: description.value,
        duration: duration.value,
        status: status.value,
        speaker: speaker.value,
        speaker_club: speaker_club.value,
        speaker_qualification: speaker_qualification.value,
        required_gear: required_gear.value,
        url: url.value,
        rsvp_detail: rsvp_detail.value,
        tags_keywords: tags_keywords.value,
    };

    const eventId = route.params.id;

    try {
        if (eventId) {
            await apiClient.put(`/events/${eventId}`, payload);
        } else {
            await apiClient.post(`/events`, payload);
        }

        alert("Event saved successfully!");
        router.push("/event");
    } catch (error) {
        console.error("Error submitting event:", error);
    }
};

const fetchEvent = async (id) => {
    try {
        const response = await apiClient.get(`/events/${id}`);
        const data = response?.data?.data || {};

        const rawDate = data.event_date;

        featured_thumb_url.value = data.featured_thumb_url || "";
        name.value = data.name || "";
        event_date.value = rawDate ? rawDate.substring(0, 10) : "";
        event_kind_id.value = data.event_kind_id || "";
        event_type_id.value = data.event_type_id || "";
        description.value = data.description || "";
        duration.value = data.duration || "";
        speaker.value = data.speaker || "";
        speaker_club.value = data.speaker_club || "";
        speaker_qualification.value = data.speaker_qualification || "";
        status.value = data.status || "";
        required_gear.value = data.required_gear || "";
        url.value = data.url || "";
        rsvp_detail.value = data.rsvp_detail || "";
        tags_keywords.value = data.tags_keywords || "";

        console.log("Populated fields:", data);
    } catch (error) {
        console.error("Error fetching event by ID:", error);
    }
};

const addTag = (tag) => {
    if (!selectedTags.value.includes(tag)) {
        selectedTags.value.push(tag);
        searchInput.value = "";
    }
};

const removeTag = (index) => {
    selectedTags.value.splice(index, 1);
};

const toggleDropdown = () => {
    showDropdown.value = true;
};

const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    if (images.value.length + files.length > 4) {
        alert("You can upload a maximum of 4 images.");
        event.target.value = "";
        return;
    }

    files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            images.value.push(e.target.result);
            captions.value.push("");
        };
        reader.readAsDataURL(file);
    });

    event.target.value = "";
};

const removeImage = (index) => {
    images.value.splice(index, 1);
    captions.value.splice(index, 1);
};

const handleAttachmentUpload = (event) => {
    const files = Array.from(event.target.files);

    if (attachments.value.length + files.length > 4) {
        alert("You can upload a maximum of 4 attachments.");
        event.target.value = "";
        return;
    }

    files.forEach((file) => attachments.value.push(file));

    event.target.value = "";
};

const removeAttachment = (index) => {
    attachments.value.splice(index, 1);
};

const handleClickOutside = (event) => {
    const imageWrapper = document.querySelector("#imageWrapper");
    const modal = document.querySelector(".lightbox-modal");

    if (imageWrapper && modal) {
        if (!imageWrapper.contains(event.target) && !modal.contains(event.target)) {
            showLightbox.value = false;
        }
    } else {
        showLightbox.value = false;
    }
};
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
onMounted(() => {
    fetchEventComments();
    fetchEvents()
    const eventId = route.params.id;
    if (eventId) {
        fetchEvent(eventId);
    }

    setTimeout(() => {
        $(".icheck-status").on("ifChecked", (event) => {
            status.value = event.target.value;
        });
    }, 0);

    document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});

watch(status, (newVal) => {
    setTimeout(() => {
        $(".icheck-status").iCheck("uncheck");
        $(`.icheck-status[value="${newVal}"]`).iCheck("check");
    }, 0);
});
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
 #news {
     width: 100%;
     margin-left: 10px;
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
 .form-control {
     height: 50px;
     font-size: 16.61px;
     font-weight: 400;
     padding: 12px;
     border-radius: 5px;
     color: #4C4036;
     border: 1.04px solid #99816B;
}
 .image-card {
     position: relative;
     background: #f5ede7;
     border-radius: 12px;
     padding: 15px;
     width: 100%;
     max-width: 400px;
     margin-bottom: 20px;
}
 .preview-image {
     width: 100%;
     border-radius: 10px;
     object-fit: cover;
}
 .caption-box {
     width: 100%;
     margin-top: 10px;
     padding: 12px;
     border: 1px solid #d9d9d9;
     border-radius: 8px;
     font-size: 14px;
     resize: none;
     height: 70px;
     outline: none;
}
 .caption-box:focus {
     border-color: #c3b2a6;
}
 .close-btn {
     position: absolute;
     top: 8px;
     right: 10px;
     background: #d9534f;
     border: none;
     color: white;
     font-size: 20px;
     font-weight: bold;
     padding: 2px 8px;
     border-radius: 50%;
     cursor: pointer;
     line-height: 18px;
}
 .close-btn:hover {
     background: #c9302c;
}
 .attachment-box {
     width: 60px;
     height: 60px;
     background: #ece8e3;
     border-radius: 6px;
     padding: 5px;
     text-align: center;
}
 .file-icon {
     font-size: 26px;
}
 .file-name {
     font-size: 10px;
     display: block;
     margin-top: 2px;
     text-overflow: ellipsis;
     overflow: hidden;
     width: 100%;
     white-space: nowrap;
}
 .remove-btn {
     position: absolute;
     top: -6px;
     right: -6px;
     background: red;
     color: white;
     border: none;
     border-radius: 50%;
     font-size: 12px;
     width: 20px;
     height: 20px;
}
</style>
