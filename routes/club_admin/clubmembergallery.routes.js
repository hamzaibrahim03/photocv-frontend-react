import ClubMemberGalleries from "@/partials/club_admin/clubmembergallery/ClubMemberGalleries.vue";

export default [
  {
    path: "/clubmembergallery/gallery",
    name: "ClubMemberGalleries",
    component: ClubMemberGalleries,
    meta: { requiresAuth: true }
  },
];
