import ClubGalleries from "@/partials/club_admin/clubgallery/ClubGalleries.vue";

export default [
  {
    path: "/clubgallery/gallery",
    name: "ClubGalleries",
    component: ClubGalleries,
    meta: { requiresAuth: true }
  },
];
