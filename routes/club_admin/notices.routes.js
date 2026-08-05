import MoreNotices from "@/partials/club_admin/notices/MoreNotices.vue";
import RecentComments from "@/partials/club_admin/notices/RecentComments.vue";
export default [
  {
    path: "/notices/notices",
    name: "MoreNotices",
    component: MoreNotices,
    meta: { requiresAuth: true }
  },
  {
    path: "/notices/comments",
    name: "RecentComments",
    component: RecentComments,
    meta: { requiresAuth: true }
  },
];
