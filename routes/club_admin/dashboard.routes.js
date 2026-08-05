import CalendarDashboard from "@/partials/club_admin/dashboard/CalendarDashboard.vue";
import ClubGallery from "@/partials/club_admin/dashboard/ClubGallery.vue";
import EventsComponent from "@/partials/club_admin/dashboard/EventsComponent.vue";
import LatestMembers from "@/partials/club_admin/dashboard/LatestMembers.vue";
import LatestNews from "@/partials/club_admin/dashboard/LatestNews.vue";
import MemberGallery from "@/partials/club_admin/dashboard/MemberGallery.vue";
import MembersComponent from "@/partials/club_admin/dashboard/MembersComponent.vue";
import ProfileComponent from "@/partials/club_admin/dashboard/ProfileComponent.vue";
import RecentNotices from "@/partials/club_admin/dashboard/RecentNotices.vue";
import RecentPages from "@/partials/club_admin/dashboard/RecentPages.vue";
import RecentResults from "@/partials/club_admin/dashboard/RecentResults.vue";
import UpcomingCompetitions from "@/partials/club_admin/dashboard/UpcomingCompetitions.vue";
import UpcomingEvents from "@/partials/club_admin/dashboard/UpcomingEvents.vue";

export default [
  {
    path: "/dashboard/calendar",
    name: "CalendarDashboard",
    component: CalendarDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/clubgallery",
    name: "ClubGallery",
    component: ClubGallery,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/events",
    name: "EventsComponent",
    component: EventsComponent,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/latest",
    name: "LatestMembers",
    component: LatestMembers,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/latest",
    name: "LatestNews",
    component: LatestNews,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/membergallery",
    name: "MemberGallery",
    component: MemberGallery,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/members",
    name: "MembersComponent",
    component: MembersComponent,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/profile",
    name: "ProfileComponent",
    component: ProfileComponent,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/recentnotices",
    name: "RecentNotices",
    component: RecentNotices,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/recentpages",
    name: "RecentPages",
    component: RecentPages,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/recentresults",
    name: "RecentResults",
    component: RecentResults,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/upcomingcompetitions",
    name: "UpcomingCompetitions",
    component: UpcomingCompetitions,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard/upcomingevents",
    name: "UpcomingEvents",
    component: UpcomingEvents,
    meta: { requiresAuth: true }
  },
];
