<template>
<NavigationRoute />
<HeaderRoute title="Notices" />
<div className="content">
    <section>
        <div className="container">
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
        </div>
    </section>

    <div className="row">
        <NoticeForm />
        <div className="col-md-4">
            <section>
                <div className="container" id="right">
                    <div className="cardddd" style="padding: 0px; height: auto">
                        <CalendarDashboard />
                    </div>
                    <div id="news">
                        <RecentComments />
                        <MoreNotices />
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>
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
import NoticeForm from "@/partials/club_admin/noticesingle/NoticeForm.vue";

const { completedDaysAgo, fetchNotices, memberCount, } = useNoticeStore()

const MemberCount = memberCount
const EventDay = completedDaysAgo
onMounted(() => {
    fetchNotices()
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
