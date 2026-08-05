import MemberGalleries from "@/partials/club_admin/membergallery/MemberGalleries.vue";

export default [
  {
    path: "/competitions/membergalleries",
    name: "MemberGalleries",
    component: MemberGalleries,
    meta: { requiresAuth: true }
  },
];
