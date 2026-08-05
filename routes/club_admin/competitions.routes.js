import RecentSubmissions from "@/partials/club_admin/competitions/RecentSubmissions.vue";
import MoreCompetitions from "@/partials/club_admin/competitions/MoreCompetitions.vue";

export default [
  {
    path: "/competitions/morecompetitions",
    name: "MoreCompetitions",
    component: MoreCompetitions,
    meta: { requiresAuth: true }
  },
  {
    path: "/competitions/submissions",
    name: "RecentSubmissions",
    component: RecentSubmissions,
    meta: { requiresAuth: true }
  },
];
