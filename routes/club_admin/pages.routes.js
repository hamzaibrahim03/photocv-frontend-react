import MorePages from "@/partials/club_admin/pages/MorePages.vue";
import RecentComments from "@/partials/club_admin/pages/RecentComments.vue";
export default [
  {
    path: "/pages/pages",
    name: "MorePages",
    component: MorePages,
    meta: { requiresAuth: true }
  },
  {
    path: "/pages/comments",
    name: "RecentComments",
    component: RecentComments,
    meta: { requiresAuth: true }
  },
];
