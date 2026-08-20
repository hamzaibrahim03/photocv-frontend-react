<template>
<NavigationRoute />
<HeaderRoute title="Notices" />
<section className="content">
    <div className="dashboard-card">
        <ProfileWithoutSearch greeting="New Notice" name="Title here" role="Dec 20, 2024" />
        <div className="card-section">
            <div className="stat-card">
                <small className="ca-details">Notices</small>
                <h3 className="number">{{ MemberCount }}</h3>
            </div>
            <div className="event-card">
                <small className="ca-details">Last Notice</small>
                <div className="row">
                    <div className="col-md-5">
                        <h3 className="number">{{EventDay}}</h3>
                    </div>
                    <div className="days col-md-7">
                        <span>days ago</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="row">
        <NoticeForm />
        <div className="col-md-4">
            <div className="calen">
                <CalendarDashboard />
            </div>
            <div id="news">
                <RecentComments style="width: 90%" />
                <MoreNotices style="width: 90%" />
            </div>
        </div>
    </div>
</section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNoticeStore } from '@/stores/club_admin/NoticeStore'
import NavigationRoute from "@/components/NavigationRoute.vue";
import HeaderRoute from "@/components/HeaderRoute.vue";
import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import RecentComments from "@/partials/club_admin/notices/RecentComments.vue";
import MoreNotices from "@/partials/club_admin/notices/MoreNotices.vue";
import ProfileWithoutSearch from "@/partials/club_admin/competitionsadd/ProfileWithoutSearch.vue";
import NoticeForm from "@/partials/post/NoticeForm.vue";

const { completedDaysAgo, fetchNotices, memberCount, } = useNoticeStore()

const MemberCount = memberCount
const EventDay = completedDaysAgo
onMounted(() => {
    fetchNotices()
})
</script>

<style scoped>
.calen {
     margin-top: 15px;
}
</style>
