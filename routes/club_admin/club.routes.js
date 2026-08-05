import ClubForm from "@/partials/club_admin/club/ClubForm.vue";
import ClubProfile from "@/partials/club_admin/club/ClubProfile.vue";

export default [
  {
    path: "/club/form",
    name: "ClubForm",
    component: ClubForm,
    meta: { requiresAuth: true }
  },
  {
    path: "/club/profile",
    name: "ClubProfile",
    component: ClubProfile,
    meta: { requiresAuth: true }
  },
];
