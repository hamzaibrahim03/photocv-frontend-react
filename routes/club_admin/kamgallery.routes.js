import KamranGalleries from "@/partials/club_admin/kamgallery/KamranGalleries.vue";

export default [
  {
    path: "/competitions/kamrangalleries",
    name: "KamranGalleries",
    component: KamranGalleries,
    meta: { requiresAuth: true }
  },
];
