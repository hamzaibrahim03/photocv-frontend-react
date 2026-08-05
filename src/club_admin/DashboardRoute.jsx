<template>
<div :style="{ backgroundColor: 'white' }">
    <Loader :show="isLoading" />
    <div v-if="!isLoading">
        <NavigationRoute />
        <HeaderRoute />

        <div class="content">
            <section>
                <div class="container">
                    <div class="dashboard-card" id="cl">
                        <div class="profile-card">
                            <div class="profile-left">
                                <img class="img-fluid" :src="dashboardData?.data?.user_details?.profile_image" alt="Profile Picture" />
                                <div class="profile-info">
                                    <span class="greeting">
                                        {{ greetingMessage }}
                                    </span>
                                    <h2 class="name">
                                        {{ dashboardData?.data?.user_details?.first_name + " " + dashboardData?.data?.user_details?.last_name }}
                                    </h2>
                                    <p class="role">
                                        {{ dashboardData?.data?.user_details?.role }}
                                    </p>
                                </div>
                            </div>
                            <div class="profile-icons">
                                <div class="icon">
                                    <span>20</span>
                                    <img :src="Image" alt="image-icon"/>
                                </div>
                                <div class="icon">
                                    <span>53</span>
                                    <img :src="Comment" alt="comment-icon"/>
                                </div>
                                <div class="icon">
                                    <span>39</span>
                                    <img :src="Point" alt="point-icon"/>
                                </div>
                            </div>
                        </div>

                        <div class="card-section">
                            <div class="stat-card">
                                <small class="ca-details">Members</small>
                                <h3 class="number">{{ memberCount }}</h3>
                            </div>

                            <div class="event-cards">
                                <small class="ca-details">Next Event</small>
                                <div class="row">
                                    <div class="col-md-5">
                                        <h3 class="number">{{ remainingDays }}</h3>
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
                    <div class="upcoming-sections">
                        <div class="event-card d-flex flex-column">
                            <h5 class="head">Upcoming Events</h5>

                            <div class="event-list" v-if="upcomingEvents.length">
                                <div class="event-item" v-for="event in upcomingEvents" :key="event.id || index" style="margin-bottom: 10px">
                                    <img v-if="event.featured_image_url" class="img-fluid event-img" :src="event.featured_image_url" alt="Event" @error="event.featured_image_url = null" />
                                    <div v-else class="event-img fallback-box d-flex justify-content-center align-items-center">
                                    </div>

                                    <div class="event-details">
                                        <div class="event-info">
                                            <span id="ename">{{ event.name }}</span>
                                        </div>

                                        <div class="event-time" id="edate">
                                            <small class="event-date galtext">{{ formatDate(event.event_date) }}</small><br />
                                            <small class="event-time-details galtext">{{ formatTime(event.event_date) }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="button-group mt-auto">
                                <router-link to="/event" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="view" @click="navigate">
                                        View All
                                    </button>
                                </router-link>
                                <router-link to="/events_add" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="new" @click="navigate">
                                        Add New
                                    </button>
                                </router-link>
                            </div>
                        </div>

                        <div class="comp-card d-flex flex-column">
                            <h5 class="head">Upcoming Competitions</h5>

                            <div class="event-list" v-if="dashboardData?.data?.competitions?.length">
                                <div class="event-item" v-for="comp in upcomingCompetitions" :key="comp.id || index">
                                    <img v-if="comp.featured_image_url" class="img-fluid event-img" :src="comp.featured_image_url" alt="Event" @error="comp.featured_image_url = null" />
                                    <div v-else class="event-img fallback-box d-flex justify-content-center align-items-center">
                                    </div>

                                    <div class="event-details">
                                        <div class="event-info">
                                            <span id="ename">{{ comp.name }}</span>
                                        </div>

                                        <div class="event-time" id="edate">
                                            <small class="event-date galtext">{{ formatDate(comp.start_date) }}</small><br />
                                            <small class="event-time-details galtext">{{ formatTime(comp.start_date) }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="button-group mt-auto">
                                <router-link to="/competitions" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="view" @click="navigate">
                                        View All
                                    </button>
                                </router-link>
                                <router-link to="/comp_edit" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="new" @click="navigate">
                                        Add New
                                    </button>
                                </router-link>
                            </div>
                        </div>

                        <div class="cal-card d-flex flex-column">
                            <Calendar />
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div class="container">
                    <div class="upcoming-section">
                        <div class="member-card d-flex flex-column">
                            <h5 class="head">Latest Members</h5>
                            <div class="row">
                                <div class="col-6" v-for="latestMember in dashboardData?.data?.latest_members.slice(0, 6)" :key="latestMember.id">
                                    <div class="event-items text-center">
                                        <img v-if="latestMember.profile_image_url" class="img-fluid event-img" :src="latestMember.profile_image_url" alt="Profile" @error="latestMember.profile_image_url = null" />
                                        <div v-else class="event-img fallback-box d-flex justify-content-center align-items-center">
                                        </div>
                                        <div class="memtext" id="memname">
                                            <span>{{ latestMember.first_name +' '+ latestMember.last_name}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="button-group mt-auto">
                                <router-link to="/members" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="view" @click="navigate">
                                        View All
                                    </button>
                                </router-link>
                                <router-link to="/notice_single" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="new" @click="navigate">
                                        Add New
                                    </button>
                                </router-link>
                            </div>
                        </div>

                        <div class="card">
                            <div class="d-flex justify-content-between align-items-center" style="padding: 10px">
                                <h5 class="head">Member Galleries</h5>
                                <router-link to="/club_gallery" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="view" @click="navigate">
                                        View All
                                    </button>
                                </router-link>
                            </div>
                            <div class="pics">
                                <div v-for="(item, index) in chunkedCards.flat() || []" :key="item.id || index" class="pics-items" :class="getPositionClass(index, chunkedCards.flat().length)">
                                    <div v-if="item.image_url">
                                        <img :src="item.image_url" :alt="item.username" />
                                        <div class="pics-infos" :class="getPositionClass(index, chunkedCards.flat().length)" :style="{ backgroundColor: hexToRgba('#7FA483', 0.7) }">
                                            <div>
                                                {{ item.gallery_name }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div class="container">
                    <div class="upcoming-sections">
                        <div class="result-card d-flex flex-column">
                            <div class="d-flex justify-content-between mb-2">
                                <h5 class="head">Recent Results</h5>
                                <button class="btn btn-sm" id="view">View All</button>
                            </div>

                            <div class="pic">
                                <div v-for="(item, index) in picture.slice(0, 6) || []" :key="item.id || index" class="pic-item" :class="getPositionedClass(index, picture.length)">
                                    <img v-if="item.image" class="img-fluid" :src="item.image" :alt="item.gallery_name" @error="item.image = null" />
                                    <div class="pic-info" :class="getPositionedClass(index, picture.length)" :style="{ backgroundColor: hexToRgba('#7FA483', 0.7) }">
                                        <div>
                                            {{ item.gallery_name }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="notice-card d-flex flex-column">
                            <h5 class="head">Recent Notices</h5>
                            <div class="event-list" v-if="recentNotices.length">
                                <div class="event-item" v-for="notice in recentNotices" :key="notice.id || index">
                                    <img v-if="notice.featured_image_url" class="img-fluid event-img" :src="notice.featured_image_url" alt="News" @error="notice.featured_image_url = null" />
                                    <div v-else class="event-img fallback-box d-flex justify-content-center align-items-center">
                                    </div>
                                    <div class="event-details">
                                        <span id="pname">{{ notice.title }}</span>
                                        <div class="event-time" id="edate">
                                            <small class="event-date galtext">{{ formatDate(notice.created_at) }}</small><br />
                                            <small class="event-time-details galtext">{{ formatTime(notice.created_at) }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="button-group mt-auto">
                                <router-link to="/notices" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="view" @click="navigate">
                                        View All
                                    </button>
                                </router-link>
                                <router-link to="/notice_single" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="new" @click="navigate">
                                        Add New
                                    </button>
                                </router-link>
                            </div>
                        </div>

                        <div class="news-card d-flex flex-column">
                            <h5 class="head">Latest News</h5>
                            <div class="event-list" v-if="latestNews.length" style="padding-top: 20px">
                                <div class="event-item" v-for="news in latestNews" :key="news.id || index" style="margin-bottom: 10px;">
                                    <img v-if="news.featured_image_url" class="img-fluid event-img" :src="news.featured_image_url" alt="News" @error="news.featured_image_url = null" />
                                    <div v-else class="event-img fallback-box d-flex justify-content-center align-items-center">
                                    </div>
                                    <div class="event-details">
                                        <span id="pname">{{ news.title }}</span>
                                        <div class="event-time" id="edate">
                                            <small class="event-date galtext">{{ formatDate(news.publish_date) }}</small><br />
                                            <small class="event-time-details galtext">{{ formatTime(news.publish_date) }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="button-group mt-auto">
                                <router-link to="/notices" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="view" @click="navigate">
                                        View All
                                    </button>
                                </router-link>
                                <router-link to="/notice_single" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="new" @click="navigate">
                                        Add New
                                    </button>
                                </router-link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section>
                <div class="container">
                    <div class="upcoming-section" style="display: flex">
                        <div class="member-card d-flex flex-column">
                            <h5 class="head">Recent Pages</h5>
                            <div class="row">
                                <div class="col-6" v-for="page in dashboardData?.data?.pages.slice(0, 6)" :key="page.id">
                                    <div class="event-items text-center">
                                        <img v-if="page.featured_image_url" class="img-fluid event-img" :src="page.featured_image_url" alt="Profile" @error="page.featured_image_url = null"/>
                                        <div v-else class="event-img fallback-box d-flex justify-content-center align-items-center">
                                        </div>
                                        <div class="memtext" id="memname">
                                            <span>{{ page.title }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="button-group mt-auto">
                                <router-link to="/members" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="view" @click="navigate">
                                        View All
                                    </button>
                                </router-link>
                                <router-link to="/members" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="edit" @click="navigate">
                                        Add New
                                    </button>
                                </router-link>
                            </div>
                        </div>

                        <div class="card">
                            <div class="d-flex justify-content-between align-items-center" style="padding: 10px">
                                <h5 class="head">Club Galleries</h5>
                                <router-link to="/club_gallery" custom v-slot="{ navigate }">
                                    <button class="btn btn-sm" id="view" @click="navigate">
                                        View All
                                    </button>
                                </router-link>
                            </div>
                            <div class="pics">
                                <div v-for="(item, index) in chunkCards.flat()" :key="item.id || index" class="pics-items" :class="getPositionClass(index, chunkCards.flat().length)">
                                    <div v-if="item.photos && item.photos.length">
                                        <img :src="item.photos[0].image" :alt="item.photos[0].title" />
                                        <div class="pics-infos" :class="getPositionClass(index, chunkCards.flat().length)" :style="{ backgroundColor: hexToRgba('#7FA483', 0.7) }">
                                            {{ item.gallery_name }}
                                        </div>
                                    </div>
                                </div>
                            </div>
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
import { useDashboardStore } from "@/stores/club_admin/DashboardStore";
import { onMounted, computed, onUnmounted, ref } from "vue";
import NavigationRoute from "@/components/NavigationRoute.vue";
import Image from "@/assets/icons/dashboard/profile_image.svg";
import Comment from "@/assets/icons/dashboard/comment.svg";
import Point from "@/assets/icons/dashboard/point.svg";
import HeaderRoute from "@/components/HeaderRoute.vue";
import Calendar from "@/components/club_admin/Calendars/CalendarDashboard.vue"
import Loader from "@/components/LoaderAll.vue";

const dashboardStore = useDashboardStore();
const dashboardData = computed(() => dashboardStore.dashboardData);
const columns = ref(5);
const columnss = ref(3);
const isLoading = ref(true);

const hour = new Date().getHours();
const greetingMessage = computed(() => {
    if (hour >= 5 && hour < 12) return "Good morning!";
    if (hour === 12) return "Good noon!";
    if (hour > 12 && hour < 17) return "Good afternoon!";
    if (hour >= 17 && hour < 21) return "Good evening!";
    return "Good night!";
});
const memberCount = computed(() => {
    const member = dashboardStore?.dashboardData?.data?.total_members_count;

    if (!member && member !== 0) return "00";

    return String(member).padStart(2, "0");
});

const remainingDays = computed(() => {
    const days = dashboardStore?.dashboardData?.data?.upcoming_event?.remaining_days;

    if (!days && days !== 0) return "00";

    return String(days).padStart(2, "0");
});

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
const upcomingEvents = computed(() => {
    const allEvents = dashboardStore.dashboardData?.data?.events || [];
    const now = new Date();

    return allEvents
        .filter((event) => {
            const eventDate = new Date(event.event_date);
            return eventDate >= now;
        })
        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
});

const upcomingCompetitions = computed(() => {
    const allCompetitions =
        dashboardStore.dashboardData?.data?.competitions || [];
    const now = new Date();

    return allCompetitions
        .filter((competition) => {
            const competitionDate = new Date(competition.start_date);
            return competitionDate >= now;
        })
        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
});

const latestNews = computed(() => {
    const allNews = dashboardStore.dashboardData?.data?.club_news || [];
    const now = new Date();

    return allNews
        .filter((news) => new Date(news.publish_date) <= now)
        .sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date))
        .slice(0, 6);
});

const recentNotices = computed(() => {
    const notices = dashboardStore.dashboardData?.data?.member_notices || [];
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 360);

    return notices
        .filter((notice) => {
            const createdDate = new Date(notice.created_at);
            return createdDate >= oneWeekAgo && createdDate <= now;
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 6);
});

const cards = computed(() => {
    const members = dashboardData.value?.data?.member_galleries || [];

    return members.map(member => {
        const firstGallery = member.galleries?. [0];

        return {
            id: member.id,
            username: member.username,
            gallery_name: firstGallery?.gallery_name || "No Gallery",
            image_url: firstGallery?.photos?. [0]?.image_url || null
        };
    }).filter(card => card.image_url);
});
const cardes = computed(
    () => dashboardData.value?.data?.clubGalleries?.original?.data || []
);

const chunkedCards = computed(() => {
    const chunkSize = 5;
    const chunks = [];
    for (let i = 0; i < cards.value.length; i += chunkSize) {
        chunks.push(cards.value.slice(i, i + chunkSize));
    }
    return chunks;
});

const chunkCards = computed(() => {
    const chunkSize = 5;
    const chunks = [];
    for (let i = 0; i < cardes.value.length; i += chunkSize) {
        chunks.push(cardes.value.slice(i, i + chunkSize));
    }
    return chunks;
});

const picture = computed(() => {
    const competitions = dashboardStore.dashboardData?.data?.recent_results?.original?.data || [];

    return competitions.flatMap(comp => {
        const members = comp?.competition_members || [];

        return members.flatMap(member =>
            (member.entries || [])
            .filter(entry => entry.position === 1 && entry.is_published === true)
            .map(entry => ({
                id: entry.id,
                image: entry.entry_image_thumb,
                gallery_name: entry.entry_image_title || "No Name"
            }))
        );
    });
});

function updateColumns() {
    if (window.innerWidth < 575) {
        columns.value = 1;
    } else if (window.innerWidth < 991) {
        columns.value = 2;
    } else if (window.innerWidth < 1199) {
        columns.value = 3;
    } else {
        columns.value = 5;
    }
}

function updatedColumns() {
    if (window.innerWidth < 575) {
        columnss.value = 1;
    } else if (window.innerWidth < 991) {
        columnss.value = 2;
    } else if (window.innerWidth < 1199) {
        columnss.value = 3;
    } else {
        columnss.value = 3;
    }
}

const hexToRgba = (hex, alpha) => {
    let r = 0,
        g = 0,
        b = 0;

    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    return `rgba(${r},${g},${b},${alpha})`;
}

onMounted(async () => {
    try {
        await dashboardStore.fetchDashboardData();

    } catch (error) {
        console.error("Error fetching home data:", error);
    } finally {
        isLoading.value = false;
    }
    updateColumns();
    updatedColumns();

});
onUnmounted(() => {
    window.removeEventListener("resize", updateColumns);
    window.removeEventListener("resize", updatedColumns);
});

function getPositionClass(index, total) {
    const row = Math.floor(index / columns.value);
    const col = index % columns.value;
    const lastIndex = total - 1;

    if (index === 0) return "top-left";

    if (row === 0 && col === columns.value - 1) return "top-right";

    if (row === Math.floor(lastIndex / columns.value) && col === 0) return "bottom-left";

    if (index === lastIndex) return "bottom-right";

    return "";
}

function getPositionedClass(index, total) {
    const row = Math.floor(index / columnss.value);
    const col = index % columnss.value;
    const lastIndex = total - 1;

    if (index === 0) return "top-left";

    if (row === 0 && col === columnss.value - 1) return "top-right";

    if (row === Math.floor(lastIndex / columnss.value) && col === 0) return "bottom-left";

    if (index === lastIndex) return "bottom-right";

    return "";
}
</script>

<style scoped>
.container {
     max-width: 1810px;
     padding: 0 15px 10px 15px;
     margin: 0 auto;
}
 .content {
     padding: 0 15px 0 35px;
     margin-bottom: 20px
}
 .dashboard-card {
     gap: 15px;
     border-radius: 10px;
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding: 15px 0px 10px;
     width: 100%;
}
 .profile-card {
     display: flex;
     align-items: center;
     justify-content: space-between;
     background: white;
     padding: 15px 20px 15px 30px;
     border-radius: 12px;
     width: 65.8%;
     box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
     height: 148px;
}
 .profile-left {
     display: flex;
     align-items: left;
     width: 100%;
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
.profile-icons .icon img {
     width: 20px; 
     height: 20px
}
 .name {
     font-weight: 500;
     font-size: 30px;
     line-height: 100%;
     color: #4c4036;
     font-family: Inter;
}
#pname {
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     font-size: 14px;
     line-height: 20px;
     letter-spacing: 0%;
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
     text-align: left;
     width: 219px;
     font-family: Inter;
     font-size: 1.2rem;
     height: 148px;
}
 .event-cards {
     background: #755840;
     color: white;
     padding: 20px;
     height: 148px;
     border-radius: 8px;
     text-align: left;
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
 .upcoming-sections {
     display: flex;
     border-radius: 10px;
     padding: 10px 0px;
     align-items: start;
     width: 100%;
     flex-wrap: wrap;
     gap: 30px;
}
 .cardddd {
     background: white;
     width: 32%;
     padding: 20px;
     height: 368px;
     border-radius: 10px;
}
 .event-card, .comp-card, .notice-card {
     background: white;
     width: 32%;
     padding: 30px;
     height: 368px;
     border-radius: 10px;
     text-align: left;
}
 .news-card {
     background: white;
     width: 31.9%;
     padding: 30px;
     height: 368px;
     border-radius: 10px;
     text-align: left;
}
 .result-card {
     background: white;
     width: 32%;
     height: 351px;
     border-radius: 10px;
}
 .cal-card {
     background: white;
     width: 31.9%;
     padding: 0px;
     height: 368px;
     border-radius: 10px;
     height: auto;
}
 .event-list {
     padding-top: 20px;
}
 .event-list {
     display: flex;
     flex-direction: column;
     gap: 10px;
}
 .event-item {
     display: flex;
     align-items: center;
     gap: 20px;
     margin-bottom: 10px
}
.event-items {
    gap: 20px;
}
.event-info {
    display: flex; 
    flex-direction: column;
}
.event-time {
    margin-right: 10px;
    width: 32%;
    text-align: right;
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
     color: black
}
.button-group {
     display: flex;
     gap: 20px;
     margin-top: 30px;
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
 .member-card {
     background: white;
     width: 32%;
     padding: 25px 30px 35px 30px;
     height: 351px;
     border-radius: 10px;
     color: #333333;
}
.member-card .row {
     padding-top: 20px;
}
.member-card img {
     width: 45px;
     height: 45px;
     border-radius: 7px;
     object-fit: cover;
     object-position: top;
     background-color: #7FA483
}
.member-card head {
     color: #333333;
}
.member-card .row .col-6 {
     margin-bottom: 15px;
}
 .card {
     background: white;
     border-radius: 10px;
     flex: 1;
     width: 65%;
     height: 351px;
     border: none;
     margin-top: -1px;
     margin: 0px
}
.card .head {
     padding-left: 20px;
     padding-top: 5px;
}
.result-card .head {
     padding-left: 30px;
     padding-top: 20px;
}
.card #view, .result-card #view {
     width: 80px;
     height: 30px;
     border-radius: 7px;
     opacity: 1;
     background-color:#99816B;
     color: white;
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     font-size: 15px;
     line-height: 100%;
     letter-spacing: 0%;
}
.card button {
     margin-right: 10px
}
.result-card button {
     margin-right: 18px;
     margin-top: 17px
}
 .upcoming-section {
     display: flex;
     border-radius: 10px;
     align-items: start;
     width: 100%;
     flex-wrap: wrap;
     gap: 30px;
     padding-top: 12px;
     padding-bottom: 10px
}
 .pics {
     align-items: start;
     display: grid;
     grid-template-columns: repeat(5, 1fr);
     width: 99.8%;
}
 .pics-items {
     position: relative;
     overflow: hidden;
     align-self: start;
}
 .pics-items img {
     width: 100%;
     height: 146px;
     object-fit: cover;
     object-position: top;
}
 .pics-infos {
     position: absolute;
     bottom: 0;
     left: 0;
     right: 0;
     color: white;
     padding: 5px;
     font-size: 12px;
     font-weight: 600;
     font-family: Inter;
     display: flex;
     align-items: center;
     justify-content: center;
     height: 32px;
     color: white;
}
 .pic {
     display: grid;
     grid-template-columns: repeat(3, 1fr);
     width: 99.8%;
     padding: 0 
}
 .pic-item {
     position: relative;
     overflow: hidden;
}
 .pic-item img {
     max-width: 100%;
     width: 191px;
     height: 157px;
}
 .pic-info {
     background: #4C403699;
     position: absolute;
     bottom: 0;
     left: 0;
     right: 0;
     color: white;
     padding: 5px;
     font-size: 12px;
     font-family: Inter;
     display: flex;
     align-items: center;
     justify-content: center;
}
 .site-footer {
     padding-top: 25px;
     padding-bottom: 10px;
     text-align: center;
     font-size: 14px;
     color: #555;
     margin-top: 100px;
}
 .site-footer a {
     color: #007bff;
     text-decoration: none;
}
 .site-footer a:hover {
     text-decoration: underline;
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
     color: #333333;
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
 .pics-items.top-left img {
     border-top-left-radius: 10px;
}
 .pics-items.top-right img {
     border-top-right-radius: 10px;
}
 .pics-items.bottom-left img {
     border-bottom-left-radius: 10px;
}
 .pics-items.bottom-right img {
     border-bottom-right-radius: 10px;
}
 .pics-infos.bottom-left {
     border-bottom-left-radius: 10px;
}
 .pics-infos.bottom-right {
     border-bottom-right-radius: 10px;
}
 .pic-item.top-left img {
     border-top-left-radius: 10px;
}
 .pic-item.top-right img {
     border-top-right-radius: 10px;
}
 .pic-item.bottom-left img {
     border-bottom-left-radius: 10px;
}
 .pic-item.bottom-right img {
     border-bottom-right-radius: 10px;
}
 .pic-info.bottom-left {
     border-bottom-left-radius: 10px;
}
 .pic-info.bottom-right {
     border-bottom-right-radius: 10px;
}
 @media only screen and (max-width: 1399px) {
     .profile-card {
         width: 60% 
    }
     .card-section {
         width: 40%;
    }
     .cardddd {
         width: 47% !important;
         margin: 0;
    }
     .cardddd:last-child {
         margin: 0 auto;
    }
     .member-card {
         width: 47% !important;
         margin: 0;
    }
     .pics-items img {
         width: 100%;
         height: 175px;
         object-fit: cover;
         object-position: top;
    }
}
 @media only screen and (max-width: 1199px) {
     .cardddd {
         width: 100% !important;
         margin: 0;
    }
     .cardddd:last-child {
         margin: 0 auto;
    }
     .member-card {
         width: 100% !important;
         margin: 0;
         height: 390px;
    }
}
 @media only screen and (max-width: 991px) {
     .profile-card {
         width: 100%;
    }
     .card-section {
         width: 100%;
    }
     #cl {
         flex-direction: column !important;
         align-items: start !important;
    }
     .pics {
         grid-template-columns: repeat(2, 1fr);
    }
}
 @media only screen and (max-width: 767px) {
     .pics {
         grid-template-columns: repeat(1, 1fr);
    }
}
 @media only screen and (max-width: 575px) {
}
 @media only screen and (max-width: 359px) {
}
</style>
